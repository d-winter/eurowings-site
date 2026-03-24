import type { TravelSegment, OriginHub } from "./types";

interface RouteDefinition {
  destination: string; // IATA code
  segment: TravelSegment;
  basePrice: number; // EUR, lowest one-way
}

// Per-hub price offset seeds — small multipliers so prices look distinct by origin
const HUB_PRICE_OFFSETS: Record<OriginHub, number> = {
  CGN: 1.00,
  DUS: 1.02,
  BER: 0.97,
  STR: 1.05,
  HAM: 1.03,
  MUC: 0.98,
};

// Beach destinations — all 27 codes
const BEACH_DESTINATIONS: RouteDefinition[] = [
  { destination: "PMI", segment: "beach-holiday", basePrice: 39.99 },
  { destination: "HER", segment: "beach-holiday", basePrice: 69.99 },
  { destination: "FAO", segment: "beach-holiday", basePrice: 49.99 },
  { destination: "AYT", segment: "beach-holiday", basePrice: 79.99 },
  { destination: "IBZ", segment: "beach-holiday", basePrice: 44.99 },
  { destination: "SPU", segment: "beach-holiday", basePrice: 54.99 },
  { destination: "CFU", segment: "beach-holiday", basePrice: 74.99 },
  { destination: "RHO", segment: "beach-holiday", basePrice: 79.99 },
  { destination: "KGS", segment: "beach-holiday", basePrice: 84.99 },
  { destination: "TFS", segment: "beach-holiday", basePrice: 89.99 },
  { destination: "FUE", segment: "beach-holiday", basePrice: 94.99 },
  { destination: "LPA", segment: "beach-holiday", basePrice: 92.99 },
  { destination: "OLB", segment: "beach-holiday", basePrice: 59.99 },
  { destination: "CAG", segment: "beach-holiday", basePrice: 64.99 },
  { destination: "BRI", segment: "beach-holiday", basePrice: 49.99 },
  { destination: "NAP", segment: "beach-holiday", basePrice: 54.99 },
  { destination: "CHQ", segment: "beach-holiday", basePrice: 72.99 },
  { destination: "ZTH", segment: "beach-holiday", basePrice: 77.99 },
  { destination: "PFO", segment: "beach-holiday", basePrice: 69.99 },
  { destination: "SSH", segment: "beach-holiday", basePrice: 109.99 },
  { destination: "HRG", segment: "beach-holiday", basePrice: 104.99 },
  { destination: "BGY", segment: "beach-holiday", basePrice: 34.99 },
  { destination: "SKG", segment: "beach-holiday", basePrice: 67.99 },
  { destination: "MLA", segment: "beach-holiday", basePrice: 59.99 },
  { destination: "DBV", segment: "beach-holiday", basePrice: 64.99 },
  { destination: "BOJ", segment: "beach-holiday", basePrice: 74.99 },
  { destination: "VAR", segment: "beach-holiday", basePrice: 72.99 },
];

// City-trip destinations — all 28 codes
const CITY_DESTINATIONS: RouteDefinition[] = [
  { destination: "BCN", segment: "city-trip", basePrice: 29.99 },
  { destination: "LIS", segment: "city-trip", basePrice: 49.99 },
  { destination: "PRG", segment: "city-trip", basePrice: 24.99 },
  { destination: "BUD", segment: "city-trip", basePrice: 27.99 },
  { destination: "VIE", segment: "city-trip", basePrice: 22.99 },
  { destination: "FCO", segment: "city-trip", basePrice: 39.99 },
  { destination: "MXP", segment: "city-trip", basePrice: 34.99 },
  { destination: "LHR", segment: "city-trip", basePrice: 54.99 },
  { destination: "CDG", segment: "city-trip", basePrice: 44.99 },
  { destination: "CPH", segment: "city-trip", basePrice: 49.99 },
  { destination: "ARN", segment: "city-trip", basePrice: 59.99 },
  { destination: "ATH", segment: "city-trip", basePrice: 54.99 },
  { destination: "IST", segment: "city-trip", basePrice: 64.99 },
  { destination: "DUB", segment: "city-trip", basePrice: 59.99 },
  { destination: "EDI", segment: "city-trip", basePrice: 64.99 },
  { destination: "GVA", segment: "city-trip", basePrice: 44.99 },
  { destination: "ZRH", segment: "city-trip", basePrice: 42.99 },
  { destination: "WAW", segment: "city-trip", basePrice: 29.99 },
  { destination: "KRK", segment: "city-trip", basePrice: 27.99 },
  { destination: "OPO", segment: "city-trip", basePrice: 52.99 },
  { destination: "TXL", segment: "city-trip", basePrice: 19.99 },
  { destination: "SOF", segment: "city-trip", basePrice: 34.99 },
  { destination: "BEG", segment: "city-trip", basePrice: 37.99 },
  { destination: "ZAG", segment: "city-trip", basePrice: 32.99 },
  { destination: "TLL", segment: "city-trip", basePrice: 54.99 },
  { destination: "RIX", segment: "city-trip", basePrice: 49.99 },
  { destination: "VNO", segment: "city-trip", basePrice: 47.99 },
  { destination: "GDN", segment: "city-trip", basePrice: 29.99 },
];

// Adventure destinations — all 13 codes
const ADVENTURE_DESTINATIONS: RouteDefinition[] = [
  { destination: "KEF", segment: "adventure", basePrice: 89.99 },
  { destination: "BGO", segment: "adventure", basePrice: 59.99 },
  { destination: "TOS", segment: "adventure", basePrice: 99.99 },
  { destination: "INN", segment: "adventure", basePrice: 34.99 },
  { destination: "SZG", segment: "adventure", basePrice: 32.99 },
  { destination: "TIV", segment: "adventure", basePrice: 54.99 },
  { destination: "KTT", segment: "adventure", basePrice: 119.99 },
  { destination: "LYR", segment: "adventure", basePrice: 149.99 },
  { destination: "EVE", segment: "adventure", basePrice: 109.99 },
  { destination: "BLL", segment: "adventure", basePrice: 44.99 },
  { destination: "TRD", segment: "adventure", basePrice: 79.99 },
  { destination: "SVG", segment: "adventure", basePrice: 69.99 },
  { destination: "RVN", segment: "adventure", basePrice: 129.99 },
];

const ALL_DESTINATIONS: RouteDefinition[] = [
  ...BEACH_DESTINATIONS,
  ...CITY_DESTINATIONS,
  ...ADVENTURE_DESTINATIONS,
];

function buildHubRoutes(hub: OriginHub): RouteDefinition[] {
  const offset = HUB_PRICE_OFFSETS[hub];
  return ALL_DESTINATIONS
    .filter((route) => route.destination !== hub)
    .map((route) => ({
      ...route,
      basePrice: Math.round(route.basePrice * offset * 100) / 100,
    }));
}

export const HUB_ROUTES: Record<OriginHub, RouteDefinition[]> = {
  CGN: buildHubRoutes("CGN"),
  DUS: buildHubRoutes("DUS"),
  BER: buildHubRoutes("BER"),
  STR: buildHubRoutes("STR"),
  HAM: buildHubRoutes("HAM"),
  MUC: buildHubRoutes("MUC"),
};
