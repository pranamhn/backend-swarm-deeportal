import { logger } from "../lib/logger.js";

// ── Population-Swarm Integration ──
// Connects population data to existing prediction types for enriched scoring

interface PopulationContext {
  regionId: string;
  regionName: string;
  totalPopulation: number;
  urbanPct: number;
  hdi: number;
  povertyRate: number;
  expenditurePc: number;
  growthRate: number;
  density: number;
}

export function enrichPrediction(
  predictionType: string,
  populationContext: PopulationContext,
): Record<string, number> {
  const enrichment: Record<string, number> = {};

  switch (predictionType) {
    case "market_opportunity":
      enrichment.market_size_population = populationContext.totalPopulation;
      enrichment.market_density_score = Math.round(Math.min(100, populationContext.density / 100));
      enrichment.purchasing_power_index = Math.round(populationContext.expenditurePc / 10000);
      break;

    case "funding_signal":
      enrichment.addressable_market_size = populationContext.totalPopulation;
      enrichment.market_depth_score = Math.round(populationContext.hdi * 100);
      enrichment.consumer_base_quality = Math.round((1 - populationContext.povertyRate / 100) * 100);
      break;

    case "political_risk":
      enrichment.population_pressure = Math.round(populationContext.growthRate * 100);
      enrichment.urbanization_stress = Math.round(populationContext.urbanPct);
      enrichment.socioeconomic_stability = Math.round(populationContext.hdi * 100);
      break;

    case "regulation_impact":
      enrichment.population_affected = populationContext.totalPopulation;
      enrichment.urban_impact_pct = Math.round(populationContext.urbanPct);
      break;

    case "credit_risk":
      enrichment.regional_economic_health = Math.round(populationContext.hdi * 100);
      enrichment.poverty_exposure = Math.round(populationContext.povertyRate);
      break;

    case "talent_acquisition":
      enrichment.workforce_size = Math.round(populationContext.totalPopulation * 0.5);
      enrichment.education_proxy = Math.round(populationContext.hdi * 100);
      break;

    case "retention_risk":
      enrichment.labor_market_tightness = Math.round(populationContext.urbanPct / 2);
      enrichment.cost_of_living_pressure = Math.round(populationContext.expenditurePc / 10000);
      break;

    case "revenue_potential":
      enrichment.total_addressable_market = populationContext.totalPopulation;
      enrichment.segment_purchasing_power = Math.round(populationContext.expenditurePc / 12000 * 100);
      break;
  }

  logger.info({ predictionType, enrichment }, "Prediction enriched with population data");
  return enrichment;
}

export function getPopulationContextForRegion(regionCode: string): PopulationContext {
  // In production: fetch from population database
  // Mock data for now based on Indonesian regions
  const contexts: Record<string, PopulationContext> = {
    "31": { regionId: "31", regionName: "DKI Jakarta", totalPopulation: 10670000, urbanPct: 100, hdi: 0.81, povertyRate: 4.6, expenditurePc: 18000000, growthRate: 1.0, density: 16000 },
    "32": { regionId: "32", regionName: "Jawa Barat", totalPopulation: 49700000, urbanPct: 72, hdi: 0.72, povertyRate: 7.9, expenditurePc: 11000000, growthRate: 1.3, density: 1400 },
    "35": { regionId: "35", regionName: "Jawa Timur", totalPopulation: 41000000, urbanPct: 55, hdi: 0.72, povertyRate: 10.4, expenditurePc: 10500000, growthRate: 0.8, density: 860 },
    "34": { regionId: "34", regionName: "DI Yogyakarta", totalPopulation: 3700000, urbanPct: 68, hdi: 0.80, povertyRate: 11.0, expenditurePc: 12000000, growthRate: 1.1, density: 1200 },
    "33": { regionId: "33", regionName: "Jawa Tengah", totalPopulation: 37000000, urbanPct: 50, hdi: 0.72, povertyRate: 10.8, expenditurePc: 10000000, growthRate: 0.9, density: 1100 },
    "default": { regionId: "00", regionName: "Indonesia", totalPopulation: 278000000, urbanPct: 57, hdi: 0.72, povertyRate: 9.5, expenditurePc: 11000000, growthRate: 1.1, density: 145 },
  };

  return contexts[regionCode] || contexts.default;
}
