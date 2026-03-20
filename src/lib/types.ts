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
  heroBanner?: HeroSection;
  promoCards?: Promotion[];
  contentSections?: ContentSectionData[];
  legalNotes?: Disclaimer[];
  featuredDestinations?: DestinationPage[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer?: { html: string };
  sortOrder?: number;
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
}

export type ContentBlock =
  | (Promotion & { __typename: "Promotion" })
  | (FlightOffer & { __typename: "FlightOffer" })
  | (CtaButton & { __typename: "CtaButton" })
  | (DestinationPage & { __typename: "DestinationPage" });

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  seo?: SeoMetadata;
  heroBanner?: HeroSection;
  contentSections?: ContentSectionData[];
  contentBlocks?: ContentBlock[];
  legalNotes?: Disclaimer[];
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
