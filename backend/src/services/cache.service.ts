// Simple in-memory fallback cache with TTL
const memoryCache = new Map<string, { value: any; expiresAt: number }>();

export class CacheService {
  /**
   * Get item from cache
   */
  static async get<T>(key: string): Promise<T | null> {
    const item = memoryCache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      memoryCache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Set item in cache with configurable TTL in seconds (defaults to CACHE_TTL_SECONDS env or 21600s = 6 hours)
   */
  static async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const defaultTtl = parseInt(process.env.CACHE_TTL_SECONDS || '21600', 10);
    const ttl = ttlSeconds !== undefined ? ttlSeconds : defaultTtl;
    const expiresAt = Date.now() + ttl * 1000;
    memoryCache.set(key, { value, expiresAt });
  }

  /**
   * Delete item from cache
   */
  static async del(key: string): Promise<void> {
    memoryCache.delete(key);
  }
}
