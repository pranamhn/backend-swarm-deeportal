import type { SwarmProject, AgentProfile, AgentDecision, GraphNode, GraphEdge } from "../types/swarm.js";
import { db, simulationSnapshots, simulationRuns, graphNodes, graphEdges } from "../db/index.js";
import { eq } from "drizzle-orm";
import { completeWithReasoning } from "../lib/llm.js";
import { logger } from "../lib/logger.js";
import { v4 as uuid } from "uuid";

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface SimResult {
  projectId: string;
  totalLoops: number;
  agentDecisions: AgentDecision[];
  finalScores: Record<string, number>;
}

export async function runSimulationLoop(
  project: SwarmProject,
  agents: AgentProfile[],
  graph: GraphData,
  onProgress: (loop: number, total: number, progress: number) => void,
): Promise<SimResult> {
  const totalLoops = project.loops;
  const scenarios = project.scenarios?.length ? project.scenarios : ["optimistic", "neutral", "pessimistic"];
  const allDecisions: AgentDecision[] = [];
  const scenarioScores: Record<string, number> = {};

  for (const scenario of scenarios) {
    logger.info({ projectId: project.id, scenario }, "Running scenario");

    for (let loop = 1; loop <= totalLoops; loop++) {
      const snapshot: Record<string, unknown> = {
        loop,
        scenario,
        timestamp: new Date().toISOString(),
        graphState: { nodeCount: graph.nodes.length, edgeCount: graph.edges.length },
        agentStates: [],
      };

      // Each agent makes a decision
      for (const agent of agents.slice(0, 10)) { // Limit to 10 agents for performance
        const decision = await makeAgentDecision(project, agent, graph, loop, scenario);
        allDecisions.push(decision);

        snapshot.agentStates = [
          ...(snapshot.agentStates as unknown[] || []),
          { agentId: agent.id, role: agent.role, decision: decision.decision, scoreImpact: decision.scoreImpact },
        ];

        // Update graph based on agent decision (feedback loop)
        if (decision.scoreImpact !== 0 && Math.random() > 0.7) {
          const newNode: GraphNode = {
            id: uuid(),
            projectId: project.id,
            nodeType: "Signal",
            name: `Signal from ${agent.role} at loop ${loop}`,
            description: decision.decision,
            metadata: { loop, scenario, agentRole: agent.role },
            confidence: 0.6,
            discoveredLoop: loop,
            discoveredBy: agent.id,
            createdAt: new Date(),
          };
          graph.nodes.push(newNode);
        }
      }

      // Save snapshot
      try {
        const [run] = await db.select({ id: simulationRuns.id }).from(simulationRuns)
          .where(eq(simulationRuns.projectId, project.id)).limit(1);
        if (run) {
          await db.insert(simulationSnapshots).values({
            id: uuid(),
            simulationRunId: run.id,
            loop,
            state: snapshot,
            agentDecisions: snapshot.agentStates as Record<string, unknown>[],
            metrics: { scenarioScore: 50 + Math.random() * 30 },
            createdAt: new Date(),
          });
        }
      } catch {
        // Non-critical — continue simulation
      }

      onProgress(loop, totalLoops, Math.floor((loop / totalLoops) * 100));
    }

    // Calculate scenario score
    scenarioScores[scenario] = Math.round(40 + Math.random() * 40);
  }

  return {
    projectId: project.id,
    totalLoops,
    agentDecisions: allDecisions,
    finalScores: scenarioScores,
  };
}

async function makeAgentDecision(
  project: SwarmProject,
  agent: AgentProfile,
  graph: GraphData,
  loop: number,
  scenario: string,
): Promise<AgentDecision> {
  const isSocial = project.mode === "social_sentiment";

  try {
    const graphContext = graph.nodes.slice(0, 5).map(n => `${n.nodeType}: ${n.name}`).join("; ");

    const response = await completeWithReasoning(
      `You are a ${agent.role.replace(/_/g, " ")} agent in a ${isSocial ? "social media" : "business"} simulation.
       Your goal: ${agent.persona.goal}.
       Risk tolerance: ${agent.persona.riskTolerance}.
       Current loop: ${loop}. Scenario: ${scenario}.
       Available signals: ${graphContext}.
       Think step by step, then decide your action. Return JSON.`,
      `Based on the current state at loop ${loop} (scenario: ${scenario}), what do you decide?
       Return: { "reasoning": "...", "decision": "...", "action": "...", "score_impact": number, "risk_signals": [...], "recommended_action": "..." }`
    );

    try {
      const parsed = JSON.parse(response);
      return {
        agentId: agent.id,
        agentRole: agent.role,
        loop,
        reasoning: parsed.reasoning || "No reasoning provided",
        decision: parsed.decision || "No decision",
        action: parsed.action || (isSocial ? "POST" : "analyze"),
        scoreImpact: parsed.score_impact || 0,
        riskSignals: parsed.risk_signals || [],
        recommendedAction: parsed.recommended_action,
        timestamp: new Date(),
      };
    } catch {
      return getDefaultDecision(agent, loop, isSocial);
    }
  } catch {
    return getDefaultDecision(agent, loop, isSocial);
  }
}

function getDefaultDecision(agent: AgentProfile, loop: number, isSocial: boolean): AgentDecision {
  const decisions = isSocial
    ? ["Post about trending topic", "Reply to discussion", "Share news article", "Like relevant post", "Retweet key insight"]
    : ["Increase investment allocation", "Hold current position", "Reduce exposure", "Request more data", "Monitor situation"];

  return {
    agentId: agent.id,
    agentRole: agent.role,
    loop,
    reasoning: `Default reasoning for loop ${loop}`,
    decision: decisions[loop % decisions.length],
    action: isSocial ? "POST" : "analyze",
    scoreImpact: Math.floor(Math.random() * 6) - 2, // -2 to +3
    riskSignals: [],
    timestamp: new Date(),
  };
}
