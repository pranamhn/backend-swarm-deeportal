import "dotenv/config";

export const config = {
  port: parseInt(process.env.PORT || "5002", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  database: {
    url: process.env.DATABASE_URL || "",
  },

  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },

  ai: {
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY || "",
      baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      reasoner: process.env.DEEPSEEK_REASONER || "deepseek-reasoner",
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || "",
      model: process.env.OPENAI_MODEL || "gpt-4o",
    },
  },

  storage: {
    bucket: process.env.S3_BUCKET || "deeportal-swarm-uploads",
    region: process.env.S3_REGION || "ap-southeast-1",
    endpoint: process.env.S3_ENDPOINT || "",
    accessKey: process.env.S3_ACCESS_KEY || "",
    secretKey: process.env.S3_SECRET_KEY || "",
  },

  simulation: {
    maxConcurrent: parseInt(process.env.SWARM_MAX_CONCURRENT_SIMULATIONS || "10", 10),
    timeoutMs: parseInt(process.env.SWARM_SIMULATION_TIMEOUT_MS || "600000", 10),
    timeouts: {
      fast: 60_000,
      balanced: 180_000,
      deep: 600_000,
    } as Record<string, number>,
  },
} as const;
