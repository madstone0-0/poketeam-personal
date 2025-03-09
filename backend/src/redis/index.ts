import { createClient } from "redis";
import type { RedisClientType } from "redis";
import { customLogger } from "../logging.js";

class RedisWrapper {
    private client: RedisClientType;
    private available: boolean = false;

    constructor() {
        this.client = createClient({
            url: process.env.REDISCLOUD_URL || "redis://localhost:6379",
        });

        // Event listeners to update availability
        this.client.on("ready", () => {
            this.available = true;
            customLogger("Redis is ready");
        });

        this.client.on("end", () => {
            this.available = false;
            customLogger("Redis connection ended");
        });

        this.client.on("error", (error) => {
            this.available = false;
            customLogger(`Redis error -> ${error}`);
        });
    }

    // Connect the redis client
    async connect(): Promise<void> {
        try {
            await this.client.connect();
            // The 'ready' event will set available to true.
        } catch (error) {
            customLogger(`Redis connection error -> ${error}`);
            this.available = false;
        }
    }

    // A safe get operation that checks availability first
    async get(key: string): Promise<string | null> {
        if (!this.available) {
            customLogger("Redis is not available. Skipping get operation.");
            return null;
        }
        try {
            return await this.client.get(key);
        } catch (error) {
            customLogger(`Error in get(${key}) -> ${error}`);
            return null;
        }
    }

    // A safe set operation that checks availability first
    async set(key: string, value: string, options?: { EX?: number }): Promise<void> {
        if (!this.available) {
            customLogger("Redis is not available. Skipping set operation.");
            return;
        }
        try {
            await this.client.set(key, value, options);
        } catch (error) {
            customLogger(`Error in set(${key}) -> ${error}`);
        }
    }

    // A safe delete operation
    async del(key: string): Promise<void> {
        if (!this.available) {
            customLogger("Redis is not available. Skipping del operation.");
            return;
        }
        try {
            await this.client.del(key);
        } catch (error) {
            customLogger(`Error in del(${key}) -> ${error}`);
        }
    }

    // Add any additional Redis operations following the same pattern
}

// Instantiate the wrapper and immediately attempt connection
const redisClient = new RedisWrapper();
(async () => {
    await redisClient.connect();
})();

export default redisClient;
