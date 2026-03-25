import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { normalizeInternalHref } from "@/lib/internal-link";
import type { SplitBannerContentBlock } from "@/lib/types";

function BannerCta({
  cta,
  brandPanel,
}: {
  cta: NonNullable<SplitBannerContentBlock["cta"]>;
  brandPanel: boolean;
}) {
  const className = brandPanel
    ? `inline-flex w-fit items-center rounded-full px-8 py-3.5 text-center text-base font-bold transition-colors ${
        cta.variant === "PRIMARY"
          ? "bg-white text-ew-primary hover:bg-white/90"
          : cta.variant === "SECONDARY"
            ? "bg-ew-accent text-ew-dark hover:bg-amber-400"
            : cta.variant === "OUTLINE"
              ? "border-2 border-white text-white hover:bg-white/10"
              : "font-semibold text-white underline decoration-white/70 underline-offset-4 hover:decoration-white"
      }`
    : `inline-flex w-fit items-center rounded-full px-8 py-3.5 text-center text-base font-bold transition-colors ${
        cta.variant === "PRIMARY"
          ? "bg-ew-primary text-white hover:bg-ew-primary-dark"
          : cta.variant === "SECONDARY"
            ? "bg-ew-accent text-ew-dark hover:bg-amber-400"
            : cta.variant === "OUTLINE"
              ? "border-2 border-ew-primary text-ew-primary hover:bg-ew-primary hover:text-white"
              : "font-semibold text-ew-primary underline-offset-4 hover:underline"
      }`;

  const attrs = {
    "data-hygraph-entry-id": cta.id,
    "data-hygraph-field-api-id": "label" as const,
  };

  if (/^https?:\/\//i.test(cta.url)) {
    return (
      <a
        href={cta.url}
        target={cta.openInNewTab ? "_blank" : undefined}
        rel={cta.openInNewTab ? "noopener noreferrer" : undefined}
        className={className}
        {...attrs}
      >
        {cta.label}
      </a>
    );
  }

  return (
    <Link href={normalizeInternalHref(cta.url)} className={className} {...attrs}>
      {cta.label}
    </Link>
  );
}

type Props = {
  block: SplitBannerContentBlock;
  /** When inside landing page grid, parent adds column span */
  embedded?: boolean;
  /** Homepage entry ID for component-based click-to-edit */
  entryId?: string;
  /** Component field apiId (e.g., "splitBanners") for click-to-edit chain */
  componentField?: string;
};

/**
 * Hygraph **ContentBlock** model: full-width split layout (image left/right + title + CTA),
 * similar to the “Fly flexibly, fly relaxed” strip under search on eurowings.com.
 */
export default function ContentBlockBanner({ block, embedded, entryId, componentField }: Props) {
  // Use parent entry ID with component chain for embedded components, or block's own ID for relations
  const eid = entryId || block.id;
  const imageOnLeft = block.imageSide !== "RIGHT";
  const brandPanel = block.panelStyle === "BRAND";

  const textColClass = brandPanel
    ? "flex w-full flex-col justify-center bg-gradient-to-br from-[#7A0344] via-[#A1045A] to-[#0088aa] px-6 py-10 sm:px-10 lg:w-1/2 lg:px-14 lg:py-12"
    : "flex w-full flex-col justify-center bg-ew-light px-6 py-10 sm:px-10 lg:w-1/2 lg:px-14 lg:py-12";

  const titleClass = brandPanel
    ? "text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl"
    : "text-3xl font-extrabold leading-tight tracking-tight text-ew-dark sm:text-4xl";

  const subClass = brandPanel
    ? "mt-4 max-w-xl text-lg leading-relaxed text-white/85"
    : "mt-4 max-w-xl text-lg leading-relaxed text-ew-grey";

  const inner = (
    <div
      className={`flex min-h-[min(22rem,70vw)] flex-col lg:min-h-[24rem] lg:flex-row ${imageOnLeft ? "" : "lg:flex-row-reverse"}`}
    >
      <div
        className="relative aspect-[4/3] w-full lg:aspect-auto lg:w-1/2 lg:min-h-[24rem]"
        data-hygraph-entry-id={eid}
        data-hygraph-field-api-id="image"
      >
        {block.image?.url ? (
          <Image
            src={block.image.url}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={!embedded}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ew-primary/20 to-ew-primary-light/10" />
        )}
      </div>

      <div className={textColClass} data-hygraph-entry-id={eid} data-hygraph-field-api-id="panelStyle">
        <h2 className={titleClass} data-hygraph-field-api-id="title">
          {block.title}
        </h2>
        {block.subheading && (
          <p className={subClass} data-hygraph-field-api-id="subheading">
            {block.subheading}
          </p>
        )}
        {block.cta && (
          <div className="mt-8">
            <BannerCta cta={block.cta} brandPanel={brandPanel} />
          </div>
        )}
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="overflow-hidden rounded-2xl border border-black/5 shadow-sm lg:rounded-none lg:border-0 lg:shadow-none">
        {inner}
      </div>
    );
  }

  return (
    <section
      className={`w-full border-y border-black/5 ${brandPanel ? "bg-[#7A0344]" : "bg-ew-light"}`}
      aria-label={block.title}
    >
      <div className="mx-auto max-w-7xl">{inner}</div>
    </section>
  );
}
