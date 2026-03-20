import type { ContentSectionData } from "@/lib/types";

export default function ContentSection({
  section,
}: {
  section: ContentSectionData;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      {section.heading && (
        <h2 className="mb-4 text-2xl font-bold text-ew-dark">
          {section.heading}
        </h2>
      )}
      {section.body?.html && (
        <div
          className="prose-ew"
          dangerouslySetInnerHTML={{ __html: section.body.html }}
        />
      )}
    </div>
  );
}
