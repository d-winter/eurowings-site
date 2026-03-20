import { formatPrice } from "@/lib/types";
import type { FlightOffer } from "@/lib/types";

export default function FlightOfferCard({ offer }: { offer: FlightOffer }) {
  const eid = offer.id;
  const dateStr = offer.travelDate
    ? new Date(offer.travelDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-ew-grey">
          <span
            className="font-medium text-ew-dark"
            data-hygraph-entry-id={eid}
            data-hygraph-field-api-id="originAirport"
          >
            {offer.originAirport}
          </span>
          <svg className="h-4 w-4 text-ew-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <span
            className="font-medium text-ew-dark"
            data-hygraph-entry-id={eid}
            data-hygraph-field-api-id="destinationAirport"
          >
            {offer.destinationAirport}
          </span>
        </div>
        {dateStr && (
          <p
            className="mt-1 text-xs text-ew-grey"
            data-hygraph-entry-id={eid}
            data-hygraph-field-api-id="travelDate"
          >
            {dateStr}
          </p>
        )}
      </div>

      <div
        className="text-right"
        data-hygraph-entry-id={eid}
        data-hygraph-field-api-id="priceFrom"
      >
        <p className="text-xs text-ew-grey">from</p>
        <p className="text-xl font-bold text-ew-primary">
          {formatPrice(offer.priceFrom, offer.currency)}
        </p>
      </div>
    </div>
  );
}
