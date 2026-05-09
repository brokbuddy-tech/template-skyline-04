export const AGENCY_SLUG_COOKIE = 'bb_agency_slug';

const RESERVED_ROOT_SEGMENTS = new Set([
  'about',
  'agents',
  'api',
  'contact',
  'developers',
  'favicon.ico',
  'images',
  'inquiry',
  'listings',
  'logo',
  'map',
  'off-plan',
  'property',
  'properties',
  'robots.txt',
  'sell',
  'services',
  'sitemap.xml',
  '_next',
]);

export function normalizeAgencySlug(value?: string | null) {
  const trimmed = value?.trim().replace(/^\/+|\/+$/g, '');
  return trimmed || null;
}

export function getDefaultAgencySlug() {
  return normalizeAgencySlug(process.env.NEXT_PUBLIC_ORG_SLUG || '');
}

export function isAgencySlugSegment(value?: string | null) {
  const normalized = normalizeAgencySlug(value);
  if (!normalized) return false;
  if (RESERVED_ROOT_SEGMENTS.has(normalized)) return false;
  if (normalized.includes('.')) return false;
  return true;
}

export function resolveAgencySlugFromPathname(pathname?: string | null) {
  if (!pathname) return null;

  const [firstSegment] = pathname.split('?')[0].split('/').filter(Boolean);
  return isAgencySlugSegment(firstSegment) ? firstSegment : null;
}

export function getAgencySlugFromBrowserPathname() {
  if (typeof window === 'undefined') return null;
  return resolveAgencySlugFromPathname(window.location.pathname);
}

export function getEffectiveAgencySlug(explicitAgencySlug?: string | null) {
  return (
    normalizeAgencySlug(explicitAgencySlug)
    || getAgencySlugFromBrowserPathname()
    || getDefaultAgencySlug()
  );
}

export function prefixAgencyPath(path: string, agencySlug?: string | null) {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
  if (!path) return '/';
  if (/^https?:\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }

  const [pathname, search = ''] = path.split('?');
  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const rootPathname =
    resolvedAgencySlug && (
      normalizedPathname === `/${resolvedAgencySlug}`
      || normalizedPathname.startsWith(`/${resolvedAgencySlug}/`)
    )
      ? (normalizedPathname.slice(resolvedAgencySlug.length + 1) || '/')
      : normalizedPathname;

  return search ? `${rootPathname}?${search}` : rootPathname;
}

export function stripAgencySlugFromPathname(pathname: string, agencySlug?: string | null) {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
  if (!resolvedAgencySlug) return pathname || '/';

  if (pathname === `/${resolvedAgencySlug}`) {
    return '/';
  }

  if (pathname.startsWith(`/${resolvedAgencySlug}/`)) {
    return pathname.slice(resolvedAgencySlug.length + 1) || '/';
  }

  return pathname || '/';
}
