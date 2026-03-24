import { NextRequest, NextResponse } from "next/server";
import { HUB_ROUTES } from "@/data/flights/routes";
import { getAirport } from "@/data/flights/airports";
import type { FlightRoute, OriginHub } from "@/data/flights/types";
import { ORIGIN_HUBS } from "@/data/flights/types";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.searchParams.get("origin")?.toUpperCase();
  if (!origin || !ORIGIN_HUBS.includes(origin as OriginHub)) {
    return NextResponse.json(
      { error: "Invalid or missing origin. Use one of: " + ORIGIN_HUBS.join(", ") },
      { status: 400 }
    );
  }

  const routes = HUB_ROUTES[origin as OriginHub] || [];
  const result: FlightRoute[] = routes
    .map((r) => {
      const dest = getAirport(r.destination);
      if (!dest) return null;
      return {
        destination: dest,
        segment: r.segment,
        lowestPrice: r.basePrice,
        currency: "EUR",
      };
    })
    .filter((r): r is FlightRoute => r !== null);

  return NextResponse.json(result);
}
