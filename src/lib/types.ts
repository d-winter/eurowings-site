export interface Asset {
  url: string;
  width?: number;
  height?: number;
}

export interface CtaButton {
  id: string;
  label: string;
  url: string;
  variant: "PRIMARY" | "SECONDARY" | "OUTLINE" | "TEXT";
  openInNewTab?: boolean;
}

export interface HeroSection {
  id: string;
  heading: string;
  subheading?: string;
  backgroundImage?: Asset;
  cta?: CtaButton;
}

/** Hygraph HeroBanner component (embedded in Homepage) */
export interface HeroBannerData {
  id?: string;
  heading: string;
  subheading?: string;
  backgroundImage?: Asset;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaVariant?: "PRIMARY" | "SECONDARY" | "OUTLINE" | "TEXT";
  ctaOpenInNewTab?: boolean;
}

/** Hygraph SplitBanner component (embedded in Homepage) */
export interface SplitBannerData {
  id?: string;
  title: string;
  subheading?: string;
  imageSide?: "LEFT" | "RIGHT";
  panelStyle?: "NEUTRAL" | "BRAND";
  image?: Asset;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaOpenInNewTab?: boolean;
}

/** Book & travel quick link (baggage, check-in, etc.) — Hygraph Service model */
export interface Service {
  id: string;
  __typename?: "Service";
  title: string;
  teaser?: string;
  iconKey?: string;
  linkUrl?: string;
  linkLabel?: string;
  sortOrder?: number;
  image?: Asset;
}

export interface Promotion {
  id: string;
  __typename?: "Promotion";
  heading: string;
  description?: string;
  priceFrom?: number;
  currency?: "EUR" | "GBP" | "USD" | "CHF";
  linkUrl?: string;
  linkLabel?: string;
  image?: Asset;
}

export interface Highlight {
  id: string;
  heading: string;
  icon?: string;
  description?: string;
}

export interface FlightOffer {
  id: string;
  __typename?: "FlightOffer";
  title?: string;
  originAirport?: string;
  destinationAirport?: string;
  priceFrom?: number;
  travelDate?: string;
  currency?: "EUR" | "GBP" | "USD" | "CHF";
  linkUrl?: string;
}

export interface Disclaimer {
  id: string;
  title?: string;
  identifier?: string;
  content?: { html: string };
}

export interface ContentSectionData {
  id?: string;
  heading?: string;
  body?: { html: string };
  imageUrl?: string;
}

export interface SeoMetadata {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface Airport {
  id: string;
  name: string;
  iataCode: string;
  city?: string;
  country?: string;
  countryCode?: string;
}

/** Promo strip + linked destination collection (Hygraph TopBanner) */
export interface TopBanner {
  id: string;
  title: string;
  slug: string;
  ctaLabel?: string | null;
  isActive?: boolean | null;
  featuredDestinations?: DestinationPage[];
}

export interface DestinationPage {
  id: string;
  __typename?: "DestinationPage";
  title: string;
  slug: string;
  description?: { html: string };
  startingPrice?: number;
  currency?: string;
  seo?: SeoMetadata;
  coverImage?: Asset;
  airport?: Airport;
  highlights?: Highlight[];
  contentSections?: ContentSectionData[];
  flightOffers?: FlightOffer[];
  legalNotes?: Disclaimer[];
  relatedDestinations?: DestinationPage[];
}

export interface Homepage {
  id: string;
  title: string;
  slug?: string;
  seo?: SeoMetadata;
  /** Embedded HeroBanner component (replaces HeroSection relation) */
  hero?: HeroBannerData;
  /** Embedded SplitBanner components (replaces ContentBlock/Service relations) */
  splitBanners?: SplitBannerData[];
  promoCards?: Promotion[];
  contentSections?: ContentSectionData[];
  legalNotes?: Disclaimer[];
  featuredDestinations?: DestinationPage[];
  /** @deprecated — kept for backward compat, use hero instead */
  heroBanner?: HeroSection;
  services?: Service[];
  bannerContentBlocks?: SplitBannerContentBlock[];
}

/** Hygraph `ContentBlock` model (split full-width promo banner) */
export interface SplitBannerContentBlock {
  id: string;
  __typename?: "ContentBlock";
  title: string;
  subheading?: string;
  imageSide?: "LEFT" | "RIGHT";
  /** Hygraph: neutral grey vs magenta/cyan brand gradient on text column */
  panelStyle?: "NEUTRAL" | "BRAND";
  sortOrder?: number;
  image?: Asset;
  cta?: CtaButton | null;
}

export interface FaqItem {
  id: string;
  question: string;
  answer?: { html: string };
  sortOrder?: number;
  /** Still stored on the item in Hygraph; used to group items from FaqPage.faqItems */
  category?: Pick<FaqCategory, "id" | "title" | "slug" | "description" | "icon"> | null;
}

export interface FaqCategory {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  icon?: string;
  faqItems?: FaqItem[];
}

export interface FaqPageData {
  id: string;
  title: string;
  description?: string;
  seo?: SeoMetadata;
  /** Linked on FaqPage in Hygraph (ordered via sortOrder on items) */
  faqItems?: FaqItem[];
}

/** Union members for Landing Page `contentBlocks` field */
export type LandingBodyBlock =
  | (Promotion & { __typename: "Promotion" })
  | (FlightOffer & { __typename: "FlightOffer" })
  | (CtaButton & { __typename: "CtaButton" })
  | (DestinationPage & { __typename: "DestinationPage" })
  | (Service & { __typename: "Service" })
  | (SplitBannerContentBlock & { __typename: "ContentBlock" });

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  seo?: SeoMetadata;
  heroBanner?: HeroSection;
  contentSections?: ContentSectionData[];
  contentBlocks?: LandingBodyBlock[];
  legalNotes?: Disclaimer[];
}

/** Federated flight offer from REST Remote Source */
export interface FederatedFlightOffer {
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departureAirport: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  date: string;
}

/** Hygraph Segment system model */
export interface Segment {
  id: string;
  name: string;
}

/** DestinationLandingPage with variant support + federated flight data */
export interface DestinationLandingPageData {
  id: string;
  title: string;
  slug: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroImage?: Asset;
  description?: { html: string };
  contentSections?: ContentSectionData[];
  seo?: SeoMetadata;
  cta?: CtaButton;
  variants?: Array<{
    id?: string;
    title?: string;
    heroHeading?: string;
    heroSubheading?: string;
    heroImage?: Asset;
    description?: { html: string };
    contentSections?: ContentSectionData[];
    cta?: CtaButton;
  }>;
  flightOffers?: FederatedFlightOffer[];
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "\u20ac",
  GBP: "\u00a3",
  USD: "$",
  CHF: "CHF",
};

export function formatPrice(
  amount?: number,
  currency?: string
): string {
  if (amount == null) return "";
  const symbol = CURRENCY_SYMBOLS[currency || "EUR"] || "\u20ac";
  return `${symbol}${amount.toFixed(2)}`;
}
