"use client";
import Link from "next/link";
import { POPULAR_ROUTES, SCHEDULES } from "@/data/boats";
import { routeToSlug } from "@/lib/routes";
import BoatSVG, { BoatVariant } from "./BoatSVG";
import type { Port } from "@/types";

const boatVariants: BoatVariant[] = ["speedboat", "catamaran", "express", "fastboat", "cruiser", "ferry"];
const cardColors = [
  { bg: "#f0f9ff", border: "#bae6fd", badge: "#e0f2fe", badgeText: "#0369a1" },
  { bg: "#f0fdfa", border: "#99f6e4", badge: "#ccfbf1", badgeText: "#0f766e" },
  { bg: "#fff7ed", border: "#fed7aa", badge: "#ffedd5", badgeText: "#c2410c" },
  { bg: "#f5f3ff", border: "#ddd6fe", badge: "#ede9fe", badgeText: "#6d28d9" },
  { bg: "#fdf2f8", border: "#f9a8d4", badge: "#fce7f3", badgeText: "#9d174d" },
  { bg: "#f0fdf4", border: "#bbf7d0", badge: "#dcfce7", badgeText: "#15803d" },
];

interface Props {
  onSelectRoute: (from: Port, to: Port) => void;
}

export default function PopularRoutes({ onSelectRoute }: Props) {
  // Calculate min price per route from real data
  const getMinPrice = (from: Port, to: Port) => {
    const routes = SCHEDULES.filter(s => s.from === from && s.to === to);
    if (!routes.length) return null;
    return Math.min(...routes.map(s => s.price));
  };

  const getCount = (from: Port, to: Port) => {
    return SCHEDULES.filter(s => s.from === from && s.to === to).length;
  };

  return (
    <section id="rute" className="py-20 px-4 sm:px-6" style={{ background: "#f8fafc" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#e0f2fe", color: "#0369a1" }}>
            🗺️ Destinasi Populer
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color: "#0c4a6e" }}>
            Rute{" "}
            <span style={{ background: "linear-gradient(135deg,#0369a1,#0284c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Favorit
            </span>{" "}
            Traveler
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#64748b" }}>
            Rute paling banyak dipesan. Klik untuk melihat semua jadwal tersedia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_ROUTES.map((route, i) => {
            const col = cardColors[i % cardColors.length];
            const minPrice = getMinPrice(route.from, route.to);
            const count = getCount(route.from, route.to);
            return (
              <Link key={i} href={`/rute/${routeToSlug(route.from, route.to)}`}
                onClick={() => onSelectRoute(route.from, route.to)}
                className="group text-left rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer block"
                style={{ background: col.bg, border: `1.5px solid ${col.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>

                {/* Boat illustration */}
                <div className="rounded-2xl mb-4 overflow-hidden flex items-center justify-center h-32 relative"
                  style={{ background: `linear-gradient(135deg,${col.badge},${col.bg})` }}>
                  <svg viewBox="0 0 300 80" className="absolute bottom-0 left-0 w-full opacity-30">
                    <path d="M0,40 Q75,20 150,40 Q225,60 300,40 L300,80 L0,80Z" fill={col.border}/>
                  </svg>
                  <BoatSVG variant={boatVariants[i % boatVariants.length]} className="w-48 h-24 relative z-10" />
                </div>

                {/* Route */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-base" style={{ color: "#0c4a6e" }}>{route.from}</span>
                  <span className="font-bold text-lg" style={{ color: "#0284c7" }}>→</span>
                  <span className="font-bold text-base" style={{ color: "#0c4a6e" }}>{route.to}</span>
                </div>
                <p className="text-xs mb-3" style={{ color: "#64748b" }}>
                  {count} jadwal tersedia · {route.duration}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: "#94a3b8" }}>Mulai dari</p>
                    <p className="text-xl font-extrabold" style={{ color: "#0369a1" }}>
                      {minPrice ? `Rp ${minPrice}K` : "–"}
                    </p>
                  </div>
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all group-hover:scale-110 group-hover:bg-opacity-80"
                    style={{ background: col.badge, color: col.badgeText }}>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
