import type { ContentSectionData } from "@/lib/types";

interface Props {
  section: ContentSectionData;
  entryId?: string;
}

export default function ContentSection({ section, entryId }: Props) {
  const chain = section.id
    ? JSON.stringify([{ fieldApiId: "contentSections", instanceId: section.id }])
    : undefined;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      {section.heading && (
        <h2
          className="mb-4 text-2xl font-bold text-ew-dark"
          data-hygraph-entry-id={entryId}
          data-hygraph-field-api-id="heading"
          data-hygraph-component-chain={chain}
        >
          {section.heading}
        </h2>
      )}
      {section.body?.html && (
        <div
          className="prose-ew"
          dangerouslySetInnerHTML={{ __html: section.body.html }}
          data-hygraph-entry-id={entryId}
          data-hygraph-field-api-id="body"
          data-hygraph-component-chain={chain}
          data-hygraph-rich-text-format="html"
        />
      )}
    </div>
  );
}
