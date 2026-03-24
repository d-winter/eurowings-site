import type { FlightOfferFlat } from "./types";
import { HUB_ROUTES } from "./routes";

const AIRLINES = [
  { name: "Eurowings", code: "EW" },
  { name: "Lufthansa", code: "LH" },
  { name: "Ryanair", code: "FR" },
  { name: "easyJet", code: "U2" },
  { name: "Wizz Air", code: "W6" },
] as const;

// Seeded pseudo-random for deterministic results
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getOffersForRoute(
  origin: string,
  destination: string
): FlightOfferFlat[] {
  const hubRoutes = HUB_ROUTES[origin as keyof typeof HUB_ROUTES];
  if (!hubRoutes) return [];

  const route = hubRoutes.find((r) => r.destination === destination);
  if (!route) return [];

  const rand = seededRandom(simpleHash(`${origin}-${destination}`));
  const offerCount = 3 + Math.floor(rand() * 3); // 3-5 offers
  const offers: FlightOfferFlat[] = [];

  for (let i = 0; i < offerCount; i++) {
    const airline = AIRLINES[Math.floor(rand() * AIRLINES.length)];
    const hour = 6 + Math.floor(rand() * 14); // 06:00-20:00
    const minute = Math.floor(rand() * 4) * 15; // 00, 15, 30, 45
    const durationHours = 1 + Math.floor(rand() * 3);
    const durationMinutes = Math.floor(rand() * 4) * 15;
    const arrHour =
      hour + durationHours + (minute + durationMinutes >= 60 ? 1 : 0);
    const arrMinute = (minute + durationMinutes) % 60;
    const priceVariation = 0.8 + rand() * 0.8; // 80%-160% of base
    const dayOffset = Math.floor(rand() * 14) + 1; // 1-14 days from now

    const date = new Date();
    date.setDate(date.getDate() + dayOffset);

    offers.push({
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code} ${1000 + Math.floor(rand() * 9000)}`,
      departureAirport: origin,
      departureTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      arrivalAirport: destination,
      arrivalTime: `${String(arrHour % 24).padStart(2, "0")}:${String(arrMinute).padStart(2, "0")}`,
      duration: `${durationHours}h ${durationMinutes > 0 ? `${durationMinutes}m` : "00m"}`,
      price: Math.round(route.basePrice * priceVariation * 100) / 100,
      currency: "EUR",
      date: date.toISOString().split("T")[0] ?? "",
    });
  }

  return offers.sort((a, b) => a.price - b.price);
}
