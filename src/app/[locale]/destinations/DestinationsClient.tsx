"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback, type ReactNode } from "react";
import AirportSearch from "@/components/AirportSearch";
import RouteGrid from "@/components/RouteGrid";
import DestinationLanding from "@/components/DestinationLanding";
import type { DestinationLandingPageData } from "@/lib/types";
import type { FlightAirport } from "@/data/flights/types";

interface ExploreLabels {
  selectOrigin: string;
  searchPlaceholder: string;
  destinationsFrom: string;
  backToSearch: string;
  featured: string;
}

interface DestinationsClientProps {
  landingPage: DestinationLandingPageData | null;
  destinationCode: string;
  heroTitle: string;
  heroSubtitle: string;
  labels: ExploreLabels;
  children: ReactNode;
}

export default function DestinationsClient({
  landingPage,
  destinationCode,
  heroTitle,
  heroSubtitle,
  labels,
  children,
}: DestinationsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const segment = searchParams.get("segment");
  const [selectedOrigin, setSelectedOrigin] = useState<FlightAirport | null>(null);

  const activeOrigin = selectedOrigin?.iataCode || origin;

  const handleOriginSelect = useCallback(
    (airport: FlightAirport) => {
      setSelectedOrigin(airport);
      router.push(`?origin=${airport.iataCode}`);
    },
    [router]
  );

  function handleBack() {
    if (activeOrigin) {
      router.push(`?origin=${activeOrigin}`);
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
            {labels.backToSearch}
          </button>
        </div>
        <DestinationLanding
          page={landingPage}
          destinationCity={destinationCode}
          destinationCode={destinationCode}
        />
      </div>
    );
  }

  // Browse view — hero + search + route grid + CMS destinations
  return (
    <div>
      {/* Hero with embedded search */}
      <section className="bg-gradient-to-br from-ew-primary-dark to-ew-primary py-16 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">{heroTitle}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">{heroSubtitle}</p>

          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium text-white/90">
              {labels.selectOrigin}
            </label>
            <AirportSearch
              onSelect={handleOriginSelect}
              placeholder={labels.searchPlaceholder}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Route grid — shown when origin is selected */}
        {activeOrigin && (
          <div className="mb-12">
            <h2 className="mb-6 text-xl font-bold text-ew-dark">
              {labels.destinationsFrom.replace("{origin}", selectedOrigin?.city || activeOrigin)}
            </h2>
            <RouteGrid origin={activeOrigin} />
          </div>
        )}

        {/* CMS destinations (passed as children from server component) */}
        {children}
      </div>
    </div>
  );
}
