import { z } from "zod";

// ── Mode ──
export const swarmModeSchema = z.enum(["social_sentiment", "investment_prediction"]);
export const socialSubTypeSchema = z.enum(["general", "political_election", "ipo_sentiment", "crisis_sentiment"]);
export const predictionTypeSchema = z.enum(["funding", "acquisition", "ipo", "market_dynamics", "business_risk", "pricing", "customer_behavior", "competitive_response"]);
export const electionTypeSchema = z.enum(["gubernur", "bupati", "walikota", "presiden", "caleg"]);
export const simulationModeSchema = z.enum(["fast", "balanced", "deep"]);
export const platformSchema = z.enum(["twitter", "reddit"]);
export const marketSchema = z.enum(["SEA", "US", "EU"]);
export const scenarioTypeSchema = z.enum(["optimistic", "neutral", "pessimistic"]);
export const politicalScenarioSchema = z.enum(["baseline", "debate_impact", "scandal_crisis", "regional_battleground", "multi_candidate"]);

// ── Candidate ──
export const candidateSchema = z.object({
  name: z.string().min(1),
  party: z.string().min(1),
  twitterHandle: z.string().optional(),
});

// ── New Swarm Project ──
export const newSwarmProjectSchema = z.object({
  title: z.string().min(1).max(200),
  mode: swarmModeSchema,

  // Mode A: Social Sentiment
  subType: socialSubTypeSchema.optional(),
  electionType: electionTypeSchema.optional(),
  region: z.string().optional(),
  platforms: z.array(platformSchema).min(1).optional(),
  seedTopics: z.array(z.string()).optional(),
  candidates: z.array(candidateSchema).optional(),

  // Mode B: Investment Prediction
  predictionType: predictionTypeSchema.optional(),
  timeHorizon: z.string().optional(),
  simulationMode: simulationModeSchema.optional(),
  markets: z.array(marketSchema).optional(),
  scenarios: z.array(z.union([scenarioTypeSchema, politicalScenarioSchema])).optional(),

  // Shared
  objective: z.string().optional(),
  targetEntity: z.string().optional(),
  agentCount: z.number().int().min(10).max(10000).default(100),
  loops: z.number().int().min(3).max(30).default(10),
}).refine(
  (data) => {
    if (data.mode === "social_sentiment") {
      return data.platforms && data.platforms.length > 0;
    }
    return true;
  },
  { message: "Social sentiment mode requires at least one platform", path: ["platforms"] }
).refine(
  (data) => {
    if (data.mode === "social_sentiment" && data.subType === "political_election") {
      return data.candidates && data.candidates.length >= 2 && data.electionType;
    }
    return true;
  },
  { message: "Political election requires at least 2 candidates and an election type", path: ["candidates"] }
).refine(
  (data) => {
    if (data.mode === "investment_prediction") {
      return data.predictionType !== undefined;
    }
    return true;
  },
  { message: "Investment prediction mode requires a prediction type", path: ["predictionType"] }
);

export type NewSwarmProject = z.infer<typeof newSwarmProjectSchema>;

// ── File Upload ──
export const fileUploadSchema = z.object({
  projectId: z.string().uuid(),
  fileName: z.string().min(1),
  fileType: z.enum(["pdf", "csv", "xlsx", "txt", "md"]),
  fileSize: z.number().max(25 * 1024 * 1024, "Max file size is 25MB"),
});

// ── Simulation Run ──
export const simulationRunSchema = z.object({
  projectId: z.string().uuid(),
  mode: swarmModeSchema,
  scenarios: z.array(z.string()).optional(),
});

// ── Chat ──
export const chatMessageSchema = z.object({
  projectId: z.string().uuid(),
  message: z.string().min(1).max(2000),
  interviewAgentId: z.string().optional(),
});

// ── Share Link ──
export const shareLinkSchema = z.object({
  reportId: z.string().uuid(),
  expiresInDays: z.number().int().min(1).max(365).default(7),
});

// ── Pagination ──
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ── Mode-specific Config ──
export const socialConfigSchema = z.object({
  platforms: z.array(platformSchema).min(1),
  agentCount: z.number().int().min(10).max(10000),
  seedTopics: z.array(z.string()).min(1),
  loops: z.number().int().min(3).max(15),
  candidates: z.array(candidateSchema).optional(),
  electionType: electionTypeSchema.optional(),
  region: z.string().optional(),
});

export const investmentConfigSchema = z.object({
  predictionType: predictionTypeSchema,
  simulationMode: simulationModeSchema,
  markets: z.array(marketSchema).optional(),
  scenarios: z.array(z.union([scenarioTypeSchema, politicalScenarioSchema])).optional(),
  timeHorizon: z.string(),
  agentCount: z.number().int().min(10).max(50),
  loops: z.number().int().min(3).max(30),
});
