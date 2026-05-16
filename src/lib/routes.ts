import { SCHEDULES } from "@/data/boats";
import type { Port } from "@/types";

export interface RouteInfo {
  from: Port;
  to: Port;
  slug: string;
  scheduleCount: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  operators: string[];          // unique operator names serving this route
  duration: string;             // taken from first schedule (same per destination)
}

// Convert port name → slug part (lowercase, dashes)
function portToSlugPart(p: string): string {
  return p.toLowerCase().replace(/\s+/g, "-");
}

// Convert "Gili Trawangan" + "Padang Bai" → "gili-trawangan-padang-bai"
export function routeToSlug(from: Port, to: Port): string {
  return `${portToSlugPart(from)}-to-${portToSlugPart(to)}`;
}

// Build all unique routes from SCHEDULES at module-load time
export const ALL_ROUTES: RouteInfo[] = (() => {
  const map = new Map<string, RouteInfo>();
  for (const s of SCHEDULES) {
    const slug = routeToSlug(s.from, s.to);
    const existing = map.get(slug);
    if (existing) {
      existing.scheduleCount += 1;
      existing.minPrice = Math.min(existing.minPrice, s.price);
      existing.maxPrice = Math.max(existing.maxPrice, s.price);
      if (!existing.operators.includes(s.operator)) existing.operators.push(s.operator);
    } else {
      map.set(slug, {
        from: s.from,
        to: s.to,
        slug,
        scheduleCount: 1,
        minPrice: s.price,
        maxPrice: s.price,
        avgPrice: 0,
        operators: [s.operator],
        duration: s.duration,
      });
    }
  }
  // Calculate avgPrice
  for (const route of map.values()) {
    const schedules = SCHEDULES.filter(s => s.from === route.from && s.to === route.to);
    route.avgPrice = Math.round(schedules.reduce((a, s) => a + s.price, 0) / schedules.length);
  }
  return Array.from(map.values()).sort((a, b) => b.scheduleCount - a.scheduleCount);
})();

// Lookup route by slug
export function findRouteBySlug(slug: string): RouteInfo | null {
  return ALL_ROUTES.find(r => r.slug === slug) ?? null;
}

// Get all slugs for generateStaticParams
export function getAllRouteSlugs(): string[] {
  return ALL_ROUTES.map(r => r.slug);
}

// Get schedules for a specific route
export function getSchedulesForRoute(from: Port, to: Port) {
  return SCHEDULES
    .filter(s => s.from === from && s.to === to)
    .sort((a, b) => a.departureTime.localeCompare(b.departureTime));
}

// Suggest related routes (same destination OR same origin)
export function getRelatedRoutes(route: RouteInfo, limit = 4): RouteInfo[] {
  return ALL_ROUTES
    .filter(r => r.slug !== route.slug && (r.to === route.to || r.from === route.from))
    .slice(0, limit);
}
