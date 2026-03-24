"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import AirportSearch from "@/components/AirportSearch";
import RouteGrid from "@/components/RouteGrid";
import DestinationLanding from "@/components/DestinationLanding";
import type { DestinationLandingPageData, Segment } from "@/lib/types";
import type { FlightAirport } from "@/data/flights/types";

interface ExploreClientProps {
  landingPage: DestinationLandingPageData | null;
  destinationCode: string;
  segments: Segment[];
  locale: string;
  isDraft: boolean;
}

export default function ExploreClient({
  landingPage,
  destinationCode,
}: ExploreClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const segment = searchParams.get("segment");
  const [selectedOrigin, setSelectedOrigin] = useState<FlightAirport | null>(null);
  const [destinationCity, setDestinationCity] = useState("");

  // Use local state for immediate UI update; URL param as fallback after navigation
  const activeOrigin = selectedOrigin?.iataCode || origin;

  const handleOriginSelect = useCallback(
    (airport: FlightAirport) => {
      setSelectedOrigin(airport);
      const params = new URLSearchParams();
      params.set("origin", airport.iataCode);
      router.push(`?${params.toString()}`);
    },
    [router]
  );

  function handleBack() {
    if (origin) {
      const params = new URLSearchParams();
      params.set("origin", origin);
      router.push(`?${params.toString()}`);
    } else {
      router.push("?");
    }
  }

  // Landing view — destination selected
  if (destination && segment && landingPage) {
    return (
      <div>
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
            className="text-sm text-ew-primary hover:underline"
          >
            &larr; Back to destinations
          </button>
        </div>
        <DestinationLanding
          page={landingPage}
          destinationCity={destinationCity || destinationCode}
          destinationCode={destinationCode}
        />
      </div>
    );
  }

  // Search view — pick origin and browse routes
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-extrabold text-ew-dark">Explore Destinations</h1>
      <p className="mb-8 text-ew-grey">Find flights from major German airports</p>

      <div className="mb-8">
        <label className="mb-2 block text-sm font-medium text-ew-dark">
          Where are you flying from?
        </label>
        <AirportSearch
          onSelect={handleOriginSelect}
          placeholder="Search for an airport (e.g., Cologne, Berlin)..."
        />
      </div>

      {activeOrigin && (
        <div>
          <h2 className="mb-6 text-xl font-bold text-ew-dark">
            Destinations from {selectedOrigin?.city || activeOrigin}
          </h2>
          <RouteGrid origin={activeOrigin} />
        </div>
      )}
    </div>
  );
}
