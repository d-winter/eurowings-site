import { hygraphFetch } from "@/lib/hygraph";

/** Hygraph / GraphCMS-style entry ids (e.g. cmmz42o1cm3d007w4j5wkvo0b) */
const HYGRAPH_ENTRY_ID_RE = /^cm[a-z0-9]{20,}$/i;

const RESOLVE_PREVIEW_ENTRY = `
  query ResolvePreviewEntry($id: ID!) {
    faqPage(where: { id: $id }, stage: DRAFT) {
      id
    }
    landingPage(where: { id: $id }, stage: DRAFT) {
      slug
    }
    destinationPage(where: { id: $id }, stage: DRAFT) {
      slug
    }
    homepage(where: { id: $id }, stage: DRAFT) {
      id
    }
    topBanner(where: { id: $id }, stage: DRAFT) {
      slug
    }
    destinationLandingPage(where: { id: $id }, stage: DRAFT) {
      slug
    }
  }
`;

type ResolveResult = {
  faqPage: { id: string } | null;
  landingPage: { slug: string } | null;
  destinationPage: { slug: string } | null;
  homepage: { id: string } | null;
  topBanner: { slug: string } | null;
  destinationLandingPage: { slug: string } | null;
};

/**
 * Map Hygraph "publication" / model hints to our Next.js routes (next-intl).
 * Studio often sends PascalCase apiIds (e.g. FaqPage) which must not be used as URL segments.
 */
export function pathFromPublicationAndSlug(
  publication: string,
  slug: string
): string | null {
  const pKey = publication.replace(/[^a-zA-Z]/g, "").toLowerCase();
  const s = slug.trim();

  // Studio / preview URLs may use apiId "Faq" → "faq" (not only FaqPage → faqpage).
  if (
    pKey === "faq" ||
    pKey === "faqpage" ||
    pKey === "faqpages"
  ) {
    return "/faq";
  }
  if (pKey === "home" || pKey === "homepage" || pKey === "homepages") {
    return "/";
  }
  if (pKey === "landingpage" || pKey === "landingpages") {
    return s ? `/pages/${s}` : null;
  }
  if (pKey === "destinationpage" || pKey === "destinationpages") {
    return s ? `/destinations/${s}` : null;
  }
  if (pKey === "topbanner" || pKey === "topbanners") {
    return s ? `/collections/${s}` : null;
  }
  if (pKey === "destinationlandingpage" || pKey === "destinationlandingpages") {
    return "/destinations";
  }

  return null;
}

/** Prefix for next-intl `localePrefix: "as-needed"` (en = no prefix). */
export function withLocalePrefix(path: string, locale: string | null): string {
  if (!locale || locale === "en") {
    return path;
  }
  if (locale === "de" || locale === "de_AT") {
    if (path === "/") {
      return "/de";
    }
    return `/de${path}`;
  }
  return path;
}

async function pathFromHygraphEntryId(id: string): Promise<string | null> {
  if (!process.env.HYGRAPH_ENDPOINT || !process.env.HYGRAPH_PREVIEW_TOKEN) {
    return null;
  }

  try {
    const data = await hygraphFetch<ResolveResult>(
      RESOLVE_PREVIEW_ENTRY,
      { id },
      true
    );

    if (data.faqPage) {
      return "/faq";
    }
    if (data.homepage) {
      return "/";
    }
    if (data.landingPage?.slug) {
      return `/pages/${data.landingPage.slug}`;
    }
    if (data.destinationPage?.slug) {
      return `/destinations/${data.destinationPage.slug}`;
    }
    if (data.topBanner?.slug) {
      return `/collections/${data.topBanner.slug}`;
    }
    if (data.destinationLandingPage) {
      return "/destinations";
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Resolves Hygraph preview query params to a pathname (no locale prefix).
 */
export async function resolvePreviewPathname(
  publication: string,
  slug: string
): Promise<string> {
  const pub = publication.trim();
  const s = slug.trim();

  const mapped = pathFromPublicationAndSlug(pub, s);
  if (mapped) {
    return mapped;
  }

  if (s && HYGRAPH_ENTRY_ID_RE.test(s)) {
    const fromId = await pathFromHygraphEntryId(s);
    if (fromId) {
      return fromId;
    }
  }

  if (pub && s) {
    // Avoid /faq/faq when publication and slug are the same segment (Hygraph templates).
    if (pub.toLowerCase() === s.toLowerCase()) {
      if (pub.toLowerCase() === "faq") {
        return "/faq";
      }
      if (pub.toLowerCase() === "home") {
        return "/";
      }
    }
    const composed = `/${pub}/${s}`.replace(/\/+/g, "/");
    if (!/^[A-Z]/.test(pub)) {
      return composed;
    }
  }

  if (s) {
    if (s === "faq" || s === "home") {
      return s === "faq" ? "/faq" : "/";
    }
    return `/${s}`;
  }

  return "/";
}

export function looksLikeHygraphEntryId(value: string): boolean {
  return HYGRAPH_ENTRY_ID_RE.test(value.trim());
}
