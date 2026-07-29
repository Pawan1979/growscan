import { Redis } from '@upstash/redis';

// Simple in-memory fallback cache with TTL
const memoryCache = new Map<string, { value: any; expiresAt: number }>();
let redisClient: Redis | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log('✅ Upstash Redis cache initialized');
  }
} catch (error) {
  console.warn('⚠️ Failed to initialize Upstash Redis, falling back to in-memory cache.', error);
}

export class CacheService {
  /**
   * Get item from cache
   */
  static async get<T>(key: string): Promise<T | null> {
    if (redisClient) {
      try {
        const item = await redisClient.get<T>(key);
        return item || null;
      } catch (err) {
        console.error(`Redis Get Error (${key}):`, err);
        // Fallback to memory if redis fails
      }
    }

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

    if (redisClient) {
      try {
        await redisClient.set(key, value, { ex: ttl });
        return;
      } catch (err) {
        console.error(`Redis Set Error (${key}):`, err);
      }
    }

    const expiresAt = Date.now() + ttl * 1000;
    memoryCache.set(key, { value, expiresAt });
  }

  /**
   * Delete item from cache
   */
  static async del(key: string): Promise<void> {
    if (redisClient) {
      try {
        await redisClient.del(key);
        return;
      } catch (err) {
        console.error(`Redis Del Error (${key}):`, err);
      }
    }
    memoryCache.delete(key);
  }
}
