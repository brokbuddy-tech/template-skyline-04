import type { Property } from './types';

type SearchParamRecord = Record<string, string | string[] | undefined>;

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
  const query = filters.q?.trim().toLowerCase();
  const selectedAmenities = (filters.amenities || []).map(item => item.toLowerCase());

  const filtered = properties.filter(property => {
    if (filters.ids?.length && !filters.ids.includes(property.id)) return false;

    if (filters.type === 'buy' && property.transactionType !== 'Sale') return false;
    if (filters.type === 'rent' && property.transactionType !== 'Rent') return false;

    if (filters.category) {
      const category = filters.category.toLowerCase();
      const propertyCategory = `${property.category || ''} ${property.type || ''}`.toLowerCase();
      if (!propertyCategory.includes(category)) return false;
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

    if (query) {
      const haystack = [
        property.title,
        property.location,
        property.description,
        property.type,
        property.category,
        property.developerName,
        ...(property.amenities || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  switch (filters.sort) {
    case 'price-asc':
      return filtered.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return filtered.sort((a, b) => b.price - a.price);
    case 'area-asc':
      return filtered.sort((a, b) => a.sqft - b.sqft);
    case 'area-desc':
      return filtered.sort((a, b) => b.sqft - a.sqft);
    case 'oldest':
      return filtered;
    default:
      return filtered;
  }
}

export function getSmartPropertyMatches(properties: Property[], query: string, limit = 4) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const bedroomsMatch = normalizedQuery.match(/(\d+)\s*bed/);
  const bathroomsMatch = normalizedQuery.match(/(\d+)\s*bath/);
  const wantsRent = /\brent|rental|lease\b/.test(normalizedQuery);
  const wantsSale = /\bbuy|sale|purchase|invest\b/.test(normalizedQuery);
  const wantsOffPlan = /\boff[\s-]?plan|handover|launch\b/.test(normalizedQuery);
  const tokens = normalizedQuery.split(/[^a-z0-9+]+/).filter(token => token.length > 2);

  const scored = properties
    .map(property => {
      let score = 0;
      const haystack = [
        property.title,
        property.location,
        property.description,
        property.type,
        property.category,
        property.developerName,
        ...(property.amenities || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      tokens.forEach(token => {
        if (haystack.includes(token)) score += 2;
      });

      if (bedroomsMatch && property.bedrooms >= Number.parseInt(bedroomsMatch[1], 10)) score += 3;
      if (bathroomsMatch && property.bathrooms >= Number.parseInt(bathroomsMatch[1], 10)) score += 2;
      if (wantsRent && property.transactionType === 'Rent') score += 3;
      if (wantsSale && property.transactionType === 'Sale') score += 3;
      if (wantsOffPlan && property.status === 'Off-plan') score += 4;

      return { property, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || b.property.price - a.property.price)
    .slice(0, limit)
    .map(item => item.property);

  return scored;
}
