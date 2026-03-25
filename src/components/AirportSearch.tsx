"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { FlightAirport } from "@/data/flights/types";
import { ORIGIN_HUBS } from "@/data/flights/types";
import { getAirport } from "@/data/flights/airports";
import { DE_CITY_NAMES } from "@/data/flights/airports";

const HUB_AIRPORTS: FlightAirport[] = ORIGIN_HUBS
  .map((code) => getAirport(code))
  .filter((a): a is FlightAirport => a != null);

interface AirportSearchProps {
  onSelect: (airport: FlightAirport) => void;
  placeholder?: string;
}

export default function AirportSearch({ onSelect, placeholder = "Search airports..." }: AirportSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<FlightAirport | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter hubs locally — no API call needed
  const results = useMemo(() => {
    if (query.length < 1 || selected) return [];
    const q = query.toLowerCase();
    return HUB_AIRPORTS.filter((a) =>
      a.iataCode.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      (DE_CITY_NAMES[a.iataCode]?.toLowerCase().includes(q) ?? false)
    );
  }, [query, selected]);

  useEffect(() => {
    setIsOpen(results.length > 0);
  }, [results]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(airport: FlightAirport) {
    setSelected(airport);
    setQuery(`${airport.city} (${airport.iataCode})`);
    setIsOpen(false);
    onSelect(airport);
  }

  function handleInputChange(value: string) {
    setQuery(value);
    setSelected(null);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <div className="relative">
        <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm transition-all focus:border-ew-primary focus:outline-none focus:ring-2 focus:ring-ew-primary/20"
        />
      </div>
      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
          {results.map((airport, idx) => (
            <li key={airport.iataCode}>
              <button
                onClick={() => handleSelect(airport)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-ew-primary/5 ${idx > 0 ? "border-t border-gray-50" : ""}`}
              >
                <span className="flex h-8 w-12 items-center justify-center rounded-md bg-ew-primary/10 font-mono text-xs font-bold text-ew-primary">
                  {airport.iataCode}
                </span>
                <div>
                  <span className="font-medium text-ew-dark">{airport.city}</span>
                  <span className="ml-1 text-xs text-ew-grey">{airport.country}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
