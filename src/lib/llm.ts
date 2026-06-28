import OpenAI from "openai";
import { config } from "../config.js";
import { logger } from "./logger.js";

// ── DeepSeek Client (Primary) ──
export const deepseek = new OpenAI({
  apiKey: config.ai.deepseek.apiKey,
  baseURL: config.ai.deepseek.baseUrl,
});

// ── OpenAI Client (Fallback) ──
export const openai = config.ai.openai.apiKey
  ? new OpenAI({ apiKey: config.ai.openai.apiKey })
  : null;

// ── Model Selection ──
export function getModel(preferReasoner = false): { client: OpenAI; model: string } {
  const hasDeepSeek = !!config.ai.deepseek.apiKey;
  const hasOpenAI = !!config.ai.openai.apiKey;

  if (hasDeepSeek) {
    return {
      client: deepseek,
      model: preferReasoner ? config.ai.deepseek.reasoner : config.ai.deepseek.model,
    };
  }

  if (hasOpenAI && openai) {
    return { client: openai, model: config.ai.openai.model };
  }

  throw new Error("No AI provider configured. Set DEEPSEEK_API_KEY or OPENAI_API_KEY.");
}

// ── JSON Extraction ──
export async function extractJSON<T>(
  prompt: string,
  systemPrompt: string,
  schema: string,
): Promise<T> {
  const { client, model } = getModel(false);

  logger.info({ model }, "AI extraction started");

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: `${systemPrompt}\n\nReturn ONLY valid JSON matching this schema:\n${schema}` },
      { role: "user", content: prompt },
    ],
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");

  return JSON.parse(content) as T;
}

// ── Text Completion (with reasoning for agent decisions) ──
export async function completeWithReasoning(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const { client, model } = getModel(true);

  logger.info({ model }, "AI reasoning started");

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.4,
  });

  return response.choices[0]?.message?.content || "";
}
