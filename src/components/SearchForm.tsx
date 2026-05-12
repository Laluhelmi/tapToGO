"use client";
import { useState, useEffect } from "react";
import { FROM_PORTS, TO_PORTS } from "@/data/boats";
import { getTodayString } from "@/lib/utils";
import type { Port } from "@/types";
import type { SearchParams } from "@/app/page";
import { useLang } from "@/contexts/LanguageContext";

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

export default function SearchForm({ onSearch, initialValues }: Props) {
  const { t } = useLang();
  const [from, setFrom] = useState<Port | "">(initialValues?.from ?? "Gili Trawangan");
  const [to, setTo] = useState<Port | "">(initialValues?.to ?? "Padang Bai");
  const [date, setDate] = useState(initialValues?.date ?? getTodayString());
  const [passengers, setPassengers] = useState(initialValues?.passengers ?? 1);

  useEffect(() => {
    if (initialValues) {
      setFrom(initialValues.from);
      setTo(initialValues.to);
      setDate(initialValues.date);
      setPassengers(initialValues.passengers);
    }
  }, [initialValues]);

  const swap = () => {
    const newFrom = TO_PORTS.includes(to as Port) ? to as Port : from;
    const newTo = FROM_PORTS.includes(from as Port) ? from as Port : to;
    setFrom(newTo as Port | "");
    setTo(newFrom as Port | "");
  };

  const handleSearch = () => {
    if (!from || !to) return;
    onSearch({ from, to, date, passengers });
  };

  const selectRoute = (f: Port, t: Port) => {
    setFrom(f); setTo(t);
    onSearch({ from: f, to: t, date, passengers });
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-2xl"
      style={{ border: "1px solid #e0f2fe", boxShadow: "0 8px 40px rgba(14,165,233,0.15), 0 2px 8px rgba(0,0,0,0.06)" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        {/* From */}
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

        {/* To */}
        <div className="relative">
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

        {/* Date */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.search.date}</label>
          <input type="date" value={date} min={getTodayString()} onChange={e => setDate(e.target.value)}
            className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none transition-all [color-scheme:light] cursor-pointer"
            style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }}
            onFocus={e => e.target.style.borderColor = "#38bdf8"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
        </div>

        {/* Passengers */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: "#0369a1" }}>{t.search.passengers}</label>
          <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5" style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
            <button onClick={() => setPassengers(Math.max(1, passengers - 1))}
              className="w-9 h-9 rounded-xl text-xl font-bold flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "#eff6ff", color: "#0284c7" }}>−</button>
            <div className="flex-1 text-center">
              <p className="text-lg font-extrabold" style={{ color: "#0369a1" }}>{passengers}</p>
              <p className="text-xs" style={{ color: "#94a3b8" }}>{t.search.pax}</p>
            </div>
            <button onClick={() => setPassengers(Math.min(20, passengers + 1))}
              className="w-9 h-9 rounded-xl text-xl font-bold flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "#eff6ff", color: "#0284c7" }}>+</button>
          </div>
        </div>
      </div>

      {/* Search button */}
      <button onClick={handleSearch}
        className="mt-4 w-full py-4 rounded-2xl text-white text-base font-extrabold tracking-wide btn-ocean flex items-center justify-center gap-2.5 disabled:opacity-50"
        disabled={!from || !to}>
        <span className="text-xl">🔍</span>
        {t.search.searchBtn}
      </button>

      {/* Popular routes */}
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
    </div>
  );
}
