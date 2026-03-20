const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT || "";
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN || "";

export async function hygraphFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate = 60
): Promise<T> {
  if (!HYGRAPH_ENDPOINT) {
    console.warn("HYGRAPH_ENDPOINT not set – returning empty data");
    return {} as T;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (HYGRAPH_TOKEN) {
    headers["Authorization"] = `Bearer ${HYGRAPH_TOKEN}`;
  }

  const res = await fetch(HYGRAPH_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  const json = await res.json();

  if (json.errors) {
    console.error("Hygraph error:", JSON.stringify(json.errors, null, 2));
    throw new Error(json.errors[0]?.message || "Hygraph query failed");
  }

  return json.data;
}
