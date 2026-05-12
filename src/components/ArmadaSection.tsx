"use client";
import { useMemo } from "react";
import { SCHEDULES, AMENITY_ICONS } from "@/data/boats";

interface OperatorInfo {
  name: string;
  logo: string;
  image: string;
  destinations: string[];
  minPrice: number;
  maxPrice: number;
  avgRating: number;
  totalReviews: number;
  amenities: string[];
  scheduleCount: number;
}

export default function ArmadaSection() {
  const operators = useMemo<OperatorInfo[]>(() => {
    const map: Record<string, OperatorInfo> = {};

    for (const s of SCHEDULES) {
      if (!map[s.operator]) {
        map[s.operator] = {
          name: s.operator,
          logo: s.logo,
          image: s.image ?? "",
          destinations: [],
          minPrice: s.price,
          maxPrice: s.price,
          avgRating: s.rating,
          totalReviews: s.reviewCount,
          amenities: s.amenities,
          scheduleCount: 0,
        };
      }
      const op = map[s.operator];
      if (!op.destinations.includes(s.to)) op.destinations.push(s.to);
      op.minPrice = Math.min(op.minPrice, s.price);
      op.maxPrice = Math.max(op.maxPrice, s.price);
      op.avgRating = Math.max(op.avgRating, s.rating);
      op.totalReviews += s.reviewCount;
      op.scheduleCount += 1;
      if (s.amenities.length > op.amenities.length) op.amenities = s.amenities;
    }

    return Object.values(map).sort((a, b) => b.avgRating - a.avgRating);
  }, []);

  return (
    <section id="armada" className="py-20 px-4 sm:px-6" style={{ background: "#f0f9ff" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#e0f2fe", color: "#0369a1" }}>
            🚢 Armada Resmi
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color: "#0c4a6e" }}>
            Operator{" "}
            <span style={{ background: "linear-gradient(135deg,#0369a1,#0284c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Terpercaya
            </span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#64748b" }}>
            {operators.length} operator resmi berizin dengan armada terawat dan standar keselamatan internasional.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {operators.map((op) => (
            <div key={op.name}
              className="bg-white rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 group"
              style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 16px rgba(2,132,199,0.07)" }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(2,132,199,0.15)"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(2,132,199,0.07)"}>

              {/* Photo */}
              <div className="relative overflow-hidden" style={{ height: 140 }}>
                <img src={op.image} alt={op.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ background: "#e0f2fe" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.04),rgba(0,0,0,0.4))" }} />

                {/* Logo badge */}
                <div className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold text-white shadow"
                  style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>
                  {op.logo}
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
                  style={{ background: "rgba(255,255,255,0.95)", color: "#0369a1" }}>
                  ★ {op.avgRating.toFixed(1)}
                </div>

                {/* Operator name overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-extrabold text-sm leading-tight drop-shadow">{op.name}</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-3 flex-1">

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl py-2" style={{ background: "#f0f9ff" }}>
                    <p className="text-base font-extrabold" style={{ color: "#0369a1" }}>{op.scheduleCount}</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>Jadwal</p>
                  </div>
                  <div className="rounded-xl py-2" style={{ background: "#f0f9ff" }}>
                    <p className="text-base font-extrabold" style={{ color: "#0369a1" }}>{op.destinations.length}</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>Rute</p>
                  </div>
                  <div className="rounded-xl py-2" style={{ background: "#f0f9ff" }}>
                    <p className="text-base font-extrabold" style={{ color: "#0369a1" }}>{(op.totalReviews / op.scheduleCount).toFixed(0)}</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>Ulasan</p>
                  </div>
                </div>

                {/* Destinations */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#94a3b8" }}>Tujuan</p>
                  <div className="flex flex-wrap gap-1">
                    {op.destinations.map(d => (
                      <span key={d} className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: "#eff6ff", color: "#0369a1", border: "1px solid #bfdbfe" }}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1">
                  {op.amenities.slice(0, 4).map(a => (
                    <span key={a} className="text-xs px-1.5 py-0.5 rounded-lg"
                      style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" }}>
                      {AMENITY_ICONS[a] ?? "✦"} {a}
                    </span>
                  ))}
                </div>

                {/* Price range */}
                <div className="flex items-center justify-between mt-auto pt-2"
                  style={{ borderTop: "1px solid #f0f9ff" }}>
                  <div>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>Harga tiket</p>
                    <p className="text-sm font-extrabold" style={{ color: "#0369a1" }}>
                      Rp {op.minPrice}K
                      {op.maxPrice !== op.minPrice && <span style={{ color: "#94a3b8" }}> – {op.maxPrice}K</span>}
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                    style={{ background: "#dcfce7", color: "#15803d" }}>
                    ✓ Resmi
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
