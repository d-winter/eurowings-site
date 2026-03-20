import { notFound } from "next/navigation";
import Image from "next/image";
import { hygraphFetch } from "@/lib/hygraph";
import {
  GET_DESTINATION_PAGE,
  GET_ALL_DESTINATION_SLUGS,
} from "@/lib/queries";
import type { DestinationPage } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import HighlightCard from "@/components/HighlightCard";
import FlightOfferCard from "@/components/FlightOfferCard";
import ContentSection from "@/components/ContentSection";
import DestinationCard from "@/components/DestinationCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPage(slug: string) {
  try {
    const data = await hygraphFetch<{ destinationPage: DestinationPage | null }>(
      GET_DESTINATION_PAGE,
      { slug }
    );
    return data.destinationPage;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const data = await hygraphFetch<{
      destinationPages: { slug: string }[];
    }>(GET_ALL_DESTINATION_SLUGS);
    return (data.destinationPages || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  return {
    title: page?.seo?.metaTitle || `${page?.title} – Eurowings`,
    description: page?.seo?.metaDescription,
  };
}

export default async function DestinationDetail({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-80 items-end overflow-hidden bg-ew-dark md:h-96">
        {page.coverImage?.url ? (
          <Image
            src={page.coverImage.url}
            alt={page.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ew-primary-dark to-ew-primary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            {page.title}
          </h1>
          {page.airport && (
            <p className="mt-2 text-lg text-white/80">
              {page.airport.city}, {page.airport.country} &middot;{" "}
              {page.airport.iataCode}
            </p>
          )}
          {page.startingPrice != null && (
            <p className="mt-3 text-white/90">
              Flights from{" "}
              <span className="text-2xl font-bold text-ew-accent">
                {formatPrice(page.startingPrice, page.currency)}*
              </span>
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Highlights */}
        {page.highlights && page.highlights.length > 0 && (
          <section className="mb-12">
            <div className="grid gap-4 sm:grid-cols-3">
              {page.highlights.map((h) => (
                <HighlightCard key={h.id} highlight={h} />
              ))}
            </div>
          </section>
        )}

        {/* Description */}
        {page.description?.html && (
          <section className="mb-12 rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <div
              className="prose-ew"
              dangerouslySetInnerHTML={{ __html: page.description.html }}
            />
          </section>
        )}

        {/* Flight Offers */}
        {page.flightOffers && page.flightOffers.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-ew-dark">
              Available Flights
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {page.flightOffers.map((offer) => (
                <FlightOfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </section>
        )}

        {/* Content Sections */}
        {page.contentSections && page.contentSections.length > 0 && (
          <section className="mb-12 space-y-6">
            {page.contentSections.map((section, idx) => (
              <ContentSection key={idx} section={section} />
            ))}
          </section>
        )}

        {/* Related Destinations */}
        {page.relatedDestinations && page.relatedDestinations.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-ew-dark">
              You Might Also Like
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {page.relatedDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </section>
        )}

        {/* Legal */}
        {page.legalNotes && page.legalNotes.length > 0 && (
          <div className="space-y-2 text-xs text-ew-grey">
            {page.legalNotes.map((note) => (
              <div key={note.id} className="flex gap-1">
                {note.identifier && <sup>{note.identifier}</sup>}
                {note.content?.html && (
                  <div dangerouslySetInnerHTML={{ __html: note.content.html }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
