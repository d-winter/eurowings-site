export interface FlightAirport {
  iataCode: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
}

export type TravelSegment = "city-trip" | "beach-holiday" | "adventure";

export interface FlightRoute {
  destination: FlightAirport;
  segment: TravelSegment;
  lowestPrice: number;
  currency: string;
}

/** Flat shape matching the Hygraph SDL type FLIGHTSOffer */
export interface FlightOfferFlat {
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departureAirport: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  date: string;
}

export const ORIGIN_HUBS = ["CGN", "DUS", "BER", "STR", "HAM", "MUC"] as const;
export type OriginHub = (typeof ORIGIN_HUBS)[number];
