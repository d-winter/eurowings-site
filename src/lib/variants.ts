/**
 * Apply the first matching variant's fields over the base entry.
 * Only overrides fields that are non-null/undefined in the variant.
 * Pattern from: ~/dev/work/hygraph-showcase/app/[locale]/blog/[slug]/page.tsx
 */
export function applyVariant<T extends object>(
  base: T,
  variants?: Array<Partial<T>>
): T {
  const variant = variants?.[0];
  if (!variant) return base;

  const overrides: Partial<T> = {};
  for (const [key, value] of Object.entries(variant)) {
    if (value !== null && value !== undefined) {
      (overrides as Record<string, unknown>)[key] = value;
    }
  }
  return { ...base, ...overrides };
}

/**
 * Normalize a segment name to a URL-safe slug.
 * "Beach Holiday" → "beach-holiday", "City Trip" → "city-trip"
 */
export function segmentNameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Find a segment ID by slug (normalized name) or direct ID.
 * Supports both `segment=beach-holiday` and `segment=cmn4nfi4sp00u07w1...`
 * so Hygraph live preview can pass IDs directly.
 */
export function findSegmentId(
  segments: Array<{ id: string; name: string }>,
  slugOrId: string
): string | undefined {
  // Direct ID match
  const byId = segments.find((s) => s.id === slugOrId);
  if (byId) return byId.id;
  // Slug match
  return segments.find((s) => segmentNameToSlug(s.name) === slugOrId)?.id;
}
