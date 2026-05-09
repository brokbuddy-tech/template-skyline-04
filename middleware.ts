import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  AGENCY_SLUG_COOKIE,
  isAgencySlugSegment,
} from './src/lib/agency-routing';

function shouldBypassPathname(pathname: string) {
  return pathname.startsWith('/_next')
    || pathname.startsWith('/api')
    || pathname === '/favicon.ico'
    || pathname === '/robots.txt'
    || pathname === '/sitemap.xml'
    || /\.[^/]+$/.test(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypassPathname(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (isAgencySlugSegment(firstSegment)) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = segments.length > 1 ? `/${segments.slice(1).join('/')}` : '/';

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-agency-slug', firstSegment);

    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });

    response.cookies.set(AGENCY_SLUG_COOKIE, firstSegment, {
      path: '/',
      sameSite: 'lax',
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
