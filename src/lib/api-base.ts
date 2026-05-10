const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_FALLBACK_API_URL: process.env.NEXT_PUBLIC_FALLBACK_API_URL,
} as const;

const DEFAULT_REMOTE_API_URL = 'https://brokbuddy-api.onrender.com';
const DEFAULT_LOCAL_API_URL = 'http://localhost:4000';
export const PUBLIC_TEMPLATE_PROXY_BASE_PATH = '/api/public-template-proxy';

export function normalizeTemplateHexCode(value?: string | null) {
  const normalized = value?.trim().toLowerCase();
  return normalized || null;
}

export function getConfiguredTemplateHexCode() {
  return normalizeTemplateHexCode(process.env.TEMPLATE_HEX_CODE || '');
}

export function normalizeApiBaseUrl(value: string) {
  const normalized = value.trim().replace(/\/+$/, '');

  if (!normalized) return '';
  if (/\/api$/i.test(normalized)) return normalized;
  if (/\/api\/public$/i.test(normalized)) return normalized.replace(/\/public$/i, '');

  return `${normalized}/api`;
}

function uniqueValues(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function isLocalApiBaseUrl(value: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api$/i.test(value);
}

function prioritizeApiBaseUrls(values: string[]) {
  const localUrls = values.filter(isLocalApiBaseUrl);
  const remoteUrls = values.filter((value) => !isLocalApiBaseUrl(value));
  return process.env.NODE_ENV === 'production'
    ? [...remoteUrls, ...localUrls]
    : [...localUrls, ...remoteUrls];
}

function normalizePublicTemplatePath(path = '') {
  if (!path) return '';
  return path.startsWith('/') ? path : `/${path}`;
}

export const API_BASE_URLS = prioritizeApiBaseUrls(uniqueValues([
  normalizeApiBaseUrl(env.NEXT_PUBLIC_API_URL || DEFAULT_REMOTE_API_URL),
  normalizeApiBaseUrl(env.NEXT_PUBLIC_FALLBACK_API_URL || DEFAULT_LOCAL_API_URL),
]));

export const PUBLIC_API_BASE_URLS = API_BASE_URLS.map((baseUrl) => `${baseUrl}/public`);

function tryParseAssetUrl(value: string) {
  const normalized = value.trim();
  if (!normalized) return null;

  if (normalized.startsWith('/')) {
    const [pathname, search = ''] = normalized.split('?');
    return {
      pathname,
      search: search ? `?${search}` : '',
    };
  }

  try {
    const parsed = new URL(normalized);
    return {
      pathname: parsed.pathname,
      search: parsed.search,
    };
  } catch {
    return null;
  }
}

export function normalizePublicTemplateAssetUrl(value?: string | null) {
  const normalized = value?.trim();
  if (!normalized) return null;

  const parsed = tryParseAssetUrl(normalized);
  if (!parsed) return normalized;

  if (parsed.pathname.startsWith(PUBLIC_TEMPLATE_PROXY_BASE_PATH)) {
    return `${parsed.pathname}${parsed.search}`;
  }

  const sluggedProxyMatch = parsed.pathname.match(/^\/api\/public-template\/([^/]+)(\/.*)?$/i);
  if (sluggedProxyMatch) {
    return getPublicTemplateProxyPath(sluggedProxyMatch[1], sluggedProxyMatch[2] || '') + parsed.search;
  }

  const backendAssetMatch = parsed.pathname.match(/^\/api\/public\/templates\/([^/]+)\/[^/]+\/(logo\/view|images\/[^/]+\/.*|profile-assets\/[^/]+\/(?:avatar|cover)\/view)$/i);
  if (backendAssetMatch) {
    return getPublicTemplateProxyPath(backendAssetMatch[1], backendAssetMatch[2]) + parsed.search;
  }

  return normalized;
}

export function getPublicTemplateProxyPath(agencySlug?: string | null, path = '') {
  const normalizedPath = normalizePublicTemplatePath(path);
  const normalizedAgencySlug = agencySlug?.trim();
  if (!normalizedAgencySlug) {
    return `${PUBLIC_TEMPLATE_PROXY_BASE_PATH}${normalizedPath}`;
  }

  return `${PUBLIC_TEMPLATE_PROXY_BASE_PATH}/${encodeURIComponent(normalizedAgencySlug)}${normalizedPath}`;
}

export function getClientTemplateFetchUrl(path = '', agencySlug?: string | null) {
  return getPublicTemplateProxyPath(agencySlug, path);
}

export async function shouldRetryApiRequest(response: Response): Promise<boolean> {
  if (response.status >= 500) {
    return true;
  }

  if (response.status !== 404) {
    return false;
  }

  try {
    const body = await response.clone().text();
    return /Route\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS):.*not found/i.test(body);
  } catch {
    return false;
  }
}
