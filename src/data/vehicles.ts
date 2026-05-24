export type VehicleType = "matic" | "manual" | "big_bike" | "car";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: VehicleType;
  cc: number;
  image: string;
  color: string;
  pricePerDay: number;  // in thousands IDR
  pricePerWeek?: number;
  pricePerMonth?: number;
  features: string[];
  available: number;
  locations: string[];
  rating: number;
  reviewCount: number;
  badge?: "Popular" | "Best Value" | "New" | "Premium";
  description?: string;
}

export const VEHICLE_LOCATIONS = [
  "Gili Trawangan",
  "Gili Air",
  "Gili Meno",
  "Bangsal",
  "Senggigi",
  "Mataram",
  "Lombok Airport",
];

// Real available rental motors from operator
export const VEHICLES: Vehicle[] = [
  {
    id: "veh-001",
    name: "Honda Beat Street",
    brand: "Honda",
    type: "matic",
    cc: 110,
    image: "🛵",
    color: "#0ea5e9",
    pricePerDay: 135,
    pricePerWeek: 810,
    features: ["Helmet × 2", "Full tank", "Insurance"],
    available: 4,
    locations: ["Gili Trawangan", "Gili Air", "Bangsal", "Senggigi"],
    rating: 4.5,
    reviewCount: 0,
    badge: "Best Value",
    description: "Compact street-style scooter. Easy to ride, perfect for short trips around Gili & Lombok.",
  },
  {
    id: "veh-002",
    name: "Yamaha NMAX 155",
    brand: "Yamaha",
    type: "matic",
    cc: 155,
    image: "🛵",
    color: "#0369a1",
    pricePerDay: 165,
    pricePerWeek: 990,
    features: ["Helmet × 2", "Full tank", "Insurance", "ABS brakes", "Spacious storage"],
    available: 3,
    locations: ["Gili Trawangan", "Bangsal", "Senggigi", "Lombok Airport"],
    rating: 4.7,
    reviewCount: 0,
    badge: "Popular",
    description: "Premium maxi-scooter with ABS. Most comfortable for 2 riders with luggage.",
  },
  {
    id: "veh-003",
    name: "Honda PCX 160",
    brand: "Honda",
    type: "matic",
    cc: 160,
    image: "🛵",
    color: "#0c4a6e",
    pricePerDay: 165,
    pricePerWeek: 990,
    features: ["Helmet × 2", "Full tank", "Insurance", "Smart Key", "Spacious storage"],
    available: 2,
    locations: ["Gili Trawangan", "Bangsal", "Senggigi", "Mataram"],
    rating: 4.6,
    reviewCount: 0,
    description: "Premium scooter with smart-key. Spacious underseat storage for surf gear or backpack.",
  },
  {
    id: "veh-004",
    name: "Honda ADV 160",
    brand: "Honda",
    type: "matic",
    cc: 160,
    image: "🛵",
    color: "#7c3aed",
    pricePerDay: 165,
    pricePerWeek: 990,
    features: ["Helmet × 2", "Full tank", "Insurance", "Adventure styling", "Long suspension"],
    available: 2,
    locations: ["Gili Trawangan", "Bangsal", "Senggigi", "Mataram"],
    rating: 4.7,
    reviewCount: 0,
    badge: "New",
    description: "Adventure-styled scooter. Higher suspension, great for exploring Lombok back roads.",
  },
  {
    id: "veh-005",
    name: "Honda Vario 160",
    brand: "Honda",
    type: "matic",
    cc: 160,
    image: "🛵",
    color: "#0284c7",
    pricePerDay: 165,
    pricePerWeek: 990,
    features: ["Helmet × 2", "Full tank", "Insurance", "Idling stop", "Phone holder"],
    available: 3,
    locations: ["Gili Trawangan", "Gili Air", "Bangsal", "Senggigi"],
    rating: 4.6,
    reviewCount: 0,
    description: "Sporty scooter with strong 160cc engine. Great balance of price and performance.",
  },
];

export const RENTAL_AMENITY_ICONS: Record<string, string> = {
  "Helmet × 2": "⛑️",
  "Full tank": "⛽",
  "Insurance": "🛡️",
  "Free delivery (Gili area)": "🚚",
  "Phone holder": "📱",
  "ABS brakes": "🛞",
  "Smart Key": "🔑",
  "Spacious storage": "💼",
  "Adventure styling": "🌄",
  "Long suspension": "🏔️",
  "Idling stop": "♻️",
};
