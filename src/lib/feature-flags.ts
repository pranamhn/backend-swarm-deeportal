// ── Feature Flags for Swarm Deeportal ──
// Simple env-var + DB override system (no external dependency)

type FlagValue = boolean | string | number;

interface FlagDefinition {
  key: string;
  defaultValue: FlagValue;
  description: string;
}

const FLAGS: FlagDefinition[] = [
  { key: "SOCIAL_SENTIMENT_MODE", defaultValue: true, description: "Enable Mode A: Social Sentiment prediction" },
  { key: "INVESTMENT_MODE", defaultValue: true, description: "Enable Mode B: Investment prediction" },
  { key: "POLITICAL_ELECTION", defaultValue: true, description: "Enable political election simulation" },
  { key: "IPO_PREDICTION", defaultValue: true, description: "Enable IPO readiness prediction" },
  { key: "MARKET_DYNAMICS", defaultValue: true, description: "Enable market dynamics simulation" },
  { key: "OASIS_SOCIAL_SIM", defaultValue: true, description: "Use OASIS Python scripts for social simulation" },
  { key: "DEEP_SEEK_REASONER", defaultValue: true, description: "Use deepseek-reasoner for agent decisions" },
  { key: "SSE_STREAMING", defaultValue: true, description: "Enable SSE real-time progress streaming" },
  { key: "COLLABORATIVE_MODE", defaultValue: false, description: "Enable multi-user collaborative predictions" },
  { key: "EXPORT_PDF", defaultValue: false, description: "Enable PDF report export" },
  { key: "ADVERSARIAL_AGENT", defaultValue: true, description: "Include adversarial (devil's advocate) agent" },
  { key: "AUTO_ML_CALIBRATION", defaultValue: false, description: "Enable Auto-ML weight calibration (needs 50+ outcomes)" },
  { key: "MAX_AGENTS_SOCIAL", defaultValue: 1000, description: "Max agents for social simulation" },
  { key: "MAX_AGENTS_INVESTMENT", defaultValue: 50, description: "Max agents for investment simulation" },
  { key: "MAX_LOOPS_SOCIAL", defaultValue: 15, description: "Max loops for social simulation" },
  { key: "MAX_LOOPS_INVESTMENT", defaultValue: 30, description: "Max loops for investment simulation" },
];

// In-memory overrides (can be set via admin API)
const overrides = new Map<string, FlagValue>();

// ── API ──
export function isEnabled(flagKey: string): boolean {
  // Check override first
  if (overrides.has(flagKey)) return !!overrides.get(flagKey);

  // Check env var
  const envVal = process.env[`SWARM_FF_${flagKey}`];
  if (envVal !== undefined) return envVal === "true" || envVal === "1";

  // Check default
  const flag = FLAGS.find(f => f.key === flagKey);
  return flag ? !!flag.defaultValue : false;
}

export function getFlag(flagKey: string): FlagValue {
  if (overrides.has(flagKey)) return overrides.get(flagKey)!;
  const envVal = process.env[`SWARM_FF_${flagKey}`];
  if (envVal !== undefined) return envVal;
  const flag = FLAGS.find(f => f.key === flagKey);
  return flag?.defaultValue ?? false;
}

export function setOverride(flagKey: string, value: FlagValue): void {
  overrides.set(flagKey, value);
}

export function removeOverride(flagKey: string): void {
  overrides.delete(flagKey);
}

export function getAllFlags(): { key: string; value: FlagValue; defaultValue: FlagValue; description: string }[] {
  return FLAGS.map(f => ({
    key: f.key,
    value: getFlag(f.key),
    defaultValue: f.defaultValue,
    description: f.description,
  }));
}

// ── Convenience ──
export const features = {
  get socialSentiment() { return isEnabled("SOCIAL_SENTIMENT_MODE"); },
  get investmentMode() { return isEnabled("INVESTMENT_MODE"); },
  get politicalElection() { return isEnabled("POLITICAL_ELECTION"); },
  get ipoPrediction() { return isEnabled("IPO_PREDICTION"); },
  get marketDynamics() { return isEnabled("MARKET_DYNAMICS"); },
  get oasisSocialSim() { return isEnabled("OASIS_SOCIAL_SIM"); },
  get deepSeekReasoner() { return isEnabled("DEEP_SEEK_REASONER"); },
  get sseStreaming() { return isEnabled("SSE_STREAMING"); },
  get collaborative() { return isEnabled("COLLABORATIVE_MODE"); },
  get exportPdf() { return isEnabled("EXPORT_PDF"); },
  get adversarialAgent() { return isEnabled("ADVERSARIAL_AGENT"); },
  get autoML() { return isEnabled("AUTO_ML_CALIBRATION"); },
};
