import type { FlightAirport } from "./types";

export const AIRPORTS: Map<string, FlightAirport> = new Map([
  // === Origin hubs ===
  ["CGN", { iataCode: "CGN", name: "Cologne Bonn Airport", city: "Cologne", country: "Germany", countryCode: "DE" }],
  ["DUS", { iataCode: "DUS", name: "Düsseldorf Airport", city: "Düsseldorf", country: "Germany", countryCode: "DE" }],
  ["BER", { iataCode: "BER", name: "Berlin Brandenburg Airport", city: "Berlin", country: "Germany", countryCode: "DE" }],
  ["STR", { iataCode: "STR", name: "Stuttgart Airport", city: "Stuttgart", country: "Germany", countryCode: "DE" }],
  ["HAM", { iataCode: "HAM", name: "Hamburg Airport", city: "Hamburg", country: "Germany", countryCode: "DE" }],
  ["MUC", { iataCode: "MUC", name: "Munich Airport", city: "Munich", country: "Germany", countryCode: "DE" }],

  // === Beach destinations ===
  ["PMI", { iataCode: "PMI", name: "Palma de Mallorca Airport", city: "Palma de Mallorca", country: "Spain", countryCode: "ES" }],
  ["HER", { iataCode: "HER", name: "Heraklion Nikos Kazantzakis International Airport", city: "Heraklion", country: "Greece", countryCode: "GR" }],
  ["FAO", { iataCode: "FAO", name: "Faro Airport", city: "Faro", country: "Portugal", countryCode: "PT" }],
  ["AYT", { iataCode: "AYT", name: "Antalya Airport", city: "Antalya", country: "Turkey", countryCode: "TR" }],
  ["IBZ", { iataCode: "IBZ", name: "Ibiza Airport", city: "Ibiza", country: "Spain", countryCode: "ES" }],
  ["SPU", { iataCode: "SPU", name: "Split Airport", city: "Split", country: "Croatia", countryCode: "HR" }],
  ["CFU", { iataCode: "CFU", name: "Corfu International Airport", city: "Corfu", country: "Greece", countryCode: "GR" }],
  ["RHO", { iataCode: "RHO", name: "Rhodes International Airport Diagoras", city: "Rhodes", country: "Greece", countryCode: "GR" }],
  ["KGS", { iataCode: "KGS", name: "Kos Island International Airport", city: "Kos", country: "Greece", countryCode: "GR" }],
  ["TFS", { iataCode: "TFS", name: "Tenerife South Airport", city: "Tenerife", country: "Spain", countryCode: "ES" }],
  ["FUE", { iataCode: "FUE", name: "Fuerteventura Airport", city: "Fuerteventura", country: "Spain", countryCode: "ES" }],
  ["LPA", { iataCode: "LPA", name: "Gran Canaria Airport", city: "Las Palmas", country: "Spain", countryCode: "ES" }],
  ["OLB", { iataCode: "OLB", name: "Olbia Costa Smeralda Airport", city: "Olbia", country: "Italy", countryCode: "IT" }],
  ["CAG", { iataCode: "CAG", name: "Cagliari Elmas Airport", city: "Cagliari", country: "Italy", countryCode: "IT" }],
  ["BRI", { iataCode: "BRI", name: "Bari Karol Wojtyla Airport", city: "Bari", country: "Italy", countryCode: "IT" }],
  ["NAP", { iataCode: "NAP", name: "Naples International Airport", city: "Naples", country: "Italy", countryCode: "IT" }],
  ["CHQ", { iataCode: "CHQ", name: "Chania International Airport Ioannis Daskalogiannis", city: "Chania", country: "Greece", countryCode: "GR" }],
  ["ZTH", { iataCode: "ZTH", name: "Zakynthos International Airport Dionysios Solomos", city: "Zakynthos", country: "Greece", countryCode: "GR" }],
  ["PFO", { iataCode: "PFO", name: "Paphos International Airport", city: "Paphos", country: "Cyprus", countryCode: "CY" }],
  ["SSH", { iataCode: "SSH", name: "Sharm el-Sheikh International Airport", city: "Sharm el-Sheikh", country: "Egypt", countryCode: "EG" }],
  ["HRG", { iataCode: "HRG", name: "Hurghada International Airport", city: "Hurghada", country: "Egypt", countryCode: "EG" }],
  ["BGY", { iataCode: "BGY", name: "Milan Bergamo Airport", city: "Bergamo", country: "Italy", countryCode: "IT" }],
  ["SKG", { iataCode: "SKG", name: "Thessaloniki Macedonia International Airport", city: "Thessaloniki", country: "Greece", countryCode: "GR" }],
  ["MLA", { iataCode: "MLA", name: "Malta International Airport", city: "Valletta", country: "Malta", countryCode: "MT" }],
  ["DBV", { iataCode: "DBV", name: "Dubrovnik Airport", city: "Dubrovnik", country: "Croatia", countryCode: "HR" }],
  ["BOJ", { iataCode: "BOJ", name: "Burgas Airport", city: "Burgas", country: "Bulgaria", countryCode: "BG" }],
  ["VAR", { iataCode: "VAR", name: "Varna Airport", city: "Varna", country: "Bulgaria", countryCode: "BG" }],

  // === City-trip destinations ===
  ["BCN", { iataCode: "BCN", name: "Barcelona El Prat Airport", city: "Barcelona", country: "Spain", countryCode: "ES" }],
  ["LIS", { iataCode: "LIS", name: "Humberto Delgado Airport", city: "Lisbon", country: "Portugal", countryCode: "PT" }],
  ["PRG", { iataCode: "PRG", name: "Václav Havel Airport Prague", city: "Prague", country: "Czech Republic", countryCode: "CZ" }],
  ["BUD", { iataCode: "BUD", name: "Budapest Ferenc Liszt International Airport", city: "Budapest", country: "Hungary", countryCode: "HU" }],
  ["VIE", { iataCode: "VIE", name: "Vienna International Airport", city: "Vienna", country: "Austria", countryCode: "AT" }],
  ["FCO", { iataCode: "FCO", name: "Rome Fiumicino Leonardo da Vinci International Airport", city: "Rome", country: "Italy", countryCode: "IT" }],
  ["MXP", { iataCode: "MXP", name: "Milan Malpensa Airport", city: "Milan", country: "Italy", countryCode: "IT" }],
  ["LHR", { iataCode: "LHR", name: "London Heathrow Airport", city: "London", country: "United Kingdom", countryCode: "GB" }],
  ["CDG", { iataCode: "CDG", name: "Paris Charles de Gaulle Airport", city: "Paris", country: "France", countryCode: "FR" }],
  ["CPH", { iataCode: "CPH", name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark", countryCode: "DK" }],
  ["ARN", { iataCode: "ARN", name: "Stockholm Arlanda Airport", city: "Stockholm", country: "Sweden", countryCode: "SE" }],
  ["ATH", { iataCode: "ATH", name: "Athens International Airport Eleftherios Venizelos", city: "Athens", country: "Greece", countryCode: "GR" }],
  ["IST", { iataCode: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey", countryCode: "TR" }],
  ["DUB", { iataCode: "DUB", name: "Dublin Airport", city: "Dublin", country: "Ireland", countryCode: "IE" }],
  ["EDI", { iataCode: "EDI", name: "Edinburgh Airport", city: "Edinburgh", country: "United Kingdom", countryCode: "GB" }],
  ["GVA", { iataCode: "GVA", name: "Geneva Airport", city: "Geneva", country: "Switzerland", countryCode: "CH" }],
  ["ZRH", { iataCode: "ZRH", name: "Zurich Airport", city: "Zurich", country: "Switzerland", countryCode: "CH" }],
  ["WAW", { iataCode: "WAW", name: "Warsaw Chopin Airport", city: "Warsaw", country: "Poland", countryCode: "PL" }],
  ["KRK", { iataCode: "KRK", name: "Kraków John Paul II International Airport", city: "Kraków", country: "Poland", countryCode: "PL" }],
  ["OPO", { iataCode: "OPO", name: "Francisco de Sá Carneiro Airport", city: "Porto", country: "Portugal", countryCode: "PT" }],
  ["TXL", { iataCode: "TXL", name: "Berlin Tegel Airport", city: "Berlin", country: "Germany", countryCode: "DE" }],
  ["SOF", { iataCode: "SOF", name: "Sofia Airport", city: "Sofia", country: "Bulgaria", countryCode: "BG" }],
  ["BEG", { iataCode: "BEG", name: "Belgrade Nikola Tesla Airport", city: "Belgrade", country: "Serbia", countryCode: "RS" }],
  ["ZAG", { iataCode: "ZAG", name: "Zagreb Airport", city: "Zagreb", country: "Croatia", countryCode: "HR" }],
  ["TLL", { iataCode: "TLL", name: "Tallinn Airport", city: "Tallinn", country: "Estonia", countryCode: "EE" }],
  ["RIX", { iataCode: "RIX", name: "Riga International Airport", city: "Riga", country: "Latvia", countryCode: "LV" }],
  ["VNO", { iataCode: "VNO", name: "Vilnius Airport", city: "Vilnius", country: "Lithuania", countryCode: "LT" }],
  ["GDN", { iataCode: "GDN", name: "Gdańsk Lech Wałęsa Airport", city: "Gdańsk", country: "Poland", countryCode: "PL" }],

  // === Adventure destinations ===
  ["KEF", { iataCode: "KEF", name: "Keflavík International Airport", city: "Reykjavik", country: "Iceland", countryCode: "IS" }],
  ["BGO", { iataCode: "BGO", name: "Bergen Airport Flesland", city: "Bergen", country: "Norway", countryCode: "NO" }],
  ["TOS", { iataCode: "TOS", name: "Tromsø Airport Langnes", city: "Tromsø", country: "Norway", countryCode: "NO" }],
  ["INN", { iataCode: "INN", name: "Innsbruck Airport", city: "Innsbruck", country: "Austria", countryCode: "AT" }],
  ["SZG", { iataCode: "SZG", name: "Salzburg Airport W. A. Mozart", city: "Salzburg", country: "Austria", countryCode: "AT" }],
  ["TIV", { iataCode: "TIV", name: "Tivat Airport", city: "Tivat", country: "Montenegro", countryCode: "ME" }],
  ["KTT", { iataCode: "KTT", name: "Kittilä Airport", city: "Kittilä", country: "Finland", countryCode: "FI" }],
  ["LYR", { iataCode: "LYR", name: "Svalbard Airport Longyear", city: "Longyearbyen", country: "Norway", countryCode: "NO" }],
  ["EVE", { iataCode: "EVE", name: "Harstad/Narvik Airport Evenes", city: "Narvik", country: "Norway", countryCode: "NO" }],
  ["BLL", { iataCode: "BLL", name: "Billund Airport", city: "Billund", country: "Denmark", countryCode: "DK" }],
  ["TRD", { iataCode: "TRD", name: "Trondheim Airport Værnes", city: "Trondheim", country: "Norway", countryCode: "NO" }],
  ["SVG", { iataCode: "SVG", name: "Stavanger Airport Sola", city: "Stavanger", country: "Norway", countryCode: "NO" }],
  ["RVN", { iataCode: "RVN", name: "Rovaniemi Airport", city: "Rovaniemi", country: "Finland", countryCode: "FI" }],
]);

/** German city names for display (first entry is the primary display name) */
export const DE_CITY_NAMES: Record<string, string> = {
  CGN: "Köln",
  MUC: "München",
  VIE: "Wien",
  PRG: "Prag",
  LIS: "Lissabon",
  FCO: "Rom",
  MXP: "Mailand",
  CPH: "Kopenhagen",
  ATH: "Athen",
  WAW: "Warschau",
  KRK: "Krakau",
  ZRH: "Zürich",
  GVA: "Genf",
  NAP: "Neapel",
  TFS: "Teneriffa",
  RHO: "Rhodos",
  CFU: "Korfu",
  BEG: "Belgrad",
};

/** German search aliases (includes DE_CITY_NAMES plus additional search terms) */
const DE_ALIASES: Record<string, string[]> = {
  CGN: ["Köln", "Koeln"],
  MUC: ["München", "Muenchen"],
  DUS: ["Düsseldorf"],
  HAM: ["Hamburg"],
  BER: ["Berlin"],
  STR: ["Stuttgart"],
  VIE: ["Wien"],
  PRG: ["Prag"],
  LIS: ["Lissabon"],
  BCN: ["Barcelona"],
  FCO: ["Rom"],
  MXP: ["Mailand"],
  CDG: ["Paris"],
  LHR: ["London"],
  CPH: ["Kopenhagen"],
  ARN: ["Stockholm"],
  ATH: ["Athen"],
  WAW: ["Warschau"],
  KRK: ["Krakau"],
  ZRH: ["Zürich"],
  GVA: ["Genf"],
  BUD: ["Budapest"],
  IST: ["Istanbul"],
  NAP: ["Neapel"],
  PMI: ["Mallorca", "Palma"],
  TFS: ["Teneriffa"],
  HER: ["Heraklion", "Kreta"],
  RHO: ["Rhodos"],
  CFU: ["Korfu"],
  ZTH: ["Zakynthos"],
  SKG: ["Thessaloniki"],
  KEF: ["Reykjavik", "Island"],
  TOS: ["Tromsø", "Tromso"],
  EDI: ["Edinburgh", "Schottland"],
  DUB: ["Dublin", "Irland"],
  BEG: ["Belgrad"],
  ZAG: ["Zagreb", "Kroatien"],
  SOF: ["Sofia", "Bulgarien"],
  BOJ: ["Burgas", "Bulgarien"],
  DBV: ["Dubrovnik", "Kroatien"],
  SPU: ["Split", "Kroatien"],
  SSH: ["Scharm el-Scheich", "Ägypten"],
  HRG: ["Hurghada", "Ägypten"],
  PFO: ["Paphos", "Zypern"],
  MLA: ["Malta", "Valletta"],
};

export function getAirport(iataCode: string): FlightAirport | undefined {
  return AIRPORTS.get(iataCode.toUpperCase());
}

export function searchAirports(query: string): FlightAirport[] {
  const q = query.toLowerCase();
  return Array.from(AIRPORTS.values()).filter((a) => {
    if (
      a.iataCode.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q)
    ) {
      return true;
    }
    const aliases = DE_ALIASES[a.iataCode];
    return aliases?.some((alias) => alias.toLowerCase().includes(q)) ?? false;
  });
}
