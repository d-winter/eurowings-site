import { draftMode } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hygraphFetch } from "@/lib/hygraph";
import { hygraphLocales } from "@/lib/hygraph-locales";
import { GET_HOMEPAGE } from "@/lib/queries";
import type { Homepage } from "@/lib/types";
import HeroBanner from "@/components/HeroBanner";
import FlightSearchPanel from "@/components/FlightSearchPanel";
import ContentBlockBanner from "@/components/ContentBlockBanner";
import PromoCard from "@/components/PromoCard";
import DestinationCard from "@/components/DestinationCard";
import ContentSection from "@/components/ContentSection";
import PreviewBanner from "@/components/PreviewBanner";

type Props = { params: Promise<{ locale: string }> };

async function getHomepage(isDraft: boolean, locale: string) {
  try {
    const stage = isDraft ? "DRAFT" : "PUBLISHED";
    const locales = hygraphLocales(locale);
    const data = await hygraphFetch<{ homepages: Homepage[] }>(
      GET_HOMEPAGE,
      { stage, locales },
      isDraft
    );
    return data.homepages?.[0] || null;
  } catch {
    return null;
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const { isEnabled: isDraft } = draftMode();
  const page = await getHomepage(isDraft, locale);

  return (
    <>
      {isDraft && <PreviewBanner />}

      {page?.hero ? (
        <HeroBanner hero={page.hero} entryId={page.id} />
      ) : (
        <section className="relative flex h-[34rem] items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ew-primary-dark via-ew-primary to-ew-primary-light" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-extrabold leading-tight text-white md:text-6xl">
                {t("fallbackTitle")}
              </h1>
              <p className="mt-4 text-lg text-white/80 md:text-xl">{t("fallbackSubtitle")}</p>
              <div className="mt-8 inline-block rounded-full bg-ew-accent px-8 py-3.5 text-base font-bold text-ew-dark shadow-lg">
                {t("searchFlights")}
              </div>
            </div>
          </div>
        </section>
      )}

      <FlightSearchPanel />

      {page?.splitBanners && page.splitBanners.length > 0 && (
        <div
          className="space-y-0"
          data-hygraph-entry-id={page.id}
          data-hygraph-field-api-id="splitBanners"
        >
          {page.splitBanners.map((banner, idx) => (
            <ContentBlockBanner
              key={banner.id || idx}
              block={{
                id: banner.id || `split-banner-${idx}`,
                title: banner.title,
                subheading: banner.subheading,
                imageSide: banner.imageSide,
                panelStyle: banner.panelStyle,
                image: banner.image,
                cta: banner.ctaLabel ? {
                  id: `split-banner-cta-${idx}`,
                  label: banner.ctaLabel,
                  url: banner.ctaUrl || "#",
                  variant: "SECONDARY",
                  openInNewTab: banner.ctaOpenInNewTab,
                } : null,
              }}
              entryId={page.id}
              componentField="splitBanners"
            />
          ))}
        </div>
      )}

      {page?.promoCards && page.promoCards.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-ew-dark">{t("dealsHeading")}</h2>
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
            <h2 className="mb-8 text-3xl font-bold text-ew-dark">{t("popularHeading")}</h2>
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
          <div
            className="space-y-6"
            data-hygraph-entry-id={page.id}
            data-hygraph-field-api-id="contentSections"
          >
            {page.contentSections.map((section, idx) => (
              <ContentSection key={section.id || idx} section={section} entryId={page.id} />
            ))}
          </div>
        </section>
      )}

      {!page && (
        <>
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-ew-dark">{t("whyHeading")}</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { title: t("featureLowPricesTitle"), desc: t("featureLowPricesDesc") },
                { title: t("featureSelectionTitle"), desc: t("featureSelectionDesc") },
                { title: t("featureSecureTitle"), desc: t("featureSecureDesc") },
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
              <h2 className="text-3xl font-bold text-ew-dark">{t("readyHeading")}</h2>
              <p className="mx-auto mt-4 max-w-xl text-ew-grey">{t("readyCms")}</p>
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
