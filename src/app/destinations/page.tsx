import { draftMode } from "next/headers";
import { hygraphFetch } from "@/lib/hygraph";
import { GET_ALL_DESTINATIONS } from "@/lib/queries";
import type { DestinationPage } from "@/lib/types";
import DestinationCard from "@/components/DestinationCard";
import PreviewBanner from "@/components/PreviewBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destinations – Eurowings",
  description: "Explore all Eurowings destinations across Europe and beyond.",
};

async function getDestinations(isDraft: boolean) {
  try {
    const stage = isDraft ? "DRAFT" : "PUBLISHED";
    const data = await hygraphFetch<{ destinationPages: DestinationPage[] }>(
      GET_ALL_DESTINATIONS,
      { stage },
      isDraft
    );
    return data.destinationPages || [];
  } catch {
    return [];
  }
}

export default async function DestinationsPage() {
  const { isEnabled: isDraft } = draftMode();
  const destinations = await getDestinations(isDraft);

  return (
    <>
      {isDraft && <PreviewBanner />}

      <section className="bg-gradient-to-br from-ew-primary-dark to-ew-primary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            Our Destinations
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            Discover where Eurowings can take you. Browse our destinations
            and find your next adventure.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {destinations.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-ew-grey">
              No destinations available yet. Add some in Hygraph to see them
              here.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
