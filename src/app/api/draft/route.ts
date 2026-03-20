import { draftMode, cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publication = searchParams.get("publication") || "";
  const slug = searchParams.get("slug") || "";
  const secret = searchParams.get("secret");

  const expectedSecret = process.env.HYGRAPH_PREVIEW_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return new Response("Invalid preview token", { status: 401 });
  }

  draftMode().enable();

  // Workaround: set sameSite=none so the cookie works inside Hygraph's iframe
  // See https://github.com/vercel/next.js/issues/49927
  const cookieStore = cookies();
  const cookie = cookieStore.get("__prerender_bypass");
  if (cookie) {
    cookies().set({
      name: "__prerender_bypass",
      value: cookie.value,
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "none",
    });
  }

  const path = publication
    ? `/${publication}/${slug}`.replace(/\/+/g, "/")
    : slug
    ? `/${slug}`
    : "/";

  redirect(`${path}?preview=true`);
}
