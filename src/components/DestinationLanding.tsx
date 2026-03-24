"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { DestinationLandingPageData, FederatedFlightOffer } from "@/lib/types";
import { applyVariant } from "@/lib/variants";
import ContentSection from "@/components/ContentSection";
import FederatedFlightCard from "@/components/FederatedFlightCard";

interface DestinationLandingProps {
  page: DestinationLandingPageData;
  destinationCity: string;
  destinationCode: string;
}

export default function DestinationLanding({
  page,
  destinationCity,
  destinationCode,
}: DestinationLandingProps) {
  const t = useTranslations("explore");
  const searchParams = useSearchParams();
  const currentOrigin = searchParams.get("origin");
  const resolved = applyVariant(page, page.variants as Array<Partial<typeof page>>);

  // For click-to-edit: use variant entry ID for variant-overridden fields,
  // base entry ID for base-only fields (slug, seo)
  const variant = page.variants?.[0];
  const eid = variant?.id || page.id;

  return (
    <div>
      {/* Hero */}
      <section className="relative flex h-80 items-end overflow-hidden bg-ew-dark md:h-96">
        <div
          className="absolute inset-0"
          data-hygraph-entry-id={eid}
          data-hygraph-field-api-id="heroImage"
        >
          {resolved.heroImage?.url ? (
            <Image
              src={resolved.heroImage.url}
              alt={resolved.heroHeading || resolved.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-ew-primary-dark to-ew-primary" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <h1
            className="text-4xl font-extrabold text-white md:text-5xl"
            data-hygraph-entry-id={eid}
            data-hygraph-field-api-id="heroHeading"
          >
            {resolved.heroHeading || resolved.title}
          </h1>
          {resolved.heroSubheading && (
            <p
              className="mt-2 text-lg text-white/80"
              data-hygraph-entry-id={eid}
              data-hygraph-field-api-id="heroSubheading"
            >
              {resolved.heroSubheading}
            </p>
          )}
          <p className="mt-1 text-white/60">{destinationCity} ({destinationCode})</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Description */}
        {resolved.description?.html && (
          <section className="mb-12 rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <div
              className="prose-ew"
              dangerouslySetInnerHTML={{ __html: resolved.description.html }}
              data-hygraph-entry-id={eid}
              data-hygraph-field-api-id="description"
              data-hygraph-rich-text-format="html"
            />
          </section>
        )}

        {/* Federated Flight Offers */}
        {resolved.flightOffers && resolved.flightOffers.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-ew-dark">{t("availableFlights")}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {resolved.flightOffers.map((offer: FederatedFlightOffer, idx: number) => (
                <FederatedFlightCard key={`${offer.flightNumber}-${idx}`} offer={offer} />
              ))}
            </div>
          </section>
        )}

        {/* Content Sections */}
        {resolved.contentSections && resolved.contentSections.length > 0 && (
          <section className="mb-12 space-y-6">
            {resolved.contentSections.map((section, idx) => (
              <ContentSection key={section.id || idx} section={section} entryId={eid} />
            ))}
          </section>
        )}

        {/* CTA */}
        {resolved.cta && (
          <section className="mb-12 text-center">
            <a
              href={currentOrigin ? `${resolved.cta.url}${resolved.cta.url.includes("?") ? "&" : "?"}origin=${currentOrigin}` : resolved.cta.url}
              className="inline-block rounded-xl bg-ew-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-ew-primary-dark"
              target={resolved.cta.openInNewTab ? "_blank" : undefined}
              rel={resolved.cta.openInNewTab ? "noopener noreferrer" : undefined}
              data-hygraph-entry-id={resolved.cta.id}
              data-hygraph-field-api-id="label"
            >
              {resolved.cta.label}
            </a>
          </section>
        )}
      </div>
    </div>
  );
}
