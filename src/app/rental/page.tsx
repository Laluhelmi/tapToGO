"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useLang } from "@/contexts/LanguageContext";

function RentalContent() {
  const { t } = useLang();
  const params = useSearchParams();
  const location = params.get("location") ?? "—";
  const startDate = params.get("startDate") ?? "—";
  const duration = params.get("duration") ?? "1";
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
            🛵 {t.rentalSearch.title}
          </h1>
          <p style={{ color: "#bae6fd" }}>
            {location} · {startDate} · {duration} {t.rentalSearch.durationUnit} · {type}
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
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: "#0c4a6e" }}>
            Coming Soon
          </h2>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "#64748b" }}>
            Layanan rental motor &amp; mobil sedang kami siapkan. Bakal ada Vario, NMAX, Beat,
            scooter Vespa, dan pilihan mobil — dengan delivery ke hotel atau pickup di pelabuhan.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {["🛵 Vario 125", "🛵 NMAX", "🛵 Beat", "🛵 PCX", "🏍️ Big Bike", "🚗 Avanza"].map(v => (
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

        {/* Search summary card */}
        <div className="mt-6 bg-white rounded-2xl p-5 text-left"
          style={{ border: "1.5px solid #e0f2fe" }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#94a3b8" }}>Pencarian kamu</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span style={{ color: "#64748b" }}>📍 {t.rentalSearch.location}</span><span className="font-semibold" style={{ color: "#0c4a6e" }}>{location}</span></div>
            <div className="flex justify-between"><span style={{ color: "#64748b" }}>📅 {t.rentalSearch.startDate}</span><span className="font-semibold" style={{ color: "#0c4a6e" }}>{startDate}</span></div>
            <div className="flex justify-between"><span style={{ color: "#64748b" }}>⏱ {t.rentalSearch.duration}</span><span className="font-semibold" style={{ color: "#0c4a6e" }}>{duration} {t.rentalSearch.durationUnit}</span></div>
            <div className="flex justify-between"><span style={{ color: "#64748b" }}>🛵 {t.rentalSearch.vehicleType}</span><span className="font-semibold" style={{ color: "#0c4a6e" }}>{type}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RentalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f9ff" }}>
      <p style={{ color: "#0369a1" }}>...</p>
    </div>}>
      <RentalContent />
    </Suspense>
  );
}
