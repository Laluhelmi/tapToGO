"use client";
import { useMemo, useState } from "react";
import { SCHEDULES, AMENITY_ICONS } from "@/data/boats";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface OperatorInfo {
  name: string;
  logo: string;
  image: string;
  destinations: string[];
  minPrice: number;
  maxPrice: number;
  amenities: string[];
  scheduleCount: number;
}

export default function ArmadaPage() {
  const [search, setSearch] = useState("");

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
          amenities: s.amenities,
          scheduleCount: 0,
        };
      }
      const op = map[s.operator];
      if (!op.destinations.includes(s.to)) op.destinations.push(s.to);
      op.minPrice = Math.min(op.minPrice, s.price);
      op.maxPrice = Math.max(op.maxPrice, s.price);
      op.scheduleCount += 1;
      if (s.amenities.length > op.amenities.length) op.amenities = s.amenities;
    }
    return Object.values(map).sort((a, b) => b.scheduleCount - a.scheduleCount);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return operators;
    return operators.filter(op =>
      op.name.toLowerCase().includes(search.toLowerCase()) ||
      op.destinations.some(d => d.toLowerCase().includes(search.toLowerCase()))
    );
  }, [operators, search]);

  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />

      {/* Hero header */}
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold mb-4 transition-opacity hover:opacity-80"
            style={{ color: "#bae6fd" }}>← Beranda</Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">Armada Resmi</h1>
          <p style={{ color: "#bae6fd" }}>
            {operators.length} operator resmi berizin dengan standar keselamatan internasional
          </p>
        </div>
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search bar */}
        <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3"
          style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
          <span className="text-lg">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama operator atau tujuan..."
            className="flex-1 text-sm font-medium focus:outline-none"
            style={{ color: "#334155", background: "transparent" }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="text-xs font-bold px-3 py-1 rounded-lg"
              style={{ background: "#fee2e2", color: "#dc2626" }}>
              ✕ Reset
            </button>
          )}
          <span className="text-sm font-semibold" style={{ color: "#0369a1" }}>
            {filtered.length} operator
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((op) => (
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
                  ✓ Resmi
                </div>

                {/* Operator name overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-extrabold text-sm leading-tight drop-shadow">{op.name}</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-3 flex-1">

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-xl py-2" style={{ background: "#f0f9ff" }}>
                    <p className="text-base font-extrabold" style={{ color: "#0369a1" }}>{op.scheduleCount}</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>Jadwal</p>
                  </div>
                  <div className="rounded-xl py-2" style={{ background: "#f0f9ff" }}>
                    <p className="text-base font-extrabold" style={{ color: "#0369a1" }}>{op.destinations.length}</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>Rute</p>
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

                {/* Price range + badge */}
                <div className="flex items-center justify-between mt-auto pt-2"
                  style={{ borderTop: "1px solid #f0f9ff" }}>
                  <div>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>Harga tiket</p>
                    <p className="text-sm font-extrabold" style={{ color: "#0369a1" }}>
                      Rp {op.minPrice}K
                      {op.maxPrice !== op.minPrice && <span style={{ color: "#94a3b8" }}> – {op.maxPrice}K</span>}
                    </p>
                  </div>
                  <Link href={`/jadwal?operator=${encodeURIComponent(op.name)}`}
                    className="text-xs px-3 py-1.5 rounded-xl font-bold text-white btn-ocean transition-all hover:scale-105">
                    Lihat Jadwal →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl py-20 text-center"
            style={{ border: "1.5px solid #e0f2fe" }}>
            <div className="text-5xl mb-3">🚢</div>
            <p className="font-bold text-lg mb-1" style={{ color: "#0c4a6e" }}>Operator tidak ditemukan</p>
            <p className="text-sm mb-4" style={{ color: "#64748b" }}>Coba kata kunci lain</p>
            <button onClick={() => setSearch("")} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white btn-ocean">
              Reset
            </button>
          </div>
        )}

        <p className="text-center text-xs mt-6" style={{ color: "#94a3b8" }}>
          Semua operator telah terverifikasi dan berizin resmi · Diperbarui berkala
        </p>
      </div>
    </div>
  );
}
