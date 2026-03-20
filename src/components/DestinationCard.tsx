import Image from "next/image";
import Link from "next/link";
import type { DestinationPage } from "@/lib/types";
import { formatPrice } from "@/lib/types";

export default function DestinationCard({
  destination,
}: {
  destination: DestinationPage;
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative flex h-64 overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl"
    >
      {destination.coverImage?.url ? (
        <Image
          src={destination.coverImage.url}
          alt={destination.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-ew-primary to-ew-primary-dark" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="relative z-10 mt-auto w-full p-5">
        <h3 className="text-lg font-bold text-white">
          {destination.title}
        </h3>
        {destination.airport && (
          <p className="text-sm text-white/70">
            {destination.airport.name} ({destination.airport.iataCode})
          </p>
        )}
        {destination.startingPrice != null && (
          <p className="mt-2 text-sm text-white/90">
            Flights from{" "}
            <span className="text-base font-bold text-ew-accent">
              {formatPrice(
                destination.startingPrice,
                destination.currency
              )}
            </span>
          </p>
        )}
      </div>
    </Link>
  );
}
