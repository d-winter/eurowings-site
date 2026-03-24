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

const SEGMENT_COLORS: Record<string, string> = {
  "city-trip": "bg-blue-100 text-blue-700",
  "beach-holiday": "bg-amber-100 text-amber-700",
  "adventure": "bg-emerald-100 text-emerald-700",
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
      className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all hover:shadow-md hover:border-ew-primary/30"
    >
      <div>
        <h3 className="font-semibold text-ew-dark">{city}</h3>
        <p className="text-sm text-ew-grey">{country} &middot; {iataCode}</p>
        <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${SEGMENT_COLORS[segment] || "bg-gray-100 text-gray-600"}`}>
          {SEGMENT_LABELS[segment] || segment}
        </span>
      </div>
      <div className="text-right">
        <p className="text-xs text-ew-grey">from</p>
        <p className="text-lg font-bold text-ew-primary">
          {formatPrice(lowestPrice, currency)}
        </p>
      </div>
    </button>
  );
}
