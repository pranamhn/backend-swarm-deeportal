import type { SwarmProject, Ontology } from "../types/swarm.js";
import { extractJSON } from "../lib/llm.js";
import { logger } from "../lib/logger.js";
import { v4 as uuid } from "uuid";

export async function generateOntology(project: SwarmProject): Promise<Ontology> {
  logger.info({ projectId: project.id, mode: project.mode }, "Generating ontology");

  const isSocial = project.mode === "social_sentiment";
  const isPolitical = isSocial && project.subType === "political_election";

  const domainContext = isPolitical
    ? `election type: ${project.electionType}, region: ${project.region}, candidates: ${JSON.stringify(project.candidates)}`
    : isSocial
      ? `social sentiment analysis on: ${project.seedTopics?.join(", ")}`
      : `${project.predictionType} prediction for ${project.targetEntity || "target entity"}`;

  const ontology = await extractJSON<Ontology>(
    domainContext,
    `You are an ontology designer for a ${isSocial ? "social sentiment" : "business prediction"} engine.
     Design entity types, relationship types, and confidence rules for this domain.
     ${isPolitical ? "Include political entities: Candidate, PoliticalParty, MediaOutlet, VoterSegment, Issue, Debate, Scandal." : ""}
     ${isSocial && !isPolitical ? "Include social media entities: Platform, Influencer, Narrative, Hashtag, SentimentTrend." : ""}`,
    JSON.stringify({
      entityTypes: [{ type: "string", attributes: ["string"], examples: ["string"] }],
      relationshipTypes: [{ type: "string", source: "string", target: "string" }],
      confidenceRules: { "string": "string" },
    })
  );

  return { ...ontology, projectId: project.id };

  // Fallback ontology if AI fails
  if (!ontology?.entityTypes?.length) {
    return getDefaultOntology(project);
  }
}

function getDefaultOntology(project: SwarmProject): Ontology {
  const isSocial = project.mode === "social_sentiment";
  const isPolitical = isSocial && project.subType === "political_election";

  return {
    projectId: project.id,
    entityTypes: isPolitical
      ? [
          { type: "Candidate", attributes: ["name", "party", "electability"], examples: ["Candidate A"] },
          { type: "PoliticalParty", attributes: ["name", "ideology", "seatCount"], examples: ["PDIP", "Gerindra"] },
          { type: "VoterSegment", attributes: ["demographic", "region", "size"], examples: ["Urban Youth", "Rural Farmers"] },
          { type: "Issue", attributes: ["name", "sentiment", "priority"], examples: ["Economy", "Corruption"] },
          { type: "MediaOutlet", attributes: ["name", "bias", "reach"], examples: ["Kompas", "Detik"] },
          { type: "Influencer", attributes: ["name", "followers", "alignment"], examples: ["@political_pundit"] },
          { type: "Debate", attributes: ["date", "topic", "viewership"], examples: ["Debate 1: Economy"] },
          { type: "Scandal", attributes: ["type", "severity", "candidate"], examples: ["Corruption allegation"] },
        ]
      : isSocial
        ? [
            { type: "Platform", attributes: ["name", "userCount", "demographic"], examples: ["Twitter/X", "Reddit"] },
            { type: "Influencer", attributes: ["name", "followers", "niche"], examples: ["@tech_influencer"] },
            { type: "Narrative", attributes: ["topic", "sentiment", "volume"], examples: ["IPO bullish"] },
            { type: "Hashtag", attributes: ["name", "count", "momentum"], examples: ["#TechIPO2026"] },
            { type: "Topic", attributes: ["name", "sentiment", "engagement"], examples: ["HR Tech"] },
          ]
        : [
            { type: "Company", attributes: ["name", "sector", "stage"], examples: ["Example SaaS"] },
            { type: "Founder", attributes: ["name", "background"], examples: ["John Doe"] },
            { type: "Investor", attributes: ["name", "fundType", "checkSize"], examples: ["Seed VC"] },
            { type: "Market", attributes: ["name", "size", "growthRate"], examples: ["HR Tech"] },
            { type: "Metric", attributes: ["name", "value", "trend"], examples: ["Monthly Revenue"] },
            { type: "RiskFactor", attributes: ["name", "severity"], examples: ["Competition"] },
          ],
    relationshipTypes: isPolitical
      ? [
          { type: "represents", source: "Candidate", target: "PoliticalParty" },
          { type: "supports", source: "VoterSegment", target: "Candidate" },
          { type: "covers", source: "MediaOutlet", target: "Issue" },
          { type: "influences", source: "Influencer", target: "VoterSegment" },
          { type: "participates_in", source: "Candidate", target: "Debate" },
          { type: "damages", source: "Scandal", target: "Candidate" },
        ]
      : isSocial
        ? [
            { type: "posts_on", source: "Influencer", target: "Platform" },
            { type: "spreads", source: "Influencer", target: "Narrative" },
            { type: "contains", source: "Narrative", target: "Topic" },
            { type: "trends_on", source: "Hashtag", target: "Platform" },
          ]
        : [
            { type: "founded_by", source: "Company", target: "Founder" },
            { type: "operates_in", source: "Company", target: "Market" },
            { type: "has_metric", source: "Company", target: "Metric" },
            { type: "invested_in", source: "Investor", target: "Company" },
            { type: "competes_with", source: "Company", target: "Company" },
          ],
    confidenceRules: {
      entity_extraction: "high if > 2 independent mentions",
      relationship_extraction: "medium if inferred, high if explicit",
    },
  };
}
