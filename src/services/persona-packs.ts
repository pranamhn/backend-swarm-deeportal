import type { AgentPersona, AgentRole } from "../types/swarm.js";

// ── Pre-built Agent Persona Packs ──

export interface PersonaPack {
  id: string;
  name: string;
  description: string;
  category: string;
  personas: PrebuiltPersona[];
}

interface PrebuiltPersona {
  role: AgentRole;
  persona: AgentPersona;
  decisionFactors: string[];
}

export const PERSONA_PACKS: PersonaPack[] = [
  {
    id: "sea-investor-pack",
    name: "SEA Investor Pack",
    description: "Pre-built personas for Southeast Asian startup investors",
    category: "investment",
    personas: [
      {
        role: "seed_investor",
        persona: { riskTolerance: "medium", goal: "Find high-growth startups in SEA with strong founder-market fit", age: 42, country: "Singapore", profession: "Seed Investor", mbti: "ENTJ", interestedTopics: ["SaaS", "fintech", "e-commerce", "logistics"] },
        decisionFactors: ["traction", "market_size", "founder_quality", "valuation", "exit_potential"],
      },
      {
        role: "vc_investor",
        persona: { riskTolerance: "medium", goal: "Lead Series A/B rounds in tech-enabled businesses across Indonesia", age: 38, country: "Indonesia", profession: "VC Partner", mbti: "ESTJ", interestedTopics: ["B2B SaaS", "agritech", "healthtech", "edtech"] },
        decisionFactors: ["market_size", "team", "traction", "competitive_moat", "unit_economics"],
      },
      {
        role: "vc_investor",
        persona: { riskTolerance: "low", goal: "Conservative investor focused on late-stage profitable startups", age: 50, country: "Singapore", profession: "PE Investor", mbti: "ISTJ", interestedTopics: ["enterprise", "infrastructure", "renewable energy"] },
        decisionFactors: ["profitability", "governance", "market_position", "exit_timeline"],
      },
    ],
  },
  {
    id: "political-analyst-pack",
    name: "Political Analyst Pack",
    description: "Pre-built personas for Indonesian political analysis",
    category: "political",
    personas: [
      {
        role: "political_influencer",
        persona: { riskTolerance: "high", goal: "Shape public opinion and drive engagement on political issues", age: 35, country: "Indonesia", profession: "Political Commentator", mbti: "ENFP", interestedTopics: ["politics", "economy", "social justice"], followerCount: 50000 },
        decisionFactors: ["engagement_metrics", "narrative_alignment", "trending_topics", "audience_sentiment"],
      },
      {
        role: "swing_voter",
        persona: { riskTolerance: "low", goal: "Evaluate candidates based on policy and credibility", age: 28, country: "Indonesia", profession: "Teacher", mbti: "ISFJ", interestedTopics: ["education", "healthcare", "economy"] },
        decisionFactors: ["policy_clarity", "candidate_credibility", "economic_impact", "community_influence"],
      },
      {
        role: "regional_voter",
        persona: { riskTolerance: "low", goal: "Support candidates who prioritize local development", age: 45, country: "Indonesia", profession: "Farmer", mbti: "ISTP", region: "Jawa Timur", urbanRural: "rural", interestedTopics: ["agriculture", "infrastructure", "subsidi"] },
        decisionFactors: ["local_issues", "candidate_origin", "development_promise", "community_endorsement"],
      },
      {
        role: "youth_voter",
        persona: { riskTolerance: "medium", goal: "Engage with politics through social media, influenced by peers and trends", age: 21, country: "Indonesia", profession: "University Student", mbti: "ENFP", interestedTopics: ["technology", "environment", "social media", "entertainment"] },
        decisionFactors: ["social_trends", "peer_opinion", "meme_culture", "candidate_authenticity"],
      },
    ],
  },
  {
    id: "tech-journalist-pack",
    name: "Tech Journalist Pack",
    description: "Pre-built personas for technology and startup media",
    category: "social",
    personas: [
      {
        role: "independent_journalist",
        persona: { riskTolerance: "low", goal: "Report facts, investigate claims, provide balanced coverage", age: 33, country: "Indonesia", profession: "Tech Journalist", mbti: "INTJ", interestedTopics: ["startups", "venture capital", "IPO", "regulation"] },
        decisionFactors: ["newsworthiness", "source_credibility", "public_interest", "editorial_independence"],
      },
      {
        role: "twitter_user",
        persona: { riskTolerance: "medium", goal: "Share insights and analysis on tech and startup ecosystem", age: 29, country: "Indonesia", profession: "Tech Blogger", mbti: "ENTP", interestedTopics: ["AI", "fintech", "Web3", "startup funding"] },
        decisionFactors: ["trending_topics", "engagement", "thought_leadership"],
      },
      {
        role: "reddit_user",
        persona: { riskTolerance: "medium", goal: "Deep-dive analysis and community discussion on tech trends", age: 26, country: "Indonesia", profession: "Software Engineer", mbti: "INTP", interestedTopics: ["programming", "startups", "open source", "tech policy"] },
        decisionFactors: ["discussion_quality", "technical_accuracy", "community_consensus"],
      },
    ],
  },
  {
    id: "founder-pack",
    name: "Startup Founder Pack",
    description: "Pre-built personas for startup founders across stages",
    category: "investment",
    personas: [
      {
        role: "founder",
        persona: { riskTolerance: "high", goal: "Scale revenue and raise Series A within 12 months", age: 32, country: "Indonesia", profession: "CEO & Co-Founder", mbti: "ENTJ", interestedTopics: ["SaaS", "growth", "fundraising", "hiring"] },
        decisionFactors: ["cash_runway", "growth_target", "team_capability", "investor_interest", "market_timing"],
      },
      {
        role: "founder",
        persona: { riskTolerance: "medium", goal: "Achieve profitability and sustainable growth", age: 40, country: "Singapore", profession: "Founder & CTO", mbti: "INTJ", interestedTopics: ["product", "engineering", "automation", "efficiency"] },
        decisionFactors: ["unit_economics", "product_market_fit", "technical_debt", "team_retention"],
      },
    ],
  },
];

export function getPersonaPack(packId: string): PersonaPack | undefined {
  return PERSONA_PACKS.find(p => p.id === packId);
}

export function getPacksByCategory(category: string): PersonaPack[] {
  return PERSONA_PACKS.filter(p => p.category === category);
}

export function getAllPacks(): PersonaPack[] {
  return PERSONA_PACKS;
}
