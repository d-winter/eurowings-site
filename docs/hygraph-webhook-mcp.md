# Hygraph webhook (created via Management API / MCP)

A webhook named **Next.js on-demand revalidation** is configured in the Hygraph project to call your Next.js **`POST /api/revalidate`** endpoint when content is **published** or **unpublished**.

## What was configured

| Setting | Value |
|--------|--------|
| **Trigger** | Content model — **PUBLISH** and **UNPUBLISH** |
| **Models** | All models |
| **Stages** | All stages (publish/unpublish are stage transitions) |
| **Payload** | Disabled (`includePayload: false`) for smaller requests |
| **Security** | Hygraph **secret key** (signed requests via `gcms-signature` header) |

The endpoint verifies signatures with [`@hygraph/utils`](https://www.npmjs.com/package/@hygraph/utils) — same flow as [Hygraph webhook security docs](https://hygraph.com/docs/api-reference/basics/webhooks#securing-webhooks).

## What you must do

### 1. Production URL

The webhook URL was set to:

`https://eurowings-site.vercel.app/api/revalidate`

If your production host is different (custom domain or another Vercel project name), open **Hygraph Studio → Project settings → AI & Automation → Webhooks**, edit **Next.js on-demand revalidation**, and update the URL to:

`https://<your-production-host>/api/revalidate`

### 2. `REVALIDATE_SECRET` on Vercel

The Hygraph webhook **secret key** and Vercel env **`REVALIDATE_SECRET`** must be **identical** (the value generated when the webhook was created).

1. In Hygraph: **Webhooks** → open **Next.js on-demand revalidation** → copy or rotate the **Secret key** (or use the value you stored when the webhook was set up).
2. In Vercel: **Settings → Environment Variables** → set **`REVALIDATE_SECRET`** to that exact string (Production, and Preview if needed).
3. **Redeploy** so the server picks up the variable.

### 3. Test

After deploy, use **Hygraph → Webhook logs** for the webhook, or publish a small content change and confirm the log shows **HTTP 200** from your app.

## Rotating the secret

1. Generate a new random string (e.g. `openssl rand -hex 32`).
2. In Hygraph, edit the webhook and set the new **Secret key**.
3. Update **`REVALIDATE_SECRET`** in Vercel and redeploy.

## Recreating via MCP

Hygraph Management API operation **`createWebhook`** accepts `triggerActions` as **uppercase** enum values: `PUBLISH`, `UNPUBLISH`, `CREATE`, `UPDATE`, `DELETE`, etc. (The MCP schema example may show lowercase; the API expects uppercase.)
