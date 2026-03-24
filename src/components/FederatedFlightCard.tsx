import { formatPrice } from "@/lib/types";
import type { FederatedFlightOffer } from "@/lib/types";

export default function FederatedFlightCard({ offer }: { offer: FederatedFlightOffer }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-ew-grey">
          <span className="font-medium text-ew-dark">{offer.departureAirport}</span>
          <svg className="h-4 w-4 text-ew-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <span className="font-medium text-ew-dark">{offer.arrivalAirport}</span>
        </div>
        <p className="mt-1 text-xs text-ew-grey">
          {offer.airline} &middot; {offer.flightNumber}
        </p>
        <p className="mt-0.5 text-xs text-ew-grey">
          {offer.departureTime} → {offer.arrivalTime} &middot; {offer.duration}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-ew-grey">from</p>
        <p className="text-xl font-bold text-ew-primary">
          {formatPrice(offer.price, offer.currency)}
        </p>
      </div>
    </div>
  );
}
