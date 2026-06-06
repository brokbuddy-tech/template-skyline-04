import type { Property } from './types';

type SearchParamRecord = Record<string, string | string[] | undefined>;

type NumericRange = {
  min?: number;
  max?: number;
};

type PropertySearchIntent = {
  normalizedQuery: string;
  queryTokens: string[];
  locationPhrase: string;
  locationTokens: string[];
  propertyTypes: string[];
  viewTokenGroups: string[][];
  priceRange?: NumericRange;
  areaRange?: NumericRange;
  minBedrooms?: number;
  minBathrooms?: number;
  wantsRent: boolean;
  wantsSale: boolean;
  wantsOffPlan: boolean;
  wantsReady: boolean;
};

type PropertySearchIndex = {
  searchText: string;
  titleText: string;
  locationText: string;
  typeText: string;
};

const PROPERTY_TYPE_PATTERNS = [
  { canonical: 'apartment', aliases: ['apartment', 'apartments', 'flat', 'flats'], pattern: /\b(?:apartment|apartments|flat|flats)\b/i },
  { canonical: 'villa', aliases: ['villa', 'villas'], pattern: /\b(?:villa|villas)\b/i },
  { canonical: 'penthouse', aliases: ['penthouse', 'penthouses'], pattern: /\b(?:penthouse|penthouses)\b/i },
  { canonical: 'townhouse', aliases: ['townhouse', 'townhouses', 'town house', 'town houses'], pattern: /\b(?:townhouse|townhouses|town house|town houses)\b/i },
  { canonical: 'office', aliases: ['office', 'offices'], pattern: /\b(?:office|offices)\b/i },
  { canonical: 'land', aliases: ['land', 'plot', 'plots'], pattern: /\b(?:land|plot|plots)\b/i },
  { canonical: 'studio', aliases: ['studio', 'studios'], pattern: /\b(?:studio|studios)\b/i },
  { canonical: 'duplex', aliases: ['duplex', 'duplexes'], pattern: /\b(?:duplex|duplexes)\b/i },
  { canonical: 'retail', aliases: ['retail', 'shop', 'shops', 'store', 'stores'], pattern: /\b(?:retail|shop|shops|store|stores)\b/i },
  { canonical: 'warehouse', aliases: ['warehouse', 'warehouses'], pattern: /\b(?:warehouse|warehouses)\b/i },
  { canonical: 'mansion', aliases: ['mansion', 'mansions', 'manor', 'manors'], pattern: /\b(?:mansion|mansions|manor|manors)\b/i },
];

const SEARCH_STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'at',
  'around',
  'by',
  'for',
  'from',
  'home',
  'homes',
  'in',
  'investment',
  'investments',
  'listing',
  'listings',
  'near',
  'of',
  'on',
  'place',
  'places',
  'project',
  'projects',
  'properties',
  'property',
  'residence',
  'residences',
  'the',
  'unit',
  'units',
  'with',
  'within',
  'without',
  'luxury',
  'premium',
  'exclusive',
  'signature',
  'spacious',
  'modern',
  'beautiful',
  'furnished',
  'unfurnished',
  'upgraded',
  'vacant',
  'brand',
  'new',
  'best',
  'view',
  'views',
  'price',
  'budget',
  'cost',
  'aed',
  'dhs',
  'dirham',
  'dirhams',
  'below',
  'under',
  'less',
  'than',
  'over',
  'above',
  'more',
  'between',
  'to',
  'from',
  'area',
  'size',
  'sq',
  'sqft',
  'ft',
  'feet',
  'max',
  'maximum',
  'min',
  'minimum',
]);

const HUMAN_NUMBER_PATTERN = '(\\d+(?:\\.\\d+)?\\s*(?:k|m|b|mn|million|billion|thousand|lakh|crore)?)';
const PROPERTY_QUERY_EXCLUDED_TOKENS = new Set([
  ...SEARCH_STOPWORDS,
  'rent',
  'rental',
  'lease',
  'buy',
  'sale',
  'purchase',
  'invest',
  'off',
  'plan',
  'offplan',
  'ready',
  'bed',
  'beds',
  'bedroom',
  'bedrooms',
  'bath',
  'baths',
  'bathroom',
  'bathrooms',
]);

export type PropertyFilterState = {
  ids?: string[];
  q?: string;
  type?: 'buy' | 'rent';
  category?: string;
  readiness?: string;
  bedrooms?: number;
  bathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  amenities?: string[];
  sort?: string;
};

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeNumber(value: string | string[] | undefined) {
  const normalized = normalizeParam(value);
  if (!normalized) return undefined;
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeCsv(value: string | string[] | undefined) {
  const normalized = normalizeParam(value);
  if (!normalized) return [];
  return normalized.split(',').map(item => item.trim()).filter(Boolean);
}

function normalizeSearchText(value: unknown) {
  if (value === null || value === undefined) return '';
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeSearchText(value: unknown) {
  return normalizeSearchText(value)
    .split(' ')
    .filter(token => token.length > 1);
}

function dedupeTokens(tokens: string[]) {
  return Array.from(new Set(tokens.filter(Boolean)));
}

function cleanCategoryToken(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function editDistance(left: string, right: string) {
  const matrix = Array.from({ length: left.length + 1 }, (_, row) =>
    Array.from({ length: right.length + 1 }, (_, col) => (row === 0 ? col : col === 0 ? row : 0)),
  );

  for (let row = 1; row <= left.length; row += 1) {
    for (let col = 1; col <= right.length; col += 1) {
      const cost = left[row - 1] === right[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost,
      );
    }
  }

  return matrix[left.length][right.length];
}

function getPropertyTypePattern(value?: string) {
  const normalized = cleanCategoryToken(value || '');
  if (!normalized) return undefined;
  return PROPERTY_TYPE_PATTERNS.find(({ canonical, aliases }) =>
    cleanCategoryToken(canonical) === normalized ||
    aliases.some((alias) => cleanCategoryToken(alias) === normalized),
  );
}

export function cleanQueryForCategoryFilter(query?: string | null, category?: string | null) {
  const trimmed = query?.trim();
  if (!trimmed || !category) return trimmed;
  const typePatterns = category.split(',').flatMap((value) => {
    const typePattern = getPropertyTypePattern(value.trim());
    return typePattern ? [typePattern] : [];
  });
  if (typePatterns.length === 0) return trimmed;

  const tokens = trimmed.split(/\s+/).map(cleanCategoryToken).filter(Boolean);
  if (tokens.length === 0 || tokens.length > 2) return trimmed;

  const aliases = typePatterns.flatMap((typePattern) => typePattern.aliases);
  const isOnlyCategoryText = tokens.every((token) =>
    aliases.some((alias) => {
      const normalizedAlias = cleanCategoryToken(alias);
      const tolerance = normalizedAlias.length >= 8 ? 2 : 1;
      return token === normalizedAlias || editDistance(token, normalizedAlias) <= tolerance;
    }),
  );

  return isOnlyCategoryText ? undefined : trimmed;
}

function matchesCategoryFilter(index: PropertySearchIndex, categoryFilter?: string) {
  const categories = (categoryFilter || '').split(',').map((category) => category.trim()).filter(Boolean);
  if (categories.length === 0) return true;

  return categories.some((category) => {
    const typePattern = getPropertyTypePattern(category);
    if (typePattern) return typePattern.pattern.test(index.typeText);
    return index.typeText.includes(normalizeSearchText(category));
  });
}

function parseHumanNumber(value?: string) {
  if (!value) return undefined;

  const normalized = value.toLowerCase().replace(/,/g, '').trim();
  const match = normalized.match(/^(\d+(?:\.\d+)?)(?:\s*)(k|m|b|mn|million|billion|thousand|lakh|crore)?$/i);

  if (!match) return undefined;

  const amount = Number.parseFloat(match[1]);
  if (!Number.isFinite(amount)) return undefined;

  const unit = match[2]?.toLowerCase();
  const multiplier =
    unit === 'k' || unit === 'thousand'
      ? 1_000
      : unit === 'm' || unit === 'mn' || unit === 'million'
        ? 1_000_000
        : unit === 'b' || unit === 'billion'
          ? 1_000_000_000
          : unit === 'lakh'
            ? 100_000
            : unit === 'crore'
              ? 10_000_000
              : 1;

  return amount * multiplier;
}

function extractRangeFromQuery(rawQuery: string, fieldPattern: string): NumericRange | undefined {
  const source = rawQuery.toLowerCase().replace(/,/g, ' ');
  const betweenPatterns = [
    new RegExp(`(?:${fieldPattern})[^\\d]{0,24}(?:between|from)\\s*${HUMAN_NUMBER_PATTERN}\\s*(?:and|to)\\s*${HUMAN_NUMBER_PATTERN}`, 'i'),
    new RegExp(`(?:between|from)\\s*${HUMAN_NUMBER_PATTERN}\\s*(?:and|to)\\s*${HUMAN_NUMBER_PATTERN}[^a-z0-9]{0,24}(?:${fieldPattern})`, 'i'),
  ];

  for (const pattern of betweenPatterns) {
    const match = source.match(pattern);
    if (!match) continue;

    const min = parseHumanNumber(match[1]);
    const max = parseHumanNumber(match[2]);
    if (min === undefined && max === undefined) continue;

    return {
      min: min !== undefined && max !== undefined ? Math.min(min, max) : min,
      max: min !== undefined && max !== undefined ? Math.max(min, max) : max,
    };
  }

  const maxPatterns = [
    new RegExp(`(?:${fieldPattern})[^\\d]{0,24}(?:under|below|less than|up to|max(?:imum)?)\\s*${HUMAN_NUMBER_PATTERN}`, 'i'),
    new RegExp(`(?:under|below|less than|up to|max(?:imum)?)\\s*${HUMAN_NUMBER_PATTERN}[^a-z0-9]{0,24}(?:${fieldPattern})`, 'i'),
  ];

  for (const pattern of maxPatterns) {
    const match = source.match(pattern);
    const max = parseHumanNumber(match?.[1]);
    if (max !== undefined) return { max };
  }

  const minPatterns = [
    new RegExp(`(?:${fieldPattern})[^\\d]{0,24}(?:over|above|more than|at least|min(?:imum)?)\\s*${HUMAN_NUMBER_PATTERN}`, 'i'),
    new RegExp(`(?:over|above|more than|at least|min(?:imum)?)\\s*${HUMAN_NUMBER_PATTERN}[^a-z0-9]{0,24}(?:${fieldPattern})`, 'i'),
  ];

  for (const pattern of minPatterns) {
    const match = source.match(pattern);
    const min = parseHumanNumber(match?.[1]);
    if (min !== undefined) return { min };
  }

  return undefined;
}

function extractPriceRange(rawQuery: string) {
  return extractRangeFromQuery(rawQuery, 'price|budget|cost|aed|dhs|dirham(?:s)?');
}

function extractAreaRange(rawQuery: string) {
  return extractRangeFromQuery(rawQuery, 'area|size|sq\\s*ft|sqft|square\\s*feet|built\\s*up|plot\\s*area|bua');
}

function extractViewTokenGroups(normalizedQuery: string) {
  const tokens = tokenizeSearchText(normalizedQuery);
  const groups: string[][] = [];

  tokens.forEach((token, index) => {
    if (token !== 'view' && token !== 'views') return;

    const context: string[] = [];

    for (let cursor = index - 1; cursor >= 0 && context.length < 2; cursor -= 1) {
      const candidate = tokens[cursor];

      if (PROPERTY_QUERY_EXCLUDED_TOKENS.has(candidate)) {
        if (context.length > 0) break;
        continue;
      }

      if (/^\d+$/.test(candidate)) continue;

      context.unshift(candidate);
    }

    if (context.length > 0) {
      groups.push([...context, 'view']);
    }
  });

  return Array.from(new Set(groups.map(group => group.join(' ')))).map(group => group.split(' '));
}

function isWithinRange(value: number | undefined, range?: NumericRange) {
  if (!range) return true;
  if (value === undefined || !Number.isFinite(value)) return false;
  if (range.min !== undefined && value < range.min) return false;
  if (range.max !== undefined && value > range.max) return false;
  return true;
}

function extractPropertySearchIntent(query: string): PropertySearchIntent {
  const rawQuery = query.toLowerCase();
  const normalizedQuery = normalizeSearchText(query);
  const minBedrooms = normalizedQuery.match(/(\d+)\s*bed/)?.[1];
  const minBathrooms = normalizedQuery.match(/(\d+)\s*bath/)?.[1];
  const propertyTypes = PROPERTY_TYPE_PATTERNS.filter(({ pattern }) => pattern.test(normalizedQuery)).map(
    ({ canonical }) => canonical
  );
  const propertyTypeTokens = dedupeTokens(
    PROPERTY_TYPE_PATTERNS
      .filter(({ canonical }) => propertyTypes.includes(canonical))
      .flatMap(({ aliases }) => aliases.flatMap(alias => tokenizeSearchText(alias)))
  );
  const queryTokens = dedupeTokens(
    tokenizeSearchText(normalizedQuery).filter(
      token =>
        !PROPERTY_QUERY_EXCLUDED_TOKENS.has(token) &&
        !propertyTypeTokens.includes(token) &&
        !/^\d+$/.test(token)
    )
  );
  const locationPhraseMatch = normalizedQuery.match(
    /\b(?:in|at|on|near|around|within|by)\s+(.+?)(?:\s+(?:with|having|featuring|for|from|under|below|above|over)\b|$)/
  );
  const rawLocationSource = locationPhraseMatch?.[1] || normalizedQuery;
  const locationTokens = dedupeTokens(
    tokenizeSearchText(rawLocationSource).filter(
      token =>
        !SEARCH_STOPWORDS.has(token) &&
        !propertyTypeTokens.includes(token) &&
        !['rent', 'rental', 'lease', 'buy', 'sale', 'purchase', 'invest', 'off', 'plan', 'offplan', 'ready', 'bed', 'beds', 'bedroom', 'bedrooms', 'bath', 'baths', 'bathroom', 'bathrooms'].includes(token) &&
        !/^\d+$/.test(token)
    )
  );

  return {
    normalizedQuery,
    queryTokens,
    locationPhrase: normalizeSearchText(locationTokens.join(' ')),
    locationTokens,
    propertyTypes,
    viewTokenGroups: extractViewTokenGroups(normalizedQuery),
    priceRange: extractPriceRange(rawQuery),
    areaRange: extractAreaRange(rawQuery),
    minBedrooms: minBedrooms ? Number.parseInt(minBedrooms, 10) : undefined,
    minBathrooms: minBathrooms ? Number.parseInt(minBathrooms, 10) : undefined,
    wantsRent: /\brent|rental|lease\b/.test(normalizedQuery),
    wantsSale: /\bbuy|sale|purchase|invest\b/.test(normalizedQuery),
    wantsOffPlan: /\boff[\s-]?plan|handover|launch\b/.test(normalizedQuery),
    wantsReady: /\bready|move[\s-]?in|immediate\b/.test(normalizedQuery),
  };
}

function buildPropertySearchIndex(property: Property): PropertySearchIndex {
  return {
    searchText: normalizeSearchText(
      property.searchableText ||
        [
          property.title,
          property.location,
          property.mapAddress,
          property.description,
          property.type,
          property.category,
          property.developerName,
          property.referenceId,
          property.organizationName,
          property.agent?.name,
          ...(property.amenities || []),
          ...(property.nearby || []).map(item => item.name),
        ]
          .filter(Boolean)
          .join(' ')
    ),
    titleText: normalizeSearchText(property.title),
    locationText: normalizeSearchText(property.searchableLocation || [property.location, property.mapAddress].filter(Boolean).join(' ')),
    typeText: normalizeSearchText([property.category, property.type, property.tag, property.title].filter(Boolean).join(' ')),
  };
}

function matchesLocationIntent(index: PropertySearchIndex, intent: PropertySearchIntent) {
  if (intent.locationTokens.length === 0) return true;
  return intent.locationTokens.every(token => index.locationText.includes(token));
}

function matchesPropertyTypeIntent(index: PropertySearchIndex, intent: PropertySearchIntent) {
  if (intent.propertyTypes.length === 0) return true;
  return PROPERTY_TYPE_PATTERNS.some(
    ({ canonical, pattern }) => intent.propertyTypes.includes(canonical) && pattern.test(index.typeText)
  );
}

function matchesViewIntent(index: PropertySearchIndex, intent: PropertySearchIntent) {
  if (intent.viewTokenGroups.length === 0) return true;
  return intent.viewTokenGroups.some(group => group.every(token => index.searchText.includes(token)));
}

function narrowPropertiesByIntent(
  properties: Property[],
  indexes: Map<string, PropertySearchIndex>,
  intent: PropertySearchIntent
) {
  let pool = [...properties];

  const applyNarrowing = (predicate: (property: Property, index: PropertySearchIndex) => boolean) => {
    const narrowed = pool.filter(property => {
      const index = indexes.get(property.id);
      return index ? predicate(property, index) : false;
    });

    if (narrowed.length > 0) {
      pool = narrowed;
    }
  };

  if (intent.locationTokens.length > 0) {
    applyNarrowing((_, index) => matchesLocationIntent(index, intent));
  }

  if (intent.propertyTypes.length > 0) {
    applyNarrowing((_, index) => matchesPropertyTypeIntent(index, intent));
  }

  if (intent.viewTokenGroups.length > 0) {
    applyNarrowing((_, index) => matchesViewIntent(index, intent));
  }

  if (intent.wantsRent) {
    applyNarrowing(property => property.transactionType === 'Rent');
  }

  if (intent.wantsSale) {
    applyNarrowing(property => property.transactionType === 'Sale');
  }

  if (intent.wantsOffPlan) {
    applyNarrowing(property => property.status === 'Off-plan');
  }

  if (intent.wantsReady) {
    applyNarrowing(property => property.status === 'Ready');
  }

  if (intent.minBedrooms !== undefined) {
    applyNarrowing(property => property.bedrooms >= intent.minBedrooms!);
  }

  if (intent.minBathrooms !== undefined) {
    applyNarrowing(property => property.bathrooms >= intent.minBathrooms!);
  }

  if (intent.priceRange) {
    applyNarrowing(property => isWithinRange(property.price, intent.priceRange));
  }

  if (intent.areaRange) {
    applyNarrowing(property => isWithinRange(property.sqft, intent.areaRange));
  }

  return pool;
}

function scorePropertyMatch(property: Property, index: PropertySearchIndex, intent: PropertySearchIntent) {
  if (!intent.normalizedQuery) return 0;

  let score = 0;

  if (index.searchText.includes(intent.normalizedQuery)) score += 28;
  if (index.titleText.includes(intent.normalizedQuery)) score += 18;

  if (intent.locationPhrase && index.locationText.includes(intent.locationPhrase)) score += 30;

  const locationTokenMatches = intent.locationTokens.filter(token => index.locationText.includes(token)).length;
  score += locationTokenMatches * 8;

  const queryTokenMatches = intent.queryTokens.filter(token => index.searchText.includes(token)).length;
  score += queryTokenMatches * 3;

  if (matchesPropertyTypeIntent(index, intent) && intent.propertyTypes.length > 0) score += 18;
  if (matchesViewIntent(index, intent) && intent.viewTokenGroups.length > 0) score += 20;
  if (intent.wantsRent && property.transactionType === 'Rent') score += 10;
  if (intent.wantsSale && property.transactionType === 'Sale') score += 10;
  if (intent.wantsOffPlan && property.status === 'Off-plan') score += 10;
  if (intent.wantsReady && property.status === 'Ready') score += 10;
  if (intent.minBedrooms !== undefined && property.bedrooms >= intent.minBedrooms) score += 8;
  if (intent.minBathrooms !== undefined && property.bathrooms >= intent.minBathrooms) score += 6;
  if (isWithinRange(property.price, intent.priceRange)) score += intent.priceRange ? 12 : 0;
  if (isWithinRange(property.sqft, intent.areaRange)) score += intent.areaRange ? 10 : 0;

  return score;
}

export function getFiltersFromSearchParams(searchParams: SearchParamRecord): PropertyFilterState {
  return {
    ids: normalizeCsv(searchParams.ids),
    q: normalizeParam(searchParams.q),
    type: normalizeParam(searchParams.type) as 'buy' | 'rent' | undefined,
    category: normalizeParam(searchParams.category) || normalizeParam(searchParams.propertyType),
    readiness: normalizeParam(searchParams.readiness) || normalizeParam(searchParams.status),
    bedrooms: normalizeNumber(searchParams.bedrooms),
    bathrooms: normalizeNumber(searchParams.bathrooms),
    minPrice: normalizeNumber(searchParams.minPrice),
    maxPrice: normalizeNumber(searchParams.maxPrice),
    minArea: normalizeNumber(searchParams.minArea),
    maxArea: normalizeNumber(searchParams.maxArea),
    amenities: normalizeCsv(searchParams.amenities),
    sort: normalizeParam(searchParams.sort),
  };
}

export function filterProperties(properties: Property[], filters: PropertyFilterState): Property[] {
  const query = normalizeSearchText(cleanQueryForCategoryFilter(filters.q?.trim(), filters.category));
  const selectedAmenities = (filters.amenities || []).map(item => item.toLowerCase());
  const hasAiScopedIds = Boolean(filters.ids?.length);

  const filtered = properties.filter(property => {
    if (filters.ids?.length && !filters.ids.includes(property.id)) return false;

    if (filters.type === 'buy' && property.transactionType !== 'Sale') return false;
    if (filters.type === 'rent' && property.transactionType !== 'Rent') return false;

    if (filters.category) {
      const index = buildPropertySearchIndex(property);
      if (!matchesCategoryFilter(index, filters.category)) return false;
    }

    if (filters.readiness) {
      const readiness = filters.readiness.toLowerCase();
      if (!(property.status || '').toLowerCase().includes(readiness)) return false;
    }

    if (filters.bedrooms !== undefined && property.bedrooms < filters.bedrooms) return false;
    if (filters.bathrooms !== undefined && property.bathrooms < filters.bathrooms) return false;
    if (filters.minPrice !== undefined && property.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && property.price > filters.maxPrice) return false;
    if (filters.minArea !== undefined && property.sqft < filters.minArea) return false;
    if (filters.maxArea !== undefined && property.sqft > filters.maxArea) return false;

    if (selectedAmenities.length > 0) {
      const propertyAmenities = property.amenities.map(item => item.toLowerCase());
      const hasAllAmenities = selectedAmenities.every(amenity => propertyAmenities.some(item => item.includes(amenity)));
      if (!hasAllAmenities) return false;
    }

    if (query && !hasAiScopedIds) {
      const haystack = normalizeSearchText(
        property.searchableText ||
          [
            property.title,
            property.location,
            property.mapAddress,
            property.description,
            property.type,
            property.category,
            property.developerName,
            property.referenceId,
            ...(property.amenities || []),
          ]
            .filter(Boolean)
            .join(' ')
      );

      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  let sorted = filtered;

  switch (filters.sort) {
    case 'price-asc':
      sorted = filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted = filtered.sort((a, b) => b.price - a.price);
      break;
    case 'area-asc':
      sorted = filtered.sort((a, b) => a.sqft - b.sqft);
      break;
    case 'area-desc':
      sorted = filtered.sort((a, b) => b.sqft - a.sqft);
      break;
    case 'oldest':
      break;
    default:
      break;
  }

  if (hasAiScopedIds && filters.ids && !filters.sort) {
    const idOrder = new Map(filters.ids.map((id, index) => [id, index]));
    sorted = [...sorted].sort(
      (left, right) => (idOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (idOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER)
    );
  }

  return sorted;
}

export function getSmartPropertyMatches(properties: Property[], query: string, limit = 4) {
  const intent = extractPropertySearchIntent(query);
  if (!intent.normalizedQuery) return [];

  const indexes = new Map(properties.map(property => [property.id, buildPropertySearchIndex(property)]));
  const scopedProperties = narrowPropertiesByIntent(properties, indexes, intent);

  return scopedProperties
    .map(property => {
      const index = indexes.get(property.id);
      return {
        property,
        score: index ? scorePropertyMatch(property, index, intent) : 0,
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || b.property.price - a.property.price)
    .slice(0, limit)
    .map(item => item.property);
}
