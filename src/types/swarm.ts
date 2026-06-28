// ── Swarm Deeportal — Core Type Definitions ──

// ── Mode Categories (from predict-deeportal-plan.md) ──
export type ModeCategory =
  | "startup_intelligence"
  | "market_intelligence"
  | "social_sentiment"
  | "political_intelligence"
  | "financial_intelligence"
  | "scenario_simulation";

// ── Mode ──
export type SwarmMode = "social_sentiment" | "investment_prediction";

// ── MVP Prediction Types (8 core types from predict-deeportal-plan.md) ──
export type SocialSubType = "general" | "political_election" | "ipo_sentiment" | "crisis_sentiment";
export type PredictionType =
  // Startup Intelligence
  | "funding_signal" | "growth_signal" | "investor_fit" | "mna_signal" | "business_risk"
  // Market Intelligence
  | "market_opportunity" | "market_expansion" | "revenue_potential"
  // Political Intelligence
  | "political_risk" | "regulation_impact" | "policy_direction"
  // Financial Intelligence
  | "credit_risk" | "financing_eligibility" | "cashflow_health"
  // Legacy (backward compat)
  | "funding" | "acquisition" | "ipo" | "market_dynamics" | "pricing" | "customer_behavior" | "competitive_response";

export type ElectionType = "gubernur" | "bupati" | "walikota" | "presiden" | "caleg";
export type SimulationMode = "fast" | "balanced" | "deep";

export type Platform = "twitter" | "reddit" | "mastodon" | "bluesky";
export type Market = "SEA" | "US" | "EU";
export type ScenarioType = "optimistic" | "neutral" | "pessimistic";
export type PoliticalScenario = "baseline" | "debate_impact" | "scandal_crisis" | "regional_battleground" | "multi_candidate";

// ── Mode Category mapping ──
export const MODE_CATEGORY_MAP: Record<PredictionType, ModeCategory> = {
  funding_signal: "startup_intelligence",
  growth_signal: "startup_intelligence",
  investor_fit: "startup_intelligence",
  mna_signal: "startup_intelligence",
  business_risk: "startup_intelligence",
  market_opportunity: "market_intelligence",
  market_expansion: "market_intelligence",
  revenue_potential: "market_intelligence",
  political_risk: "political_intelligence",
  regulation_impact: "political_intelligence",
  policy_direction: "political_intelligence",
  credit_risk: "financial_intelligence",
  financing_eligibility: "financial_intelligence",
  cashflow_health: "financial_intelligence",
  // Legacy
  funding: "startup_intelligence",
  acquisition: "startup_intelligence",
  ipo: "startup_intelligence",
  market_dynamics: "market_intelligence",
  pricing: "market_intelligence",
  customer_behavior: "market_intelligence",
  competitive_response: "market_intelligence",
};

export const MODE_LABELS: Record<PredictionType, { label: string; icon: string; category: ModeCategory }> = {
  funding_signal: { label: "💰 Funding Signal", icon: "💰", category: "startup_intelligence" },
  growth_signal: { label: "📈 Growth Signal", icon: "📈", category: "startup_intelligence" },
  investor_fit: { label: "🧲 Investor Fit", icon: "🧲", category: "startup_intelligence" },
  mna_signal: { label: "🤝 M&A Signal", icon: "🤝", category: "startup_intelligence" },
  business_risk: { label: "⚠️ Business Risk", icon: "⚠️", category: "startup_intelligence" },
  market_opportunity: { label: "📊 Market Opportunity", icon: "📊", category: "market_intelligence" },
  market_expansion: { label: "🌏 Market Expansion", icon: "🌏", category: "market_intelligence" },
  revenue_potential: { label: "💵 Revenue Potential", icon: "💵", category: "market_intelligence" },
  political_risk: { label: "🏛️ Political Risk", icon: "🏛️", category: "political_intelligence" },
  regulation_impact: { label: "📜 Regulation Impact", icon: "📜", category: "political_intelligence" },
  policy_direction: { label: "🧭 Policy Direction", icon: "🧭", category: "political_intelligence" },
  credit_risk: { label: "🏦 Credit Risk", icon: "🏦", category: "financial_intelligence" },
  financing_eligibility: { label: "💳 Financing Eligibility", icon: "💳", category: "financial_intelligence" },
  cashflow_health: { label: "🧾 Cashflow Health", icon: "🧾", category: "financial_intelligence" },
  // Legacy
  funding: { label: "💰 Funding Prediction", icon: "💰", category: "startup_intelligence" },
  acquisition: { label: "🤝 Acquisition Fit", icon: "🤝", category: "startup_intelligence" },
  ipo: { label: "🏛️ IPO Readiness", icon: "🏛️", category: "startup_intelligence" },
  market_dynamics: { label: "📊 Market Dynamics", icon: "📊", category: "market_intelligence" },
  pricing: { label: "💲 Pricing Simulation", icon: "💲", category: "market_intelligence" },
  customer_behavior: { label: "👥 Customer Behavior", icon: "👥", category: "market_intelligence" },
  competitive_response: { label: "⚔️ Competitive Response", icon: "⚔️", category: "market_intelligence" },
};

// ── Project ──
export type ProjectStatus =
  | "draft"
  | "files_uploading"
  | "files_processing"
  | "graph_building"
  | "agents_generating"
  | "simulating"
  | "scoring"
  | "completed"
  | "failed"
  | "cancelled";

export interface SwarmProject {
  id: string;
  userId: string;
  title: string;
  mode: SwarmMode;

  // Mode A: Social Sentiment
  subType?: SocialSubType;
  electionType?: ElectionType;
  region?: string;
  platforms?: Platform[];
  seedTopics?: string[];
  candidates?: Candidate[];

  // Mode B: Investment Prediction
  predictionType?: PredictionType;
  timeHorizon?: string;
  simulationMode?: SimulationMode;
  markets?: Market[];
  scenarios?: (ScenarioType | PoliticalScenario)[];

  // Shared
  objective?: string;
  targetEntity?: string;
  agentCount: number;
  loops: number;
  status: ProjectStatus;
  progress: number; // 0-100
  currentStep?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidate {
  name: string;
  party: string;
  twitterHandle?: string;
}

// ── Knowledge Graph ──
export type NodeType = "Company" | "Founder" | "Investor" | "Market" | "Product" | "CustomerSegment" | "Competitor" | "Metric" | "RiskFactor" | "Signal" | "Event" | "Candidate" | "PoliticalParty" | "MediaOutlet" | "Influencer";

export type RelationshipType = "competes_with" | "invested_in" | "founded_by" | "operates_in" | "sells_to" | "has_metric" | "affected_by" | "increases" | "decreases" | "indicates" | "has_risk" | "has_opportunity" | "supports" | "opposes" | "endorses" | "influences";

export interface GraphNode {
  id: string;
  projectId: string;
  nodeType: NodeType;
  name: string;
  description?: string;
  metadata: Record<string, unknown>;
  confidence: number;
  discoveredLoop?: number;
  discoveredBy?: string; // agent ID
  createdAt: Date;
}

export interface GraphEdge {
  id: string;
  projectId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: RelationshipType;
  weight: number;
  confidence: number;
  metadata?: Record<string, unknown>;
  discoveredLoop?: number;
  discoveredBy?: string;
  createdAt: Date;
}

// ── Ontology ──
export interface OntologyEntityType {
  type: string;
  attributes: string[];
  examples: string[];
}

export interface OntologyRelationshipType {
  type: string;
  source: string;
  target: string;
}

export interface Ontology {
  projectId: string;
  entityTypes: OntologyEntityType[];
  relationshipTypes: OntologyRelationshipType[];
  confidenceRules: Record<string, string>;
}

// ── Agents ──
export type AgentRole =
  // Social
  | "twitter_user" | "reddit_user"
  | "partisan_supporter" | "swing_voter" | "political_influencer"
  | "independent_journalist" | "opposition_researcher"
  | "regional_voter" | "youth_voter"
  // Investment
  | "seed_investor" | "vc_investor" | "pe_investor"
  | "founder" | "acquirer" | "customer" | "competitor"
  | "regulator" | "underwriter" | "market_maker"
  | "hedge_fund_analyst" | "corporate_strategist"
  | "policy_maker" | "consumer_proxy"
  // Shared
  | "adversarial_analyst";

export interface AgentProfile {
  id: string;
  projectId: string;
  role: AgentRole;
  persona: AgentPersona;
  decisionFactors: string[];
  memory: AgentMemoryEntry[];
  platform?: Platform;
  createdAt: Date;
}

export interface AgentPersona {
  bio?: string;
  persona?: string; // personality description
  age?: number;
  gender?: string;
  mbti?: string;
  country?: string;
  profession?: string;
  interestedTopics?: string[];
  followerCount?: number;
  friendCount?: number;
  karma?: number;
  subreddits?: string[];
  postingStyle?: string;
  riskTolerance: "ultra-low" | "low" | "medium" | "medium-high" | "high";
  goal: string;
  region?: string;
  urbanRural?: "urban" | "rural";
}

export interface AgentMemoryEntry {
  loop: number;
  decision: string;
  reasoning: string;
  scoreImpact: number;
  timestamp: Date;
}

export interface AgentDecision {
  agentId: string;
  agentRole: AgentRole;
  loop: number;
  reasoning: string;
  decision: string;
  action: string;
  scoreImpact: number;
  riskSignals: string[];
  recommendedAction?: string;
  timestamp: Date;
}

// ── Simulation ──
export type SimulationStatus = "pending" | "preparing" | "ready" | "running" | "completed" | "failed" | "stopped";

export interface SimulationRun {
  id: string;
  projectId: string;
  mode: SwarmMode;
  scenarioName: string;
  status: SimulationStatus;
  currentLoop: number;
  totalLoops: number;
  result?: SimulationResult;
  startedAt?: Date;
  finishedAt?: Date;
  error?: string;
}

export interface SimulationResult {
  projectId: string;
  mode: SwarmMode;
  scenarios: ScenarioResult[];
  agentDecisions: AgentDecision[];
  graphSnapshot?: GraphSnapshot;
}

export interface ScenarioResult {
  scenarioName: string;
  status: "completed" | "failed" | "partial";
  score?: number;
  confidence?: number;
  details: Record<string, unknown>;
}

export interface GraphSnapshot {
  loop: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
  metrics: Record<string, number>;
}

// ── Scoring ──
export interface SwarmScore {
  projectId: string;
  mode: SwarmMode;

  // Social Sentiment scores
  sentimentScore?: number; // -100 to +100
  viralityProbability?: number;
  narrativeDominance?: Record<string, number>;
  influencerRankings?: InfluencerRanking[];

  // Investment scores
  predictionScore?: number; // 0-100
  subScores?: SubScore[];
  causalChain?: CausalChainNode[];

  // Political scores
  electabilityForecast?: Record<string, number>;
  regionalBreakdown?: Record<string, RegionalScore>;
  debateImpact?: DebateImpactScore;

  // Shared
  confidenceScore: number;
  adversarialPenalty?: number;
  missingDataWarnings: string[];
}

export interface SubScore {
  name: string;
  score: number;
  weight: number;
  contribution: number;
  missingData: boolean;
}

export interface CausalChainNode {
  node: string;
  nodeType: string;
  subScore: number;
  weight: number;
  contribution: number;
  evidence: Evidence[];
  missingData?: boolean;
  warning?: string;
}

export interface Evidence {
  source: string;
  excerpt?: string;
  agentsAgreeing?: number;
  total?: number;
}

export interface InfluencerRanking {
  agentId: string;
  role: string;
  impactScore: number;
  narrativeAlignment: string;
}

export interface RegionalScore {
  leading: string;
  margin: string;
}

export interface DebateImpactScore {
  candidate: string;
  preDebateSentiment: number;
  postDebateSentiment: number;
  delta: number;
  winner: boolean;
}

export interface ConfidenceFactors {
  dataCompleteness: number;
  signalReliability: number;
  agentConsensus: number;
  benchmarkSimilarity: number;
  scenarioStability: number;
}

// ── Report ──
export interface SwarmReport {
  id: string;
  projectId: string;
  mode: SwarmMode;
  summary: string;
  score: SwarmScore;
  keyFindings: KeyFinding[];
  risks: Risk[];
  opportunities: Opportunity[];
  recommendations: Recommendation[];
  causalChain?: CausalChainNode[];
  agentQuotes?: AgentQuote[];
  rawMarkdown?: string;
  createdAt: Date;
}

export interface KeyFinding {
  title: string;
  description: string;
  confidence: number;
}

export interface Risk {
  type: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  probability: number;
  mitigation?: string;
}

export interface Opportunity {
  type: string;
  description: string;
  potentialImpact: "low" | "medium" | "high";
}

export interface Recommendation {
  action: string;
  rationale: string;
  priority: "low" | "medium" | "high";
}

export interface AgentQuote {
  agentId: string;
  agentRole: string;
  quote: string;
  loop: number;
}

// ── Chat ──
export interface ChatMessage {
  id: string;
  projectId: string;
  role: "user" | "assistant" | "agent";
  agentId?: string;
  content: string;
  referencedNodes?: string[];
  timestamp: Date;
}

// ── API ──
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  retryable: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ── Sim Progress (SSE) ──
export interface SimulationProgressEvent {
  projectId: string;
  mode: SwarmMode;
  step: string;
  progress: number; // 0-100
  currentLoop?: number;
  totalLoops?: number;
  message?: string;
  agentDecision?: AgentDecision;
  newNode?: GraphNode;
  newEdge?: GraphEdge;
  scoreUpdate?: { scenario: string; score: number };
  timestamp: Date;
}
