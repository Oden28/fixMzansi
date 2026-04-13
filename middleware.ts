import { NextResponse, type NextRequest } from 'next/server';
import { originAllowedForRequest } from '@/lib/api-origin';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * CSRF guard for mutating /api/* requests: reject cross-site browser posts.
 *
 * Modern browsers send `Sec-Fetch-Site: same-origin` for same-origin fetches; we trust that first.
 * Otherwise we compare `Origin` to `Host` / `X-Forwarded-Host`, with loopback normalization
 * (localhost vs 127.0.0.1) so local dev and common proxy setups keep working.
 */
export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api') || !MUTATING_METHODS.has(request.method)) {
    return NextResponse.next();
  }

  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite === 'same-origin') {
    return NextResponse.next();
  }

  const origin = request.headers.get('origin');
  if (!origin || origin === 'null') {
    return NextResponse.next();
  }

  try {
    if (originAllowedForRequest(request, origin)) {
      return NextResponse.next();
    }
  } catch {
    return NextResponse.json({ error: 'Invalid origin header' }, { status: 403 });
  }

  return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 });
}

export const config = {
  matcher: '/api/:path*',
};
