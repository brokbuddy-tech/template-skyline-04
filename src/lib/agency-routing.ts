const RESERVED_ROOT_SEGMENTS = new Set([
  'about',
  'agents',
  'api',
  'contact',
  'developers',
  'favicon.ico',
  'map',
  'off-plan',
  'properties',
  'robots.txt',
  'sell',
  'services',
  'sitemap.xml',
  '_next',
]);

function normalizeAgencySlug(value?: string | null) {
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
  if (!resolvedAgencySlug) return path;
  if (!path) return `/${resolvedAgencySlug}`;
  if (/^https?:\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }

  const [pathname, search = ''] = path.split('?');
  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (normalizedPathname === `/${resolvedAgencySlug}` || normalizedPathname.startsWith(`/${resolvedAgencySlug}/`)) {
    return path;
  }

  const prefixedPathname = normalizedPathname === '/'
    ? `/${resolvedAgencySlug}`
    : `/${resolvedAgencySlug}${normalizedPathname}`;

  return search ? `${prefixedPathname}?${search}` : prefixedPathname;
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
