const env = (((globalThis as any).process?.env ?? {}) as Record<string, string | undefined>);

const DEFAULT_REMOTE_API_URL = 'https://brokbuddy-api.onrender.com';
const DEFAULT_LOCAL_API_URL = 'http://localhost:4000';

function getRequiredPublicEnv(name: string): string {
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
export const PUBLIC_TEMPLATE_HEX_CODE = getRequiredPublicEnv('NEXT_PUBLIC_TEMPLATE_HEX_CODE').toLowerCase();

function normalizePublicTemplatePath(path = '') {
  if (!path) return '';
  return path.startsWith('/') ? path : `/${path}`;
}

export function getPublicTemplateUrl(path = '') {
  const baseUrl = PUBLIC_API_BASE_URLS[0] || '/api/public';
  const publicTemplatePath = ['templates', PUBLIC_TEMPLATE_ORG_SLUG, PUBLIC_TEMPLATE_HEX_CODE]
    .filter(Boolean)
    .join('/');
  return `${baseUrl}/${publicTemplatePath}${normalizePublicTemplatePath(path)}`;
}

export function shouldRetryApiRequest(status: number): boolean {
  return status >= 500;
}
