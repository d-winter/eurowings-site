# Hygraph webhooks → Vercel (automatic rebuilds)

When editors **publish** or **unpublish** content in Hygraph, you can trigger a **new Vercel deployment** so the site is rebuilt against fresh CMS data. This matches Hygraph’s guide: [Deploy your Vercel project with Hygraph webhooks](https://hygraph.com/docs/developer-guides/webhooks/trigger-static-build).

## What you get

- **Automatic**: No manual “Redeploy” in Vercel after each publish.
- **Fresh static output**: New `generateStaticParams` entries (e.g. new destination slugs) appear after the deploy finishes.
- **Not millisecond-instant**: A deploy usually takes **~1–3 minutes**. Until it completes, users still see the previous deployment.

The app also uses **ISR** (`revalidate: 60` in `src/lib/hygraph.ts` for published content), so **small text edits** can show up within about a minute **without** a deploy. Webhooks are still useful for **new URLs**, **structural changes**, and when you want a **full, predictable** refresh right after publish.

## 1. Create a Vercel Deploy Hook

1. Open your project on [Vercel](https://vercel.com) → **Settings** → **Git**.
2. Scroll to **Deploy Hooks**.
3. Create a hook: choose a **name** (e.g. `Hygraph publish`) and the **branch** to build (usually `main`).
4. Copy the generated URL.

**Important:** Anyone with the URL can trigger a deploy. **Do not commit it** or share it publicly—treat it like a password.

## 2. Add the webhook in Hygraph

1. In **Hygraph Studio** → **Project settings** → **AI & Automation** → **Webhooks** → **Add webhook**.
2. **URL**: paste the Vercel Deploy Hook URL.
3. Optional: disable **Include payload** if you only need the trigger (as in the Hygraph guide).
4. **Triggers** (recommended for production):
   - **Stage**: **Published** — so drafts don’t trigger production deploys.
   - **Action**: leave empty to fire on publish **and** unpublish, or narrow as needed.
   - **Content model**: leave empty to trigger on any model, or restrict to specific models.

Webhooks are **per Hygraph environment**; repeat for staging if you use multiple environments.

## 3. Verify

1. Publish a visible change in Hygraph (**Save and publish**).
2. In Vercel → **Deployments**, confirm a new deployment started.

## Optional: faster updates without a full deploy

For **near-instant** cache busting without rebuilding the whole site, you can add a Next.js **on-demand revalidation** route and point Hygraph to that URL instead (or in addition). That is a separate pattern from deploy hooks; deploy hooks are the simplest ops-wise.

## References

- [Hygraph: Deploy your Vercel project with webhooks](https://hygraph.com/docs/developer-guides/webhooks/trigger-static-build)
- [Vercel: Deploy Hooks](https://vercel.com/docs/deploy-hooks)
