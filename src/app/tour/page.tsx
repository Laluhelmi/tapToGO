"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useLang } from "@/contexts/LanguageContext";

function TourContent() {
  const { t } = useLang();
  const params = useSearchParams();
  const destination = params.get("destination") ?? "—";
  const date = params.get("date") ?? "—";
  const participants = params.get("participants") ?? "1";
  const type = params.get("type") ?? "any";

  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />

      {/* Hero */}
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold mb-4 transition-opacity hover:opacity-80"
            style={{ color: "#bae6fd" }}>← {t.nav.home}</Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-1 flex items-center gap-3">
            🤿 {t.tourSearch.title}
          </h1>
          <p style={{ color: "#bae6fd" }}>
            {destination} · {date} · {participants} {t.search.pax} · {type}
          </p>
        </div>
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-3xl p-12"
          style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 4px 24px rgba(2,132,199,0.08)" }}>
          <div className="text-6xl mb-4">🌊</div>
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: "#0c4a6e" }}>
            Coming Soon
          </h2>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "#64748b" }}>
            Layanan snorkeling tour &amp; day trip lagi disiapkan — Manta Bay, Crystal Bay, Gamat Bay,
            Menjangan, Amed, dan spot terbaik Bali. Termasuk hotel pickup, guide, gear, dan lunch.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {["🤿 Manta Snorkel", "🐠 Crystal Bay", "🏝️ 3-Spot Penida", "🌅 Sunset Cruise", "🐢 Turtle Watch", "🤿 Diving"].map(v => (
              <span key={v} className="text-xs px-3 py-1.5 rounded-full font-bold"
                style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>
                {v}
              </span>
            ))}
          </div>
          <Link href="/" className="inline-block px-6 py-3 rounded-xl text-sm font-bold text-white btn-ocean">
            ← Kembali ke Beranda
          </Link>
        </div>

        {/* Search summary */}
        <div className="mt-6 bg-white rounded-2xl p-5 text-left"
          style={{ border: "1.5px solid #e0f2fe" }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#94a3b8" }}>Pencarian kamu</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span style={{ color: "#64748b" }}>🏝️ {t.tourSearch.destination}</span><span className="font-semibold" style={{ color: "#0c4a6e" }}>{destination}</span></div>
            <div className="flex justify-between"><span style={{ color: "#64748b" }}>📅 {t.tourSearch.date}</span><span className="font-semibold" style={{ color: "#0c4a6e" }}>{date}</span></div>
            <div className="flex justify-between"><span style={{ color: "#64748b" }}>👥 {t.tourSearch.participants}</span><span className="font-semibold" style={{ color: "#0c4a6e" }}>{participants} {t.search.pax}</span></div>
            <div className="flex justify-between"><span style={{ color: "#64748b" }}>🤿 {t.tourSearch.tourType}</span><span className="font-semibold" style={{ color: "#0c4a6e" }}>{type}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TourPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f9ff" }}>
      <p style={{ color: "#0369a1" }}>...</p>
    </div>}>
      <TourContent />
    </Suspense>
  );
}
