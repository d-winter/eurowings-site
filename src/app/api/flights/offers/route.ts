import { NextRequest, NextResponse } from "next/server";
import { getOffersForRoute } from "@/data/flights/offers";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.searchParams.get("origin")?.toUpperCase();
  const destination = request.nextUrl.searchParams.get("destination")?.toUpperCase();

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "Both origin and destination are required" },
      { status: 400 }
    );
  }

  const offers = getOffersForRoute(origin, destination);
  return NextResponse.json(offers);
}
