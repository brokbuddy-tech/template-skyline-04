import { NextResponse } from 'next/server';

type SearchFilters = {
  q?: string;
  type?: string;
  transactionType?: string;
  propertyType?: string;
  category?: string;
  readiness?: string;
  bedrooms?: string;
  bathrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
};

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const CATEGORY_PATTERNS = [
  { canonical: 'Apartment', pattern: /\b(apartment|apartments|flat|flats)\b/i },
  { canonical: 'Villa', pattern: /\b(villa|villas)\b/i },
  { canonical: 'Penthouse', pattern: /\b(penthouse|penthouses)\b/i },
  { canonical: 'Townhouse', pattern: /\b(townhouse|townhouses|town house|town houses)\b/i },
  { canonical: 'House', pattern: /\b(house|houses|home|homes)\b/i },
  { canonical: 'Land', pattern: /\b(land|plot|plots)\b/i },
  { canonical: 'Office', pattern: /\b(office|offices)\b/i },
  { canonical: 'Retail', pattern: /\b(retail|shop|shops|showroom|showrooms)\b/i },
  { canonical: 'Warehouse', pattern: /\b(warehouse|warehouses|industrial)\b/i },
  { canonical: 'Rural', pattern: /\b(rural|farm|acreage)\b/i },
];
const COMMERCIAL_CATEGORIES = new Set(['Office', 'Retail', 'Warehouse']);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeEnum(value: unknown, allowed: string[]) {
  const normalized = cleanText(value).toUpperCase();
  return allowed.includes(normalized) ? normalized : undefined;
}

function parseHumanNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const source = cleanText(value).toLowerCase().replace(/,/g, '');
  const match = source.match(/^(\d+(?:\.\d+)?)\s*(k|m|mn|b|million|billion|thousand|lakh|crore)?$/);
  if (!match) return undefined;
  const amount = Number.parseFloat(match[1]);
  const unit = match[2];
  const multiplier =
    unit === 'k' || unit === 'thousand' ? 1_000 :
    unit === 'm' || unit === 'mn' || unit === 'million' ? 1_000_000 :
    unit === 'b' || unit === 'billion' ? 1_000_000_000 :
    unit === 'lakh' ? 100_000 :
    unit === 'crore' ? 10_000_000 :
    1;
  return Math.round(amount * multiplier);
}

function normalizeNumber(value: unknown) {
  const parsed = parseHumanNumber(value);
  return parsed !== undefined && Number.isFinite(parsed) ? String(parsed) : undefined;
}

function inferCategory(...values: unknown[]) {
  const source = values.map(cleanText).filter(Boolean).join(' ');
  if (!source) return undefined;
  const match = CATEGORY_PATTERNS.find(({ pattern }) => pattern.test(source));
  return match?.canonical;
}

function extractPrice(query: string) {
  const numberPattern = '(\\d+(?:\\.\\d+)?\\s*(?:k|m|mn|b|million|billion|thousand|lakh|crore)?)';
  const lower = query.toLowerCase().replace(/,/g, ' ');
  const between = lower.match(new RegExp(`(?:between|from)\\s+${numberPattern}\\s+(?:and|to)\\s+${numberPattern}`));
  if (between) {
    const first = parseHumanNumber(between[1]);
    const second = parseHumanNumber(between[2]);
    if (first !== undefined && second !== undefined) {
      return { minPrice: String(Math.min(first, second)), maxPrice: String(Math.max(first, second)) };
    }
  }
  const max = lower.match(new RegExp(`(?:under|below|less than|up to|max(?:imum)?|budget(?: of| is)?|around)\\s+${numberPattern}`));
  if (max) return { maxPrice: normalizeNumber(max[1]) };
  const min = lower.match(new RegExp(`(?:over|above|more than|at least|min(?:imum)?)\\s+${numberPattern}`));
  if (min) return { minPrice: normalizeNumber(min[1]) };
  return {};
}

function extractQueryPhrase(query: string, category?: string) {
  const location = query.match(/\b(?:in|near|around|at|within)\s+(.+?)(?:\s+(?:with|having|featuring|for|under|below|above|over|between|from)\b|$)/i)?.[1];
  const source = location || query;
  const stripped = source
    .replace(/\b\d+\s*(bed|beds|bedroom|bedrooms|bath|baths|bathroom|bathrooms)\b/gi, ' ')
    .replace(/\b(under|below|less than|up to|over|above|more than|at least|between|from|budget|around|max|minimum|maximum)\b.*$/gi, ' ')
    .replace(/\b(aed|aud|usd|gbp|eur|dhs|dirhams?|dollars?)\b/gi, ' ')
    .replace(category ? new RegExp(`\\b${category}s?\\b`, 'gi') : /$^/, ' ')
    .replace(/\b(buy|rent|rental|sale|purchase|lease|off|plan|offplan|ready|property|properties|home|homes|with|and|for)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return stripped || undefined;
}

function fallbackParse(query: string, seed: Record<string, unknown>): SearchFilters {
  const category = inferCategory(query, seed.category);
  const transactionType =
    normalizeEnum(seed.transactionType, ['SALE', 'RENT']) ||
    (/\b(rent|rental|lease)\b/i.test(query) ? 'RENT' : /\b(buy|sale|purchase|invest)\b/i.test(query) ? 'SALE' : undefined);
  const readiness =
    normalizeEnum(seed.readiness, ['READY', 'OFFPLAN']) ||
    (/\b(off[\s-]?plan|new homes?|handover|launch)\b/i.test(query) ? 'OFFPLAN' : undefined);
  const propertyType =
    normalizeEnum(seed.propertyType, ['RESIDENTIAL', 'COMMERCIAL']) ||
    (category && COMMERCIAL_CATEGORIES.has(category) ? 'COMMERCIAL' : /\b(commercial|office|retail|warehouse|industrial)\b/i.test(query) ? 'COMMERCIAL' : undefined);
  return {
    transactionType,
    readiness,
    propertyType,
    category,
    q: extractQueryPhrase(query, category),
    bedrooms: cleanText(seed.bedrooms) || query.match(/(\d+)\s*(?:bed|beds|bedroom|bedrooms)\b/i)?.[1],
    bathrooms: cleanText(seed.bathrooms) || query.match(/(\d+)\s*(?:bath|baths|bathroom|bathrooms)\b/i)?.[1],
    minPrice: normalizeNumber(seed.minPrice),
    maxPrice: normalizeNumber(seed.maxPrice),
    ...extractPrice(query),
  };
}

function sanitizeFilters(raw: Record<string, unknown>, query: string, seed: Record<string, unknown>): SearchFilters {
  const fallback = fallbackParse(query, seed);
  const category = inferCategory(raw.category, fallback.category);
  const transactionType = normalizeEnum(raw.transactionType, ['SALE', 'RENT']) || fallback.transactionType;
  const readiness = normalizeEnum(raw.readiness, ['READY', 'OFFPLAN']) || fallback.readiness;
  const propertyType = normalizeEnum(raw.propertyType, ['RESIDENTIAL', 'COMMERCIAL']) || fallback.propertyType;
  const filters: SearchFilters = {
    q: cleanText(raw.q) || fallback.q,
    transactionType,
    readiness,
    propertyType,
    category,
    bedrooms: normalizeNumber(raw.bedrooms) || fallback.bedrooms,
    bathrooms: normalizeNumber(raw.bathrooms) || fallback.bathrooms,
    minPrice: normalizeNumber(raw.minPrice) || fallback.minPrice,
    maxPrice: normalizeNumber(raw.maxPrice) || fallback.maxPrice,
    minArea: normalizeNumber(raw.minArea) || fallback.minArea,
    maxArea: normalizeNumber(raw.maxArea) || fallback.maxArea,
  };
  filters.type = transactionType === 'RENT' ? 'rent' : readiness === 'OFFPLAN' ? 'new-homes' : propertyType === 'COMMERCIAL' ? 'commercial' : 'buy';
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => Boolean(value))) as SearchFilters;
}

function parseGeminiText(text: string) {
  const jsonText = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  return asRecord(JSON.parse(jsonText));
}

async function askGemini(query: string, seed: Record<string, unknown>) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  const model = process.env.GEMINI_SEARCH_MODEL || process.env.GEMINI_PRIMARY_MODEL || 'gemini-2.5-flash';
  const response = await fetch(`${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `Convert this real estate search into JSON filters. Use only these keys: q, transactionType, propertyType, category, readiness, bedrooms, bathrooms, minPrice, maxPrice, minArea, maxArea. transactionType must be SALE or RENT. propertyType must be RESIDENTIAL or COMMERCIAL. readiness must be READY or OFFPLAN. category should be singular title case, like Apartment, Villa, Penthouse, Townhouse, House, Land, Office, Retail, Warehouse, Rural. q should contain only location, building, community, view, school, or amenity keywords not already captured. Return JSON only.\n\nSearch: ${query}\nCurrent filters: ${JSON.stringify(seed)}` }] }],
      generationConfig: { temperature: 0.1, responseMimeType: 'application/json' },
    }),
  });
  if (!response.ok) return null;
  const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
  return text ? parseGeminiText(text) : null;
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = asRecord(await request.json());
  } catch {
    body = {};
  }
  const query = cleanText(body.query) || cleanText(body.prompt) || cleanText(body.q);
  const seed = asRecord(body.filters);
  const mergedSeed = { ...body, ...seed };
  const gemini = query ? await askGemini(query, mergedSeed).catch(() => null) : null;
  const filters = sanitizeFilters(gemini || {}, query, mergedSeed);
  return NextResponse.json({ filters, source: gemini ? 'gemini' : 'fallback' });
}
