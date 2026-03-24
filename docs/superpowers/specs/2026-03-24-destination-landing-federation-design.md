# Destination Landing Page with Content Federation

**Date:** 2026-03-24
**Status:** Approved
**Context:** US-4 demo — Prices & Routes pages with Hygraph Variants + Content Federation

## Goal

Add a destination landing page that demonstrates two Hygraph capabilities:
1. **Variants** — one CMS entry serves different content experiences (hero, copy, tone) based on a travel segment (city-trip, beach-holiday, adventure)
2. **Content Federation** — flight offer data is fetched live from an external service via a REST Remote Source, not stored in the CMS

The frontend combines both in a single GraphQL query: variant-driven editorial content alongside federated flight data.

## Architecture

```
Flight Data Service (Next.js API routes)
  /api/flights/airports   — autocomplete
  /api/flights/routes     — destinations from origin
  /api/flights/offers     — flight offers for a route
        │
        ▼
Hygraph REST Remote Source ──► Remote field on DestinationLandingPage
        │
        ▼
Hygraph Content API
  DestinationLandingPage entry
    Default content + 3 segment variants
    + federated flightOffers remote field
        │
        ▼
Frontend (Next.js)
  /destinations/explore
  Single query returns variant content + flight data
```

## 1. Flight Data Service

Three Next.js API routes deployed with the site on Vercel. Hygraph calls these via Content Federation.

### Endpoints

| Endpoint | Purpose | Params |
|----------|---------|--------|
| `GET /api/flights/airports` | Airport autocomplete | `query` (string) |
| `GET /api/flights/routes` | Available destinations from origin | `origin` (IATA code) |
| `GET /api/flights/offers` | Flight offers for a route | `origin`, `destination` (IATA codes) |

### Data Structures

**Airport:**
```ts
interface FlightAirport {
  iataCode: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
}
```

**Route (destination):**
```ts
interface FlightRoute {
  destination: FlightAirport;
  segment: "city-trip" | "beach-holiday" | "adventure";
  lowestPrice: number;
  currency: string;
}
```

**Flight offer:**
```ts
interface FlightOffer {
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departure: { airport: string; time: string };
  arrival: { airport: string; time: string };
  duration: string;
  price: number;
  currency: string;
  date: string;
}
```

### Dataset

Rich static JSON covering all 6 Eurowings hubs as origins:
- **CGN** (Cologne/Bonn)
- **DUS** (Dusseldorf)
- **BER** (Berlin)
- **STR** (Stuttgart)
- **HAM** (Hamburg)
- **MUC** (Munich)

Each origin has ~30-50 destinations with realistic European routes. Destinations are tagged with one of 3 segments. Multiple flight offers per route with varied airlines (primarily Eurowings, plus Lufthansa, Ryanair, easyJet where realistic), plausible prices, and varied times.

The dataset uses real IATA codes, real airport names, real airline names, and plausible pricing for European short-haul routes.

### Demo Narrative

> "This flight data service represents your existing booking system or any external API. Hygraph federates it via a REST Remote Source — the CMS doesn't store this data, it queries it live."

## 2. Hygraph Schema

### Segments (system model entries)

The `Segment` model is a Hygraph system model that already exists in this project (confirmed via entity type listing). It has no entries yet. We create 3:

| Name | Description |
|------|-------------|
| City Trip | Urban destinations — culture, nightlife, sightseeing |
| Beach Holiday | Sun, sea, and sand destinations |
| Adventure | Nature, hiking, outdoor experiences |

Segment IDs will be used for variant queries (Hygraph filters by segment ID, not slug — per the showcase pattern).

### New Model: `DestinationLandingPage`

| Field | apiId | Type | Variant-enabled | Required | Localized | Notes |
|-------|-------|------|-----------------|----------|-----------|-------|
| Title | `title` | String | Yes | Yes | Yes | Page title per segment |
| Slug | `slug` | String | No | Yes | No | Unique, single entry: `destination` |
| Hero Heading | `heroHeading` | String | Yes | No | Yes | Variant: "Beach paradise" vs "Urban adventure" |
| Hero Subheading | `heroSubheading` | String | Yes | No | Yes | Supporting copy |
| Hero Image | `heroImage` | Asset relation | Yes | No | No | Different hero per segment |
| Description | `description` | Rich Text | Yes | No | Yes | Longer intro copy per segment |
| Content Sections | `contentSections` | Component list (ContentSection) | Yes | No | — | Reuses existing component |
| SEO | `seo` | Component (Seo) | No | No | — | Shared across variants |
| CTA | `cta` | Relation to CtaButton | Yes | No | No | Segment-specific CTA |
| Flight Offers | `flightOffers` | Remote field (REST) | No | No | No | Federated from flight data service |

### REST Remote Source

- **Display name:** Flight Data Service
- **Prefix:** `FLIGHTS`
- **Kind:** Custom
- **URL:** `https://<deployed-site>/api/flights`
- **SDL:**
  ```graphql
  type FLIGHTSOffer {
    airline: String!
    airlineCode: String!
    flightNumber: String!
    departureAirport: String!
    departureTime: String!
    arrivalAirport: String!
    arrivalTime: String!
    duration: String!
    price: Float!
    currency: String!
    date: String!
  }
  ```

### Remote Field: `flightOffers`

- **Parent model:** `DestinationLandingPage`
- **Type:** REST
- **REST path:** `/offers?origin={{args.origin}}&destination={{args.destination}}`
- **Input args:** `origin` (String, required), `destination` (String, required)
- **Return type:** `FLIGHTSOffer` (list)
- **Cache TTL:** 300 seconds

### Manual Steps in Hygraph Studio

After creating the model and fields via the Management API:
1. Enable variants on fields: `title`, `heroHeading`, `heroSubheading`, `heroImage`, `description`, `contentSections`, `cta` (per-field setting in field configuration)
2. Link variant configuration to the 3 segments
3. Create the single entry (slug: `destination`) with default content + 3 variant overrides

### API Route Response Shape

The flight data API routes must return **flat** fields matching the SDL (not the nested TypeScript interface). The `/api/flights/offers` endpoint returns:
```json
{
  "airline": "Eurowings",
  "airlineCode": "EW",
  "flightNumber": "EW 7544",
  "departureAirport": "CGN",
  "departureTime": "06:45",
  "arrivalAirport": "PMI",
  "arrivalTime": "09:30",
  "duration": "2h 45m",
  "price": 49.99,
  "currency": "EUR",
  "date": "2026-04-15"
}
```
This flat shape matches the `FLIGHTSOffer` SDL type. The nested `departure`/`arrival` objects in the TypeScript interface are for internal use only.

## 3. Frontend

### Route

`/destinations/explore` — accessible at `/destinations/explore` (en) and `/de/destinations/explore` (de).

**Routing note:** This is a static route at `src/app/[locale]/destinations/explore/page.tsx`. In Next.js App Router, it takes precedence over the existing `[slug]` dynamic route at `src/app/[locale]/destinations/[slug]/page.tsx`. No existing destination entry should use `explore` as a slug.

### Page Flow

1. **Initial state:** Origin airport selector (autocomplete) + destination route grid
2. **Destination selected:** Variant-driven landing content + federated flight offer cards

### Components

**`AirportSearch`** — autocomplete input
- Calls `/api/flights/airports?query=...` with debounce
- Dropdown with matching airports
- Selecting an origin loads the route grid

**`RouteGrid`** — grid of destination cards
- Calls `/api/flights/routes?origin=CGN`
- Each card: city name, country, segment tag, lowest price
- Clicking navigates to landing view with `?origin=CGN&destination=PMI&segment=beach-holiday`
- The `segment` param is included in the URL so the landing view knows which variant to request

**`DestinationLanding`** — variant-aware content view
- Reads `origin`, `destination`, and `segment` from URL search params
- Looks up segment ID from segment name (fetched via `GetSegments` query, cached)
- Queries Hygraph with segment ID for variant resolution
- Renders: hero (variant), description (variant), content sections (variant), CTA (variant)
- Below editorial content: federated flight offer cards

**`FederatedFlightCard`** — single flight offer display
- Airline, flight number, times, duration, price
- Follows existing `FlightOfferCard` styling patterns

### GraphQL Query

Based on the proven pattern from the hygraph-showcase repo:

```graphql
query GetDestinationLandingPage($slug: String!, $locale: Locale!, $segmentId: ID, $origin: String!, $destination: String!) {
  destinationLandingPages(where: { slug: $slug }, locales: [$locale, en], stage: DRAFT, first: 1) {
    id
    title
    heroHeading
    heroSubheading
    heroImage { url }
    description { html }
    contentSections { heading body { html } }
    cta { label url variant }
    variants(where: { segments_some: { id: $segmentId } }) {
      title
      heroHeading
      heroSubheading
      heroImage { url }
      description { html }
      contentSections { heading body { html } }
      cta { label url variant }
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
```

Key differences from naive approach (validated by showcase):
- Uses `segments_some: { id: $segmentId }` — filters by segment **ID**, not slug
- Uses `locales: [$locale, en]` for locale fallback
- Uses `stage: DRAFT` for preview support, `PUBLISHED` for production
- Fetches via plural `destinationLandingPages` with `first: 1`

### Segment Lookup

Segments must be fetched to map segment names (from URL) to IDs (for the variant query):

```graphql
query GetSegments {
  segments(stage: DRAFT) {
    id
    name
  }
}
```

This is fetched once and cached. The frontend maps `?segment=beach-holiday` → segment ID → passes to variant query.

### Variant Resolution Logic

Field-level override pattern (from showcase):

```ts
function applyVariant<T extends Record<string, unknown>>(
  base: T,
  variants?: Array<Partial<T>>
): T {
  const variant = variants?.[0];
  if (!variant) return base;
  // Only override fields that the variant actually provides
  const overrides: Partial<T> = {};
  for (const [key, value] of Object.entries(variant)) {
    if (value !== null && value !== undefined) {
      (overrides as Record<string, unknown>)[key] = value;
    }
  }
  return { ...base, ...overrides };
}
```

## 4. Preview

Extend existing preview infrastructure:

**`src/lib/resolve-preview-path.ts`:**
- Add mapping: `DestinationLandingPage` -> `/destinations/explore`

**`src/lib/queries.ts`:**
- Add `GET_DESTINATION_LANDING_PAGE` query

**`src/lib/types.ts`:**
- Add `DestinationLandingPage` type and federated flight data types

Preview flow is unchanged: Hygraph Studio -> `/api/draft` -> draft mode -> page renders with draft content.

## Build Order

Sequential, each step validates the previous:

1. **Flight data service** — build API routes + seed rich dataset, deploy to Vercel
2. **Hygraph schema** — create model + fields via MCP, create segments, set up REST Remote Source + remote field, manual variant config in Studio, seed entry with variants
3. **Frontend** — build `/destinations/explore` page with all components
4. **Preview wiring** — extend resolve-preview-path, add query + types

## Demo Script

### Part 1: CMS Walkthrough
- Show the 3 segments: city-trip, beach-holiday, adventure
- Show the DestinationLandingPage entry with its variants
- Open each variant: different hero, different copy, different tone
- Show the federated flightOffers remote field
- "The editor created 3 content experiences. Flight data comes from an external service via Content Federation."

### Part 2: Frontend Walkthrough
- Open the site, pick origin airport
- See available destinations with segment tags and prices
- Click a city-trip destination -> urban hero, city copy, live flight cards
- Click a beach destination -> beach hero, relaxed copy, same flight data structure
- "Same page, same entry — completely different content experience. Driven by the CMS, fed by live data."

### Part 3: Round-Trip Edit
- Go back to CMS, change the Beach Holiday hero image
- Refresh frontend on a beach destination -> updated
- "Editor changes content, external data stays live. Each system does what it's best at."

## Reference Implementation

The `hygraph-showcase` repo at `~/dev/work/hygraph-showcase` demonstrates the exact patterns used here:
- **Variant queries:** `src/graphql/queries/Page.gql`, `src/graphql/queries/Article.gql`
- **Segment context:** `src/lib/context/SegmentContext.tsx` — URL param + cookie storage
- **Variant merge (page sections):** `app/[locale]/[slug]/page.tsx` — section-level replacement
- **Variant merge (article fields):** `app/[locale]/blog/[slug]/page.tsx` — field-level override
- **Content Federation:** `src/graphql/queries/Product.gql` — BigCommerce remote source
- **Segment switcher UI:** `src/components/ui/SegmentSwitcher` — dropdown for testing

## Out of Scope

- Real flight API integration (Amadeus/Duffel) — purpose-built flight data service is the intentional choice
- Booking flow
- Multiple DestinationLandingPage entries — single entry with variants is the demo pattern
- German translations for seed content — English only for the demo
