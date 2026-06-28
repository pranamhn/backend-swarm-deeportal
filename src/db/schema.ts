import { mysqlTable, varchar, text, int, timestamp, json, real, boolean } from "drizzle-orm/mysql-core";

// ── Swarm Projects ──
export const swarmProjects = mysqlTable("swarm_projects", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  title: text("title").notNull(),
  mode: varchar("mode", { length: 50 }).notNull(),

  // Mode A: Social Sentiment
  subType: varchar("sub_type", { length: 50 }),
  electionType: varchar("election_type", { length: 50 }),
  region: varchar("region", { length: 100 }),
  platforms: json("platforms").$type<string[]>(),
  seedTopics: json("seed_topics").$type<string[]>(),
  candidates: json("candidates").$type<{ name: string; party: string; twitterHandle?: string }[]>(),

  // Mode B: Investment Prediction
  predictionType: varchar("prediction_type", { length: 50 }),
  timeHorizon: varchar("time_horizon", { length: 50 }),
  simulationMode: varchar("simulation_mode", { length: 50 }),
  markets: json("markets").$type<string[]>(),
  scenarios: json("scenarios").$type<string[]>(),

  // Shared
  objective: text("objective"),
  targetEntity: varchar("target_entity", { length: 200 }),
  agentCount: int("agent_count").notNull().default(100),
  loops: int("loops").notNull().default(10),
  status: varchar("status", { length: 50 }).notNull().default("draft"),
  progress: int("progress").notNull().default(0),
  currentStep: varchar("current_step", { length: 50 }),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Project Files ──
export const swarmFiles = mysqlTable("swarm_files", {
  id: varchar("id", { length: 36 }).primaryKey(),
  projectId: varchar("project_id", { length: 36 }).notNull(),
  fileName: text("file_name").notNull(),
  fileType: varchar("file_type", { length: 20 }),
  fileUrl: text("file_url"),
  extractedText: text("extracted_text"),
  extractionStatus: varchar("extraction_status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Knowledge Graph ──
export const graphNodes = mysqlTable("graph_nodes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  projectId: varchar("project_id", { length: 36 }).notNull(),
  nodeType: varchar("node_type", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  metadata: json("metadata").$type<Record<string, unknown>>().default({}),
  confidence: real("confidence").default(0.5),
  discoveredLoop: int("discovered_loop"),
  discoveredBy: varchar("discovered_by", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const graphEdges = mysqlTable("graph_edges", {
  id: varchar("id", { length: 36 }).primaryKey(),
  projectId: varchar("project_id", { length: 36 }).notNull(),
  sourceNodeId: varchar("source_node_id", { length: 36 }).notNull(),
  targetNodeId: varchar("target_node_id", { length: 36 }).notNull(),
  relationshipType: varchar("relationship_type", { length: 50 }).notNull(),
  weight: real("weight").default(0.5),
  confidence: real("confidence").default(0.5),
  metadata: json("metadata").$type<Record<string, unknown>>().default({}),
  discoveredLoop: int("discovered_loop"),
  discoveredBy: varchar("discovered_by", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Agents ──
export const swarmAgents = mysqlTable("swarm_agents", {
  id: varchar("id", { length: 36 }).primaryKey(),
  projectId: varchar("project_id", { length: 36 }).notNull(),
  agentRole: varchar("agent_role", { length: 50 }).notNull(),
  persona: json("persona").$type<Record<string, unknown>>().notNull(),
  decisionFactors: json("decision_factors").$type<string[]>().default([]),
  memory: json("memory").$type<Record<string, unknown>[]>().default([]),
  platform: varchar("platform", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Social Agents ──
export const swarmSocialAgents = mysqlTable("swarm_social_agents", {
  id: varchar("id", { length: 36 }).primaryKey(),
  projectId: varchar("project_id", { length: 36 }).notNull(),
  agentId: varchar("agent_id", { length: 36 }),
  bio: text("bio"),
  persona: text("persona"),
  mbti: varchar("mbti", { length: 10 }),
  age: int("age"),
  country: varchar("country", { length: 100 }),
  interestedTopics: json("interested_topics").$type<string[]>(),
  followerCount: int("follower_count").default(100),
  friendCount: int("friend_count").default(50),
  karma: int("karma"),
  subreddits: json("subreddits").$type<string[]>(),
  postingStyle: varchar("posting_style", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Social Actions ──
export const swarmSocialActions = mysqlTable("swarm_social_actions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  projectId: varchar("project_id", { length: 36 }).notNull(),
  agentId: varchar("agent_id", { length: 36 }).notNull(),
  loop: int("loop").notNull(),
  platform: varchar("platform", { length: 20 }).notNull(),
  actionType: varchar("action_type", { length: 30 }).notNull(),
  content: text("content"),
  targetAgentId: varchar("target_agent_id", { length: 36 }),
  sentimentLabel: varchar("sentiment_label", { length: 20 }),
  sentimentScore: real("sentiment_score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Simulation Runs ──
export const simulationRuns = mysqlTable("simulation_runs", {
  id: varchar("id", { length: 36 }).primaryKey(),
  projectId: varchar("project_id", { length: 36 }).notNull(),
  mode: varchar("mode", { length: 50 }).notNull(),
  scenarioName: varchar("scenario_name", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  currentLoop: int("current_loop").default(0),
  totalLoops: int("total_loops").notNull(),
  result: json("result").$type<Record<string, unknown>>(),
  startedAt: timestamp("started_at"),
  finishedAt: timestamp("finished_at"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Simulation Snapshots ──
export const simulationSnapshots = mysqlTable("simulation_snapshots", {
  id: varchar("id", { length: 36 }).primaryKey(),
  simulationRunId: varchar("simulation_run_id", { length: 36 }).notNull(),
  loop: int("loop").notNull(),
  state: json("state").$type<Record<string, unknown>>().notNull(),
  agentDecisions: json("agent_decisions").$type<Record<string, unknown>[]>(),
  metrics: json("metrics").$type<Record<string, number>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Reports ──
export const swarmReports = mysqlTable("swarm_reports", {
  id: varchar("id", { length: 36 }).primaryKey(),
  projectId: varchar("project_id", { length: 36 }).notNull(),
  mode: varchar("mode", { length: 50 }).notNull(),
  summary: text("summary"),
  score: json("score").$type<Record<string, unknown>>(),
  keyFindings: json("key_findings").$type<Record<string, unknown>[]>(),
  risks: json("risks").$type<Record<string, unknown>[]>(),
  opportunities: json("opportunities").$type<Record<string, unknown>[]>(),
  recommendations: json("recommendations").$type<Record<string, unknown>[]>(),
  causalChain: json("causal_chain").$type<Record<string, unknown>[]>(),
  agentQuotes: json("agent_quotes").$type<Record<string, unknown>[]>(),
  rawMarkdown: text("raw_markdown"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Chat Messages ──
export const swarmChatMessages = mysqlTable("swarm_chat_messages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  projectId: varchar("project_id", { length: 36 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  agentId: varchar("agent_id", { length: 36 }),
  content: text("content").notNull(),
  referencedNodes: json("referenced_nodes").$type<string[]>(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// ── Agent Episodic Memory (MySQL JSON for embeddings instead of pgvector) ──
export const agentEpisodicMemory = mysqlTable("agent_episodic_memory", {
  id: varchar("id", { length: 36 }).primaryKey(),
  agentType: varchar("agent_type", { length: 50 }).notNull(),
  projectId: varchar("project_id", { length: 36 }),
  episode: json("episode").$type<Record<string, unknown>>().notNull(),
  embeddingJson: json("embedding_json").$type<number[]>(), // MySQL JSON instead of pgvector VECTOR(1536)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Share Links ──
export const swarmShareLinks = mysqlTable("swarm_share_links", {
  id: varchar("id", { length: 36 }).primaryKey(),
  reportId: varchar("report_id", { length: 36 }).notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Notifications ──
export const swarmNotifications = mysqlTable("swarm_notifications", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  data: json("data").$type<Record<string, unknown>>().default({}),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Audit Log ──
export const swarmAuditLog = mysqlTable("swarm_audit_log", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  projectId: varchar("project_id", { length: 36 }),
  mode: varchar("mode", { length: 50 }),
  details: json("details").$type<Record<string, unknown>>().default({}),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
