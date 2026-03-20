import { draftMode } from "next/headers";
import { hygraphFetch } from "@/lib/hygraph";
import { GET_HOMEPAGE } from "@/lib/queries";
import type { Homepage } from "@/lib/types";
import HeroBanner from "@/components/HeroBanner";
import PromoCard from "@/components/PromoCard";
import DestinationCard from "@/components/DestinationCard";
import ContentSection from "@/components/ContentSection";
import PreviewBanner from "@/components/PreviewBanner";

async function getHomepage(isDraft: boolean) {
  try {
    const stage = isDraft ? "DRAFT" : "PUBLISHED";
    const data = await hygraphFetch<{ homepages: Homepage[] }>(
      GET_HOMEPAGE,
      { stage },
      isDraft
    );
    return data.homepages?.[0] || null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const { isEnabled: isDraft } = draftMode();
  const page = await getHomepage(isDraft);

  return (
    <>
      {isDraft && <PreviewBanner />}

      {page?.heroBanner ? (
        <HeroBanner hero={page.heroBanner} />
      ) : (
        <section className="relative flex h-[34rem] items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ew-primary-dark via-ew-primary to-ew-primary-light" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-extrabold leading-tight text-white md:text-6xl">
                Fly Smarter with Eurowings
              </h1>
              <p className="mt-4 text-lg text-white/80 md:text-xl">
                Discover Europe and beyond with affordable fares and great service.
              </p>
              <div className="mt-8 inline-block rounded-full bg-ew-accent px-8 py-3.5 text-base font-bold text-ew-dark shadow-lg">
                Search Flights
              </div>
            </div>
          </div>
        </section>
      )}

      {page?.promoCards && page.promoCards.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-ew-dark">Current Deals</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {page.promoCards.map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </div>
        </section>
      )}

      {page?.featuredDestinations && page.featuredDestinations.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-ew-dark">Popular Destinations</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {page.featuredDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </div>
        </section>
      )}

      {page?.contentSections && page.contentSections.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {page.contentSections.map((section, idx) => (
              <ContentSection key={section.id || idx} section={section} entryId={page.id} />
            ))}
          </div>
        </section>
      )}

      {!page && (
        <>
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-ew-dark">Why Fly with Eurowings?</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { title: "Low Prices", desc: "Affordable fares starting from \u20ac29.99 across Europe and beyond." },
                { title: "Great Selection", desc: "Fly to 150+ destinations from airports across Germany." },
                { title: "Safe & Secure", desc: "SSL encrypted booking with PCI DSS certified payment." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ew-primary/10">
                    <svg className="h-7 w-7 text-ew-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-ew-dark">{item.title}</h3>
                  <p className="mt-2 text-sm text-ew-grey">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-ew-dark">Ready to Explore?</h2>
              <p className="mx-auto mt-4 max-w-xl text-ew-grey">
                Connect your Hygraph CMS to see live content. Set the
                HYGRAPH_ENDPOINT environment variable to get started.
              </p>
            </div>
          </section>
        </>
      )}

      {page?.legalNotes && page.legalNotes.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="space-y-2 text-xs text-ew-grey">
            {page.legalNotes.map((note) => (
              <div key={note.id} className="flex gap-1">
                {note.identifier && <sup>{note.identifier}</sup>}
                {note.content?.html && (
                  <div
                    dangerouslySetInnerHTML={{ __html: note.content.html }}
                    data-hygraph-entry-id={note.id}
                    data-hygraph-field-api-id="content"
                    data-hygraph-rich-text-format="html"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
