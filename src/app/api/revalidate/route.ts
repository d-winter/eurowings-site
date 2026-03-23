import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@hygraph/utils";
import { HYGRAPH_CACHE_TAG } from "@/lib/cache-tags";

/** Node runtime — @hygraph/utils uses Node crypto for HMAC verification */
export const runtime = "nodejs";

/**
 * On-demand revalidation for Hygraph-driven pages.
 *
 * **Recommended (Hygraph webhooks with secret key):** Hygraph sends `gcms-signature`;
 * set the same value in `REVALIDATE_SECRET` as the webhook’s secret key in Studio.
 *
 * **Legacy:** `?secret=`, `Authorization: Bearer`, or JSON `{ "secret": "..." }`.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "REVALIDATE_SECRET is not configured" },
      { status: 503 }
    );
  }

  const gcmsSignature = request.headers.get("gcms-signature");

  if (gcmsSignature) {
    const rawBody = await request.text();
    const valid = verifyWebhookSignature({
      signature: gcmsSignature,
      secret,
      rawPayload: rawBody,
    });
    if (!valid) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    revalidateTag(HYGRAPH_CACHE_TAG);
    return NextResponse.json({
      revalidated: true,
      tag: HYGRAPH_CACHE_TAG,
      via: "hygraph-signature",
      now: Date.now(),
    });
  }

  const auth = request.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  const querySecret = request.nextUrl.searchParams.get("secret")?.trim() ?? null;

  if (bearer === secret || querySecret === secret) {
    revalidateTag(HYGRAPH_CACHE_TAG);
    return NextResponse.json({
      revalidated: true,
      tag: HYGRAPH_CACHE_TAG,
      via: "token",
      now: Date.now(),
    });
  }

  const rawBody = await request.text();
  try {
    const body = JSON.parse(rawBody) as { secret?: string };
    if (typeof body.secret === "string" && body.secret.trim() === secret) {
      revalidateTag(HYGRAPH_CACHE_TAG);
      return NextResponse.json({
        revalidated: true,
        tag: HYGRAPH_CACHE_TAG,
        via: "body",
        now: Date.now(),
      });
    }
  } catch {
    // not JSON
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
