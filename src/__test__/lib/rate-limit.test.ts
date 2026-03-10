import { rateLimit } from '@/lib/rate-limit';

describe('rateLimit', () => {
  it('allows requests under the limit', () => {
    const result = rateLimit('test-key-1', 5, 60_000);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('blocks requests over the limit', () => {
    const key = 'test-key-2';
    for (let i = 0; i < 3; i++) rateLimit(key, 3, 60_000);
    const result = rateLimit(key, 3, 60_000);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it('resets after the window expires', async () => {
    const key = 'test-key-3';
    rateLimit(key, 1, 50); // 50ms window
    rateLimit(key, 1, 50); // blocked

    await new Promise((r) => setTimeout(r, 60));

    const result = rateLimit(key, 1, 50);
    expect(result.success).toBe(true);
  });

  it('tracks different keys independently', () => {
    const a = rateLimit('key-a', 1, 60_000);
    const b = rateLimit('key-b', 1, 60_000);
    expect(a.success).toBe(true);
    expect(b.success).toBe(true);
  });
});
