import type { Property, PropertyAgent, SiteAgent, SiteConfig, Testimonial } from './types';
import { PUBLIC_API_BASE_URLS, shouldRetryApiRequest } from './api-base';
import { getSmartPropertyMatches } from './search';

const CLIENT_PUBLIC_API_BASE = '/api/public';

export const ORG_SLUG =
  (((globalThis as any).process?.env?.NEXT_PUBLIC_ORG_SLUG as string | undefined) || 'skyline-realty').trim();

const DEFAULT_SITE_CONFIG: SiteConfig = {
  organization: {
    name: 'Skyline Realty',
    slug: ORG_SLUG,
  },
  categories: [],
  amenities: [],
  featuredAreas: [],
  leadAgent: null,
  branding: null,
  stats: {
    totalListings: 0,
    readyListings: 0,
    offPlanListings: 0,
    activeAgents: 0,
    awards: 0,
    blogs: 0,
    testimonials: 0,
  },
};

export type GetPropertiesParams = Record<string, string | number | boolean | undefined | null>;

export type PaginatedProperties = {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
};

export type AiPropertySearchResult = {
  propertyIds: string[];
  source: 'gemini' | 'fallback';
  model: string | null;
};

type PublicListingImage = {
  id?: string | null;
  url?: string | null;
  cdnUrl?: string | null;
  mediumUrl?: string | null;
  thumbnailUrl?: string | null;
  gcsPath?: string | null;
  format?: string | null;
  category?: string | null;
  order?: number | null;
  status?: string | null;
  isHero?: boolean | null;
};

type PublicListing = Record<string, any> & {
  id: string;
  title?: string | null;
  description?: string | null;
  transactionType?: string | null;
  propertyType?: string | null;
  category?: string | null;
  readiness?: string | null;
  emirate?: string | null;
  area?: string | null;
  price?: number | string | null;
  currency?: string | null;
  bedrooms?: number | string | null;
  bathrooms?: number | string | null;
  builtUpArea?: number | string | null;
  size?: number | string | null;
  images?: PublicListingImage[];
  broker?: Record<string, any> | null;
  organization?: { name?: string | null; slug?: string | null } | null;
  developerName?: string | null;
  constructionTimelineData?: Record<string, any> | null;
  paymentPlanData?: Record<string, any> | null;
  latitude?: number | null;
  longitude?: number | null;
  lat?: number | string | null;
  lng?: number | string | null;
  streetAddress?: string | null;
  address?: string | null;
};

const LOCATION_FIELD_PATTERN = /(?:^|\.)(?:area|emirate|city|community|subcommunity|tower|building|street|address|location|district|neighbou?rhood|project|island|cluster)$/i;

function getPublicApiBases() {
  return typeof window === 'undefined' ? PUBLIC_API_BASE_URLS : [CLIENT_PUBLIC_API_BASE];
}

function normalizeTransactionType(value?: string | null): 'Sale' | 'Rent' {
  return value?.toUpperCase() === 'RENT' ? 'Rent' : 'Sale';
}

function normalizeStatus(value?: string | null): 'Off-plan' | 'Ready' {
  return value?.toUpperCase() === 'OFFPLAN' ? 'Off-plan' : 'Ready';
}

function normalizeNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function normalizeCoordinate(...values: unknown[]): number | null {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return null;
}

function buildStorageImageUrl(gcsPath?: string | null): string | null {
  if (!gcsPath) return null;
  return `https://storage.googleapis.com/brokbuddy-listing-images/${gcsPath.replace(/^\/+/, '')}`;
}

function normalizeAssetUrl(value?: string | null): string | null {
  const normalized = value?.trim();
  if (!normalized) return null;
  if (!normalized.startsWith('/')) return normalized;

  const publicApiBase = PUBLIC_API_BASE_URLS[0];
  if (!publicApiBase) return normalized;

  const apiOrigin = publicApiBase.replace(/\/api\/public$/i, '');

  try {
    return new URL(normalized, apiOrigin).toString();
  } catch {
    return normalized;
  }
}

function isProxiedPublicImageUrl(value?: string | null): boolean {
  return /^\/api\/public\/images\/[^/]+\/view/i.test(value?.trim() || '');
}

function isRenderableImage(image?: PublicListingImage | null): boolean {
  if (!image) return false;

  const format = (image.format || '').toLowerCase();
  const category = (image.category || '').toUpperCase();

  if (category === 'TITLE_DEED') return false;
  if (format === 'application/pdf' || format.endsWith('pdf')) return false;

  return true;
}

function normalizeImageUrl(image?: PublicListingImage | null): string | null {
  if (!image || !isRenderableImage(image)) return null;

  const storageUrl = buildStorageImageUrl(image.gcsPath);
  const originalUrl = isProxiedPublicImageUrl(image.url)
    ? normalizeAssetUrl(image.url) || storageUrl
    : normalizeAssetUrl(image.url) || storageUrl;
  const isReady = image.status?.toUpperCase() === 'READY';
  const preferredUrl = isReady
    ? normalizeAssetUrl(image.mediumUrl) ||
      normalizeAssetUrl(image.cdnUrl) ||
      normalizeAssetUrl(image.thumbnailUrl) ||
      originalUrl
    : originalUrl ||
      normalizeAssetUrl(image.mediumUrl) ||
      normalizeAssetUrl(image.thumbnailUrl) ||
      normalizeAssetUrl(image.cdnUrl);

  return preferredUrl?.trim() || null;
}

function normalizeImages(images?: PublicListingImage[] | null): string[] {
  if (!images?.length) return [];
  return [...images]
    .filter(isRenderableImage)
    .sort((left, right) => {
      const heroDelta = Number(Boolean(right.isHero)) - Number(Boolean(left.isHero));
      if (heroDelta !== 0) return heroDelta;

      const orderDelta =
        (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER);
      if (orderDelta !== 0) return orderDelta;

      return String(left.id || '').localeCompare(String(right.id || ''));
    })
    .map(normalizeImageUrl)
    .filter((image): image is string => Boolean(image));
}

function pickDeveloperLogo(developerName?: string | null) {
  const normalized = developerName?.trim().toLowerCase();
  if (!normalized) return undefined;
  if (normalized.includes('emaar')) return 'Emaar';
  if (normalized.includes('nakheel')) return 'Nakheel';
  return undefined;
}

function normalizeLocation(listing: PublicListing) {
  return [listing.area, listing.emirate].filter(Boolean).join(', ') || listing.location || 'Dubai';
}

function flattenPublicListingValues(value: unknown, bucket: string[] = []): string[] {
  if (value === null || value === undefined) return bucket;

  if (Array.isArray(value)) {
    value.forEach(item => flattenPublicListingValues(item, bucket));
    return bucket;
  }

  if (typeof value === 'object') {
    Object.values(value as Record<string, unknown>).forEach(item => flattenPublicListingValues(item, bucket));
    return bucket;
  }

  if (typeof value === 'string') {
    const normalized = value.trim();
    if (normalized) bucket.push(normalized);
    return bucket;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    bucket.push(String(value));
  }

  return bucket;
}

function collectPublicListingLocationValues(
  value: unknown,
  bucket: string[] = [],
  parentKey = ''
): string[] {
  if (!value || typeof value !== 'object') return bucket;

  Object.entries(value as Record<string, unknown>).forEach(([key, childValue]) => {
    const nextKey = parentKey ? `${parentKey}.${key}` : key;

    if (LOCATION_FIELD_PATTERN.test(nextKey)) {
      flattenPublicListingValues(childValue, bucket);
    }

    if (childValue && typeof childValue === 'object') {
      collectPublicListingLocationValues(childValue, bucket, nextKey);
    }
  });

  return bucket;
}

function dedupeJoinedSearchValues(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(
      values
        .map(value => value?.trim())
        .filter((value): value is string => Boolean(value))
    )
  ).join(' ');
}

function normalizeReferenceId(listing: PublicListing) {
  return listing.listingCode || listing.referenceId || undefined;
}

function normalizePermitNumber(listing: PublicListing) {
  return listing.trakheesiPermitNumber || listing.permitNumber || listing.trakheesi || undefined;
}

function normalizeReraNumber(listing: PublicListing) {
  return listing.reraNumber || listing.reraPermit || undefined;
}

function normalizeHandoverDate(listing: PublicListing) {
  const expectedCompletion =
    listing.constructionTimelineData?.expected_completion ||
    listing.constructionTimelineData?.expectedCompletion ||
    listing.handoverDate;
  if (typeof expectedCompletion === 'string' && expectedCompletion.trim()) {
    return expectedCompletion;
  }
  return undefined;
}

function mapAgent(agent?: Record<string, any> | null, organizationName?: string): PropertyAgent | undefined {
  if (!agent) return undefined;
  return {
    id: agent.id,
    name: `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || agent.brokerProfile?.displayName || 'Skyline Agent',
    title: agent.brokerProfile?.tagline || 'Real Estate Advisor',
    avatarUrl: agent.avatar || null,
    phone: agent.brokerProfile?.publicPhone || agent.phone || null,
    email: agent.brokerProfile?.publicEmail || agent.email || null,
    whatsapp: agent.brokerProfile?.whatsapp || agent.phone || null,
    company: organizationName,
    licenseNumber: agent.licenseNumber || null,
    slug: agent.brokerProfile?.slug || null,
    instagram: agent.brokerProfile?.instagram || null,
    linkedin: agent.brokerProfile?.linkedin || null,
    twitter: agent.brokerProfile?.twitter || null,
  };
}

function mapListingToProperty(listing: PublicListing): Property {
  const images = normalizeImages(listing.images);
  const organizationName = listing.organization?.name || 'Skyline Realty';
  const sqft = normalizeNumber(listing.builtUpArea) || normalizeNumber(listing.size) || normalizeNumber(listing.areaSqFt);
  const amenities = Array.isArray(listing.amenities)
    ? listing.amenities.filter(Boolean)
    : Array.isArray(listing.fields?.amenities)
      ? listing.fields.amenities.filter(Boolean)
      : [];
  const searchableText = dedupeJoinedSearchValues(flattenPublicListingValues(listing));
  const searchableLocation = dedupeJoinedSearchValues([
    listing.location,
    listing.area,
    listing.emirate,
    listing.streetAddress,
    listing.address,
    ...collectPublicListingLocationValues(listing),
  ]);

  return {
    id: listing.id,
    title: listing.title?.trim() || 'Untitled Property',
    location: normalizeLocation(listing),
    mapAddress: listing.streetAddress?.trim() || listing.address?.trim() || undefined,
    searchableText: searchableText || undefined,
    searchableLocation: searchableLocation || undefined,
    price: normalizeNumber(listing.price),
    currency: listing.currency || 'AED',
    bedrooms: normalizeNumber(listing.bedrooms),
    bathrooms: normalizeNumber(listing.bathrooms),
    sqft,
    type: listing.category || listing.type || listing.propertyType || 'Property',
    amenities,
    images,
    description: listing.description?.trim() || 'More details available on request.',
    referenceId: normalizeReferenceId(listing),
    trakheesi: normalizePermitNumber(listing),
    reraPermit: normalizeReraNumber(listing),
    dldPermitLink: listing.dldPermitLink || null,
    status: normalizeStatus(listing.readiness),
    transactionType: normalizeTransactionType(listing.transactionType),
    photoCount: images.length,
    tag: listing.propertyType === 'COMMERCIAL' ? 'Commercial' : 'Residential',
    developerLogo: pickDeveloperLogo(listing.developerName),
    developerName: listing.developerName || undefined,
    category: listing.category || undefined,
    nearby: Array.isArray(listing.nearby) ? listing.nearby : [],
    handoverDate: normalizeHandoverDate(listing),
    latitude: normalizeCoordinate(listing.latitude, listing.lat),
    longitude: normalizeCoordinate(listing.longitude, listing.lng),
    paymentPlanData: listing.paymentPlanData || null,
    constructionTimelineData: listing.constructionTimelineData || null,
    organizationName,
    organizationSlug: listing.organization?.slug || ORG_SLUG,
    agent: mapAgent(listing.broker, organizationName),
  };
}

async function fetchJson<T>(
  path: string,
  {
    params,
    revalidate,
    init,
  }: {
    params?: GetPropertiesParams;
    revalidate?: number;
    init?: RequestInit;
  } = {}
): Promise<T> {
  const requestInit: RequestInit = {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  };

  if (typeof window === 'undefined' && revalidate) {
    (requestInit as RequestInit & { next?: { revalidate: number } }).next = { revalidate };
  }

  const publicApiBases = getPublicApiBases();
  let lastError: Error | null = null;

  for (const [index, publicApiBase] of publicApiBases.entries()) {
    const url = new URL(
      `${publicApiBase}${path}`,
      typeof window === 'undefined' ? 'http://localhost' : window.location.origin
    );

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        url.searchParams.set(key, String(value));
      });
    }

    try {
      const response = await fetch(url.toString(), requestInit);
      if (!response.ok) {
        const error = new Error(`Request failed for ${url.pathname}: ${response.status}`);
        if (index < publicApiBases.length - 1 && shouldRetryApiRequest(response.status)) {
          lastError = error;
          continue;
        }

        throw error;
      }

      return response.json() as Promise<T>;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (index === publicApiBases.length - 1) {
        throw lastError;
      }
    }
  }

  throw lastError ?? new Error(`Request failed for ${path}`);
}

export function toSocialUrl(platform: 'instagram' | 'linkedin' | 'twitter' | 'website' | 'whatsapp', value?: string | null) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (platform === 'website') return `https://${value.replace(/^\/+/, '')}`;
  if (platform === 'instagram') return `https://instagram.com/${value.replace(/^@/, '')}`;
  if (platform === 'linkedin') return `https://linkedin.com/in/${value.replace(/^@/, '')}`;
  if (platform === 'twitter') return `https://x.com/${value.replace(/^@/, '')}`;
  if (platform === 'whatsapp') {
    const phone = value.replace(/[^\d+]/g, '');
    return phone ? `https://wa.me/${phone.replace('+', '')}` : null;
  }
  return value;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const config = await fetchJson<SiteConfig>(`/org/${ORG_SLUG}/config`, {
      revalidate: 300,
    });

    return {
      ...DEFAULT_SITE_CONFIG,
      ...config,
      organization: {
        ...DEFAULT_SITE_CONFIG.organization,
        ...(config.organization || {}),
      },
      categories: config.categories || [],
      amenities: config.amenities || [],
      featuredAreas: config.featuredAreas || [],
      leadAgent: config.leadAgent || null,
      branding: config.branding || null,
      stats: {
        ...DEFAULT_SITE_CONFIG.stats!,
        ...(config.stats || {}),
      },
    };
  } catch (error) {
    console.error('Failed to fetch site config', error);
    return DEFAULT_SITE_CONFIG;
  }
}

export async function getProperties(params: GetPropertiesParams = {}): Promise<PaginatedProperties> {
  try {
    const data = await fetchJson<{ listings: PublicListing[]; total: number; page: number; totalPages: number }>(
      `/org/${ORG_SLUG}/listings`,
      {
        params,
        revalidate: 60,
      }
    );

    return {
      properties: (data.listings || []).map(mapListingToProperty),
      total: data.total || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 1,
    };
  } catch (error) {
    console.error('Failed to fetch properties', error);
    return {
      properties: [],
      total: 0,
      page: 1,
      totalPages: 1,
    };
  }
}

function normalizeAiSearchTransactionType(value?: string) {
  if (value === 'rent') return 'RENT';
  if (value === 'buy') return 'SALE';
  return undefined;
}

function normalizeAiSearchReadiness(value?: string) {
  const normalized = value?.trim();
  if (!normalized) return undefined;
  return normalized.toUpperCase().replace(/[^A-Z]/g, '');
}

async function fallbackAiPropertySearch(payload: {
  query: string;
  transactionType?: string;
  category?: string;
  readiness?: string;
  limit?: number;
}): Promise<AiPropertySearchResult> {
  const normalizedTransactionType = normalizeAiSearchTransactionType(payload.transactionType);
  const normalizedReadiness = normalizeAiSearchReadiness(payload.readiness);
  const { properties } = await getProperties({
    limit: Math.max(payload.limit || 12, 120),
    transactionType: normalizedTransactionType,
    category: payload.category,
    readiness: normalizedReadiness,
  });

  const matches = getSmartPropertyMatches(properties, payload.query, payload.limit || 12);

  return {
    propertyIds: matches.map(property => property.id),
    source: 'fallback',
    model: null,
  };
}

export async function searchPropertiesWithAI(payload: {
  query: string;
  transactionType?: string;
  category?: string;
  readiness?: string;
  limit?: number;
}): Promise<AiPropertySearchResult> {
  try {
    const result = await fetchJson<AiPropertySearchResult>(`/org/${ORG_SLUG}/ai-property-search`, {
      init: {
        method: 'POST',
        body: JSON.stringify({
          query: payload.query,
          transactionType: normalizeAiSearchTransactionType(payload.transactionType),
          category: payload.category,
          readiness: normalizeAiSearchReadiness(payload.readiness),
          limit: payload.limit,
        }),
      },
    });

    if (result.source === 'fallback') {
      const refinedFallback = await fallbackAiPropertySearch(payload);

      if (refinedFallback.propertyIds.length > 0) {
        return refinedFallback;
      }
    }

    return result;
  } catch (error) {
    console.warn('AI property search failed, using template fallback search.', error);
    return fallbackAiPropertySearch(payload);
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const data = await fetchJson<PublicListing>(`/listing/${id}`, {
      revalidate: 60,
    });
    return mapListingToProperty(data);
  } catch (error) {
    console.error(`Failed to fetch property ${id}`, error);
    return null;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await fetchJson<Testimonial[]>(`/org/${ORG_SLUG}/testimonials`, {
      revalidate: 300,
    });
  } catch (error) {
    console.error('Failed to fetch testimonials', error);
    return [];
  }
}

export async function getAgents(): Promise<SiteAgent[]> {
  try {
    const agents = await fetchJson<Record<string, any>[]>(`/org/${ORG_SLUG}/agents`, {
      revalidate: 300,
    });

    return agents.map(agent => ({
      id: agent.id,
      name: agent.brokerProfile?.displayName || `${agent.firstName || ''} ${agent.lastName || ''}`.trim(),
      email: agent.brokerProfile?.publicEmail || agent.email,
      phone: agent.brokerProfile?.publicPhone || agent.phone,
      whatsapp: agent.brokerProfile?.whatsapp || agent.phone,
      avatar: agent.avatar || null,
      licenseNumber: agent.licenseNumber || null,
      slug: agent.brokerProfile?.slug || null,
      tagline: agent.brokerProfile?.tagline || null,
      bio: agent.brokerProfile?.bio || null,
      instagram: agent.brokerProfile?.instagram || null,
      linkedin: agent.brokerProfile?.linkedin || null,
      twitter: agent.brokerProfile?.twitter || null,
      specializations: agent.brokerProfile?.specializations || [],
      languages: agent.brokerProfile?.languages || [],
      yearsExperience: agent.brokerProfile?.yearsExperience ?? null,
    }));
  } catch (error) {
    console.error('Failed to fetch agents', error);
    return [];
  }
}

export async function submitOrgInquiry(payload: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  listingId?: string;
  propertyType?: string;
  budget?: number;
}) {
  return fetchJson<{ message: string; data: unknown }>(`/org/${ORG_SLUG}/inquiry`, {
    init: {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  });
}
