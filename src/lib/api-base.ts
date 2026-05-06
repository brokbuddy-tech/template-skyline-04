const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_FALLBACK_API_URL: process.env.NEXT_PUBLIC_FALLBACK_API_URL,
  NEXT_PUBLIC_ORG_SLUG: process.env.NEXT_PUBLIC_ORG_SLUG,
} as const;

const DEFAULT_REMOTE_API_URL = 'https://brokbuddy-api.onrender.com';
const DEFAULT_LOCAL_API_URL = 'http://localhost:4000';

function getRequiredPublicEnv(name: keyof typeof env): string {
  const value = (env[name] || '').trim();
  if (!value) {
    throw new Error(`Missing required public env variable: ${name}`);
  }
  return value;
}

function normalizeApiBaseUrl(value: string): string {
  const normalized = value.trim().replace(/\/+$/, '');

  if (!normalized) return '';
  if (/\/api$/i.test(normalized)) return normalized;
  if (/\/api\/public$/i.test(normalized)) return normalized.replace(/\/public$/i, '');

  return `${normalized}/api`;
}

function uniqueValues(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export const API_BASE_URLS = uniqueValues([
  normalizeApiBaseUrl(env.NEXT_PUBLIC_API_URL || DEFAULT_REMOTE_API_URL),
  normalizeApiBaseUrl(env.NEXT_PUBLIC_FALLBACK_API_URL || DEFAULT_LOCAL_API_URL),
]);

export const PUBLIC_API_BASE_URLS = API_BASE_URLS.map(baseUrl => `${baseUrl}/public`);
export const PUBLIC_TEMPLATE_ORG_SLUG = getRequiredPublicEnv('NEXT_PUBLIC_ORG_SLUG');
export const PUBLIC_TEMPLATE_PROXY_BASE_PATH = '/api/public-template';

function normalizePublicTemplatePath(path = '') {
  if (!path) return '';
  return path.startsWith('/') ? path : `/${path}`;
}

export function getPublicTemplateUrl(path = '') {
  return `${PUBLIC_TEMPLATE_PROXY_BASE_PATH}${normalizePublicTemplatePath(path)}`;
}

function getRequiredServerTemplateHexCode() {
  const value = (process.env.TEMPLATE_HEX_CODE || '').trim();
  if (!value) {
    throw new Error('Missing required server env variable: TEMPLATE_HEX_CODE');
  }
  return value.toLowerCase();
}

export function getServerPublicTemplateUrl(path = '') {
  const baseUrl = PUBLIC_API_BASE_URLS[0] || '/api/public';
  const publicTemplatePath = ['templates', PUBLIC_TEMPLATE_ORG_SLUG, getRequiredServerTemplateHexCode()]
    .filter(Boolean)
    .join('/');
  return `${baseUrl}/${publicTemplatePath}${normalizePublicTemplatePath(path)}`;
}

export function getTemplateFetchUrl(path = '') {
  return typeof window === 'undefined'
    ? getServerPublicTemplateUrl(path)
    : getPublicTemplateUrl(path);
}

export function shouldRetryApiRequest(status: number): boolean {
  return status >= 500;
}
