import { PUBLIC_API_BASE_URLS, shouldRetryApiRequest } from '@/lib/api-base';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

function buildUpstreamUrl(baseUrl: string, path: string[], search: string): URL {
  const encodedPath = path.map(segment => encodeURIComponent(segment)).join('/');
  const pathname = encodedPath ? `/${encodedPath}` : '';
  return new URL(`${baseUrl}${pathname}${search}`);
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

function sanitizeProxyResponseHeaders(headers: Headers) {
  const responseHeaders = new Headers(headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');
  responseHeaders.delete('transfer-encoding');
  responseHeaders.delete('connection');
  return responseHeaders;
}

async function proxyRequest(request: Request, context: RouteContext): Promise<Response> {
  const { path = [] } = await context.params;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('host');
  requestHeaders.delete('content-length');

  const requestBody =
    request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer();

  let lastError: Error | null = null;

  for (const [index, publicApiBase] of PUBLIC_API_BASE_URLS.entries()) {
    const upstreamUrl = buildUpstreamUrl(publicApiBase, path, new URL(request.url).search);

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
        headers: sanitizeProxyResponseHeaders(upstreamResponse.headers),
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
    { status: 502 }
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
