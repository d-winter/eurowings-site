import Link from "next/link";

const footerLinks = [
  {
    title: "Booking",
    links: [
      { label: "Flight Search", href: "/" },
      { label: "Deals & Offers", href: "/" },
      { label: "Low Fare Calendar", href: "/" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Baggage", href: "/faq" },
      { label: "Check-in", href: "/faq" },
      { label: "At the Airport", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Eurowings", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Press", href: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ew-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 32 32" className="text-ew-primary">
                <circle cx="16" cy="16" r="16" fill="currentColor" />
                <path d="M8 17.5 L14 12 L26 12 L20 17.5 Z" fill="white" opacity="0.9" />
                <path d="M10 19.5 L15 15.5 L24 15.5 L19 19.5 Z" fill="white" opacity="0.6" />
              </svg>
              <span className="text-lg font-bold">
                euro<span className="text-ew-primary">wings</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Fly smarter. Discover Europe and beyond with affordable fares
              and great service.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Eurowings. All rights
            reserved. Demo site built with Next.js&nbsp;&&nbsp;Hygraph.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Legal Notice", "Cookie Settings"].map(
              (item) => (
                <Link
                  key={item}
                  href="/"
                  className="text-xs text-gray-500 hover:text-gray-300"
                >
                  {item}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
