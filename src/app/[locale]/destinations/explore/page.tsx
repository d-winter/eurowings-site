import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

/**
 * Redirect /destinations/explore to /destinations, preserving search params.
 * The explore functionality is now merged into the main destinations page.
 */
export default async function ExploreRedirect({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value) qs.set(key, value);
  }
  const query = qs.toString();
  const prefix = locale === "en" ? "" : `/${locale}`;
  redirect(`${prefix}/destinations${query ? `?${query}` : ""}`);
}
