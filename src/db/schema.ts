import { pgTable, uuid, text, integer, timestamp, jsonb, real, boolean } from "drizzle-orm/pg-core";

// ── Swarm Projects ──
export const swarmProjects = pgTable("swarm_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  mode: text("mode").notNull(), // "social_sentiment" | "investment_prediction"

  // Mode A: Social Sentiment
  subType: text("sub_type"),
  electionType: text("election_type"),
  region: text("region"),
  platforms: jsonb("platforms").$type<string[]>(),
  seedTopics: jsonb("seed_topics").$type<string[]>(),
  candidates: jsonb("candidates").$type<{ name: string; party: string; twitterHandle?: string }[]>(),

  // Mode B: Investment Prediction
  predictionType: text("prediction_type"),
  timeHorizon: text("time_horizon"),
  simulationMode: text("simulation_mode"),
  markets: jsonb("markets").$type<string[]>(),
  scenarios: jsonb("scenarios").$type<string[]>(),

  // Shared
  objective: text("objective"),
  targetEntity: text("target_entity"),
  agentCount: integer("agent_count").notNull().default(100),
  loops: integer("loops").notNull().default(10),
  status: text("status").notNull().default("draft"),
  progress: integer("progress").notNull().default(0),
  currentStep: text("current_step"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Project Files ──
export const swarmFiles = pgTable("swarm_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => swarmProjects.id).notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type"),
  fileUrl: text("file_url"),
  extractedText: text("extracted_text"),
  extractionStatus: text("extraction_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Knowledge Graph ──
export const graphNodes = pgTable("graph_nodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => swarmProjects.id).notNull(),
  nodeType: text("node_type").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  confidence: real("confidence").default(0.5),
  discoveredLoop: integer("discovered_loop"),
  discoveredBy: text("discovered_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const graphEdges = pgTable("graph_edges", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => swarmProjects.id).notNull(),
  sourceNodeId: uuid("source_node_id").references(() => graphNodes.id).notNull(),
  targetNodeId: uuid("target_node_id").references(() => graphNodes.id).notNull(),
  relationshipType: text("relationship_type").notNull(),
  weight: real("weight").default(0.5),
  confidence: real("confidence").default(0.5),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  discoveredLoop: integer("discovered_loop"),
  discoveredBy: text("discovered_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Agents ──
export const swarmAgents = pgTable("swarm_agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => swarmProjects.id).notNull(),
  agentRole: text("agent_role").notNull(),
  persona: jsonb("persona").$type<Record<string, unknown>>().notNull(),
  decisionFactors: jsonb("decision_factors").$type<string[]>().default([]),
  memory: jsonb("memory").$type<Record<string, unknown>[]>().default([]),
  platform: text("platform"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Social Agents (Mode A specific) ──
export const swarmSocialAgents = pgTable("swarm_social_agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => swarmProjects.id).notNull(),
  agentId: uuid("agent_id").references(() => swarmAgents.id),
  bio: text("bio"),
  persona: text("persona"),
  mbti: text("mbti"),
  age: integer("age"),
  country: text("country"),
  interestedTopics: jsonb("interested_topics").$type<string[]>(),
  followerCount: integer("follower_count").default(100),
  friendCount: integer("friend_count").default(50),
  karma: integer("karma"),
  subreddits: jsonb("subreddits").$type<string[]>(),
  postingStyle: text("posting_style"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Social Actions (Mode A) ──
export const swarmSocialActions = pgTable("swarm_social_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => swarmProjects.id).notNull(),
  agentId: uuid("agent_id").references(() => swarmAgents.id).notNull(),
  loop: integer("loop").notNull(),
  platform: text("platform").notNull(),
  actionType: text("action_type").notNull(), // POST, LIKE, REPOST, FOLLOW, COMMENT
  content: text("content"),
  targetAgentId: uuid("target_agent_id"),
  sentimentLabel: text("sentiment_label"), // positive, negative, neutral
  sentimentScore: real("sentiment_score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Simulation Runs ──
export const simulationRuns = pgTable("simulation_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => swarmProjects.id).notNull(),
  mode: text("mode").notNull(),
  scenarioName: text("scenario_name").notNull(),
  status: text("status").default("pending"),
  currentLoop: integer("current_loop").default(0),
  totalLoops: integer("total_loops").notNull(),
  result: jsonb("result").$type<Record<string, unknown>>(),
  startedAt: timestamp("started_at"),
  finishedAt: timestamp("finished_at"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Simulation Snapshots ──
export const simulationSnapshots = pgTable("simulation_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  simulationRunId: uuid("simulation_run_id").references(() => simulationRuns.id).notNull(),
  loop: integer("loop").notNull(),
  state: jsonb("state").$type<Record<string, unknown>>().notNull(),
  agentDecisions: jsonb("agent_decisions").$type<Record<string, unknown>[]>(),
  metrics: jsonb("metrics").$type<Record<string, number>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Reports ──
export const swarmReports = pgTable("swarm_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => swarmProjects.id).notNull(),
  mode: text("mode").notNull(),
  summary: text("summary"),
  score: jsonb("score").$type<Record<string, unknown>>(),
  keyFindings: jsonb("key_findings").$type<Record<string, unknown>[]>(),
  risks: jsonb("risks").$type<Record<string, unknown>[]>(),
  opportunities: jsonb("opportunities").$type<Record<string, unknown>[]>(),
  recommendations: jsonb("recommendations").$type<Record<string, unknown>[]>(),
  causalChain: jsonb("causal_chain").$type<Record<string, unknown>[]>(),
  agentQuotes: jsonb("agent_quotes").$type<Record<string, unknown>[]>(),
  rawMarkdown: text("raw_markdown"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Chat Messages ──
export const swarmChatMessages = pgTable("swarm_chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => swarmProjects.id).notNull(),
  role: text("role").notNull(), // user | assistant | agent
  agentId: uuid("agent_id"),
  content: text("content").notNull(),
  referencedNodes: jsonb("referenced_nodes").$type<string[]>(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// ── Agent Episodic Memory ──
export const agentEpisodicMemory = pgTable("agent_episodic_memory", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentType: text("agent_type").notNull(),
  projectId: uuid("project_id").references(() => swarmProjects.id),
  episode: jsonb("episode").$type<Record<string, unknown>>().notNull(),
  embedding: jsonb("embedding").$type<number[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Share Links ──
export const swarmShareLinks = pgTable("swarm_share_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").references(() => swarmReports.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Notifications ──
export const swarmNotifications = pgTable("swarm_notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  type: text("type").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().default({}),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Audit Log ──
export const swarmAuditLog = pgTable("swarm_audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  action: text("action").notNull(),
  projectId: uuid("project_id"),
  mode: text("mode"),
  details: jsonb("details").$type<Record<string, unknown>>().default({}),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
