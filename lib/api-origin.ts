/**
 * Validates that a browser Origin header matches this deployment (CSRF / cross-post guard).
 * Used by middleware for mutating /api/* requests.
 */

function defaultPort(protocol: string): string {
  return protocol === 'https:' ? '443' : '80';
}

function portOf(url: URL): string {
  return url.port || defaultPort(url.protocol);
}

function isLoopbackHostname(hostname: string): boolean {
  const h = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  return h === 'localhost' || h === '127.0.0.1' || h === '::1';
}

/** Same port + both loopback hostnames (localhost vs 127.0.0.1 vs ::1). */
export function loopbackSameSite(originURL: URL, requestHostURL: URL): boolean {
  if (!isLoopbackHostname(originURL.hostname) || !isLoopbackHostname(requestHostURL.hostname)) {
    return false;
  }
  return portOf(originURL) === portOf(requestHostURL);
}

/**
 * Build a URL from Host / X-Forwarded-Host so we can compare to Origin.
 * Falls back to request.url host if headers are missing.
 */
export function requestHostURL(request: Request): URL | null {
  const forwarded = request.headers.get('x-forwarded-host');
  const host = (forwarded?.split(',')[0].trim() || request.headers.get('host') || '').trim();
  if (!host) return null;

  try {
    const fromRequest = new URL(request.url);
    return new URL(`${fromRequest.protocol}//${host}`);
  } catch {
    try {
      return new URL(`https://${host}`);
    } catch {
      return null;
    }
  }
}

/** Optional public URL (e.g. https://app.example.com) — allow matching Origin when proxies rewrite Host. */
export function envAppHostURL(): URL | null {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

export function originAllowedForRequest(request: Request, originHeader: string): boolean {
  const originURL = new URL(originHeader);
  const reqHostURL = requestHostURL(request);
  if (!reqHostURL) return true;

  if (originURL.host === reqHostURL.host) return true;
  if (loopbackSameSite(originURL, reqHostURL)) return true;

  const app = envAppHostURL();
  if (app && originURL.host === app.host) return true;

  return false;
}
