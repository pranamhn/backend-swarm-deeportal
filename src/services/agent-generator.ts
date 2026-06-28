import type { SwarmProject, AgentProfile, AgentPersona, AgentRole, GraphNode, GraphEdge } from "../types/swarm.js";
import { db, swarmAgents, swarmSocialAgents } from "../db/index.js";
import { extractJSON } from "../lib/llm.js";
import { logger } from "../lib/logger.js";
import { v4 as uuid } from "uuid";

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export async function generateAgents(project: SwarmProject, graph: GraphData): Promise<AgentProfile[]> {
  logger.info({ projectId: project.id, mode: project.mode }, "Generating agents");

  const isSocial = project.mode === "social_sentiment";
  const isPolitical = isSocial && project.subType === "political_election";

  const agentRoles = getAgentRoles(project, isPolitical);
  const count = Math.min(project.agentCount, agentRoles.length * 10);

  const agents: AgentProfile[] = [];

  for (let i = 0; i < count; i++) {
    const roleIndex = i % agentRoles.length;
    const role = agentRoles[roleIndex];
    const persona = await generatePersona(project, role, graph, i);

    const agent: AgentProfile = {
      id: uuid(),
      projectId: project.id,
      role,
      persona,
      decisionFactors: getDecisionFactors(role, isPolitical),
      memory: [],
      platform: isSocial ? (i % 2 === 0 ? "twitter" : "reddit") : undefined,
      createdAt: new Date(),
    };

    agents.push(agent);
  }

  // Save to DB
  if (agents.length) {
    await db.insert(swarmAgents).values(agents.map(a => ({
      id: a.id,
      projectId: a.projectId,
      agentRole: a.role,
      persona: a.persona as unknown as Record<string, unknown>,
      decisionFactors: a.decisionFactors,
      memory: [],
      platform: a.platform,
      createdAt: a.createdAt,
    })));

    if (isSocial) {
      await db.insert(swarmSocialAgents).values(agents.map(a => ({
        id: uuid(),
        projectId: a.projectId,
        agentId: a.id,
        bio: a.persona.bio,
        persona: a.persona.persona,
        mbti: a.persona.mbti,
        age: a.persona.age,
        country: a.persona.country,
        interestedTopics: a.persona.interestedTopics,
        followerCount: a.persona.followerCount,
        friendCount: a.persona.friendCount,
        createdAt: new Date(),
      })));
    }
  }

  return agents;
}

function getAgentRoles(project: SwarmProject, isPolitical: boolean): AgentRole[] {
  if (isPolitical) {
    return [
      "partisan_supporter", "partisan_supporter",  // 2x for each candidate
      "swing_voter", "swing_voter",                // 2x undecided
      "political_influencer",
      "independent_journalist",
      "opposition_researcher",
      "regional_voter",
      "youth_voter",
    ];
  }
  if (project.mode === "social_sentiment") {
    return ["twitter_user", "twitter_user", "reddit_user", "reddit_user"];
  }
  // Investment
  const typeRoles: Record<string, string[]> = {
    funding: ["seed_investor", "vc_investor", "founder", "customer", "competitor", "adversarial_analyst"],
    acquisition: ["acquirer", "founder", "competitor", "regulator", "adversarial_analyst"],
    ipo: ["underwriter", "seed_investor", "regulator", "founder", "adversarial_analyst"],
    market_dynamics: ["market_maker", "hedge_fund_analyst", "corporate_strategist", "policy_maker", "consumer_proxy", "adversarial_analyst"],
    business_risk: ["founder", "regulator", "competitor", "adversarial_analyst"],
  };
  return (typeRoles[project.predictionType || "funding"] || typeRoles.funding) as AgentRole[];
}

function getDecisionFactors(role: AgentRole, isPolitical: boolean): string[] {
  const factors: Record<string, string[]> = {
    partisan_supporter: ["candidate_news", "opponent_weakness", "party_instruction", "trending_hashtags"],
    swing_voter: ["policy_clarity", "candidate_credibility", "scandal_severity", "economic_condition"],
    political_influencer: ["engagement_metrics", "narrative_alignment", "trending_topics"],
    independent_journalist: ["newsworthiness", "source_credibility", "public_interest"],
    regional_voter: ["local_issues", "candidate_origin", "development_promise"],
    youth_voter: ["social_trends", "peer_opinion", "meme_culture"],
    seed_investor: ["traction", "market_size", "founder_quality", "growth_rate", "valuation"],
    vc_investor: ["market_size", "team", "traction", "competitive_moat", "exit_potential"],
    founder: ["cash_runway", "growth_target", "team_capability", "investor_interest"],
    acquirer: ["strategic_synergy", "technology_fit", "team_quality", "customer_overlap"],
    adversarial_analyst: ["assumption_validity", "data_reliability", "counter_argument", "blind_spot"],
  };
  return factors[role] || ["market_signal", "risk_assessment", "opportunity_cost"];
}

async function generatePersona(
  project: SwarmProject,
  role: AgentRole,
  graph: GraphData,
  index: number,
): Promise<AgentPersona> {
  try {
    const context = `Role: ${role}. Project: ${project.mode}. Index: ${index}. Graph nodes: ${graph.nodes.map(n => n.name).join(", ")}`;
    return await extractJSON<AgentPersona>(
      context,
      "Generate a realistic persona profile for this simulation agent.",
      JSON.stringify({
        bio: "string",
        persona: "string",
        age: 30,
        mbti: "ENFJ",
        country: "Indonesia",
        profession: "string",
        interestedTopics: ["string"],
        followerCount: 500,
        friendCount: 100,
        riskTolerance: "medium",
        goal: "string",
      })
    );
  } catch {
    return getDefaultPersona(role, index);
  }
}

function getDefaultPersona(role: string, index: number): AgentPersona {
  return {
    bio: `Simulated ${role.replace(/_/g, " ")} agent #${index + 1}`,
    persona: `A typical ${role.replace(/_/g, " ")} with balanced views`,
    age: 25 + (index % 30),
    mbti: ["ENFJ", "ISTJ", "ENTP", "ISFP"][index % 4],
    country: "Indonesia",
    profession: role.replace(/_/g, " "),
    interestedTopics: ["economy", "technology", "politics"],
    followerCount: 100 + index * 50,
    friendCount: 50 + index * 10,
    riskTolerance: index % 3 === 0 ? "high" : index % 3 === 1 ? "medium" : "low",
    goal: `Act as a realistic ${role.replace(/_/g, " ")} in the simulation`,
  };
}
