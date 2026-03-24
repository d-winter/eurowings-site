"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RouteCard from "./RouteCard";
import type { FlightRoute } from "@/data/flights/types";

interface RouteGridProps {
  origin: string;
}

function SkeletonCard() {
  return (
    <div className="flex animate-pulse items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex-1">
        <div className="h-5 w-32 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-24 rounded bg-gray-100" />
        <div className="mt-2 h-5 w-16 rounded-full bg-gray-100" />
      </div>
      <div className="text-right">
        <div className="h-3 w-10 rounded bg-gray-100" />
        <div className="mt-1 h-6 w-16 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function RouteGrid({ origin }: RouteGridProps) {
  const [routes, setRoutes] = useState<FlightRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);
    setVisible(false);
    setFilter("all");

    fetch(`/api/flights/routes?origin=${encodeURIComponent(origin)}`)
      .then((res) => res.json())
      .then((data: FlightRoute[]) => {
        // Artificial delay to simulate remote source latency
        setTimeout(() => {
          setRoutes(data);
          setLoading(false);
          // Stagger the fade-in after data loads
          requestAnimationFrame(() => setVisible(true));
        }, 800);
      })
      .catch(() => {
        setTimeout(() => setLoading(false), 800);
      });
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
    return (
      <div>
        {/* Skeleton filter pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-28 animate-pulse rounded-full bg-gray-100" />
          ))}
        </div>
        {/* Skeleton cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
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
        {filtered.map((route, index) => (
          <div
            key={route.destination.iataCode}
            className="transition-all duration-500 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transitionDelay: `${Math.min(index * 50, 500)}ms`,
            }}
          >
            <RouteCard
              city={route.destination.city}
              country={route.destination.country}
              iataCode={route.destination.iataCode}
              segment={route.segment}
              lowestPrice={route.lowestPrice}
              currency={route.currency}
              onClick={() => handleRouteClick(route)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
