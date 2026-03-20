import { notFound } from "next/navigation";
import { hygraphFetch } from "@/lib/hygraph";
import { GET_LANDING_PAGE, GET_ALL_LANDING_PAGE_SLUGS } from "@/lib/queries";
import type { LandingPage, ContentBlock } from "@/lib/types";
import HeroBanner from "@/components/HeroBanner";
import ContentSection from "@/components/ContentSection";
import PromoCard from "@/components/PromoCard";
import FlightOfferCard from "@/components/FlightOfferCard";
import DestinationCard from "@/components/DestinationCard";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPage(slug: string) {
  try {
    const data = await hygraphFetch<{ landingPage: LandingPage | null }>(
      GET_LANDING_PAGE,
      { slug }
    );
    return data.landingPage;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const data = await hygraphFetch<{
      landingPages: { slug: string }[];
    }>(GET_ALL_LANDING_PAGE_SLUGS);
    return (data.landingPages || []).map((p) => ({ slug: p.slug }));
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

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.__typename) {
    case "Promotion":
      return <PromoCard promo={block} />;
    case "FlightOffer":
      return <FlightOfferCard offer={block} />;
    case "DestinationPage":
      return <DestinationCard destination={block} />;
    case "CtaButton":
      return (
        <Link
          href={block.url}
          target={block.openInNewTab ? "_blank" : undefined}
          className={`inline-block rounded-full px-8 py-3.5 text-center font-semibold transition-colors ${
            block.variant === "PRIMARY"
              ? "bg-ew-primary text-white hover:bg-ew-primary-dark"
              : block.variant === "SECONDARY"
              ? "bg-ew-accent text-ew-dark hover:bg-amber-400"
              : "border-2 border-ew-primary text-ew-primary hover:bg-ew-primary hover:text-white"
          }`}
        >
          {block.label}
        </Link>
      );
    default:
      return null;
  }
}

export default async function LandingPageRoute({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <>
      {page.heroBanner && <HeroBanner hero={page.heroBanner} compact />}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Content Blocks */}
        {page.contentBlocks && page.contentBlocks.length > 0 && (
          <section className="mb-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {page.contentBlocks.map((block, idx) => (
                <ContentBlockRenderer key={block.id || idx} block={block} />
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
