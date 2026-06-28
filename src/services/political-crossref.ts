import { logger } from "../lib/logger.js";

// ── Cross-Reference Pipeline: Political + Population Data ──
// Connects political-data.md ↔ population-data.md for enriched predictions

interface RegionPoliticalData {
  regionCode: string;
  totalVoters: number;
  turnout: number;
  swingIndex: number;
  dominantParty: string;
  competitiveness: number;
}

interface RegionPopulationData {
  totalPopulation: number;
  hdi: number;
  povertyRate: number;
  expenditurePc: number;
  youthPct: number;
  urbanPct: number;
}

interface CrossReferencedRegion {
  regionCode: string;
  name: string;
  political: RegionPoliticalData;
  population: RegionPopulationData;
  derived: {
    voterDensity: number;       // voters per 1000 population
    turnoutHdiCorrelation: number; // turnout × HDI
    swingVsYouth: number;       // swing index correlation with youth %
    campaignEfficiency: number; // reachable voters per Rp 1M spent
    riskScore: number;          // composite political + demographic risk
  };
}

export function crossReferenceRegion(
  regionCode: string,
  name: string,
  political: RegionPoliticalData,
  population: RegionPopulationData,
): CrossReferencedRegion {
  const voterDensity = Math.round((political.totalVoters / population.totalPopulation) * 1000);
  const turnoutHdiCorrelation = Math.round((political.turnout / 100) * population.hdi * 100);
  const swingVsYouth = Math.round(political.swingIndex * (population.youthPct / 100));
  const campaignEfficiency = Math.round((political.totalVoters * (political.swingIndex / 100)) / (population.expenditurePc / 1000000));
  const riskScore = Math.round(
    ((100 - political.turnout) * 0.3) +
    (political.swingIndex * 0.3) +
    (population.povertyRate * 0.2) +
    ((1 - population.hdi) * 100 * 0.2)
  );

  logger.info({ regionCode, voterDensity, riskScore }, "Cross-referenced region");

  return {
    regionCode, name, political, population,
    derived: { voterDensity, turnoutHdiCorrelation, swingVsYouth, campaignEfficiency, riskScore },
  };
}

export function getDefaultPoliticalData(regionCode: string): RegionPoliticalData {
  const data: Record<string, RegionPoliticalData> = {
    "31": { regionCode: "31", totalVoters: 8200000, turnout: 78, swingIndex: 25, dominantParty: "PDIP", competitiveness: 0.6 },
    "32": { regionCode: "32", totalVoters: 35000000, turnout: 72, swingIndex: 40, dominantParty: "Gerindra", competitiveness: 0.7 },
    "35": { regionCode: "35", totalVoters: 30000000, turnout: 70, swingIndex: 35, dominantParty: "PKB", competitiveness: 0.65 },
    "default": { regionCode: "00", totalVoters: 10000000, turnout: 75, swingIndex: 40, dominantParty: "Mixed", competitiveness: 0.6 },
  };
  return data[regionCode] || data.default!;
}

export function getDefaultPopulationData(regionCode: string): RegionPopulationData {
  const data: Record<string, RegionPopulationData> = {
    "31": { totalPopulation: 10670000, hdi: 0.81, povertyRate: 4.6, expenditurePc: 18000000, youthPct: 28, urbanPct: 100 },
    "32": { totalPopulation: 49700000, hdi: 0.72, povertyRate: 7.9, expenditurePc: 11000000, youthPct: 30, urbanPct: 72 },
    "35": { totalPopulation: 41000000, hdi: 0.72, povertyRate: 10.4, expenditurePc: 10500000, youthPct: 29, urbanPct: 55 },
    "default": { totalPopulation: 278000000, hdi: 0.72, povertyRate: 9.5, expenditurePc: 11000000, youthPct: 30, urbanPct: 57 },
  };
  return data[regionCode] || data.default!;
}

export function crossReferenceAllRegions(): CrossReferencedRegion[] {
  const regions = ["31", "32", "35"];
  return regions.map(code => {
    const political = getDefaultPoliticalData(code);
    const population = getDefaultPopulationData(code);
    const names: Record<string, string> = { "31": "DKI Jakarta", "32": "Jawa Barat", "35": "Jawa Timur" };
    return crossReferenceRegion(code, names[code] || code, political, population);
  });
}
