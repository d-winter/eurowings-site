"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RouteCard from "./RouteCard";
import type { FlightRoute } from "@/data/flights/types";

interface RouteGridProps {
  origin: string;
}

export default function RouteGrid({ origin }: RouteGridProps) {
  const [routes, setRoutes] = useState<FlightRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/flights/routes?origin=${encodeURIComponent(origin)}`)
      .then((res) => res.json())
      .then((data: FlightRoute[]) => {
        setRoutes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [origin]);

  const filtered = filter === "all" ? routes : routes.filter((r) => r.segment === filter);

  function handleRouteClick(route: FlightRoute) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("origin", origin);
    params.set("destination", route.destination.iataCode);
    params.set("segment", route.segment);
    router.push(`?${params.toString()}`);
  }

  if (loading) {
    return <div className="py-12 text-center text-ew-grey">Loading destinations...</div>;
  }

  const segments = ["all", "city-trip", "beach-holiday", "adventure"];
  const segmentLabels: Record<string, string> = {
    all: "All",
    "city-trip": "City Trips",
    "beach-holiday": "Beach Holidays",
    adventure: "Adventure",
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {segments.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === s
                ? "bg-ew-primary text-white"
                : "bg-gray-100 text-ew-grey hover:bg-gray-200"
            }`}
          >
            {segmentLabels[s]} ({s === "all" ? routes.length : routes.filter((r) => r.segment === s).length})
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((route) => (
          <RouteCard
            key={route.destination.iataCode}
            city={route.destination.city}
            country={route.destination.country}
            iataCode={route.destination.iataCode}
            segment={route.segment}
            lowestPrice={route.lowestPrice}
            currency={route.currency}
            onClick={() => handleRouteClick(route)}
          />
        ))}
      </div>
    </div>
  );
}
