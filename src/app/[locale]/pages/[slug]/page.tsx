import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { hygraphFetch } from "@/lib/hygraph";
import { hygraphLocales } from "@/lib/hygraph-locales";
import { GET_LANDING_PAGE, GET_ALL_LANDING_PAGE_SLUGS } from "@/lib/queries";
import type { LandingPage, LandingBodyBlock } from "@/lib/types";
import HeroBanner from "@/components/HeroBanner";
import FlightSearchPanel from "@/components/FlightSearchPanel";
import ContentSection from "@/components/ContentSection";
import PromoCard from "@/components/PromoCard";
import ServiceCard from "@/components/ServiceCard";
import ContentBlockBanner from "@/components/ContentBlockBanner";
import FlightOfferCard from "@/components/FlightOfferCard";
import DestinationCard from "@/components/DestinationCard";
import PreviewBanner from "@/components/PreviewBanner";
import { Link } from "@/i18n/navigation";
import { normalizeInternalHref } from "@/lib/internal-link";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

async function getPage(slug: string, isDraft: boolean, locale: string) {
  try {
    const stage = isDraft ? "DRAFT" : "PUBLISHED";
    const locales = hygraphLocales(locale);
    const data = await hygraphFetch<{ landingPage: LandingPage | null }>(
      GET_LANDING_PAGE,
      { slug, stage, locales },
      isDraft
    );
    return data.landingPage;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const data = await hygraphFetch<{ landingPages: { slug: string }[] }>(
      GET_ALL_LANDING_PAGE_SLUGS
    );
    const slugs = (data.landingPages || []).map((p) => p.slug);
    const locales = ["en", "de"] as const;
    return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const page = await getPage(slug, false, locale);
  return {
    title: page?.seo?.metaTitle || `${page?.title} – Eurowings`,
    description: page?.seo?.metaDescription,
  };
}

interface AliasedBlock extends Record<string, unknown> {
  offerTitle?: string;
  destTitle?: string;
}

function ContentBlockRenderer({ block }: { block: LandingBodyBlock }) {
  const raw = block as LandingBodyBlock & AliasedBlock;
  switch (block.__typename) {
    case "ContentBlock":
      return (
        <div className="sm:col-span-2 lg:col-span-3">
          <ContentBlockBanner block={block} embedded />
        </div>
      );
    case "Promotion":
      return <PromoCard promo={block} />;
    case "Service":
      return <ServiceCard service={block} />;
    case "FlightOffer":
      return (
        <FlightOfferCard offer={{ ...block, title: raw.offerTitle ?? block.title }} />
      );
    case "DestinationPage":
      return (
        <DestinationCard destination={{ ...block, title: raw.destTitle ?? block.title }} />
      );
    case "CtaButton": {
      const isExternal = /^https?:\/\//i.test(block.url);
      const className = `inline-block rounded-full px-8 py-3.5 text-center font-semibold transition-colors ${
        block.variant === "PRIMARY"
          ? "bg-ew-primary text-white hover:bg-ew-primary-dark"
          : block.variant === "SECONDARY"
          ? "bg-ew-accent text-ew-dark hover:bg-amber-400"
          : "border-2 border-ew-primary text-ew-primary hover:bg-ew-primary hover:text-white"
      }`;
      if (isExternal) {
        return (
          <a
            href={block.url}
            target={block.openInNewTab ? "_blank" : undefined}
            rel={block.openInNewTab ? "noopener noreferrer" : undefined}
            className={className}
            data-hygraph-entry-id={block.id}
            data-hygraph-field-api-id="label"
          >
            {block.label}
          </a>
        );
      }
      return (
        <Link
          href={normalizeInternalHref(block.url)}
          className={className}
          data-hygraph-entry-id={block.id}
          data-hygraph-field-api-id="label"
        >
          {block.label}
        </Link>
      );
    }
    default:
      return null;
  }
}

export default async function LandingPageRoute({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const { isEnabled: isDraft } = draftMode();
  const page = await getPage(slug, isDraft, locale);
  if (!page) notFound();

  return (
    <>
      {isDraft && <PreviewBanner />}

      {page.heroBanner && <HeroBanner hero={page.heroBanner} compact />}

      <FlightSearchPanel />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {page.contentBlocks && page.contentBlocks.length > 0 && (
          <section className="mb-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {page.contentBlocks.map((block, idx) => (
                <ContentBlockRenderer key={block.id || idx} block={block} />
              ))}
            </div>
          </section>
        )}

        {page.contentSections && page.contentSections.length > 0 && (
          <section className="mb-12 space-y-6">
            {page.contentSections.map((section, idx) => (
              <ContentSection key={section.id || idx} section={section} entryId={page.id} />
            ))}
          </section>
        )}

        {page.legalNotes && page.legalNotes.length > 0 && (
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
        )}
      </div>
    </>
  );
}
