# On-demand revalidation (Hygraph → Next.js)

Published Hygraph content is fetched with **tagged caching** (`hygraph` tag, 60s time-based revalidation). Calling **`POST /api/revalidate`** clears that cache so the next request loads fresh CMS data—usually **within seconds**, without a full Vercel build.

## Recommended: Hygraph webhook **secret key** (signed)

This matches [Hygraph’s webhook security model](https://hygraph.com/docs/api-reference/basics/webhooks#securing-webhooks):

1. In Hygraph, create or edit the webhook → set a **Secret key** (shared secret).
2. Point the webhook URL to `https://<your-domain>/api/revalidate` (no query string required).
3. Set **`REVALIDATE_SECRET`** in Vercel to the **same** value as the Hygraph secret key and redeploy.

Hygraph sends the **`gcms-signature`** header; the route verifies it with **`@hygraph/utils`** using the **raw request body** (required for a valid HMAC).

A webhook was provisioned via Hygraph Management API — see **[hygraph-webhook-mcp.md](./hygraph-webhook-mcp.md)** for URL and env alignment.

## 1. Set the secret (`REVALIDATE_SECRET`)

1. Use the same string as the Hygraph webhook **Secret key** (or generate with `openssl rand -hex 32` and paste into both Hygraph and Vercel).
2. Add to **Vercel** → **Settings** → **Environment Variables** → **`REVALIDATE_SECRET`** (Production, etc.).
3. Add to **`.env.local`** for local tests.

## 2. Hygraph webhook URL

| Field | Suggestion |
|--------|------------|
| **URL** | `https://<your-production-domain>/api/revalidate` |
| **Secret key** | Same value as **`REVALIDATE_SECRET`** |
| **Stage / Action** | Restrict as needed (e.g. **Published** + publish/unpublish only) |

### Legacy (no Hygraph secret key)

You can still call the route with:

- `https://<domain>/api/revalidate?secret=<REVALIDATE_SECRET>`, or  
- `Authorization: Bearer <REVALIDATE_SECRET>`, or  
- JSON body `{ "secret": "<REVALIDATE_SECRET>" }`.

Prefer the **signed webhook** path for production; query strings can leak in logs.

## 3. Test

```bash
curl -X POST "https://<your-domain>/api/revalidate?secret=YOUR_SECRET"
```

Expected: `200` and JSON `{ "revalidated": true, "tag": "hygraph", ... }`.

Wrong or missing secret → `401`. Missing `REVALIDATE_SECRET` on the server → `503`.

## Behaviour notes

- **Content updates** on existing pages: reflected after the webhook runs and the next visitor (or CDN) misses cache.
- **New destination / landing slugs**: With the App Router default (`dynamicParams`), new slugs are typically served on first request after cache invalidation. A **Vercel deploy** is still the surest way to refresh `generateStaticParams` output for purely static export scenarios; for this project, on-demand revalidation is usually enough.
- **Draft / Preview**: Draft content uses `cache: "no-store"` and is **not** tagged; preview mode is unchanged.

## Deploy hooks vs on-demand

| Approach | Speed | Use case |
|----------|--------|----------|
| **On-demand revalidation** (this doc) | Seconds | Day-to-day CMS publishes |
| **[Vercel Deploy Hooks](./hygraph-vercel-webhook.md)** | Minutes | Full rebuild, dependency updates, guaranteed static param refresh |

You can use **both**: webhook → `/api/revalidate` for speed, deploy hook occasionally or for major releases.

## References

- [Next.js: `revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- [Next.js: On-demand revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation-with-revalidatetag)
