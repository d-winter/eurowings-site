# Destination Landing Page with Content Federation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a destination landing page that combines Hygraph Variants (segment-based content personalization) with Content Federation (live flight data from an external REST service).

**Architecture:** Three Next.js API routes serve a rich static flight dataset. Hygraph federates this via a REST Remote Source. A new `DestinationLandingPage` model uses Variants to serve different content per travel segment. The frontend at `/destinations/explore` combines variant content + federated flight data in a single GraphQL query.

**Tech Stack:** Next.js 14 (App Router), Hygraph CMS (Variants + Content Federation), TypeScript, Tailwind CSS, next-intl

**Spec:** `docs/superpowers/specs/2026-03-24-destination-landing-federation-design.md`

**Reference implementation:** `~/dev/work/hygraph-showcase` — see spec for exact file references.

**Note on testing:** This project has no test infrastructure (no jest/vitest). Steps include manual verification commands instead of unit tests. Run `npx tsc --noEmit` for type checking after each task.

---

## File Structure

### New files
```
src/
├── data/
│   └── flights/
│       ├── airports.ts          — Airport reference data (all European airports in dataset)
│       ├── routes.ts            — Route definitions per origin hub with segment tags
│       ├── offers.ts            — Flight offer generator from route definitions
│       └── types.ts             — Shared types for flight data service
├── app/
│   ├── api/flights/
│   │   ├── airports/route.ts    — GET /api/flights/airports?query=...
│   │   ├── routes/route.ts      — GET /api/flights/routes?origin=CGN
│   │   └── offers/route.ts      — GET /api/flights/offers?origin=CGN&destination=PMI
│   └── [locale]/destinations/
│       └── explore/
│           ├── page.tsx         — Main explore page (server component)
│           └── ExploreClient.tsx — Client: search/landing toggle + navigation
├── components/
│   ├── AirportSearch.tsx        — Client: autocomplete airport input
│   ├── RouteGrid.tsx            — Client: destination card grid
│   ├── RouteCard.tsx            — Card for a single route/destination
│   ├── DestinationLanding.tsx   — Client: variant content + flight offers
│   └── FederatedFlightCard.tsx  — Card for a single federated flight offer
└── lib/
    └── variants.ts              — applyVariant helper
```

### Modified files
```
src/lib/types.ts                 — Add DestinationLandingPage + federated types
src/lib/queries.ts               — Add GET_DESTINATION_LANDING_PAGE + GET_SEGMENTS
src/lib/resolve-preview-path.ts  — Add DestinationLandingPage mapping
messages/en.json                 — Add explore page translations
```

---

## Task 1: Flight Data Types and Airport Dataset

**Files:**
- Create: `src/data/flights/types.ts`
- Create: `src/data/flights/airports.ts`

- [ ] **Step 1: Create flight data types**

Create `src/data/flights/types.ts`:

```ts
export interface FlightAirport {
  iataCode: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
}

export type TravelSegment = "city-trip" | "beach-holiday" | "adventure";

export interface FlightRoute {
  destination: FlightAirport;
  segment: TravelSegment;
  lowestPrice: number;
  currency: string;
}

/** Flat shape matching the Hygraph SDL type FLIGHTSOffer */
export interface FlightOfferFlat {
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

export const ORIGIN_HUBS = ["CGN", "DUS", "BER", "STR", "HAM", "MUC"] as const;
export type OriginHub = (typeof ORIGIN_HUBS)[number];
```

- [ ] **Step 2: Create airport reference data**

Create `src/data/flights/airports.ts` with a `Map<string, FlightAirport>` containing all airports used in the dataset. This includes the 6 origin hubs plus ~60 European destinations. Each airport has real IATA code, real name, city, country, and country code.

Structure:

```ts
import type { FlightAirport } from "./types";

export const AIRPORTS: Map<string, FlightAirport> = new Map([
  // === Origin hubs ===
  ["CGN", { iataCode: "CGN", name: "Cologne Bonn Airport", city: "Cologne", country: "Germany", countryCode: "DE" }],
  ["DUS", { iataCode: "DUS", name: "Düsseldorf Airport", city: "Düsseldorf", country: "Germany", countryCode: "DE" }],
  ["BER", { iataCode: "BER", name: "Berlin Brandenburg Airport", city: "Berlin", country: "Germany", countryCode: "DE" }],
  ["STR", { iataCode: "STR", name: "Stuttgart Airport", city: "Stuttgart", country: "Germany", countryCode: "DE" }],
  ["HAM", { iataCode: "HAM", name: "Hamburg Airport", city: "Hamburg", country: "Germany", countryCode: "DE" }],
  ["MUC", { iataCode: "MUC", name: "Munich Airport", city: "Munich", country: "Germany", countryCode: "DE" }],
  // === Beach destinations ===
  ["PMI", { iataCode: "PMI", name: "Palma de Mallorca Airport", city: "Palma de Mallorca", country: "Spain", countryCode: "ES" }],
  ["HER", { iataCode: "HER", name: "Heraklion Airport", city: "Heraklion", country: "Greece", countryCode: "GR" }],
  // ... ~60 total destinations covering beach, city-trip, adventure
]);

export function getAirport(iataCode: string): FlightAirport | undefined {
  return AIRPORTS.get(iataCode.toUpperCase());
}

export function searchAirports(query: string): FlightAirport[] {
  const q = query.toLowerCase();
  return Array.from(AIRPORTS.values()).filter(
    (a) =>
      a.iataCode.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q)
  );
}
```

Include at minimum these destinations (real Eurowings routes):

**Beach (segment: "beach-holiday"):** PMI, HER, FAO, AYT, IBZ, SPU, CFU, RHO, KGS, TFS, FUE, LPA, OLB, CAG, BRI, NAP, CHQ, ZTH, PFO, SSH, HRG, BGY (as beach gateway), SKG (summer), MLA, DBV, BOJ, VAR

**City (segment: "city-trip"):** BCN, LIS, PRG, BUD, VIE, FCO, MXP, LHR, CDG, CPH, ARN, ATH, IST, DUB, EDI, GVA, ZRH, WAW, KRK, OPO, TXL (legacy), SOF, BEG, ZAG, TLL, RIX, VNO, GDN

**Adventure (segment: "adventure"):** KEF, BGO, TOS, INN, SZG, TIV, KTT, LYR, EVE, BLL, TRD, SVG, RVN

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/data/flights/types.ts src/data/flights/airports.ts
git commit -m "feat(flights): add flight data types and airport reference dataset"
```

---

## Task 2: Route Definitions and Flight Offer Generator

**Files:**
- Create: `src/data/flights/routes.ts`
- Create: `src/data/flights/offers.ts`

- [ ] **Step 1: Create route definitions**

Create `src/data/flights/routes.ts`. Define which destinations are reachable from each hub, with segment tags and base prices. Use a compact definition format to avoid repetition:

```ts
import type { TravelSegment, OriginHub } from "./types";

interface RouteDefinition {
  destination: string; // IATA code
  segment: TravelSegment;
  basePrice: number; // EUR, lowest one-way
}

// Shared destination pools — most hubs serve similar routes
const BEACH_DESTINATIONS: RouteDefinition[] = [
  { destination: "PMI", segment: "beach-holiday", basePrice: 39.99 },
  { destination: "HER", segment: "beach-holiday", basePrice: 69.99 },
  // ... all beach destinations with realistic base prices
];

const CITY_DESTINATIONS: RouteDefinition[] = [
  { destination: "BCN", segment: "city-trip", basePrice: 29.99 },
  { destination: "LIS", segment: "city-trip", basePrice: 49.99 },
  // ... all city destinations
];

const ADVENTURE_DESTINATIONS: RouteDefinition[] = [
  { destination: "KEF", segment: "adventure", basePrice: 89.99 },
  { destination: "BGO", segment: "adventure", basePrice: 59.99 },
  // ... all adventure destinations
];

// Per-hub route maps. Each hub gets all shared routes minus itself,
// plus hub-specific price adjustments.
export const HUB_ROUTES: Record<OriginHub, RouteDefinition[]> = {
  CGN: [...BEACH_DESTINATIONS, ...CITY_DESTINATIONS, ...ADVENTURE_DESTINATIONS],
  DUS: [...BEACH_DESTINATIONS, ...CITY_DESTINATIONS, ...ADVENTURE_DESTINATIONS],
  BER: [...BEACH_DESTINATIONS, ...CITY_DESTINATIONS, ...ADVENTURE_DESTINATIONS],
  STR: [...BEACH_DESTINATIONS, ...CITY_DESTINATIONS, ...ADVENTURE_DESTINATIONS],
  HAM: [...BEACH_DESTINATIONS, ...CITY_DESTINATIONS, ...ADVENTURE_DESTINATIONS],
  MUC: [...BEACH_DESTINATIONS, ...CITY_DESTINATIONS, ...ADVENTURE_DESTINATIONS],
};
```

Filter out self-routes (e.g., CGN→CGN doesn't exist). Apply small per-hub price variations using a seeded offset so prices look realistic and vary by origin.

- [ ] **Step 2: Create flight offer generator**

Create `src/data/flights/offers.ts`. Generates deterministic flight offers for any origin→destination pair. Uses the route's base price to create 3-5 offers with varied airlines, times, and prices:

```ts
import type { FlightOfferFlat } from "./types";
import { HUB_ROUTES } from "./routes";
import { getAirport } from "./airports";

const AIRLINES = [
  { name: "Eurowings", code: "EW" },
  { name: "Lufthansa", code: "LH" },
  { name: "Ryanair", code: "FR" },
  { name: "easyJet", code: "U2" },
  { name: "Wizz Air", code: "W6" },
] as const;

// Seeded pseudo-random for deterministic results
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getOffersForRoute(
  origin: string,
  destination: string
): FlightOfferFlat[] {
  const route = HUB_ROUTES[origin as keyof typeof HUB_ROUTES]?.find(
    (r) => r.destination === destination
  );
  if (!route) return [];

  const rand = seededRandom(simpleHash(`${origin}-${destination}`));
  const offerCount = 3 + Math.floor(rand() * 3); // 3-5 offers
  const offers: FlightOfferFlat[] = [];

  for (let i = 0; i < offerCount; i++) {
    const airline = AIRLINES[Math.floor(rand() * AIRLINES.length)];
    const hour = 6 + Math.floor(rand() * 14); // 06:00-20:00
    const minute = Math.floor(rand() * 4) * 15; // 00, 15, 30, 45
    const durationHours = 1 + Math.floor(rand() * 3);
    const durationMinutes = Math.floor(rand() * 4) * 15;
    const arrHour = hour + durationHours + (minute + durationMinutes >= 60 ? 1 : 0);
    const arrMinute = (minute + durationMinutes) % 60;
    const priceVariation = 0.8 + rand() * 0.8; // 80%-160% of base
    const dayOffset = Math.floor(rand() * 14) + 1; // 1-14 days from now

    const date = new Date();
    date.setDate(date.getDate() + dayOffset);

    offers.push({
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code} ${1000 + Math.floor(rand() * 9000)}`,
      departureAirport: origin,
      departureTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      arrivalAirport: destination,
      arrivalTime: `${String(arrHour % 24).padStart(2, "0")}:${String(arrMinute).padStart(2, "0")}`,
      duration: `${durationHours}h ${durationMinutes > 0 ? `${durationMinutes}m` : "00m"}`,
      price: Math.round(route.basePrice * priceVariation * 100) / 100,
      currency: "EUR",
      date: date.toISOString().split("T")[0],
    });
  }

  return offers.sort((a, b) => a.price - b.price);
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/data/flights/routes.ts src/data/flights/offers.ts
git commit -m "feat(flights): add route definitions and deterministic offer generator"
```

---

## Task 3: Flight API Routes

**Files:**
- Create: `src/app/api/flights/airports/route.ts`
- Create: `src/app/api/flights/routes/route.ts`
- Create: `src/app/api/flights/offers/route.ts`

- [ ] **Step 1: Create airports endpoint**

Create `src/app/api/flights/airports/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { searchAirports } from "@/data/flights/airports";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }
  const results = searchAirports(query).slice(0, 10);
  return NextResponse.json(results);
}
```

- [ ] **Step 2: Create routes endpoint**

Create `src/app/api/flights/routes/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { HUB_ROUTES } from "@/data/flights/routes";
import { getAirport } from "@/data/flights/airports";
import type { FlightRoute, OriginHub } from "@/data/flights/types";
import { ORIGIN_HUBS } from "@/data/flights/types";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.searchParams.get("origin")?.toUpperCase();
  if (!origin || !ORIGIN_HUBS.includes(origin as OriginHub)) {
    return NextResponse.json(
      { error: "Invalid or missing origin. Use one of: " + ORIGIN_HUBS.join(", ") },
      { status: 400 }
    );
  }

  const routes = HUB_ROUTES[origin as OriginHub] || [];
  const result: FlightRoute[] = routes
    .map((r) => {
      const dest = getAirport(r.destination);
      if (!dest) return null;
      return {
        destination: dest,
        segment: r.segment,
        lowestPrice: r.basePrice,
        currency: "EUR",
      };
    })
    .filter((r): r is FlightRoute => r !== null);

  return NextResponse.json(result);
}
```

- [ ] **Step 3: Create offers endpoint**

Create `src/app/api/flights/offers/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getOffersForRoute } from "@/data/flights/offers";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.searchParams.get("origin")?.toUpperCase();
  const destination = request.nextUrl.searchParams.get("destination")?.toUpperCase();

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "Both origin and destination are required" },
      { status: 400 }
    );
  }

  const offers = getOffersForRoute(origin, destination);
  return NextResponse.json(offers);
}
```

- [ ] **Step 4: Verify endpoints work**

Run: `npm run dev`

Then test in another terminal:
```bash
curl "http://localhost:3000/api/flights/airports?query=ber"
curl "http://localhost:3000/api/flights/routes?origin=CGN"
curl "http://localhost:3000/api/flights/offers?origin=CGN&destination=PMI"
```

Expected: JSON responses with realistic data. The airports endpoint returns Berlin airports. The routes endpoint returns ~50+ destinations with segments. The offers endpoint returns 3-5 flight offers sorted by price.

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/app/api/flights/
git commit -m "feat(flights): add API routes for airports, routes, and offers"
```

---

## Task 4: Hygraph Schema — Model, Segments, Remote Source

This task uses the Hygraph MCP tools. Some steps require manual action in Hygraph Studio (noted with **MANUAL**).

**Files:** None (Hygraph schema changes)

- [ ] **Step 1: Create the DestinationLandingPage model**

Use MCP `submit_batch_migration` to create the model:

```json
[
  {
    "operationName": "createModel",
    "params": {
      "apiId": "DestinationLandingPage",
      "apiIdPlural": "DestinationLandingPages",
      "displayName": "Destination Landing Page",
      "description": "Template-driven destination page with variant support and federated flight data"
    }
  }
]
```

- [ ] **Step 2: Add fields to DestinationLandingPage**

Use MCP `submit_batch_migration` with these operations (one batch):

```json
[
  {
    "operationName": "createSimpleField",
    "params": {
      "apiId": "title",
      "parentApiId": "DestinationLandingPage",
      "type": "STRING",
      "displayName": "Title",
      "isRequired": true,
      "isLocalized": true,
      "isTitle": true
    }
  },
  {
    "operationName": "createSimpleField",
    "params": {
      "apiId": "slug",
      "parentApiId": "DestinationLandingPage",
      "type": "STRING",
      "displayName": "Slug",
      "isRequired": true,
      "isUnique": true
    }
  },
  {
    "operationName": "createSimpleField",
    "params": {
      "apiId": "heroHeading",
      "parentApiId": "DestinationLandingPage",
      "type": "STRING",
      "displayName": "Hero Heading",
      "isLocalized": true
    }
  },
  {
    "operationName": "createSimpleField",
    "params": {
      "apiId": "heroSubheading",
      "parentApiId": "DestinationLandingPage",
      "type": "STRING",
      "displayName": "Hero Subheading",
      "isLocalized": true
    }
  },
  {
    "operationName": "createSimpleField",
    "params": {
      "apiId": "description",
      "parentApiId": "DestinationLandingPage",
      "type": "RICHTEXT",
      "displayName": "Description",
      "isLocalized": true
    }
  }
]
```

Then a second batch for relation/component fields:

```json
[
  {
    "operationName": "createRelationalField",
    "params": {
      "apiId": "heroImage",
      "parentApiId": "DestinationLandingPage",
      "type": "RELATION",
      "displayName": "Hero Image",
      "relatedModel": "Asset",
      "relationType": "ONE_TO_ONE"
    }
  },
  {
    "operationName": "createComponentField",
    "params": {
      "apiId": "contentSections",
      "parentApiId": "DestinationLandingPage",
      "displayName": "Content Sections",
      "componentApiId": "ContentSection",
      "isList": true
    }
  },
  {
    "operationName": "createComponentField",
    "params": {
      "apiId": "seo",
      "parentApiId": "DestinationLandingPage",
      "displayName": "SEO",
      "componentApiId": "Seo"
    }
  },
  {
    "operationName": "createRelationalField",
    "params": {
      "apiId": "cta",
      "parentApiId": "DestinationLandingPage",
      "type": "RELATION",
      "displayName": "Call to Action",
      "relatedModel": "CtaButton",
      "relationType": "ONE_TO_ONE"
    }
  }
]
```

Note: Check `get_management_operation_schema` for the exact field names for `createRelationalField` and `createComponentField` before executing — the params above may need adjustment (e.g., `reverseField` config for relations).

- [ ] **Step 3: Create segment entries**

Use MCP `create_entry` for the Segment model (3 entries):

1. Name: "City Trip", description: "Urban destinations — culture, nightlife, sightseeing"
2. Name: "Beach Holiday", description: "Sun, sea, and sand destinations"
3. Name: "Adventure", description: "Nature, hiking, outdoor experiences"

Then publish all three.

**Save the returned IDs** — they're needed for the variant queries in the frontend.

- [ ] **Step 4: Deploy the site to get a public URL**

The REST Remote Source needs a publicly accessible URL for the flight API. Deploy the current state to Vercel:

```bash
git push
```

Wait for deploy to complete. Note the production URL (e.g., `https://eurowings-site.vercel.app`).

- [ ] **Step 5: Create REST Remote Source**

Use MCP `submit_batch_migration`:

```json
[
  {
    "operationName": "createRESTRemoteSource",
    "params": {
      "displayName": "Flight Data Service",
      "prefix": "FLIGHTS",
      "url": "https://<deployed-url>/api/flights",
      "kind": "Custom",
      "remoteTypeDefinitions": {
        "sdl": "type FLIGHTSOffer { airline: String! airlineCode: String! flightNumber: String! departureAirport: String! departureTime: String! arrivalAirport: String! arrivalTime: String! duration: String! price: Float! currency: String! date: String! }"
      }
    }
  }
]
```

Replace `<deployed-url>` with the actual Vercel URL.

- [ ] **Step 6: Create remote field**

Use MCP `submit_batch_migration`:

```json
[
  {
    "operationName": "createRemoteField",
    "params": {
      "apiId": "flightOffers",
      "parentApiId": "DestinationLandingPage",
      "type": "REST",
      "displayName": "Flight Offers (federated)",
      "description": "Live flight offers from external service via Content Federation",
      "isList": true,
      "remoteConfig": {
        "remoteSourcePrefix": "FLIGHTS",
        "returnTypeApiId": "FLIGHTSOffer",
        "method": "GET",
        "cacheTTLSeconds": 300,
        "restPath": "/offers?origin={{args.origin}}&destination={{args.destination}}"
      },
      "inputArgs": [
        { "apiId": "origin", "remoteTypeApiId": "String", "isRequired": true },
        { "apiId": "destination", "remoteTypeApiId": "String", "isRequired": true }
      ]
    }
  }
]
```

- [ ] **Step 7: MANUAL — Enable variants on fields in Hygraph Studio**

Open Hygraph Studio → Schema → DestinationLandingPage model. For each of these fields, open field settings and enable "Variant":

1. `title`
2. `heroHeading`
3. `heroSubheading`
4. `heroImage`
5. `description`
6. `contentSections`
7. `cta`

Link the variant configuration to the 3 segments created in Step 3.

- [ ] **Step 8: MANUAL — Create seed content entry with variants**

In Hygraph Studio, create one `DestinationLandingPage` entry:

**Default (base):**
- Title: "Discover Your Next Destination"
- Slug: `destination`
- Hero Heading: "Where will you fly next?"
- Hero Subheading: "Explore destinations from all major German airports"
- Description: Generic travel inspiration copy
- Upload a generic travel hero image

**City Trip variant:**
- Title: "Explore the City"
- Hero Heading: "Urban adventures await"
- Hero Subheading: "Culture, nightlife, and city vibes"
- Description: City-focused copy about museums, restaurants, architecture
- Upload a city skyline hero image

**Beach Holiday variant:**
- Title: "Sun, Sea & Sand"
- Hero Heading: "Your beach paradise is calling"
- Hero Subheading: "Relax, unwind, and soak up the sun"
- Description: Beach-focused copy about relaxation, clear waters, golden sands
- Upload a beach hero image

**Adventure variant:**
- Title: "Seek the Extraordinary"
- Hero Heading: "Adventures beyond the ordinary"
- Hero Subheading: "Mountains, glaciers, and untamed nature"
- Description: Adventure-focused copy about hiking, nature, unique experiences
- Upload a mountain/nature hero image

Publish the entry.

- [ ] **Step 9: Verify federation in Hygraph API Playground**

In Hygraph Studio → API Playground, run:

```graphql
query TestFederation {
  destinationLandingPages(first: 1, stage: DRAFT) {
    id
    title
    heroHeading
    flightOffers(origin: "CGN", destination: "PMI") {
      airline
      price
      departureTime
    }
  }
}
```

Expected: Returns the entry with title and federated flight offers from the API.

---

## Task 5: Frontend Types, Queries, and Variant Helper

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/queries.ts`
- Create: `src/lib/variants.ts`

- [ ] **Step 1: Add types for DestinationLandingPage and federated data**

Add to `src/lib/types.ts` (after the existing `LandingPage` interface, before `CURRENCY_SYMBOLS`):

```ts
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
```

- [ ] **Step 2: Add GraphQL queries**

Add to `src/lib/queries.ts`:

```ts
export const GET_SEGMENTS = `
  query GetSegments($stage: Stage! = PUBLISHED) {
    segments(stage: $stage) {
      id
      name
    }
  }
`;

export const GET_DESTINATION_LANDING_PAGE = `
  query GetDestinationLandingPage($slug: String!, $stage: Stage! = PUBLISHED, $locales: [Locale!]!, $segmentId: ID, $origin: String!, $destination: String!) {
    destinationLandingPages(where: { slug: $slug }, stage: $stage, locales: $locales, first: 1) {
      id
      title
      slug
      heroHeading
      heroSubheading
      heroImage { url }
      description { html }
      contentSections { heading body { html } }
      seo { metaTitle metaDescription ogImage noIndex }
      cta { id label url variant openInNewTab }
      variants(where: { segments_some: { id: $segmentId } }) {
        title
        heroHeading
        heroSubheading
        heroImage { url }
        description { html }
        contentSections { heading body { html } }
        cta { id label url variant openInNewTab }
      }
      flightOffers(origin: $origin, destination: $destination) {
        airline
        airlineCode
        flightNumber
        departureAirport
        departureTime
        arrivalAirport
        arrivalTime
        duration
        price
        currency
        date
      }
    }
  }
`;
```

- [ ] **Step 3: Create variant resolution helper**

Create `src/lib/variants.ts`:

```ts
/**
 * Apply the first matching variant's fields over the base entry.
 * Only overrides fields that are non-null/undefined in the variant.
 * Pattern from: ~/dev/work/hygraph-showcase/app/[locale]/blog/[slug]/page.tsx
 */
export function applyVariant<T extends Record<string, unknown>>(
  base: T,
  variants?: Array<Partial<T>>
): T {
  const variant = variants?.[0];
  if (!variant) return base;

  const overrides: Partial<T> = {};
  for (const [key, value] of Object.entries(variant)) {
    if (value !== null && value !== undefined) {
      (overrides as Record<string, unknown>)[key] = value;
    }
  }
  return { ...base, ...overrides };
}

/**
 * Normalize a segment name to a URL-safe slug.
 * "Beach Holiday" → "beach-holiday", "City Trip" → "city-trip"
 */
export function segmentNameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Find a segment ID by its slug (normalized name).
 */
export function findSegmentId(
  segments: Array<{ id: string; name: string }>,
  slug: string
): string | undefined {
  return segments.find((s) => segmentNameToSlug(s.name) === slug)?.id;
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/lib/types.ts src/lib/queries.ts src/lib/variants.ts
git commit -m "feat: add DestinationLandingPage types, queries, and variant helper"
```

---

## Task 6: Frontend Components

**Files:**
- Create: `src/components/FederatedFlightCard.tsx`
- Create: `src/components/RouteCard.tsx`
- Create: `src/components/AirportSearch.tsx`
- Create: `src/components/RouteGrid.tsx`
- Create: `src/components/DestinationLanding.tsx`

- [ ] **Step 1: Create FederatedFlightCard**

Create `src/components/FederatedFlightCard.tsx`. Displays a single federated flight offer. Follows the styling of the existing `FlightOfferCard` component at `src/components/FlightOfferCard.tsx` but uses the `FederatedFlightOffer` shape:

```tsx
import { formatPrice } from "@/lib/types";
import type { FederatedFlightOffer } from "@/lib/types";

export default function FederatedFlightCard({ offer }: { offer: FederatedFlightOffer }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-ew-grey">
          <span className="font-medium text-ew-dark">{offer.departureAirport}</span>
          <svg className="h-4 w-4 text-ew-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <span className="font-medium text-ew-dark">{offer.arrivalAirport}</span>
        </div>
        <p className="mt-1 text-xs text-ew-grey">
          {offer.airline} &middot; {offer.flightNumber}
        </p>
        <p className="mt-0.5 text-xs text-ew-grey">
          {offer.departureTime} → {offer.arrivalTime} &middot; {offer.duration}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-ew-grey">from</p>
        <p className="text-xl font-bold text-ew-primary">
          {formatPrice(offer.price, offer.currency)}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create RouteCard**

Create `src/components/RouteCard.tsx`. Displays a destination in the route grid:

```tsx
import { formatPrice } from "@/lib/types";

interface RouteCardProps {
  city: string;
  country: string;
  iataCode: string;
  segment: string;
  lowestPrice: number;
  currency: string;
  onClick: () => void;
}

const SEGMENT_COLORS: Record<string, string> = {
  "city-trip": "bg-blue-100 text-blue-700",
  "beach-holiday": "bg-amber-100 text-amber-700",
  "adventure": "bg-emerald-100 text-emerald-700",
};

const SEGMENT_LABELS: Record<string, string> = {
  "city-trip": "City Trip",
  "beach-holiday": "Beach",
  "adventure": "Adventure",
};

export default function RouteCard({
  city,
  country,
  iataCode,
  segment,
  lowestPrice,
  currency,
  onClick,
}: RouteCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all hover:shadow-md hover:border-ew-primary/30"
    >
      <div>
        <h3 className="font-semibold text-ew-dark">{city}</h3>
        <p className="text-sm text-ew-grey">{country} &middot; {iataCode}</p>
        <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${SEGMENT_COLORS[segment] || "bg-gray-100 text-gray-600"}`}>
          {SEGMENT_LABELS[segment] || segment}
        </span>
      </div>
      <div className="text-right">
        <p className="text-xs text-ew-grey">from</p>
        <p className="text-lg font-bold text-ew-primary">
          {formatPrice(lowestPrice, currency)}
        </p>
      </div>
    </button>
  );
}
```

- [ ] **Step 3: Create AirportSearch**

Create `src/components/AirportSearch.tsx`. Client component with debounced autocomplete:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import type { FlightAirport } from "@/data/flights/types";

interface AirportSearchProps {
  onSelect: (airport: FlightAirport) => void;
  placeholder?: string;
}

export default function AirportSearch({ onSelect, placeholder = "Search airports..." }: AirportSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FlightAirport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<FlightAirport | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2 || selected) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/flights/airports?query=${encodeURIComponent(query)}`);
      const data: FlightAirport[] = await res.json();
      setResults(data);
      setIsOpen(data.length > 0);
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [query, selected]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(airport: FlightAirport) {
    setSelected(airport);
    setQuery(`${airport.city} (${airport.iataCode})`);
    setIsOpen(false);
    onSelect(airport);
  }

  function handleInputChange(value: string) {
    setQuery(value);
    setSelected(null);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-ew-primary focus:outline-none focus:ring-2 focus:ring-ew-primary/20"
      />
      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-xl border border-gray-100 bg-white shadow-lg">
          {results.map((airport) => (
            <li key={airport.iataCode}>
              <button
                onClick={() => handleSelect(airport)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
              >
                <span className="font-mono font-semibold text-ew-primary">{airport.iataCode}</span>
                <span className="text-ew-dark">{airport.city}, {airport.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create RouteGrid**

Create `src/components/RouteGrid.tsx`. Client component that fetches and displays routes:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RouteCard from "./RouteCard";
import type { FlightRoute } from "@/data/flights/types";

interface RouteGridProps {
  origin: string;
}

export default function RouteGrid({ origin }: RouteGridProps) {
  const [routes, setRoutes] = useState<FlightRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/flights/routes?origin=${encodeURIComponent(origin)}`)
      .then((res) => res.json())
      .then((data: FlightRoute[]) => {
        setRoutes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [origin]);

  const filtered = filter === "all" ? routes : routes.filter((r) => r.segment === filter);

  function handleRouteClick(route: FlightRoute) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("origin", origin);
    params.set("destination", route.destination.iataCode);
    params.set("segment", route.segment);
    router.push(`?${params.toString()}`);
  }

  if (loading) {
    return <div className="py-12 text-center text-ew-grey">Loading destinations...</div>;
  }

  const segments = ["all", "city-trip", "beach-holiday", "adventure"];
  const segmentLabels: Record<string, string> = {
    all: "All",
    "city-trip": "City Trips",
    "beach-holiday": "Beach Holidays",
    adventure: "Adventure",
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {segments.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === s
                ? "bg-ew-primary text-white"
                : "bg-gray-100 text-ew-grey hover:bg-gray-200"
            }`}
          >
            {segmentLabels[s]} ({s === "all" ? routes.length : routes.filter((r) => r.segment === s).length})
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((route) => (
          <RouteCard
            key={route.destination.iataCode}
            city={route.destination.city}
            country={route.destination.country}
            iataCode={route.destination.iataCode}
            segment={route.segment}
            lowestPrice={route.lowestPrice}
            currency={route.currency}
            onClick={() => handleRouteClick(route)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create DestinationLanding**

Create `src/components/DestinationLanding.tsx`. Client component that displays variant content + federated flights. This is the most complex component:

```tsx
"use client";

import Image from "next/image";
import type { DestinationLandingPageData, FederatedFlightOffer, Segment } from "@/lib/types";
import { applyVariant, findSegmentId } from "@/lib/variants";
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
  const resolved = applyVariant(page, page.variants as Array<Partial<typeof page>>);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex h-80 items-end overflow-hidden bg-ew-dark md:h-96">
        <div className="absolute inset-0">
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
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            {resolved.heroHeading || resolved.title}
          </h1>
          {resolved.heroSubheading && (
            <p className="mt-2 text-lg text-white/80">{resolved.heroSubheading}</p>
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
            />
          </section>
        )}

        {/* Federated Flight Offers */}
        {resolved.flightOffers && resolved.flightOffers.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-ew-dark">Available Flights</h2>
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
              <ContentSection key={section.id || idx} section={section} entryId={resolved.id} />
            ))}
          </section>
        )}

        {/* CTA */}
        {resolved.cta && (
          <section className="mb-12 text-center">
            <a
              href={resolved.cta.url}
              className="inline-block rounded-xl bg-ew-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-ew-primary-dark"
              target={resolved.cta.openInNewTab ? "_blank" : undefined}
              rel={resolved.cta.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {resolved.cta.label}
            </a>
          </section>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 7: Commit**

```bash
git add src/components/FederatedFlightCard.tsx src/components/RouteCard.tsx src/components/AirportSearch.tsx src/components/RouteGrid.tsx src/components/DestinationLanding.tsx
git commit -m "feat(explore): add flight search and landing components"
```

---

## Task 7: Explore Page

**Files:**
- Create: `src/app/[locale]/destinations/explore/page.tsx`
- Modify: `messages/en.json`

- [ ] **Step 1: Add translations**

Add to `messages/en.json` (inside the top-level object):

```json
"explore": {
  "title": "Explore Destinations",
  "subtitle": "Find flights from major German airports",
  "selectOrigin": "Where are you flying from?",
  "destinationsFrom": "Destinations from {origin}",
  "backToSearch": "← Back to destinations"
}
```

- [ ] **Step 2: Create the explore page**

Create `src/app/[locale]/destinations/explore/page.tsx`:

```tsx
import { Suspense } from "react";
import { draftMode } from "next/headers";
import { setRequestLocale, getTranslations } from "next-intl/server";
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
  let destinationCity = "";
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
    // City name will be passed from client-side route data
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
```

- [ ] **Step 3: Create ExploreClient wrapper**

Create `src/app/[locale]/destinations/explore/ExploreClient.tsx`. This client component manages the search/landing toggle and handles navigation:

```tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import AirportSearch from "@/components/AirportSearch";
import RouteGrid from "@/components/RouteGrid";
import DestinationLanding from "@/components/DestinationLanding";
import type { DestinationLandingPageData, Segment } from "@/lib/types";
import type { FlightAirport } from "@/data/flights/types";

interface ExploreClientProps {
  landingPage: DestinationLandingPageData | null;
  destinationCode: string;
  segments: Segment[];
  locale: string;
  isDraft: boolean;
}

export default function ExploreClient({
  landingPage,
  destinationCode,
  segments,
  locale,
  isDraft,
}: ExploreClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const segment = searchParams.get("segment");
  const [selectedOrigin, setSelectedOrigin] = useState<FlightAirport | null>(null);
  const [destinationCity, setDestinationCity] = useState("");

  const handleOriginSelect = useCallback(
    (airport: FlightAirport) => {
      setSelectedOrigin(airport);
      const params = new URLSearchParams();
      params.set("origin", airport.iataCode);
      router.push(`?${params.toString()}`);
    },
    [router]
  );

  function handleBack() {
    if (origin) {
      const params = new URLSearchParams();
      params.set("origin", origin);
      router.push(`?${params.toString()}`);
    } else {
      router.push("?");
    }
  }

  // Landing view — destination selected
  if (destination && segment && landingPage) {
    return (
      <div>
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
            className="text-sm text-ew-primary hover:underline"
          >
            ← Back to destinations
          </button>
        </div>
        <DestinationLanding
          page={landingPage}
          destinationCity={destinationCity || destinationCode}
          destinationCode={destinationCode}
        />
      </div>
    );
  }

  // Search view — pick origin and browse routes
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-extrabold text-ew-dark">Explore Destinations</h1>
      <p className="mb-8 text-ew-grey">Find flights from major German airports</p>

      <div className="mb-8">
        <label className="mb-2 block text-sm font-medium text-ew-dark">
          Where are you flying from?
        </label>
        <AirportSearch
          onSelect={handleOriginSelect}
          placeholder="Search for an airport (e.g., Cologne, Berlin)..."
        />
      </div>

      {origin && (
        <div>
          <h2 className="mb-6 text-xl font-bold text-ew-dark">
            Destinations from {selectedOrigin?.city || origin}
          </h2>
          <RouteGrid origin={origin} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify the page renders**

Run: `npm run dev`

Open `http://localhost:3000/destinations/explore` in the browser.

Expected:
1. See the search page with title and airport search input
2. Type "cologne" — dropdown shows CGN
3. Select CGN — route grid loads with ~50 destinations
4. Filter by segment works
5. Click a destination — URL updates with `?origin=CGN&destination=PMI&segment=beach-holiday`

Note: The landing view won't show CMS content until the Hygraph schema (Task 4) is set up. But the page should render without errors.

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/destinations/explore/ messages/en.json
git commit -m "feat(explore): add destination explore page with search and landing view"
```

---

## Task 8: Preview Wiring

**Files:**
- Modify: `src/lib/resolve-preview-path.ts`

- [ ] **Step 1: Add DestinationLandingPage to publication-based mapping**

In `src/lib/resolve-preview-path.ts`, add a new condition in `pathFromPublicationAndSlug` after the `topbanner` block (around line 64):

```ts
if (pKey === "destinationlandingpage" || pKey === "destinationlandingpages") {
  return "/destinations/explore";
}
```

- [ ] **Step 2: Add DestinationLandingPage to entry ID resolution query**

In `src/lib/resolve-preview-path.ts`, update the `RESOLVE_PREVIEW_ENTRY` query to include:

```graphql
destinationLandingPage(where: { id: $id }, stage: DRAFT) {
  slug
}
```

Update the `ResolveResult` type:

```ts
destinationLandingPage: { slug: string } | null;
```

Add to the resolution logic in `pathFromHygraphEntryId`:

```ts
if (data.destinationLandingPage) {
  return "/destinations/explore";
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/resolve-preview-path.ts
git commit -m "feat(preview): add DestinationLandingPage preview path resolution"
```

---

## Task 9: Final Verification

- [ ] **Step 1: Run full type-check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run dev server and verify full flow**

Run: `npm run dev`

Test the complete flow:
1. Open `/destinations/explore`
2. Search for "Berlin" → select BER
3. Browse destination grid → filter by Beach
4. Click "Palma de Mallorca" → URL updates to `?origin=BER&destination=PMI&segment=beach-holiday`
5. If Hygraph schema is set up (Task 4 done): verify CMS content renders with beach variant + federated flight cards
6. If Hygraph schema not yet set up: verify page renders without errors, flight API calls work

- [ ] **Step 3: Test API endpoints directly**

```bash
curl "http://localhost:3000/api/flights/airports?query=lon" | jq
curl "http://localhost:3000/api/flights/routes?origin=MUC" | jq '.[:3]'
curl "http://localhost:3000/api/flights/offers?origin=DUS&destination=BCN" | jq
```

- [ ] **Step 4: Deploy and verify Hygraph federation**

```bash
git push
```

After deploy, test the federated query in Hygraph API Playground (see Task 4, Step 9).

- [ ] **Step 5: Commit any remaining fixes**

```bash
git add -A
git commit -m "fix: address any remaining issues from final verification"
```
