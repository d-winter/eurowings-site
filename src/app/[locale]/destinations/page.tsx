import { Suspense } from "react";
import { draftMode } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { hygraphFetch } from "@/lib/hygraph";
import { hygraphLocales } from "@/lib/hygraph-locales";
import { GET_ALL_DESTINATIONS, GET_DESTINATION_LANDING_PAGE, GET_SEGMENTS } from "@/lib/queries";
import type { DestinationPage, DestinationLandingPageData, Segment } from "@/lib/types";
import { findSegmentId } from "@/lib/variants";
import DestinationCard from "@/components/DestinationCard";
import PreviewBanner from "@/components/PreviewBanner";
import DestinationsClient from "./DestinationsClient";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ origin?: string; destination?: string; segment?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("destinationsTitle"),
    description: t("destinationsDescription"),
  };
}

async function getDestinations(isDraft: boolean, locale: string) {
  try {
    const stage = isDraft ? "DRAFT" : "PUBLISHED";
    const locales = hygraphLocales(locale);
    const data = await hygraphFetch<{ destinationPages: DestinationPage[] }>(
      GET_ALL_DESTINATIONS,
      { stage, locales },
      isDraft
    );
    return data.destinationPages || [];
  } catch {
    return [];
  }
}

async function getSegments(isDraft: boolean): Promise<Segment[]> {
  try {
    const stage = isDraft ? "DRAFT" : "PUBLISHED";
    const data = await hygraphFetch<{ segments: Segment[] }>(
      GET_SEGMENTS,
      { stage },
      isDraft
    );
    return data.segments || [];
  } catch {
    return [];
  }
}

async function getLandingPage(
  segmentId: string | undefined,
  origin: string,
  destination: string,
  isDraft: boolean,
  locale: string
): Promise<DestinationLandingPageData | null> {
  try {
    const stage = isDraft ? "DRAFT" : "PUBLISHED";
    const locales = hygraphLocales(locale);
    const data = await hygraphFetch<{ destinationLandingPages: DestinationLandingPageData[] }>(
      GET_DESTINATION_LANDING_PAGE,
      { slug: "destination", stage, locales, segmentId: segmentId || null, origin, destination },
      isDraft
    );
    return data.destinationLandingPages?.[0] || null;
  } catch {
    return null;
  }
}

export default async function DestinationsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("destinations");
  const te = await getTranslations("explore");
  const { origin, destination, segment } = await searchParams;
  const { isEnabled: isDraft } = draftMode();

  const [destinations, segments] = await Promise.all([
    getDestinations(isDraft, locale),
    getSegments(isDraft),
  ]);

  let landingPage: DestinationLandingPageData | null = null;
  let destinationCode = "";

  if (origin && destination && segment) {
    const segmentId = findSegmentId(segments, segment);
    landingPage = await getLandingPage(segmentId, origin, destination, isDraft, locale);
    destinationCode = destination;
  }

  return (
    <>
      {isDraft && <PreviewBanner />}

      <Suspense fallback={<div className="py-12 text-center text-ew-grey">Loading...</div>}>
        <DestinationsClient
          landingPage={landingPage}
          destinationCode={destinationCode}
          heroTitle={t("heroTitle")}
          heroSubtitle={t("heroSubtitle")}
        >
          {destinations.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-6 text-2xl font-bold text-ew-dark">{te("featured")}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {destinations.map((dest) => (
                  <DestinationCard key={dest.id} destination={dest} />
                ))}
              </div>
            </section>
          )}
        </DestinationsClient>
      </Suspense>
    </>
  );
}
