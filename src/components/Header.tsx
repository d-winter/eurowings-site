"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="32" height="32" viewBox="0 0 32 32" className="text-ew-primary">
              <circle cx="16" cy="16" r="16" fill="currentColor" />
              <path
                d="M8 17.5 L14 12 L26 12 L20 17.5 Z"
                fill="white"
                opacity="0.9"
              />
              <path
                d="M10 19.5 L15 15.5 L24 15.5 L19 19.5 Z"
                fill="white"
                opacity="0.6"
              />
            </svg>
            <span className="text-xl font-bold tracking-tight text-ew-dark">
              euro<span className="text-ew-primary">wings</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              { href: "/", label: "Home" },
              { href: "/destinations", label: "Destinations" },
              { href: "/faq", label: "FAQ" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ew-dark transition-colors hover:text-ew-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/"
              className="rounded-full bg-ew-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ew-primary-dark"
            >
              Book&nbsp;Now
            </Link>
          </div>

          <button
            className="relative h-6 w-7 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
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
          {[
            { href: "/", label: "Home" },
            { href: "/destinations", label: "Destinations" },
            { href: "/faq", label: "FAQ" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2.5 font-medium text-ew-dark hover:bg-ew-light"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-2 rounded-full bg-ew-primary px-5 py-2.5 text-center font-semibold text-white"
            onClick={() => setMenuOpen(false)}
          >
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
