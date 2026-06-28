import type { SwarmProject, GraphNode, GraphEdge, Ontology } from "../types/swarm.js";
import { db, graphNodes, graphEdges } from "../db/index.js";
import { extractJSON } from "../lib/llm.js";
import { logger } from "../lib/logger.js";
import { v4 as uuid } from "uuid";

interface GraphBuildResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export async function buildKnowledgeGraph(project: SwarmProject, ontology: Ontology): Promise<GraphBuildResult> {
  logger.info({ projectId: project.id }, "Building knowledge graph");

  const isSocial = project.mode === "social_sentiment";
  const isPolitical = isSocial && project.subType === "political_election";

  const seedContext = isPolitical
    ? `Election: ${project.electionType} in ${project.region}. Candidates: ${JSON.stringify(project.candidates)}. Topics: ${project.seedTopics?.join(", ")}`
    : isSocial
      ? `Topics: ${project.seedTopics?.join(", ")}`
      : `${project.predictionType}: ${project.objective || ""}. Target: ${project.targetEntity || ""}`;

  try {
    const extracted = await extractJSON<{ nodes: Partial<GraphNode>[]; edges: Partial<GraphEdge>[] }>(
      seedContext,
      `Build a knowledge graph for this ${isSocial ? "social sentiment" : "business prediction"} project.
       Entity types available: ${ontology.entityTypes.map(e => e.type).join(", ")}.
       Relationship types available: ${ontology.relationshipTypes.map(r => r.type).join(", ")}.
       Extract all relevant entities and their relationships.`,
      JSON.stringify({
        nodes: [{ name: "string", nodeType: "string", description: "string", confidence: 0.8 }],
        edges: [{ sourceNodeId: "index", targetNodeId: "index", relationshipType: "string", weight: 0.7 }],
      })
    );

    const nodes: GraphNode[] = (extracted.nodes || []).map((n, i) => ({
      id: uuid(),
      projectId: project.id,
      nodeType: (n.nodeType || ontology.entityTypes[0]?.type || "Metric") as GraphNode["nodeType"],
      name: n.name || `Node ${i + 1}`,
      description: n.description,
      metadata: {},
      confidence: n.confidence || 0.7,
      createdAt: new Date(),
    }));

    const edges: GraphEdge[] = (extracted.edges || []).map((e) => ({
      id: uuid(),
      projectId: project.id,
      sourceNodeId: nodes[parseInt(String(e.sourceNodeId))]?.id || nodes[0]?.id || uuid(),
      targetNodeId: nodes[parseInt(String(e.targetNodeId))]?.id || nodes[0]?.id || uuid(),
      relationshipType: (e.relationshipType || ontology.relationshipTypes[0]?.type || "related_to") as GraphEdge["relationshipType"],
      weight: e.weight || 0.5,
      confidence: e.confidence || 0.5,
      createdAt: new Date(),
    })).filter(e => e.sourceNodeId !== e.targetNodeId);

    // Persist to DB
    if (nodes.length) await db.insert(graphNodes).values(nodes);
    if (edges.length) await db.insert(graphEdges).values(edges);

    return { nodes, edges };
  } catch {
    // Fallback: create minimal graph from ontology
    logger.warn({ projectId: project.id }, "AI extraction failed, using default graph");
    return buildDefaultGraph(project, ontology);
  }
}

function buildDefaultGraph(project: SwarmProject, ontology: Ontology): GraphBuildResult {
  const nodes: GraphNode[] = ontology.entityTypes.map((et) => ({
    id: uuid(),
    projectId: project.id,
    nodeType: et.type as GraphNode["nodeType"],
    name: et.examples[0] || et.type,
    description: `Default ${et.type} node`,
    metadata: {},
    confidence: 0.5,
    createdAt: new Date(),
  }));

  const edges: GraphEdge[] = ontology.relationshipTypes.slice(0, nodes.length).map((rt, i) => ({
    id: uuid(),
    projectId: project.id,
    sourceNodeId: nodes[i]?.id || nodes[0]?.id,
    targetNodeId: nodes[(i + 1) % nodes.length]?.id || nodes[0]?.id,
    relationshipType: rt.type as GraphEdge["relationshipType"],
    weight: 0.5,
    confidence: 0.4,
    createdAt: new Date(),
  }));

  return { nodes, edges };
}
