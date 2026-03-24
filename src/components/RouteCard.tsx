import { formatPrice } from "@/lib/types";

interface RouteCardProps {
  city: string;
  country: string;
  iataCode: string;
  segment: string;
  lowestPrice: number;
  currency: string;
  onClick: () => void;
}

const SEGMENT_ACCENT: Record<string, string> = {
  "city-trip": "border-l-blue-500",
  "beach-holiday": "border-l-amber-500",
  "adventure": "border-l-emerald-500",
};

const SEGMENT_COLORS: Record<string, string> = {
  "city-trip": "bg-blue-50 text-blue-700",
  "beach-holiday": "bg-amber-50 text-amber-700",
  "adventure": "bg-emerald-50 text-emerald-700",
};

const SEGMENT_LABELS: Record<string, string> = {
  "city-trip": "City Trip",
  "beach-holiday": "Beach",
  "adventure": "Adventure",
};

export default function RouteCard({
  city,
  country,
  iataCode,
  segment,
  lowestPrice,
  currency,
  onClick,
}: RouteCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center justify-between rounded-xl border border-gray-100 border-l-[3px] bg-white p-4 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:border-l-ew-primary ${SEGMENT_ACCENT[segment] || "border-l-gray-300"}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold text-ew-dark group-hover:text-ew-primary transition-colors">{city}</h3>
          <span className="shrink-0 font-mono text-[11px] font-medium text-ew-grey">{iataCode}</span>
        </div>
        <p className="mt-0.5 text-sm text-ew-grey">{country}</p>
        <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${SEGMENT_COLORS[segment] || "bg-gray-100 text-gray-600"}`}>
          {SEGMENT_LABELS[segment] || segment}
        </span>
      </div>
      <div className="ml-4 text-right">
        <p className="text-[11px] font-medium uppercase tracking-wide text-ew-grey">from</p>
        <p className="text-lg font-bold text-ew-primary">
          {formatPrice(lowestPrice, currency)}
        </p>
      </div>
    </button>
  );
}
