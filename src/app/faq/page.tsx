import { draftMode } from "next/headers";
import { hygraphFetch } from "@/lib/hygraph";
import { GET_FAQ_PAGE } from "@/lib/queries";
import type { FaqPageData, FaqCategory } from "@/lib/types";
import FaqAccordion from "@/components/FaqAccordion";
import PreviewBanner from "@/components/PreviewBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ – Eurowings",
  description: "Find answers to your questions about flights, baggage, rebooking, and more.",
};

async function getFaqData(isDraft: boolean) {
  try {
    const stage = isDraft ? "DRAFT" : "PUBLISHED";
    const data = await hygraphFetch<{
      faqPages: FaqPageData[];
      faqCategories: FaqCategory[];
    }>(GET_FAQ_PAGE, { stage }, isDraft);
    return {
      page: data.faqPages?.[0] || null,
      categories: data.faqCategories || [],
    };
  } catch {
    return { page: null, categories: [] };
  }
}

export default async function FaqPage() {
  const { isEnabled: isDraft } = draftMode();
  const { page, categories } = await getFaqData(isDraft);

  return (
    <>
      {isDraft && <PreviewBanner />}

      <section className="bg-gradient-to-br from-ew-primary-dark to-ew-primary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            {page?.title || "Frequently Asked Questions"}
          </h1>
          {(page?.description || !page) && (
            <p className="mt-4 max-w-xl text-lg text-white/80">
              {page?.description ||
                "Find answers to all your questions about flights, baggage, rebooking, and more."}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {categories.length > 0 ? (
          <FaqAccordion categories={categories} />
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ew-primary/10">
              <svg className="h-8 w-8 text-ew-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg text-ew-grey">
              FAQ content coming soon. Add FAQ categories and items in Hygraph.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
