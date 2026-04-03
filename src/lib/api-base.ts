const env = (((globalThis as any).process?.env ?? {}) as Record<string, string | undefined>);

const DEFAULT_REMOTE_API_URL = 'https://brokbuddy-api.onrender.com';
const DEFAULT_LOCAL_API_URL = 'http://localhost:4000';

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

export function shouldRetryApiRequest(status: number): boolean {
  return status >= 500;
}
