"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FROM_PORTS, TO_PORTS } from "@/data/boats";
import { getTodayString } from "@/lib/utils";
import Spinner from "./Spinner";
import type { Port } from "@/types";
import type { SearchParams } from "@/app/page";
import { useLang } from "@/contexts/LanguageContext";

type TabKey = "fastboat" | "rental" | "tour";

// Professional SVG icons
const IconFrom = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="12" cy="12" r="9" opacity="0.4" />
  </svg>
);
const IconTo = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconLoc = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconBike = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
  </svg>
);
const IconTour = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M5 16c0 2 3 4 7 4s7-2 7-4M3 9.5A9 9 0 0 1 12 3a9 9 0 0 1 9 6.5" />
  </svg>
);
const IconSearch = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

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

// Rental pickup locations (Lombok)
const RENTAL_LOCATIONS = ["Bangsal", "Senggigi"];
const POPULAR_RENTAL_LOCATIONS = ["Bangsal", "Senggigi"];

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
  const [rentalLoc, setRentalLoc] = useState("Bangsal");
  const [rentalStart, setRentalStart] = useState(getTodayString());
  const [rentalDays, setRentalDays] = useState(1);
  const [rentalQty, setRentalQty] = useState(1);
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

  const [isSearching, setIsSearching] = useState(false);

  // ── Search handlers ──
  const searchFastboat = () => {
    if (!from || !to) return;
    setIsSearching(true);
    // Brief loading state for visual feedback (search itself is instant in-memory)
    setTimeout(() => {
      onSearch({ from, to, date, passengers });
      setTimeout(() => setIsSearching(false), 600);
    }, 200);
  };

  const searchRental = () => {
    const params = new URLSearchParams({
      location: rentalLoc,
      startDate: rentalStart,
      duration: String(rentalDays),
      quantity: String(rentalQty),
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

      <div className="p-4 sm:p-5">
        {/* ── FASTBOAT TAB ── */}
        {tab === "fastboat" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-end">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: "#0369a1" }}>{t.search.from}</label>
                <div className="relative">
                  <IconFrom className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width={15} height={15} style={{ color: "#0284c7" }} />
                  <select value={from} onChange={e => setFrom(e.target.value as Port)}
                    className="w-full rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold appearance-none cursor-pointer focus:outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: from ? "#0369a1" : "#94a3b8" }}
                    onFocus={e => e.target.style.borderColor = "#38bdf8"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                    <option value="">{t.search.selectPort}</option>
                    {FROM_PORTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: "#0369a1" }}>{t.search.to}</label>
                <div className="relative">
                  <IconTo className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width={15} height={15} style={{ color: "#0284c7" }} />
                  <select value={to} onChange={e => setTo(e.target.value as Port)}
                    className="w-full rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold appearance-none cursor-pointer focus:outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: to ? "#0369a1" : "#94a3b8" }}
                    onFocus={e => e.target.style.borderColor = "#38bdf8"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                    <option value="">{t.search.selectDestination}</option>
                    {TO_PORTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: "#0369a1" }}>{t.search.date}</label>
                <input type="date" value={date} min={getTodayString()} onChange={e => { const v = e.target.value; if (v && v >= getTodayString()) setDate(v); }}
                  className="w-full min-w-0 max-w-full rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none transition-all [color-scheme:light] cursor-pointer appearance-none"
                  style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#38bdf8"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: "#0369a1" }}>{t.search.passengers}</label>
                <Counter value={passengers} setValue={setPassengers} min={1} max={20} label={t.search.pax} />
              </div>
            </div>
            <button onClick={searchFastboat}
              className="mt-3 w-full py-3 rounded-xl text-white text-sm font-extrabold tracking-wide btn-ocean flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={!from || !to || isSearching}>
              {isSearching ? (
                <>
                  <Spinner size={16} color="white" />
                  Searching…
                </>
              ) : (
                <>
                  <IconSearch width={16} height={16} />
                  {t.search.searchBtn}
                </>
              )}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-end">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: "#0369a1" }}>{t.rentalSearch.location}</label>
                <div className="relative">
                  <IconLoc className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width={15} height={15} style={{ color: "#0284c7" }} />
                  <select value={rentalLoc} onChange={e => setRentalLoc(e.target.value)}
                    className="w-full rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold appearance-none cursor-pointer focus:outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }}
                    onFocus={e => e.target.style.borderColor = "#38bdf8"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                    {RENTAL_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: "#0369a1" }}>{t.rentalSearch.startDate}</label>
                <input type="date" value={rentalStart} min={getTodayString()} onChange={e => { const v = e.target.value; if (v && v >= getTodayString()) setRentalStart(v); }}
                  className="w-full min-w-0 max-w-full rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none transition-all [color-scheme:light] cursor-pointer appearance-none"
                  style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#38bdf8"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: "#0369a1" }}>{t.rentalSearch.duration}</label>
                <Counter value={rentalDays} setValue={setRentalDays} min={1} max={30} label={t.rentalSearch.durationUnit} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: "#0369a1" }}>{t.rentalSearch.quantity}</label>
                <Counter value={rentalQty} setValue={setRentalQty} min={1} max={10} label={t.rentalSearch.quantityUnit} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: "#0369a1" }}>{t.rentalSearch.vehicleType}</label>
                <div className="relative">
                  <IconBike className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width={15} height={15} style={{ color: "#0284c7" }} />
                  <select value={rentalType} onChange={e => setRentalType(e.target.value as typeof rentalType)}
                    className="w-full rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold appearance-none cursor-pointer focus:outline-none transition-all"
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
              className="mt-3 w-full py-3 rounded-xl text-white text-sm font-extrabold tracking-wide btn-ocean flex items-center justify-center gap-2">
              <IconSearch width={16} height={16} />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-end">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: "#0369a1" }}>{t.tourSearch.destination}</label>
                <div className="relative">
                  <IconLoc className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width={15} height={15} style={{ color: "#0284c7" }} />
                  <select value={tourDest} onChange={e => setTourDest(e.target.value)}
                    className="w-full rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold appearance-none cursor-pointer focus:outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }}
                    onFocus={e => e.target.style.borderColor = "#38bdf8"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                    {TOUR_DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: "#0369a1" }}>{t.tourSearch.date}</label>
                <input type="date" value={tourDate} min={getTodayString()} onChange={e => { const v = e.target.value; if (v && v >= getTodayString()) setTourDate(v); }}
                  className="w-full min-w-0 max-w-full rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none transition-all [color-scheme:light] cursor-pointer appearance-none"
                  style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#38bdf8"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: "#0369a1" }}>{t.tourSearch.participants}</label>
                <Counter value={tourPax} setValue={setTourPax} min={1} max={20} label={t.search.pax} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: "#0369a1" }}>{t.tourSearch.tourType}</label>
                <div className="relative">
                  <IconTour className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width={15} height={15} style={{ color: "#0284c7" }} />
                  <select value={tourType} onChange={e => setTourType(e.target.value as typeof tourType)}
                    className="w-full rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold appearance-none cursor-pointer focus:outline-none transition-all"
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
              className="mt-3 w-full py-3 rounded-xl text-white text-sm font-extrabold tracking-wide btn-ocean flex items-center justify-center gap-2">
              <IconSearch width={16} height={16} />
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
    <div className="flex items-center gap-2 rounded-xl px-2 py-1" style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
      <button onClick={() => setValue(Math.max(min, value - 1))}
        className="w-7 h-7 rounded-lg text-base font-bold flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "#eff6ff", color: "#0284c7" }}>−</button>
      <div className="flex-1 text-center leading-tight py-0.5">
        <p className="text-sm font-extrabold leading-none" style={{ color: "#0369a1" }}>{value}</p>
        <p className="text-[9px]" style={{ color: "#94a3b8" }}>{label}</p>
      </div>
      <button onClick={() => setValue(Math.min(max, value + 1))}
        className="w-7 h-7 rounded-lg text-base font-bold flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "#eff6ff", color: "#0284c7" }}>+</button>
    </div>
  );
}
