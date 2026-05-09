import { PUBLIC_API_BASE_URLS, shouldRetryApiRequest } from '@/lib/api-base';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    agencySlug: string;
    path?: string[];
  }>;
};

function appendHexToSearch(search: string, hexCode: string) {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  params.set('hex', hexCode);
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

function buildUpstreamUrl(
  publicApiBaseUrl: string,
  agencySlug: string,
  hexCode: string,
  pathSegments: string[],
  search: string,
) {
  if (pathSegments.length === 0) {
    return new URL(`${publicApiBaseUrl}/organization${appendHexToSearch(search, hexCode)}`);
  }

  if (pathSegments[0] === 'listings') {
    if (pathSegments[1]) {
      return new URL(`${publicApiBaseUrl}/listings/${encodeURIComponent(pathSegments[1])}${appendHexToSearch(search, hexCode)}`);
    }
    return new URL(`${publicApiBaseUrl}/listings${appendHexToSearch(search, hexCode)}`);
  }

  if (pathSegments[0] === 'agents') {
    if (pathSegments[1]) {
      return new URL(`${publicApiBaseUrl}/agent/${encodeURIComponent(pathSegments[1])}${appendHexToSearch(search, hexCode)}`);
    }
    return new URL(`${publicApiBaseUrl}/agents${appendHexToSearch(search, hexCode)}`);
  }

  if (pathSegments[0] === 'inquiry') {
    return new URL(`${publicApiBaseUrl}/inquiries${appendHexToSearch(search, hexCode)}`);
  }

  if (pathSegments[0] === 'logo' && pathSegments[1] === 'view') {
    return new URL(`${publicApiBaseUrl}/templates/${encodeURIComponent(agencySlug)}/${encodeURIComponent(hexCode)}/logo/view${search}`);
  }

  if (pathSegments[0] === 'images' && pathSegments[1]) {
    const trailing = pathSegments.slice(2).map(encodeURIComponent).join('/');
    return new URL(
      `${publicApiBaseUrl}/templates/${encodeURIComponent(agencySlug)}/${encodeURIComponent(hexCode)}/images/${encodeURIComponent(pathSegments[1])}/${trailing}${search}`,
    );
  }

  const joinedPath = pathSegments.map(encodeURIComponent).join('/');
  return new URL(`${publicApiBaseUrl}/templates/${encodeURIComponent(agencySlug)}/${encodeURIComponent(hexCode)}/${joinedPath}${search}`);
}

async function fetchWithTimeout(input: URL | string, init?: RequestInit, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function resolveAgencyContext(agencySlug: string) {
  for (const publicApiBaseUrl of PUBLIC_API_BASE_URLS) {
    try {
      const response = await fetchWithTimeout(`${publicApiBaseUrl}/agency/${encodeURIComponent(agencySlug)}/resolve`, {
        cache: 'no-store',
      }, 4000);

      if (!response.ok) {
        continue;
      }

      const data = await response.json() as {
        organization?: {
          hexCode?: string;
        };
      };
      if (data.organization?.hexCode) {
        return data;
      }
    } catch {
      continue;
    }
  }

  return null;
}

async function proxyRequest(request: Request, context: RouteContext): Promise<Response> {
  const { agencySlug, path = [] } = await context.params;
  const agencyContext = await resolveAgencyContext(agencySlug);
  const hexCode = agencyContext?.organization?.hexCode;

  if (!hexCode) {
    return Response.json({ message: 'Agency not found.' }, { status: 404 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('host');
  requestHeaders.delete('content-length');

  const requestBody =
    request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer();

  const search = new URL(request.url).search;
  let lastError: Error | null = null;

  for (const [index, publicApiBaseUrl] of PUBLIC_API_BASE_URLS.entries()) {
    const upstreamUrl = buildUpstreamUrl(publicApiBaseUrl, agencySlug, hexCode, path, search);

    try {
      const upstreamResponse = await fetchWithTimeout(upstreamUrl, {
        method: request.method,
        headers: requestHeaders,
        body: requestBody,
        redirect: 'follow',
        cache: 'no-store',
      }, 5000);

      if (!upstreamResponse.ok && index < PUBLIC_API_BASE_URLS.length - 1 && await shouldRetryApiRequest(upstreamResponse)) {
        lastError = new Error(`Request failed for ${upstreamUrl.pathname}: ${upstreamResponse.status}`);
        continue;
      }

      return new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        headers: upstreamResponse.headers,
      });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (index === PUBLIC_API_BASE_URLS.length - 1) {
        break;
      }
    }
  }

  return Response.json(
    {
      message: lastError?.message || 'Unable to reach any configured backend.',
    },
    { status: 502 },
  );
}

export async function GET(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function OPTIONS(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}
