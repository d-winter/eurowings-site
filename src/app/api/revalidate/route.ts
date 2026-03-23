import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { HYGRAPH_CACHE_TAG } from "@/lib/cache-tags";

/**
 * On-demand revalidation for Hygraph-driven pages.
 *
 * Configure Hygraph webhook URL, e.g.:
 *   https://<your-domain>/api/revalidate?secret=<REVALIDATE_SECRET>
 *
 * Or send header: Authorization: Bearer <REVALIDATE_SECRET>
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "REVALIDATE_SECRET is not configured" },
      { status: 503 }
    );
  }

  const auth = request.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  const querySecret = request.nextUrl.searchParams.get("secret")?.trim() ?? null;

  const authorizedByHeaderOrQuery =
    (bearer != null && bearer === secret) || (querySecret != null && querySecret === secret);

  if (!authorizedByHeaderOrQuery) {
    let bodySecret: string | undefined;
    try {
      const body = (await request.json()) as { secret?: string } | null;
      if (body && typeof body.secret === "string") {
        bodySecret = body.secret.trim();
      }
    } catch {
      // No / invalid JSON body
    }
    if (bodySecret !== secret) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  revalidateTag(HYGRAPH_CACHE_TAG);

  return NextResponse.json({
    revalidated: true,
    tag: HYGRAPH_CACHE_TAG,
    now: Date.now(),
  });
}
