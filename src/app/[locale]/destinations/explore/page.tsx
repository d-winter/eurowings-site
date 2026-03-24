import { Suspense } from "react";
import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { hygraphFetch } from "@/lib/hygraph";
import { hygraphLocales } from "@/lib/hygraph-locales";
import { GET_DESTINATION_LANDING_PAGE, GET_SEGMENTS } from "@/lib/queries";
import type { DestinationLandingPageData, Segment } from "@/lib/types";
import { findSegmentId } from "@/lib/variants";
import PreviewBanner from "@/components/PreviewBanner";
import ExploreClient from "./ExploreClient";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ origin?: string; destination?: string; segment?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Explore Destinations – Eurowings",
    description: "Find flights from major German airports to destinations across Europe",
  };
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
  slug: string,
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
      { slug, stage, locales, segmentId: segmentId || null, origin, destination },
      isDraft
    );
    return data.destinationLandingPages?.[0] || null;
  } catch {
    return null;
  }
}

export default async function ExplorePage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { origin, destination, segment } = await searchParams;
  const { isEnabled: isDraft } = draftMode();

  const segments = await getSegments(isDraft);

  let landingPage: DestinationLandingPageData | null = null;
  let destinationCode = "";

  if (origin && destination && segment) {
    const segmentId = findSegmentId(segments, segment);
    landingPage = await getLandingPage(
      "destination",
      segmentId,
      origin,
      destination,
      isDraft,
      locale
    );
    destinationCode = destination;
  }

  return (
    <>
      {isDraft && <PreviewBanner />}
      <Suspense fallback={<div className="py-12 text-center text-ew-grey">Loading...</div>}>
        <ExploreClient
          landingPage={landingPage}
          destinationCode={destinationCode}
          segments={segments}
          locale={locale}
          isDraft={isDraft}
        />
      </Suspense>
    </>
  );
}
