"use client";
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import EmptyState from "@/components/EmptyState";
import { VEHICLES, VEHICLE_LOCATIONS, type VehicleType } from "@/data/vehicles";
import { useLang } from "@/contexts/LanguageContext";

type SortKey = "popular" | "price-low" | "price-high";

function RentalContent() {
  const { t } = useLang();
  const params = useSearchParams();

  const initLocation = params.get("location") ?? "";
  const initType = (params.get("type") as VehicleType | "any") ?? "any";
  const initStartDate = params.get("startDate") ?? "";
  const initDuration = Number(params.get("duration") || "1");
  const initQuantity = Number(params.get("quantity") || "1");

  const [location, setLocation] = useState(initLocation);
  const [type, setType] = useState<VehicleType | "any">(initType);
  const [sort, setSort] = useState<SortKey>("popular");

  const filtered = useMemo(() => {
    let list = VEHICLES.filter((v) => {
      if (location && !v.locations.includes(location)) return false;
      if (type !== "any" && v.type !== type) return false;
      return true;
    });

    if (sort === "price-low") list = list.slice().sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (sort === "price-high") list = list.slice().sort((a, b) => b.pricePerDay - a.pricePerDay);
    else list = list.slice().sort((a, b) => b.reviewCount - a.reviewCount);

    return list;
  }, [location, type, sort]);

  const reset = () => {
    setLocation("");
    setType("any");
    setSort("popular");
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />

      {/* Hero */}
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-semibold mb-4 transition-opacity hover:opacity-80"
            style={{ color: "#bae6fd" }}
          >
            ← {t.nav.home}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
            🛵 {t.rentalSearch.title}
          </h1>
          <p style={{ color: "#bae6fd" }}>
            {VEHICLES.length} vehicles available · Pickup at Lombok & Gili Islands · Delivery available
          </p>

          {(initStartDate || initDuration > 1 || initQuantity > 1) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {initStartDate && (
                <span className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
                  📅 {initStartDate}
                </span>
              )}
              {initDuration > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
                  ⏱️ {initDuration} {t.rentalSearch.durationUnit}
                </span>
              )}
              {initQuantity > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
                  🔢 {initQuantity} {t.rentalSearch.quantityUnit}
                </span>
              )}
            </div>
          )}
        </div>

        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* Filter bar */}
        <div className="bg-white rounded-2xl p-4 mb-6"
          style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.06)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1 block" style={{ color: "#0369a1" }}>
                {t.rentalSearch.location}
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }}
              >
                <option value="">All locations</option>
                {VEHICLE_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1 block" style={{ color: "#0369a1" }}>
                {t.rentalSearch.vehicleType}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VehicleType | "any")}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }}
              >
                <option value="any">{t.rentalSearch.typeAny}</option>
                <option value="matic">{t.rentalSearch.typeMatic}</option>
                <option value="manual">{t.rentalSearch.typeManual}</option>
                <option value="big_bike">{t.rentalSearch.typeBigBike}</option>
                <option value="car">{t.rentalSearch.typeCar}</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1 block" style={{ color: "#0369a1" }}>
                Sort by
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }}
              >
                <option value="popular">Most popular</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold" style={{ color: "#94a3b8" }}>Quick:</span>
            {[
              { v: "matic" as const, l: "🛵 Scooter" },
              { v: "manual" as const, l: "🏍️ Manual" },
              { v: "big_bike" as const, l: "🏍️ Big Bike" },
              { v: "car" as const, l: "🚗 Car" },
            ].map((c) => (
              <button
                key={c.v}
                onClick={() => setType(type === c.v ? "any" : c.v)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={
                  type === c.v
                    ? { background: "linear-gradient(135deg,#0284c7,#0369a1)", color: "white" }
                    : { background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }
                }
              >
                {c.l}
              </button>
            ))}
            {(location || type !== "any") && (
              <button
                onClick={reset}
                className="ml-auto text-xs font-bold px-3 py-1.5 rounded-lg"
                style={{ background: "#fee2e2", color: "#dc2626" }}
              >
                ✕ Reset
              </button>
            )}
          </div>
        </div>

        <p className="text-sm mb-4 px-1" style={{ color: "#64748b" }}>
          Showing <span className="font-bold" style={{ color: "#0369a1" }}>{filtered.length}</span> of {VEHICLES.length} vehicles
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                startDate={initStartDate}
                duration={initDuration}
                quantity={initQuantity}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No vehicles match your filter"
            description="Try a different location or vehicle type."
            action={
              <button onClick={reset} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white btn-ocean">
                Reset Filter
              </button>
            }
          />
        )}

        <div className="mt-10 rounded-2xl p-5 text-sm"
          style={{ background: "white", border: "1.5px solid #e0f2fe" }}>
          <p className="font-bold mb-2 flex items-center gap-2" style={{ color: "#0c4a6e" }}>
            🛡️ Rental Terms
          </p>
          <ul className="space-y-1.5 text-xs leading-relaxed" style={{ color: "#64748b" }}>
            <li>• Valid Indonesian driver license (SIM C) or International Driving Permit required</li>
            <li>• Minimum age 18 years for scooter, 21 years for big bike & car</li>
            <li>• Cash deposit Rp 500K–2jt (returned at handover)</li>
            <li>• Damage charges apply for accidents not covered by basic insurance</li>
            <li>• Helmet, full tank, and basic insurance included in price</li>
            <li>• Free delivery in Gili area (booking 24h advance)</li>
            <li>• Cancellation: free up to 24h before pickup</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RentalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f9ff" }}>
          <p style={{ color: "#0369a1" }}>Loading…</p>
        </div>
      }
    >
      <RentalContent />
    </Suspense>
  );
}
