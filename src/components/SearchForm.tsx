"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FROM_PORTS, TO_PORTS } from "@/data/boats";
import { getTodayString } from "@/lib/utils";
import type { Port } from "@/types";
import type { SearchParams } from "@/app/page";
import { useLang } from "@/contexts/LanguageContext";

type TabKey = "fastboat" | "rental" | "tour";

interface Props {
  onSearch: (params: SearchParams) => void;
  initialValues?: SearchParams;
}

const QUICK_ROUTES: { from: Port; to: Port; label: string }[] = [
  { from: "Gili Trawangan", to: "Padang Bai", label: "Gili T → Padang Bai" },
  { from: "Bangsal", to: "Padang Bai", label: "Bangsal → Padang Bai" },
  { from: "Gili Air", to: "Nusa Penida", label: "Gili Air → Nusa Penida" },
  { from: "Gili Trawangan", to: "Sanur", label: "Gili T → Sanur" },
];

// Rental locations (Bali popular pickup spots)
const RENTAL_LOCATIONS = [
  "Kuta", "Seminyak", "Canggu", "Ubud", "Sanur",
  "Denpasar", "Nusa Dua", "Jimbaran", "Gili Trawangan", "Senggigi",
];
const POPULAR_RENTAL_LOCATIONS = ["Kuta", "Canggu", "Ubud", "Gili Trawangan"];

// Tour destinations
const TOUR_DESTINATIONS = [
  "Nusa Penida", "Nusa Lembongan", "Gili Trawangan", "Gili Meno", "Gili Air",
  "Menjangan", "Amed", "Tulamben", "Padangbai",
];
const POPULAR_TOUR_DESTINATIONS = ["Nusa Penida", "Gili Trawangan", "Menjangan", "Amed"];

export default function SearchForm({ onSearch, initialValues }: Props) {
  const { t } = useLang();
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("fastboat");

  // ── Fastboat state ──
  const [from, setFrom] = useState<Port | "">(initialValues?.from ?? "Gili Trawangan");
  const [to, setTo] = useState<Port | "">(initialValues?.to ?? "Padang Bai");
  const [date, setDate] = useState(initialValues?.date ?? getTodayString());
  const [passengers, setPassengers] = useState(initialValues?.passengers ?? 1);

  // ── Rental state ──
  const [rentalLoc, setRentalLoc] = useState("Kuta");
  const [rentalStart, setRentalStart] = useState(getTodayString());
  const [rentalDays, setRentalDays] = useState(1);
  const [rentalType, setRentalType] = useState<"any" | "matic" | "manual" | "bigbike" | "car">("any");

  // ── Tour state ──
  const [tourDest, setTourDest] = useState("Nusa Penida");
  const [tourDate, setTourDate] = useState(getTodayString());
  const [tourPax, setTourPax] = useState(1);
  const [tourType, setTourType] = useState<"any" | "halfday" | "fullday" | "private" | "diving">("any");

  useEffect(() => {
    if (initialValues) {
      setFrom(initialValues.from);
      setTo(initialValues.to);
      setDate(initialValues.date);
      setPassengers(initialValues.passengers);
    }
  }, [initialValues]);

  // ── Search handlers ──
  const searchFastboat = () => {
    if (!from || !to) return;
    onSearch({ from, to, date, passengers });
  };

  const searchRental = () => {
    const params = new URLSearchParams({
      location: rentalLoc,
      startDate: rentalStart,
      duration: String(rentalDays),
      type: rentalType,
    });
    router.push(`/rental?${params.toString()}`);
  };

  const searchTour = () => {
    const params = new URLSearchParams({
      destination: tourDest,
      date: tourDate,
      participants: String(tourPax),
      type: tourType,
    });
    router.push(`/tour?${params.toString()}`);
  };

  const selectRoute = (f: Port, tt: Port) => {
    setFrom(f); setTo(tt);
    onSearch({ from: f, to: tt, date, passengers });
  };

  // ── Tab Pills ──
  const tabs: { key: TabKey; icon: string; label: string }[] = [
    { key: "fastboat", icon: "🚤", label: t.productTab.fastboat },
    { key: "rental", icon: "🛵", label: t.productTab.rental },
    { key: "tour", icon: "🤿", label: t.productTab.tour },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl"
      style={{ border: "1px solid #e0f2fe", boxShadow: "0 8px 40px rgba(14,165,233,0.15), 0 2px 8px rgba(0,0,0,0.06)" }}>

      {/* Tab pills — top of card */}
      <div className="flex p-1.5 mx-3 mt-3 rounded-2xl" style={{ background: "#f0f9ff" }}>
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap"
            style={tab === key
              ? { background: "white", color: "#0369a1", boxShadow: "0 2px 8px rgba(2,132,199,0.15)" }
              : { color: "#94a3b8" }}>
            {label}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-6">
        {/* ── FASTBOAT TAB ── */}
        {tab === "fastboat" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.search.from}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">🛳️</span>
                  <select value={from} onChange={e => setFrom(e.target.value as Port)}
                    className="w-full rounded-2xl pl-9 pr-4 py-3.5 text-sm font-semibold appearance-none cursor-pointer focus:outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: from ? "#0369a1" : "#94a3b8" }}
                    onFocus={e => e.target.style.borderColor = "#38bdf8"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                    <option value="">{t.search.selectPort}</option>
                    {FROM_PORTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.search.to}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">⚓</span>
                  <select value={to} onChange={e => setTo(e.target.value as Port)}
                    className="w-full rounded-2xl pl-9 pr-4 py-3.5 text-sm font-semibold appearance-none cursor-pointer focus:outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: to ? "#0369a1" : "#94a3b8" }}
                    onFocus={e => e.target.style.borderColor = "#38bdf8"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                    <option value="">{t.search.selectDestination}</option>
                    {TO_PORTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.search.date}</label>
                <input type="date" value={date} min={getTodayString()} onChange={e => setDate(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none transition-all [color-scheme:light] cursor-pointer"
                  style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }}
                  onFocus={e => e.target.style.borderColor = "#38bdf8"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.search.passengers}</label>
                <Counter value={passengers} setValue={setPassengers} min={1} max={20} label={t.search.pax} />
              </div>
            </div>
            <button onClick={searchFastboat}
              className="mt-4 w-full py-4 rounded-2xl text-white text-base font-extrabold tracking-wide btn-ocean flex items-center justify-center gap-2.5 disabled:opacity-50"
              disabled={!from || !to}>
              <span className="text-xl">🔍</span>
              {t.search.searchBtn}
            </button>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: "#94a3b8" }}>{t.search.popular}</span>
              {QUICK_ROUTES.map(r => (
                <button key={r.label} onClick={() => selectRoute(r.from, r.to)}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all hover:scale-105"
                  style={{
                    background: (from === r.from && to === r.to) ? "#0284c7" : "#eff6ff",
                    color: (from === r.from && to === r.to) ? "white" : "#0284c7",
                    border: "1px solid #bfdbfe"
                  }}>
                  {r.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── RENTAL TAB ── */}
        {tab === "rental" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.rentalSearch.location}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">📍</span>
                  <select value={rentalLoc} onChange={e => setRentalLoc(e.target.value)}
                    className="w-full rounded-2xl pl-9 pr-4 py-3.5 text-sm font-semibold appearance-none cursor-pointer focus:outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }}
                    onFocus={e => e.target.style.borderColor = "#38bdf8"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                    {RENTAL_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.rentalSearch.startDate}</label>
                <input type="date" value={rentalStart} min={getTodayString()} onChange={e => setRentalStart(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none transition-all [color-scheme:light] cursor-pointer"
                  style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }}
                  onFocus={e => e.target.style.borderColor = "#38bdf8"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.rentalSearch.duration}</label>
                <Counter value={rentalDays} setValue={setRentalDays} min={1} max={30} label={t.rentalSearch.durationUnit} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.rentalSearch.vehicleType}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">🛵</span>
                  <select value={rentalType} onChange={e => setRentalType(e.target.value as typeof rentalType)}
                    className="w-full rounded-2xl pl-9 pr-4 py-3.5 text-sm font-semibold appearance-none cursor-pointer focus:outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }}
                    onFocus={e => e.target.style.borderColor = "#38bdf8"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                    <option value="any">{t.rentalSearch.typeAny}</option>
                    <option value="matic">{t.rentalSearch.typeMatic}</option>
                    <option value="manual">{t.rentalSearch.typeManual}</option>
                    <option value="bigbike">{t.rentalSearch.typeBigBike}</option>
                    <option value="car">{t.rentalSearch.typeCar}</option>
                  </select>
                </div>
              </div>
            </div>
            <button onClick={searchRental}
              className="mt-4 w-full py-4 rounded-2xl text-white text-base font-extrabold tracking-wide btn-ocean flex items-center justify-center gap-2.5">
              <span className="text-xl">🔍</span>
              {t.rentalSearch.searchBtn}
            </button>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: "#94a3b8" }}>{t.rentalSearch.popular}</span>
              {POPULAR_RENTAL_LOCATIONS.map(l => (
                <button key={l} onClick={() => setRentalLoc(l)}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all hover:scale-105"
                  style={{
                    background: rentalLoc === l ? "#0284c7" : "#eff6ff",
                    color: rentalLoc === l ? "white" : "#0284c7",
                    border: "1px solid #bfdbfe"
                  }}>
                  📍 {l}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── TOUR TAB ── */}
        {tab === "tour" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.tourSearch.destination}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">🏝️</span>
                  <select value={tourDest} onChange={e => setTourDest(e.target.value)}
                    className="w-full rounded-2xl pl-9 pr-4 py-3.5 text-sm font-semibold appearance-none cursor-pointer focus:outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }}
                    onFocus={e => e.target.style.borderColor = "#38bdf8"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                    {TOUR_DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.tourSearch.date}</label>
                <input type="date" value={tourDate} min={getTodayString()} onChange={e => setTourDate(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none transition-all [color-scheme:light] cursor-pointer"
                  style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }}
                  onFocus={e => e.target.style.borderColor = "#38bdf8"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.tourSearch.participants}</label>
                <Counter value={tourPax} setValue={setTourPax} min={1} max={20} label={t.search.pax} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.tourSearch.tourType}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">🤿</span>
                  <select value={tourType} onChange={e => setTourType(e.target.value as typeof tourType)}
                    className="w-full rounded-2xl pl-9 pr-4 py-3.5 text-sm font-semibold appearance-none cursor-pointer focus:outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }}
                    onFocus={e => e.target.style.borderColor = "#38bdf8"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                    <option value="any">{t.tourSearch.typeAny}</option>
                    <option value="halfday">{t.tourSearch.typeHalfDay}</option>
                    <option value="fullday">{t.tourSearch.typeFullDay}</option>
                    <option value="private">{t.tourSearch.typePrivate}</option>
                    <option value="diving">{t.tourSearch.typeDiving}</option>
                  </select>
                </div>
              </div>
            </div>
            <button onClick={searchTour}
              className="mt-4 w-full py-4 rounded-2xl text-white text-base font-extrabold tracking-wide btn-ocean flex items-center justify-center gap-2.5">
              <span className="text-xl">🔍</span>
              {t.tourSearch.searchBtn}
            </button>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: "#94a3b8" }}>{t.tourSearch.popular}</span>
              {POPULAR_TOUR_DESTINATIONS.map(d => (
                <button key={d} onClick={() => setTourDest(d)}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all hover:scale-105"
                  style={{
                    background: tourDest === d ? "#0284c7" : "#eff6ff",
                    color: tourDest === d ? "white" : "#0284c7",
                    border: "1px solid #bfdbfe"
                  }}>
                  🏝️ {d}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Shared counter component ──
function Counter({ value, setValue, min, max, label }: {
  value: number; setValue: (n: number) => void; min: number; max: number; label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5" style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
      <button onClick={() => setValue(Math.max(min, value - 1))}
        className="w-9 h-9 rounded-xl text-xl font-bold flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "#eff6ff", color: "#0284c7" }}>−</button>
      <div className="flex-1 text-center">
        <p className="text-lg font-extrabold" style={{ color: "#0369a1" }}>{value}</p>
        <p className="text-xs" style={{ color: "#94a3b8" }}>{label}</p>
      </div>
      <button onClick={() => setValue(Math.min(max, value + 1))}
        className="w-9 h-9 rounded-xl text-xl font-bold flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "#eff6ff", color: "#0284c7" }}>+</button>
    </div>
  );
}
