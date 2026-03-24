"use client";

import { useState, useEffect, useRef } from "react";
import type { FlightAirport } from "@/data/flights/types";

interface AirportSearchProps {
  onSelect: (airport: FlightAirport) => void;
  placeholder?: string;
}

export default function AirportSearch({ onSelect, placeholder = "Search airports..." }: AirportSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FlightAirport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<FlightAirport | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2 || selected) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/flights/airports?query=${encodeURIComponent(query)}`);
      const data: FlightAirport[] = await res.json();
      setResults(data);
      setIsOpen(data.length > 0);
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [query, selected]);

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
    <div ref={containerRef} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-ew-primary focus:outline-none focus:ring-2 focus:ring-ew-primary/20"
      />
      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-xl border border-gray-100 bg-white shadow-lg">
          {results.map((airport) => (
            <li key={airport.iataCode}>
              <button
                onClick={() => handleSelect(airport)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
              >
                <span className="font-mono font-semibold text-ew-primary">{airport.iataCode}</span>
                <span className="text-ew-dark">{airport.city}, {airport.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
