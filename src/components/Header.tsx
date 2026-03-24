"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();

  const switchLocale = useCallback((targetLocale: "en" | "de") => {
    const qs = typeof window !== "undefined" ? window.location.search : "";
    router.push(`${pathname}${qs}`, { locale: targetLocale });
  }, [pathname, router]);

  const nav = [
    { href: "/", key: "home" as const },
    { href: "/destinations", key: "destinations" as const },
    { href: "/faq", key: "faq" as const },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/eurowings-logo.svg"
              alt="Eurowings"
              width={160}
              height={40}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((item) => {
              const isActive = item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-ew-primary ${
                    isActive
                      ? "text-ew-primary border-b-2 border-ew-primary pb-0.5"
                      : "text-ew-dark"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-1 py-0.5 text-xs font-semibold">
              <button
                onClick={() => switchLocale("en")}
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  locale === "en" ? "bg-white text-ew-primary shadow-sm" : "text-ew-grey hover:text-ew-dark"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => switchLocale("de")}
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  locale === "de" ? "bg-white text-ew-primary shadow-sm" : "text-ew-grey hover:text-ew-dark"
                }`}
              >
                DE
              </button>
            </div>
            <Link
              href="/"
              className="rounded-full bg-ew-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ew-primary-dark"
            >
              {t("bookNow")}
            </Link>
          </div>

          <button
            className="relative h-6 w-7 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t("toggleMenu")}
          >
            <span
              className={`absolute left-0 block h-0.5 w-full bg-ew-dark transition-all duration-300 ${
                menuOpen ? "top-3 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-3 block h-0.5 w-full bg-ew-dark transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-full bg-ew-dark transition-all duration-300 ${
                menuOpen ? "top-3 -rotate-45" : "top-6"
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t bg-white transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-80" : "max-h-0 border-t-0"
        }`}
      >
        <nav className="flex flex-col gap-1 p-4">
          <div className="mb-2 flex justify-center gap-2">
            <button
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${locale === "en" ? "border-ew-primary text-ew-primary" : ""}`}
              onClick={() => { switchLocale("en"); setMenuOpen(false); }}
            >
              EN
            </button>
            <button
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${locale === "de" ? "border-ew-primary text-ew-primary" : ""}`}
              onClick={() => { switchLocale("de"); setMenuOpen(false); }}
            >
              DE
            </button>
          </div>
          {nav.map((item) => {
            const isActive = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2.5 font-medium transition-colors hover:bg-ew-light ${
                  isActive ? "bg-ew-primary/5 text-ew-primary" : "text-ew-dark"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {t(item.key)}
              </Link>
            );
          })}
          <Link
            href="/"
            className="mt-2 rounded-full bg-ew-primary px-5 py-2.5 text-center font-semibold text-white"
            onClick={() => setMenuOpen(false)}
          >
            {t("bookNow")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
