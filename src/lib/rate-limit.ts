type Entry = { count: number; resetAt: number };

// ⚠️ In-memory store: resets per-process instance.
// For distributed/serverless production replace with Upstash Redis:
//   npm i @upstash/ratelimit @upstash/redis
//   https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
const store = new Map<string, Entry>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, retryAfterMs: 0 };
}
