export type Port =
  | "Bangsal"
  | "Padang Bai"
  | "Sanur"
  | "Nusa Penida"
  | "Nusa Lembongan"
  | "Serangan"
  | "Amed"
  | "Gili Trawangan"
  | "Gili Meno"
  | "Gili Air"
  | "Senggigi";

export interface Route {
  from: Port;
  to: Port;
  duration: string; // e.g. "2h 30m"
}

export interface BoatSchedule {
  id: string;
  operator: string;
  logo: string; // emoji or initial
  departureTime: string;
  arrivalTime: string;
  from: Port;
  to: Port;
  price: number; // in IDR thousands
  originalPrice?: number;
  seats: number;
  availableSeats: number;
  duration: string;
  amenities: string[];
  rating: number;
  reviewCount: number;
  boatType: "Speedboat" | "Fastboat" | "Ferry";
  badge?: "Best Price" | "Most Popular" | "Fastest" | "Recommended";
  image?: string;
}

export interface SearchParams {
  from: Port | null;
  to: Port | null;
  date: string;
  passengers: number;
}
