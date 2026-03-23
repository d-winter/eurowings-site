# On-demand revalidation (Hygraph → Next.js)

Published Hygraph content is fetched with **tagged caching** (`hygraph` tag, 60s time-based revalidation). Calling **`POST /api/revalidate`** clears that cache so the next request loads fresh CMS data—usually **within seconds**, without a full Vercel build.

## 1. Set the secret

1. Generate a long random string (e.g. `openssl rand -hex 32`).
2. Add to **Vercel** → Project → **Settings** → **Environment Variables**:
   - Name: `REVALIDATE_SECRET`
   - Value: your random string  
   - Apply to **Production** (and Preview/Development if you use webhooks there).
3. Add the same variable locally in `.env.local` for testing.

## 2. Point Hygraph at the route

In **Hygraph Studio** → **Project settings** → **AI & Automation** → **Webhooks** → **Add webhook**:

| Field | Suggestion |
|--------|------------|
| **URL** | `https://<your-production-domain>/api/revalidate?secret=<REVALIDATE_SECRET>` |
| **Stage** | **Published** (avoid rebuilding cache on every draft save) |
| **Action** | Leave empty for publish + unpublish, or restrict as needed |
| **Content model** | Empty = all models, or limit to specific models |

Replace `<REVALIDATE_SECRET>` with the **same** value as the env var (URL-encoded if it contains special characters).

**Security:** The URL is sensitive (like a password). Only share it with Hygraph project admins; never commit it to git.

### Alternative: `Authorization` header

If you prefer not to put the secret in the query string, use a tool that can add headers, or a tiny proxy. This app also accepts:

```http
POST /api/revalidate
Authorization: Bearer <REVALIDATE_SECRET>
```

Hygraph’s default webhook UI only provides a URL field; the **query parameter** approach is usually simplest.

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
