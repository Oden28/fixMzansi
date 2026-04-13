/**
 * Simple in-memory sliding-window rate limiter.
 * For production at scale, replace with Redis-backed (e.g. @upstash/ratelimit).
 */

type RateLimitEntry = { timestamps: number[] };

const store = new Map<string, RateLimitEntry>();

// Garbage-collect expired entries every 60s
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < 120_000);
      if (entry.timestamps.length === 0) store.delete(key);
    }
  }, 60_000);
}

export type RateLimitConfig = {
  /** Maximum requests allowed within the window */
  maxRequests: number;
  /** Window size in seconds */
  windowSec: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetInSec: number;
};

export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSec * 1000;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= config.maxRequests) {
    const oldest = entry.timestamps[0];
    const resetInSec = Math.ceil((oldest + windowMs - now) / 1000);
    return { allowed: false, remaining: 0, resetInSec };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
    resetInSec: config.windowSec,
  };
}

/**
 * Extract a stable identifier from the request for rate limiting.
 * Uses x-forwarded-for (behind proxy) or falls back to a fixed key.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}
