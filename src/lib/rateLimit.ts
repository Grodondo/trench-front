const MAX_REQUESTS = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetTime) {
        store.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

export function checkRateLimit(ipHash: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ipHash);

  if (!entry || now > entry.resetTime) {
    store.set(ipHash, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}
