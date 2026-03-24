"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import RouteCard from "./RouteCard";
import type { FlightRoute } from "@/data/flights/types";
import { DE_CITY_NAMES } from "@/data/flights/airports";

interface RouteGridProps {
  origin: string;
}

function SkeletonCard() {
  return (
    <div className="flex animate-pulse items-center justify-between rounded-xl border border-gray-100 border-l-[3px] border-l-gray-200 bg-white p-4 shadow-sm">
      <div className="flex-1 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="h-5 w-28 rounded bg-gray-200" />
          <div className="h-4 w-8 rounded bg-gray-100" />
        </div>
        <div className="h-4 w-16 rounded bg-gray-100" />
        <div className="h-5 w-14 rounded-full bg-gray-100" />
      </div>
      <div className="space-y-1 text-right">
        <div className="h-3 w-10 rounded bg-gray-100" />
        <div className="h-6 w-16 rounded bg-gray-200" />
      </div>
    </div>
  );
}

const SEGMENT_ICONS: Record<string, string> = {
  all: "",
  "city-trip": "\ud83c\udfd9\ufe0f",
  "beach-holiday": "\ud83c\udfd6\ufe0f",
  adventure: "\u26f0\ufe0f",
};

const SEGMENT_KEYS: Record<string, string> = {
  all: "allDestinations",
  "city-trip": "cityTrips",
  "beach-holiday": "beachHolidays",
  adventure: "adventure",
};

export default function RouteGrid({ origin }: RouteGridProps) {
  const [routes, setRoutes] = useState<FlightRoute[]>([]);
  const [loadedOrigin, setLoadedOrigin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("explore");

  useEffect(() => {
    // Skip fetch + animation if we already have routes for this origin
    if (loadedOrigin === origin && routes.length > 0) {
      setLoading(false);
      setVisible(true);
      return;
    }

    const isFirstLoad = loadedOrigin === null;
    setLoading(true);
    setVisible(false);
    setFilter("all");

    fetch(`/api/flights/routes?origin=${encodeURIComponent(origin)}`)
      .then((res) => res.json())
      .then((data: FlightRoute[]) => {
        const delay = isFirstLoad ? 800 : 0;
        setTimeout(() => {
          setRoutes(data);
          setLoadedOrigin(origin);
          setLoading(false);
          requestAnimationFrame(() => setVisible(true));
        }, delay);
      })
      .catch(() => {
        setTimeout(() => setLoading(false), isFirstLoad ? 800 : 0);
      });
  }, [origin, loadedOrigin, routes.length]);

  const filtered = filter === "all" ? routes : routes.filter((r) => r.segment === filter);

  function localizedCity(iataCode: string, englishCity: string): string {
    if (locale === "de" || locale === "de_AT") {
      return DE_CITY_NAMES[iataCode] || englishCity;
    }
    return englishCity;
  }

  function handleRouteClick(route: FlightRoute) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("origin", origin);
    params.set("destination", route.destination.iataCode);
    params.set("segment", route.segment);
    router.push(`/destinations?${params.toString()}`);
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6 flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-32 animate-pulse rounded-full bg-gray-100" />
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const segments = ["all", "city-trip", "beach-holiday", "adventure"];

  return (
    <div>
      {/* Segment filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {segments.map((s) => {
          const count = s === "all" ? routes.length : routes.filter((r) => r.segment === s).length;
          const isActive = filter === s;
          return (
            <button
              key={s}
              onClick={() => { setVisible(false); setFilter(s); requestAnimationFrame(() => setVisible(true)); }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-ew-primary text-white shadow-sm shadow-ew-primary/25"
                  : "bg-white text-ew-grey ring-1 ring-gray-200 hover:bg-gray-50 hover:text-ew-dark"
              }`}
            >
              {SEGMENT_ICONS[s] && <span className="text-xs">{SEGMENT_ICONS[s]}</span>}
              {t(SEGMENT_KEYS[s] as "allDestinations" | "cityTrips" | "beachHolidays" | "adventure")}
              <span className={`ml-0.5 text-xs ${isActive ? "text-white/70" : "text-ew-grey/60"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-ew-grey">
        {t("destinationsFound", { count: filtered.length })}
      </p>

      {/* Route cards grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((route, index) => (
          <div
            key={route.destination.iataCode}
            className="transition-all duration-500 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transitionDelay: `${Math.min(index * 40, 400)}ms`,
            }}
          >
            <RouteCard
              city={localizedCity(route.destination.iataCode, route.destination.city)}
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
