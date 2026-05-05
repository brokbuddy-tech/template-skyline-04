import type { 
  Property, 
  PropertyMedia, 
  SiteConfig,
  SiteAgent,
  SiteBranding,
  SiteStats
} from './types';
import { 
  PUBLIC_API_BASE_URLS,
  PUBLIC_TEMPLATE_ORG_SLUG,
  getPublicTemplateUrl,
  getTemplateFetchUrl,
} from './api-base';

// ── Types ──────────────────────────────────────────────────────────────────

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

type PublicTemplateSiteSnapshot = SiteConfig & {
  profile?: SiteConfig['profile'];
  areaGuides?: any[];
  testimonials?: any[];
  sellerTestimonials?: any[];
  blogs?: any[];
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

// ── Helpers ────────────────────────────────────────────────────────────────

function buildStorageImageUrl(gcsPath?: string | null): string | null {
  if (!gcsPath) return null;
  return `https://storage.googleapis.com/brokbuddy-listing-images/${gcsPath.replace(/^\/+/, '')}`;
}

const GCS_PUBLIC_BASE = 'https://storage.googleapis.com/brokbuddy-listing-images';
const BROKEN_CDN_PATTERNS = [
  /^https?:\/\/cdn\.brokbuddy\.com\//,
  /^https?:\/\/34\.160\.56\.176\//,
];

/**
 * Rewrites CDN URLs that point to non-operational CDN hosts
 * to use direct GCS public URLs instead.
 */
function rewriteCdnToGcs(url?: string | null): string | null {
  if (!url) return null;
  for (const pattern of BROKEN_CDN_PATTERNS) {
    if (pattern.test(url)) {
      return url.replace(pattern, `${GCS_PUBLIC_BASE}/`);
    }
  }
  return url;
}

/** 
 * Mimics Broker-OS getListingMediaUrl for the public API proxy.
 * COST OPTIMIZATION: Prefer direct GCS URLs when available to avoid
 * routing image bytes through the API server (the #1 networking cost driver).
 * Only falls back to the proxy URL when no direct URLs exist.
 */
function getPublicListingMediaUrl(
  image?: PublicListingImage | null,
  variant: 'thumbnail' | 'medium' | 'compressed' | 'original' = 'medium'
): string | null {
  if (!image) return null;

  // Force API proxy as CDN and direct GCS URLs are currently returning 403
  // due to unauthenticated bucket permissions.
  if (image.id) {
    return getPublicTemplateUrl(`/images/${image.id}/view?variant=${variant}`);
  }

  return image.url || null;
}

function normalizeAssetUrl(value?: string | null): string | null {
  const normalized = value?.trim();
  if (!normalized) return null;
  
  if (/^https?:\/\//i.test(normalized)) return normalized;
  if (normalized.startsWith(PUBLIC_TEMPLATE_PROXY_BASE_PATH)) return normalized;

  const path = normalized.startsWith('/') ? normalized : `/${normalized}`;
  const publicApiBase = PUBLIC_API_BASE_URLS[0];
  if (!publicApiBase) return normalized;

  const apiOrigin = publicApiBase.replace(/\/api\/public$/i, '');

  try {
    return new URL(path, apiOrigin).toString();
  } catch {
    return normalized;
  }
}

function isRenderableImage(image?: PublicListingImage | null): boolean {
  if (!image) return false;

  const format = (image.format || '').toLowerCase();
  const category = (image.category || '').toUpperCase();

  if (category === 'TITLE_DEED') return false;
  if (format === 'application/pdf' || format.endsWith('pdf')) return false;

  return true;
}

function normalizeNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/,/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function normalizeListingDescription(description?: string) {
  const plainText = (description || '')
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(div|p|section|article|h[1-6])\s*>/gi, '\n\n')
    .replace(/<\/\s*li\s*>/gi, '\n')
    .replace(/<\s*li\b[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  return plainText || 'Property details coming soon.';
}

function getStringValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  }
  return undefined;
}

function normalizeLocation(listing: any): string {
  const parts = [
    listing.area,
    listing.emirate
  ].filter(p => !!p && typeof p === 'string');
  
  return parts.length > 0 ? parts.join(', ') : (listing.location || 'Dubai');
}

function collectPublicListingLocationValues(listing: any): string[] {
  const values: string[] = [];
  if (listing.location) values.push(listing.location);
  if (listing.area) values.push(listing.area);
  if (listing.emirate) values.push(listing.emirate);
  if (listing.subArea) values.push(listing.subArea);
  if (listing.streetAddress) values.push(listing.streetAddress);
  if (listing.address) values.push(listing.address);
  return values;
}

function flattenPublicListingValues(listing: any): string[] {
  const values: string[] = [
    listing.title,
    normalizeListingDescription(listing.description),
  ];
  return values.concat(collectPublicListingLocationValues(listing)).filter(Boolean);
}

function dedupeJoinedSearchValues(values: string[]): string {
  return Array.from(new Set(values.filter(v => !!v && typeof v === 'string').map(v => v.trim())))
    .join(' ')
    .toLowerCase();
}

function mapListingAgent(listing: any): Property['agent'] {
  const publicAgent = listing?.agent;
  const legacyBroker = listing?.broker;
  const agentName = getStringValue(
    publicAgent?.name,
    legacyBroker?.brokerProfile?.displayName,
    [legacyBroker?.firstName, legacyBroker?.lastName].filter(Boolean).join(' ')
  );

  if (!agentName) {
    return undefined;
  }

  return {
    id: publicAgent?.id,
    name: agentName,
    avatarUrl: normalizeAssetUrl(publicAgent?.avatarUrl || publicAgent?.avatar || legacyBroker?.avatar) || '',
    title: getStringValue(publicAgent?.title, publicAgent?.tagline, legacyBroker?.brokerProfile?.tagline) || 'Property Consultant',
    phone: getStringValue(publicAgent?.phone, legacyBroker?.brokerProfile?.publicPhone, legacyBroker?.phone) || '',
    email: getStringValue(publicAgent?.email, legacyBroker?.brokerProfile?.publicEmail, legacyBroker?.email) || '',
    whatsapp: getStringValue(publicAgent?.whatsapp, legacyBroker?.brokerProfile?.whatsapp, legacyBroker?.whatsapp, legacyBroker?.brokerProfile?.publicPhone, legacyBroker?.phone) || '',
    company: getStringValue(publicAgent?.company, listing?.organizationName, listing?.organization?.name),
    licenseNumber: getStringValue(publicAgent?.licenseNumber, legacyBroker?.licenseNumber) || undefined,
    slug: getStringValue(publicAgent?.slug, legacyBroker?.brokerProfile?.slug) || undefined,
  };
}

/**
 * Maps raw API listing data to the Property type.
 * Updated to mimic Broker-OS image fetching and READY status handling.
 */
export function mapListingToProperty(listing: any): Property {
  const images: PublicListingImage[] = Array.isArray(listing.images) ? listing.images : [];
  
  const media: PropertyMedia[] = images
    .filter(isRenderableImage)
    .sort((left, right) => {
      const heroDelta = Number(Boolean(right.isHero)) - Number(Boolean(left.isHero));
      if (heroDelta !== 0) return heroDelta;
      const orderDelta = (left.order ?? 999) - (right.order ?? 999);
      if (orderDelta !== 0) return orderDelta;
      return String(left.id || '').localeCompare(String(right.id || ''));
    })
    .map(img => {
      const storageUrl = buildStorageImageUrl(img.gcsPath);
      
      // Use the proxied variant URLs (Mimicking Broker-OS getProcessedUrl/buildMediaSlide)
      const thumb = getPublicListingMediaUrl(img, 'thumbnail');
      const med = getPublicListingMediaUrl(img, 'medium');
      const high = getPublicListingMediaUrl(img, 'compressed');
      
      const originalUrl = normalizeAssetUrl(img.url) || storageUrl || '';

      return {
        url: med || high || originalUrl,
        thumbnailUrl: thumb || med || originalUrl,
        mediumUrl: med || high || originalUrl,
        cdnUrl: high || med || originalUrl,
      };
    })
    .filter(m => !!m.url);

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
    transactionType: listing.transactionType === 'RENT' ? 'Rent' : 'Sale',
    status: listing.readiness?.toUpperCase() === 'OFFPLAN' ? 'Off-plan' : 'Ready',
    amenities: amenities.map(String),
    description: normalizeListingDescription(listing.description),
    images: media.map(m => m.url),
    media,
    featured: Boolean(listing.featured || listing.isFeatured),
    dldPermitLink: listing.dldPermitLink || listing.fields?.dldPermitLink || undefined,
    handoverDate: listing.handoverDate || listing.fields?.handoverDate || undefined,
    developerName: listing.developer?.name || listing.fields?.developerName || undefined,
    developerLogo: listing.developer?.logo || listing.fields?.developerLogo || undefined,
    tag: listing.tag || listing.fields?.tag || undefined,
    agent: mapListingAgent(listing),
  };
}

// ── API Methods ─────────────────────────────────────────────────────────────

async function safeFetch(url: string, options?: RequestInit, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    return new Response(null, { status: 503, statusText: 'Service Unavailable' });
  } finally {
    clearTimeout(id);
  }
}

export async function getProperties(params: GetPropertiesParams = {}): Promise<PaginatedProperties> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  const fetchUrl = getTemplateFetchUrl(`/listings${query ? `?${query}` : ''}`);

  const response = await safeFetch(fetchUrl, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return { properties: [], total: 0, page: 1, totalPages: 1 };
  }

  const data = await response.json();
  
  const rawListings = Array.isArray(data) ? data : (data.listings || []);
  const total = data.total || rawListings.length;
  const page = data.page || 1;
  const totalPages = data.totalPages || Math.ceil(total / (params.limit as number || 10)) || 1;

  return {
    properties: rawListings.map(mapListingToProperty),
    total,
    page,
    totalPages,
  };
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const response = await safeFetch(getTemplateFetchUrl(`/listings/${id}`), {
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;

  const data = await response.json();
  return mapListingToProperty(data);
}

export async function getSmartPropertyMatches(query: string | Record<string, any>): Promise<AiPropertySearchResult> {
  try {
    const queryInput = typeof query === 'string' ? { q: query } : query;
    const properties = await getProperties({
      q: typeof queryInput.q === 'string' ? queryInput.q : '',
      transactionType: queryInput.transactionType,
      category: queryInput.category,
      readiness: queryInput.readiness,
      limit: queryInput.limit || 8,
    });

    return {
      propertyIds: properties.properties.map((property) => property.id).slice(0, Number(queryInput.limit || 8)),
      source: 'fallback',
      model: null,
    };
  } catch (error) {
    return { propertyIds: [], source: 'fallback', model: null };
  }
}

/** Legacy alias for AI search with expanded compatibility */
export const searchPropertiesWithAI = getSmartPropertyMatches;

export async function submitOrgInquiry(payload: any): Promise<any> {
  const response = await safeFetch(getTemplateFetchUrl('/inquiry'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || 'Failed to submit inquiry');
  }

  return await response.json();
}

async function getTemplateSiteSnapshot(): Promise<PublicTemplateSiteSnapshot | null> {
  const response = await safeFetch(getTemplateFetchUrl(), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return null;
  }

  return await response.json();
}

export function toSocialUrl(network: string, handle?: string | null): string {
  if (!handle) return '';
  const trimmed = handle.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http')) return trimmed;

  switch (network.toLowerCase()) {
    case 'instagram': return `https://instagram.com/${trimmed.replace(/^@/, '')}`;
    case 'twitter': return `https://twitter.com/${trimmed.replace(/^@/, '')}`;
    case 'linkedin': return trimmed.includes('linkedin.com') ? trimmed : `https://linkedin.com/in/${trimmed}`;
    case 'whatsapp': return `https://wa.me/${trimmed.replace(/\D/g, '')}`;
    default: return trimmed;
  }
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const data = await getTemplateSiteSnapshot();
  const defaultTitle = 'Agency Website';
  const defaultSlug = PUBLIC_TEMPLATE_ORG_SLUG || 'organization';

  if (!data) {
    return {
      organization: { name: defaultTitle, slug: defaultSlug },
      categories: [],
      amenities: [],
    };
  }

  return {
    organization: data.organization || { name: defaultTitle, slug: defaultSlug },
    categories: data.categories || [],
    amenities: data.amenities || [],
    featuredAreas: data.featuredAreas || [],
    leadAgent: data.leadAgent || null,
    branding: data.branding || null,
    profile: data.profile || null,
    stats: data.stats || {
      totalListings: 0,
      readyListings: 0,
      offPlanListings: 0,
      activeAgents: 0,
      awards: 0,
      blogs: 0,
      testimonials: 0,
    },
  };
}

export async function getAreaGuides(): Promise<any[]> {
  const data = await getTemplateSiteSnapshot();
  return data?.areaGuides || [];
}

export async function getTestimonials(): Promise<any[]> {
  const data = await getTemplateSiteSnapshot();
  return data?.testimonials || [];
}

export async function getBlogs(): Promise<any[]> {
  const data = await getTemplateSiteSnapshot();
  return data?.blogs || [];
}

export async function getSellerTestimonials(): Promise<any[]> {
  const data = await getTemplateSiteSnapshot();
  return data?.sellerTestimonials || [];
}
