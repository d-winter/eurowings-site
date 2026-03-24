import { NextRequest, NextResponse } from "next/server";
import { searchAirports } from "@/data/flights/airports";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }
  const results = searchAirports(query).slice(0, 10);
  return NextResponse.json(results);
}
