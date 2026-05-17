"use client";
import { useState, useMemo, useEffect, Suspense, type ReactNode } from "react";
import { SCHEDULES, FROM_PORTS, TO_PORTS } from "@/data/boats";
import type { Port } from "@/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useLang } from "@/contexts/LanguageContext";

type SortKey = "time" | "price" | "operator";

export default function JadwalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "#f0f9ff" }}><Navbar /></div>}>
      <JadwalContent />
    </Suspense>
  );
}

function JadwalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLang();
  const [from, setFrom] = useState<Port | "">("");
  const [to, setTo] = useState<Port | "">("");
  const [operator, setOperator] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [search, setSearch] = useState("");

  // Apply filter from URL query (e.g. ?operator=Ekajaya%2025 from /armada)
  useEffect(() => {
    const op = searchParams.get("operator");
    const f = searchParams.get("from");
    const tp = searchParams.get("to");
    if (op) setOperator(op);
    if (f) setFrom(f as Port);
    if (tp) setTo(tp as Port);
  }, [searchParams]);

  const goToBooking = (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    router.push(`/booking?id=${id}&date=${today}&passengers=1`);
  };

  const operators = useMemo(() => {
    const set = new Set(SCHEDULES.map(s => s.operator));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return SCHEDULES
      .filter(s => !from || s.from === from)
      .filter(s => !to || s.to === to)
      .filter(s => !operator || s.operator === operator)
      .filter(s => !search || s.operator.toLowerCase().includes(search.toLowerCase()) || s.from.toLowerCase().includes(search.toLowerCase()) || s.to.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortKey === "time") return a.departureTime.localeCompare(b.departureTime);
        if (sortKey === "price") return a.price - b.price;
        return a.operator.localeCompare(b.operator);
      });
  }, [from, to, operator, search, sortKey]);

  const reset = () => { setFrom(""); setTo(""); setOperator(""); setSearch(""); };

  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />

      {/* Hero header — sama style dengan halaman utama */}
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold mb-4 transition-opacity hover:opacity-80"
            style={{ color: "#bae6fd" }}>{t.jadwal.backHome}</Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{t.jadwal.title}</h1>
          <p style={{ color: "#bae6fd" }}>
            {SCHEDULES.length} {t.jadwal.subtitle} {operators.length} {t.jadwal.officialOp}
          </p>
        </div>
        {/* Wave — sama seperti HeroSection */}
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filter bar */}
        <div className="bg-white rounded-2xl p-5 mb-6"
          style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">

            {/* Search */}
            <div className="relative lg:col-span-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t.jadwal.searchPlaceholder}
                className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium focus:outline-none"
                style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#334155" }}
                onFocus={e => e.target.style.borderColor = "#38bdf8"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            {/* From */}
            <select value={from} onChange={e => setFrom(e.target.value as Port | "")}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold appearance-none cursor-pointer focus:outline-none"
              style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: from ? "#0369a1" : "#94a3b8" }}>
              <option value="">{t.jadwal.allDepartures}</option>
              {FROM_PORTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            {/* To */}
            <select value={to} onChange={e => setTo(e.target.value as Port | "")}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold appearance-none cursor-pointer focus:outline-none"
              style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: to ? "#0369a1" : "#94a3b8" }}>
              <option value="">{t.jadwal.allDestinations}</option>
              {TO_PORTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            {/* Operator */}
            <select value={operator} onChange={e => setOperator(e.target.value)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold appearance-none cursor-pointer focus:outline-none"
              style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: operator ? "#0369a1" : "#94a3b8" }}>
              <option value="">{t.jadwal.allOperators}</option>
              {operators.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Sort */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold" style={{ color: "#94a3b8" }}>{t.jadwal.sortBy}</span>
              {([
                {
                  k: "time", l: t.jadwal.sortTime,
                  icon: (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9"/>
                      <polyline points="12 7 12 12 15 14"/>
                    </svg>
                  ),
                },
                {
                  k: "price", l: t.jadwal.sortPrice,
                  icon: (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="2" x2="12" y2="22"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  ),
                },
                {
                  k: "operator", l: t.jadwal.sortOperator,
                  icon: (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 18c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0"/>
                      <path d="M4 14l1.5-4.5h13L20 14"/>
                      <line x1="12" y1="3" x2="12" y2="9.5"/>
                    </svg>
                  ),
                },
              ] as { k: SortKey; l: string; icon: ReactNode }[]).map(({ k, l, icon }) => (
                <button key={k} onClick={() => setSortKey(k)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={sortKey === k
                    ? { background: "linear-gradient(135deg,#0284c7,#0369a1)", color: "white" }
                    : { background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }}>
                  {icon}{l}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold" style={{ color: "#0369a1" }}>
                {filtered.length} {t.jadwal.schedules}
              </span>
              {(from || to || operator || search) && (
                <button onClick={reset} className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: "#fee2e2", color: "#dc2626" }}>
                  {t.jadwal.resetFilter}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cards */}
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filtered.map((s) => (
              <div key={s.id}
                className="bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(2,132,199,0.14)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(2,132,199,0.07)"}>

                {/* Mobile layout */}
                <div className="lg:hidden px-4 py-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold text-white shrink-0"
                        style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>{s.logo}</div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: "#0c4a6e" }}>{s.operator}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>{s.boatType}</span>
                          </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-extrabold" style={{ color: "#0369a1" }}>Rp {s.price}K</p>
                      <p className="text-xs" style={{ color: "#94a3b8" }}>/pax</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="shrink-0">
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#94a3b8" }}>{t.jadwal.from}</p>
                      <p className="text-sm font-semibold" style={{ color: "#334155" }}>{s.from}</p>
                    </div>
                    <span className="shrink-0" style={{ color: "#bae6fd" }}>→</span>
                    <div className="shrink-0">
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#94a3b8" }}>{t.jadwal.to}</p>
                      <p className="text-sm font-semibold" style={{ color: "#334155" }}>{s.to}</p>
                    </div>
                    <div className="shrink-0 ml-auto">
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#94a3b8" }}>Jam</p>
                      <p className="text-sm font-semibold tabular-nums" style={{ color: "#0369a1" }}>{s.departureTime}</p>
                    </div>
                  </div>
                  <button onClick={() => goToBooking(s.id)} className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white btn-ocean">{t.jadwal.select}</button>
                </div>

                {/* Desktop layout */}
                <div className="hidden lg:flex items-center px-5 py-4 gap-0">

                  {/* Time — 90px */}
                  <div className="shrink-0 w-[90px]">
                    <p className="text-xl font-extrabold tabular-nums leading-none" style={{ color: "#0369a1" }}>{s.departureTime}</p>
                    <p className="text-xs mt-1 font-semibold" style={{ color: "#94a3b8" }}>→ {s.arrivalTime}</p>
                  </div>

                  <div className="shrink-0 w-px self-stretch mx-4" style={{ background: "#e0f2fe" }} />

                  {/* Operator — grow */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold text-white shrink-0"
                      style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>{s.logo}</div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm leading-tight truncate" style={{ color: "#0c4a6e" }}>{s.operator}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap"
                          style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>{s.boatType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 w-px self-stretch mx-4" style={{ background: "#e0f2fe" }} />

                  {/* Route — 200px */}
                  <div className="shrink-0 w-[200px] flex items-center gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#94a3b8" }}>Dari</p>
                      <p className="text-sm font-semibold truncate" style={{ color: "#334155" }}>{s.from}</p>
                    </div>
                    <span className="shrink-0 font-bold" style={{ color: "#bae6fd" }}>→</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#94a3b8" }}>Ke</p>
                      <p className="text-sm font-semibold truncate" style={{ color: "#334155" }}>{s.to}</p>
                    </div>
                  </div>

                  <div className="shrink-0 w-px self-stretch mx-4" style={{ background: "#e0f2fe" }} />

                  {/* Duration — 100px */}
                  <div className="shrink-0 w-[100px]">
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#94a3b8" }}>{t.jadwal.duration}</p>
                    <p className="text-sm font-semibold" style={{ color: "#64748b" }}>{s.duration}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded-md inline-block mt-0.5"
                      style={{ background: "#f0f9ff", color: "#0369a1" }}>{s.availableSeats} {t.jadwal.seats}</span>
                  </div>

                  <div className="shrink-0 w-px self-stretch mx-4" style={{ background: "#e0f2fe" }} />

                  {/* Price + CTA — 160px */}
                  <div className="shrink-0 w-[160px] flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xl font-extrabold leading-none" style={{ color: "#0369a1" }}>Rp {s.price}K</p>
                      <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{t.jadwal.perPax}</p>
                    </div>
                    <button onClick={() => goToBooking(s.id)} className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white btn-ocean transition-all hover:scale-105 whitespace-nowrap">
                      {t.jadwal.select}
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl py-20 text-center"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-bold text-lg mb-1" style={{ color: "#0c4a6e" }}>{t.jadwal.noSchedule}</p>
            <p className="text-sm mb-4" style={{ color: "#64748b" }}>{t.jadwal.tryFilter}</p>
            <button onClick={reset} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white btn-ocean">
              {t.jadwal.resetFilter}
            </button>
          </div>
        )}

        <p className="text-center text-xs mt-4" style={{ color: "#94a3b8" }}>
          {t.jadwal.realData}
        </p>
      </div>
    </div>
  );
}
