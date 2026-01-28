import Redis from "ioredis";

// Redis client configuration
// In production, these would come from environment variables
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Create Redis client with connection handling
let redis: Redis | null = null;

export function getRedisClient(): Redis {
    if (!redis) {
        redis = new Redis(REDIS_URL, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            // Reconnect on error
            reconnectOnError(err) {
                const targetError = "READONLY";
                if (err.message.includes(targetError)) {
                    return true;
                }
                return false;
            },
        });

        redis.on("error", (err) => {
            console.error("Redis error:", err);
        });

        redis.on("connect", () => {
            console.log("Connected to Redis");
        });
    }

    return redis;
}

// Cache helper functions
const DEFAULT_TTL = 3600; // 1 hour in seconds

/**
 * Get cached data or fetch and cache it
 */
export async function getOrSetCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = DEFAULT_TTL
): Promise<T> {
    const client = getRedisClient();

    try {
        const cached = await client.get(key);
        if (cached) {
            return JSON.parse(cached) as T;
        }

        const data = await fetcher();
        await client.setex(key, ttl, JSON.stringify(data));
        return data;
    } catch (error) {
        // If Redis fails, just return the fetched data
        console.error("Redis cache error:", error);
        return fetcher();
    }
}

/**
 * Set cache with expiration
 */
export async function setCache(
    key: string,
    data: unknown,
    ttl: number = DEFAULT_TTL
): Promise<void> {
    const client = getRedisClient();
    try {
        await client.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
        console.error("Redis set error:", error);
    }
}

/**
 * Get cache value
 */
export async function getCache<T>(key: string): Promise<T | null> {
    const client = getRedisClient();
    try {
        const cached = await client.get(key);
        return cached ? (JSON.parse(cached) as T) : null;
    } catch (error) {
        console.error("Redis get error:", error);
        return null;
    }
}

/**
 * Delete cache by key
 */
export async function deleteCache(key: string): Promise<void> {
    const client = getRedisClient();
    try {
        await client.del(key);
    } catch (error) {
        console.error("Redis delete error:", error);
    }
}

/**
 * Delete cache by pattern (e.g., "user:*")
 */
export async function deleteCacheByPattern(pattern: string): Promise<void> {
    const client = getRedisClient();
    try {
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
            await client.del(...keys);
        }
    } catch (error) {
        console.error("Redis delete pattern error:", error);
    }
}

/**
 * Increment a counter
 */
export async function incrementCounter(key: string): Promise<number> {
    const client = getRedisClient();
    try {
        return await client.incr(key);
    } catch (error) {
        console.error("Redis increment error:", error);
        return 0;
    }
}

// Cache key generators for consistent naming
export const CacheKeys = {
    // Dashboard stats
    dashboardStats: (role: string, id: string) => `dashboard:${role}:${id}:stats`,

    // Schools
    allSchools: () => "schools:all",
    schoolById: (id: string) => `school:${id}`,
    schoolsByDinas: (dinasId: string) => `schools:dinas:${dinasId}`,
    schoolStats: (id: string) => `school:${id}:stats`,

    // Registrations
    registrationById: (id: string) => `registration:${id}`,
    registrationsBySchool: (schoolId: string) => `registrations:school:${schoolId}`,
    registrationsByJalur: (schoolId: string, jalurId: string) =>
        `registrations:school:${schoolId}:jalur:${jalurId}`,
    registrationStats: (schoolId: string) => `registrations:school:${schoolId}:stats`,

    // Users
    userById: (id: string) => `user:${id}`,
    userSession: (sessionId: string) => `session:${sessionId}`,

    // Announcements
    announcements: (type: string) => `announcements:${type}`,

    // Rate limiting
    rateLimit: (ip: string, action: string) => `ratelimit:${ip}:${action}`,
};
