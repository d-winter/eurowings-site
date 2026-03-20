import type { Highlight } from "@/lib/types";

const ICON_MAP: Record<string, string> = {
  price: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  selection: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  security: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
};

export default function HighlightCard({
  highlight,
}: {
  highlight: Highlight;
}) {
  const iconPath =
    ICON_MAP[highlight.icon || ""] || ICON_MAP.price;

  return (
    <div className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ew-primary/10">
        <svg
          className="h-7 w-7 text-ew-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d={iconPath}
          />
        </svg>
      </div>
      <h3 className="text-base font-bold text-ew-dark">
        {highlight.heading}
      </h3>
      {highlight.description && (
        <p className="mt-2 text-sm leading-relaxed text-ew-grey">
          {highlight.description}
        </p>
      )}
    </div>
  );
}
