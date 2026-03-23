# Eurowings Site

A modern airline website built with [Next.js](https://nextjs.org/) and [Hygraph](https://hygraph.com/) CMS, inspired by the Eurowings brand.

## Getting Started

### Prerequisites

- Node.js 18+
- A Hygraph project with the Eurowings schema

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the environment file and add your Hygraph Content API endpoint:

```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and set `HYGRAPH_ENDPOINT` to your Hygraph Content API URL (found in Hygraph Studio > Project Settings > API Access).

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, promotions, and featured destinations |
| `/destinations` | All destinations listing |
| `/destinations/[slug]` | Individual destination page |
| `/faq` | FAQ page with accordion categories |
| `/pages/[slug]` | Flexible landing pages |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **CMS**: Hygraph (GraphQL)
- **Language**: TypeScript
- **Deployment**: Vercel

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set the `HYGRAPH_ENDPOINT` (and optional Hygraph tokens) in Vercel **Project → Settings → Environment Variables**.

### Auto-rebuild when content is published (Hygraph → Vercel)

To refresh the live site after editors publish in Hygraph, use a **Vercel Deploy Hook** and a **Hygraph webhook** (no app code required). Step-by-step: **[docs/hygraph-vercel-webhook.md](./docs/hygraph-vercel-webhook.md)** — same flow as [Hygraph’s Vercel webhook guide](https://hygraph.com/docs/developer-guides/webhooks/trigger-static-build).

**Summary:** Vercel **Settings → Git → Deploy Hooks** → copy URL → Hygraph **Project settings → AI & Automation → Webhooks** → paste URL, stage **Published**, configure triggers. Keep the deploy hook URL secret.

Published API responses are also cached with **~60s revalidation** (`src/lib/hygraph.ts`); a deploy hook guarantees a full rebuild after publish (needed for new static routes and when you want immediate consistency).
