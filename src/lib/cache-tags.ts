/**
 * Tag for all published Hygraph `fetch` calls (see `hygraphFetch`).
 * Invalidate via `revalidateTag(HYGRAPH_CACHE_TAG)` — e.g. from `/api/revalidate`.
 */
export const HYGRAPH_CACHE_TAG = "hygraph" as const;
