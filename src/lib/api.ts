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
  getConfiguredTemplateHexCode,
  getClientTemplateFetchUrl,
  normalizePublicTemplateAssetUrl,
  PUBLIC_TEMPLATE_PROXY_BASE_PATH,
  shouldRetryApiRequest,
} from './api-base';
import { getDefaultAgencySlug, getEffectiveAgencySlug } from './agency-routing';

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

type ResolvedAgencyContext = {
  organization: {
    id?: string;
    name?: string;
    slug: string;
    hexCode: string;
    templateUrl?: string | null;
    publicAgencyUrl?: string | null;
    country?: string | null;
  };
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

const DEFAULT_SITE_STATS: SiteStats = {
  totalListings: 0,
  readyListings: 0,
  offPlanListings: 0,
  activeAgents: 0,
  awards: 0,
  blogs: 0,
  testimonials: 0,
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
  variant: 'thumbnail' | 'medium' | 'compressed' | 'original' = 'medium',
  agencySlug?: string | null,
): string | null {
  if (!image) return null;

  // Force API proxy as CDN and direct GCS URLs are currently returning 403
  // due to unauthenticated bucket permissions.
  if (image.id) {
    return getClientTemplateFetchUrl(`/images/${image.id}/view?variant=${variant}`, agencySlug);
  }

  return image.url || null;
}

function normalizeAssetUrl(value?: string | null): string | null {
  const normalized = value?.trim();
  if (!normalized) return null;

  const normalizedProxyPath = normalizePublicTemplateAssetUrl(normalized) || normalized;
  if (/^https?:\/\//i.test(normalizedProxyPath)) return normalizedProxyPath;
  if (normalizedProxyPath.startsWith(PUBLIC_TEMPLATE_PROXY_BASE_PATH)) return normalizedProxyPath;

  const path = normalizedProxyPath.startsWith('/') ? normalizedProxyPath : `/${normalizedProxyPath}`;
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

function getOptionalNumber(...values: any[]): number | null {
  for (const value of values) {
    if (value === null || value === undefined || value === '') {
      continue;
    }

    if (typeof value === 'number') {
      if (!Number.isNaN(value)) {
        return value;
      }
      continue;
    }

    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/,/g, ''));
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  return null;
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
    brn: getStringValue(publicAgent?.brn, publicAgent?.licenseNumber, legacyBroker?.brokerProfile?.brn, legacyBroker?.licenseNumber) || undefined,
    licenseNumber: getStringValue(publicAgent?.brn, publicAgent?.licenseNumber, legacyBroker?.brokerProfile?.brn, legacyBroker?.licenseNumber) || undefined,
    slug: getStringValue(publicAgent?.slug, legacyBroker?.brokerProfile?.slug) || undefined,
  };
}

const RECENTLY_LISTED_WINDOW_MS = 15 * 24 * 60 * 60 * 1000;

function isTruthyListingFlag(value: unknown) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'y', 'on'].includes(value.trim().toLowerCase());
  }
  return Boolean(value);
}

function isFeaturedListing(listing: any) {
  return [
    listing.isFeatured,
    listing.featured,
    listing.fields?.isFeatured,
    listing.fields?.featured,
  ].some(isTruthyListingFlag);
}

function getCreatedAtIso(value: unknown) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function isRecentlyListed(createdAt?: string) {
  if (!createdAt) return false;
  const createdTime = Date.parse(createdAt);
  if (!Number.isFinite(createdTime)) return false;
  const ageMs = Date.now() - createdTime;
  return ageMs >= 0 && ageMs <= RECENTLY_LISTED_WINDOW_MS;
}

/**
 * Maps raw API listing data to the Property type.
 * Updated to mimic Broker-OS image fetching and READY status handling.
 */
export function mapListingToProperty(listing: any, agencySlug?: string | null): Property {
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
      const thumb = getPublicListingMediaUrl(img, 'thumbnail', agencySlug);
      const med = getPublicListingMediaUrl(img, 'medium', agencySlug);
      const high = getPublicListingMediaUrl(img, 'compressed', agencySlug);
      
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

  const createdAt = getCreatedAtIso(listing.createdAt);
  const featured = isFeaturedListing(listing);

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
    featured,
    createdAt,
    recentlyListed: isRecentlyListed(createdAt),
    dldPermitNo: getStringValue(listing.trakheesiPermitNumber, listing.dldPermitNo, listing.permitNumber, listing.trakheesi, listing.fields?.dldPermitNo, listing.fields?.permitNumber, listing.fields?.trakheesiPermit),
    trakheesi: getStringValue(listing.trakheesiPermitNumber, listing.trakheesi, listing.permitNumber, listing.dldPermitNo, listing.fields?.trakheesi, listing.fields?.permitNumber, listing.fields?.trakheesiPermit),
    reraPermit: getStringValue(listing.reraPermitNumber, listing.reraPermit, listing.reraNumber, listing.reraProjectNumber, listing.fields?.reraPermit, listing.fields?.reraNumber, listing.fields?.reraProjectNumber),
    dldPermitLink: getStringValue(listing.dldPermitLink, listing.trakheesiPermitLink, listing.fields?.dldPermitLink) || undefined,
    floorPlans: Array.isArray(listing.floorPlans) ? listing.floorPlans : Array.isArray(listing.fields?.floorPlans) ? listing.fields?.floorPlans : [],
    handoverDate: listing.handoverDate || listing.fields?.handoverDate || undefined,
    developerName: listing.developer?.name || listing.fields?.developerName || undefined,
    developerLogo: listing.developer?.logo || listing.fields?.developerLogo || undefined,
    tag: listing.tag || listing.fields?.tag || undefined,
    latitude: getOptionalNumber(listing.latitude, listing.lat, listing.fields?.latitude, listing.fields?.lat),
    longitude: getOptionalNumber(listing.longitude, listing.lng, listing.fields?.longitude, listing.fields?.lng),
    virtualTourUrl:
      getStringValue(
        listing.virtualTourUrl,
        listing.videoTourUrl,
        listing.fields?.virtualTourUrl,
        listing.fields?.virtualTour,
        listing.fields?.virtualTourLink,
        listing.fields?.tourUrl,
        listing.fields?.videoTourUrl,
        listing.fields?.matterportUrl,
      ) || null,
    agent: mapListingAgent(listing),
  };
}

// ── API Methods ─────────────────────────────────────────────────────────────

function splitTemplatePath(path = '') {
  const [pathname = '', search = ''] = path.split('?');
  return {
    pathname: pathname || '',
    search: search ? `?${search}` : '',
  };
}

function appendHexToSearch(search: string, hexCode: string) {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  params.set('hex', hexCode);
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

function buildBackendPublicUrl(publicApiBaseUrl: string, agencySlug: string, hexCode: string, path = '') {
  const { pathname, search } = splitTemplatePath(path);
  const trimmedPathname = pathname.replace(/^\/+/, '');
  const segments = trimmedPathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return `${publicApiBaseUrl}/organization${appendHexToSearch(search, hexCode)}`;
  }

  if (segments[0] === 'listings') {
    if (segments[1]) {
      return `${publicApiBaseUrl}/listings/${encodeURIComponent(segments[1])}${appendHexToSearch(search, hexCode)}`;
    }
    return `${publicApiBaseUrl}/listings${appendHexToSearch(search, hexCode)}`;
  }

  if (segments[0] === 'agents') {
    if (segments[1]) {
      return `${publicApiBaseUrl}/agent/${encodeURIComponent(segments[1])}${appendHexToSearch(search, hexCode)}`;
    }
    return `${publicApiBaseUrl}/agents${appendHexToSearch(search, hexCode)}`;
  }

  if (segments[0] === 'inquiry') {
    return `${publicApiBaseUrl}/inquiries${appendHexToSearch(search, hexCode)}`;
  }

  if (segments[0] === 'logo' && segments[1] === 'view') {
    return `${publicApiBaseUrl}/templates/${encodeURIComponent(agencySlug)}/${encodeURIComponent(hexCode)}/logo/view${search}`;
  }

  if (segments[0] === 'images' && segments[1]) {
    const remaining = segments.slice(2).map(encodeURIComponent).join('/');
    return `${publicApiBaseUrl}/templates/${encodeURIComponent(agencySlug)}/${encodeURIComponent(hexCode)}/images/${encodeURIComponent(segments[1])}/${remaining}${search}`;
  }

  return `${publicApiBaseUrl}/templates/${encodeURIComponent(agencySlug)}/${encodeURIComponent(hexCode)}${pathname.startsWith('/') ? pathname : `/${pathname}`}${search}`;
}

function getConfiguredAgencyContext(agencySlug?: string | null): ResolvedAgencyContext | null {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
  const defaultAgencySlug = getDefaultAgencySlug();
  const configuredHexCode = getConfiguredTemplateHexCode();

  if (!resolvedAgencySlug || !defaultAgencySlug || !configuredHexCode || resolvedAgencySlug !== defaultAgencySlug) {
    return null;
  }

  return {
    organization: {
      slug: resolvedAgencySlug,
      hexCode: configuredHexCode,
    },
  };
}

async function resolveAgencyContext(agencySlug?: string | null): Promise<ResolvedAgencyContext | null> {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
  if (!resolvedAgencySlug) {
    return null;
  }

  const configuredContext = getConfiguredAgencyContext(resolvedAgencySlug);
  if (configuredContext) {
    return configuredContext;
  }

  for (const publicApiBase of PUBLIC_API_BASE_URLS) {
    try {
      const response = await safeFetch(`${publicApiBase}/agency/${encodeURIComponent(resolvedAgencySlug)}/resolve`, {
        cache: 'no-store',
      }, 4000);

      if (!response.ok) {
        continue;
      }

      const data = await response.json() as ResolvedAgencyContext;
      if (data?.organization?.hexCode) {
        return data;
      }
    } catch {
      continue;
    }
  }

  return null;
}

async function fetchDirectTemplateResponse(
  resolvedAgencySlug: string,
  path = '',
  options?: RequestInit,
  timeout = 10000,
): Promise<Response> {
  const resolvedContext = await resolveAgencyContext(resolvedAgencySlug);
  if (!resolvedContext?.organization?.hexCode) {
    return new Response(null, { status: 404, statusText: 'Agency Not Found' });
  }

  let lastResponse: Response | null = null;
  for (const publicApiBase of PUBLIC_API_BASE_URLS) {
    const backendUrl = buildBackendPublicUrl(
      publicApiBase,
      resolvedAgencySlug,
      resolvedContext.organization.hexCode,
      path,
    );
    const response = await safeFetch(backendUrl, options, timeout);
    lastResponse = response;
    if (response.ok || !(await shouldRetryApiRequest(response))) {
      return response;
    }
  }

  return lastResponse || new Response(null, { status: 502, statusText: 'Service Unavailable' });
}

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

function normalizeOrganization(
  organization: SiteConfig['organization'] | undefined,
  fallbackSlug: string,
): SiteConfig['organization'] {
  return {
    ...organization,
    name: organization?.name || 'Agency Website',
    slug: organization?.slug || fallbackSlug,
  };
}

function normalizeSiteProfile(profile?: SiteConfig['profile'] | null): SiteConfig['profile'] {
  if (!profile) return null;

  return {
    ...profile,
    logo: normalizeAssetUrl(profile.logo) ?? profile.logo ?? null,
  };
}

function normalizeSiteBranding(
  branding: SiteBranding | null | undefined,
  organizationName: string,
): SiteBranding | null {
  if (!branding) return null;

  return {
    ...branding,
    displayName: organizationName || branding.displayName || null,
    coverImage: normalizeAssetUrl(branding.coverImage) ?? branding.coverImage ?? null,
  };
}

function normalizeSiteAgent<T extends SiteAgent | null | undefined>(agent: T): T {
  if (!agent) return agent;

  return {
    ...agent,
    avatar: normalizeAssetUrl(agent.avatarUrl ?? agent.avatar) ?? agent.avatarUrl ?? agent.avatar ?? null,
    avatarUrl: normalizeAssetUrl(agent.avatarUrl ?? agent.avatar) ?? agent.avatarUrl ?? agent.avatar ?? null,
    coverImage: normalizeAssetUrl(agent.coverImageUrl ?? agent.coverImage) ?? agent.coverImageUrl ?? agent.coverImage ?? null,
    coverImageUrl: normalizeAssetUrl(agent.coverImageUrl ?? agent.coverImage) ?? agent.coverImageUrl ?? agent.coverImage ?? null,
  } as T;
}

function normalizeSiteAgents(agents: unknown[]): SiteAgent[] {
  return agents
    .map((agent) => normalizeSiteAgent(agent as SiteAgent | null))
    .filter((agent): agent is SiteAgent => Boolean(agent));
}

function normalizeSiteConfigPayload(
  data: PublicTemplateSiteSnapshot | null | undefined,
  fallbackSlug: string,
): SiteConfig {
  const organization = normalizeOrganization(
    (data?.organization as SiteConfig['organization'] | undefined),
    fallbackSlug,
  );

  return {
    organization,
    categories: data?.categories || [],
    amenities: data?.amenities || [],
    featuredAreas: data?.featuredAreas || [],
    leadAgent: normalizeSiteAgent(data?.leadAgent as SiteAgent | null | undefined),
    branding: normalizeSiteBranding(data?.branding || null, organization.name),
    profile: normalizeSiteProfile(data?.profile || null),
    stats: data?.stats || DEFAULT_SITE_STATS,
  };
}

async function fetchTemplateResponse(
  path = '',
  options?: RequestInit,
  timeout = 10000,
  agencySlug?: string | null,
): Promise<Response> {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
  if (!resolvedAgencySlug) {
    return new Response(null, { status: 404, statusText: 'Agency Not Found' });
  }

  if (typeof window !== 'undefined') {
    return safeFetch(getClientTemplateFetchUrl(path, resolvedAgencySlug), options, timeout);
  }

  return fetchDirectTemplateResponse(resolvedAgencySlug, path, options, timeout);
}

export async function getProperties(
  params: GetPropertiesParams = {},
  agencySlug?: string | null,
): Promise<PaginatedProperties> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  const response = await fetchTemplateResponse(`/listings${query ? `?${query}` : ''}`, {
    next: { revalidate: 300 },
  }, 10000, agencySlug);

  if (!response.ok) {
    return { properties: [], total: 0, page: 1, totalPages: 1 };
  }

  const data = await response.json();
  
  const rawListings = Array.isArray(data) ? data : (data.listings || []);
  const total = data.total || rawListings.length;
  const page = data.page || 1;
  const totalPages = data.totalPages || Math.ceil(total / (params.limit as number || 10)) || 1;

  return {
    properties: rawListings.map((listing: any) => mapListingToProperty(listing, agencySlug)),
    total,
    page,
    totalPages,
  };
}

export async function getPropertyById(id: string, agencySlug?: string | null): Promise<Property | null> {
  const response = await fetchTemplateResponse(`/listings/${id}`, {
    next: { revalidate: 300 },
  }, 10000, agencySlug);

  if (!response.ok) return null;

  const data = await response.json();
  return mapListingToProperty(data, agencySlug);
}

function normalizeSearchTransaction(value: unknown) {
  const normalized = typeof value === 'string' ? value.toUpperCase() : '';
  if (normalized === 'RENT') return 'RENT';
  if (normalized === 'BUY' || normalized === 'SALE') return 'SALE';
  return undefined;
}

export async function getSmartPropertyMatches(query: string | Record<string, any>): Promise<AiPropertySearchResult> {
  try {
    const queryInput = typeof query === 'string' ? { q: query } : query;
    let aiFilters: Record<string, any> = {};

    if (typeof window !== 'undefined' && (queryInput.q || queryInput.query)) {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryInput.query || queryInput.q,
          filters: queryInput,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        aiFilters = data.filters || {};
      }
    }

    const mergedInput = { ...queryInput, ...aiFilters };
    const properties = await getProperties({
      q: typeof mergedInput.q === 'string' ? mergedInput.q : '',
      transactionType: normalizeSearchTransaction(mergedInput.transactionType || mergedInput.type),
      category: mergedInput.category,
      readiness: mergedInput.readiness,
      bedrooms: mergedInput.bedrooms,
      bathrooms: mergedInput.bathrooms,
      minPrice: mergedInput.minPrice,
      maxPrice: mergedInput.maxPrice,
      minArea: mergedInput.minArea,
      maxArea: mergedInput.maxArea,
      limit: queryInput.limit || 8,
    });

    return {
      propertyIds: properties.properties.map((property) => property.id).slice(0, Number(queryInput.limit || 8)),
      source: Object.keys(aiFilters).length ? 'gemini' : 'fallback',
      model: Object.keys(aiFilters).length ? 'gemini' : null,
    };
  } catch (error) {
    return { propertyIds: [], source: 'fallback', model: null };
  }
}

/** Legacy alias for AI search with expanded compatibility */
export const searchPropertiesWithAI = getSmartPropertyMatches;

export async function submitOrgInquiry(payload: any): Promise<any> {
  const response = await fetchTemplateResponse('/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'We could not submit your request right now. Please try again shortly.';
    try {
      const errorPayload = await response.json() as { message?: string };
      if (response.status < 500 && errorPayload.message) {
        message = errorPayload.message;
      }
    } catch {
      // Keep the visitor-facing fallback above.
    }
    throw new Error(message);
  }

  return await response.json();
}

async function getTemplateSiteSnapshot(agencySlug?: string | null): Promise<PublicTemplateSiteSnapshot | null> {
  const response = await fetchTemplateResponse('', {
    next: { revalidate: 3600 },
  }, 10000, agencySlug);

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

export async function getSiteConfig(agencySlug?: string | null): Promise<SiteConfig> {
  const data = await getTemplateSiteSnapshot(agencySlug);
  const defaultSlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug() || 'organization';
  return normalizeSiteConfigPayload(data, defaultSlug);
}

export async function getSiteConfigOrNull(agencySlug?: string | null): Promise<SiteConfig | null> {
  const data = await getTemplateSiteSnapshot(agencySlug);
  if (!data) {
    return null;
  }

  return normalizeSiteConfigPayload(
    data,
    getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug() || 'organization',
  );
}

export async function getAreaGuides(agencySlug?: string | null): Promise<any[]> {
  const data = await getTemplateSiteSnapshot(agencySlug);
  return data?.areaGuides || [];
}

export async function getTestimonials(agencySlug?: string | null): Promise<any[]> {
  const data = await getTemplateSiteSnapshot(agencySlug);
  return data?.testimonials || [];
}

export async function getBlogs(agencySlug?: string | null): Promise<any[]> {
  const data = await getTemplateSiteSnapshot(agencySlug);
  return data?.blogs || [];
}

export async function getSellerTestimonials(agencySlug?: string | null): Promise<any[]> {
  const data = await getTemplateSiteSnapshot(agencySlug);
  return data?.sellerTestimonials || [];
}

export async function getAgents(agencySlug?: string | null): Promise<{
  organization: SiteConfig['organization'];
  agents: SiteAgent[];
}> {
  const fallbackSlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug() || 'organization';
  const response = await fetchTemplateResponse('/agents', {
    next: { revalidate: 300 },
  }, 10000, agencySlug);

  if (!response.ok) {
    return {
      organization: normalizeOrganization(undefined, fallbackSlug),
      agents: [],
    };
  }

  const data = await response.json();
  return {
    organization: normalizeOrganization(data.organization, fallbackSlug),
    agents: Array.isArray(data.agents) ? normalizeSiteAgents(data.agents) : [],
  };
}

export async function getAgentProfile(
  agentSlug: string,
  agencySlug?: string | null,
): Promise<{
  organization: SiteConfig['organization'];
  profile?: SiteConfig['profile'];
  agent: (SiteAgent & {
    totalDeals?: number;
    totalListings?: number;
    primaryColor?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
  }) | null;
  stats: {
    activeListings: number;
    soldListings: number;
    rentedListings: number;
  };
  activeListings: Property[];
  soldListings: Property[];
  rentedListings: Property[];
} | null> {
  const response = await fetchTemplateResponse(`/agents/${agentSlug}`, {
    next: { revalidate: 300 },
  }, 10000, agencySlug);
  const fallbackSlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug() || 'organization';

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return {
    organization: normalizeOrganization(data.organization, fallbackSlug),
    profile: normalizeSiteProfile(data.profile || null),
    agent: normalizeSiteAgent(data.agent || null),
    stats: data.stats || {
      activeListings: 0,
      soldListings: 0,
      rentedListings: 0,
    },
    activeListings: Array.isArray(data.activeListings)
      ? data.activeListings.map((listing: any) => mapListingToProperty(listing, agencySlug))
      : [],
    soldListings: Array.isArray(data.soldListings)
      ? data.soldListings.map((listing: any) => mapListingToProperty(listing, agencySlug))
      : [],
    rentedListings: Array.isArray(data.rentedListings)
      ? data.rentedListings.map((listing: any) => mapListingToProperty(listing, agencySlug))
      : [],
  };
}
