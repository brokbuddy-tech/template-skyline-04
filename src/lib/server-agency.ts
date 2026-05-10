import { cookies, headers } from 'next/headers';
import {
  AGENCY_SLUG_COOKIE,
  getDefaultAgencySlug,
  normalizeAgencySlug,
  resolveAgencySlugFromPathname,
} from './agency-routing';

function getPathnameLikeValue(value?: string | null) {
  const normalizedValue = value?.trim();
  if (!normalizedValue) return null;
  if (normalizedValue.startsWith('/')) return normalizedValue;

  try {
    return new URL(normalizedValue).pathname;
  } catch {
    return normalizedValue;
  }
}

function resolveAgencySlugFromHeaders(requestHeaders: Headers) {
  const explicitSlug = normalizeAgencySlug(requestHeaders.get('x-agency-slug'));
  if (explicitSlug) {
    return explicitSlug;
  }

  for (const headerName of ['x-nextjs-rewritten-path', 'next-url', 'x-matched-path']) {
    const headerSlug = resolveAgencySlugFromPathname(
      getPathnameLikeValue(requestHeaders.get(headerName)),
    );
    if (headerSlug) {
      return headerSlug;
    }
  }

  return undefined;
}

export async function getRequestAgencySlug() {
  const requestHeaders = await headers();
  const headerSlug = resolveAgencySlugFromHeaders(requestHeaders);
  if (headerSlug) {
    return headerSlug;
  }

  const cookieStore = await cookies();
  return normalizeAgencySlug(cookieStore.get(AGENCY_SLUG_COOKIE)?.value) || getDefaultAgencySlug() || undefined;
}
