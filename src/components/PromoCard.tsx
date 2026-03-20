import Image from "next/image";
import Link from "next/link";
import type { Promotion } from "@/lib/types";
import { formatPrice } from "@/lib/types";

function CardInner({ promo }: { promo: Promotion }) {
  return (
    <>
      <div className="relative h-48 overflow-hidden bg-ew-light">
        {promo.image?.url ? (
          <Image
            src={promo.image.url}
            alt={promo.heading}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-ew-primary/10 to-ew-primary/5">
            <svg className="h-12 w-12 text-ew-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        )}
        {promo.priceFrom != null && (
          <div className="absolute bottom-3 right-3 rounded-full bg-ew-accent px-3 py-1 text-sm font-bold text-ew-dark shadow">
            from {formatPrice(promo.priceFrom, promo.currency)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ew-dark group-hover:text-ew-primary">
          {promo.heading}
        </h3>
        {promo.description && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ew-grey">
            {promo.description}
          </p>
        )}
        {promo.linkLabel && (
          <span className="mt-4 text-sm font-semibold text-ew-primary">
            {promo.linkLabel} &rarr;
          </span>
        )}
      </div>
    </>
  );
}

export default function PromoCard({ promo }: { promo: Promotion }) {
  const className =
    "group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl";

  if (promo.linkUrl) {
    return (
      <Link href={promo.linkUrl} className={className}>
        <CardInner promo={promo} />
      </Link>
    );
  }

  return (
    <div className={className}>
      <CardInner promo={promo} />
    </div>
  );
}
