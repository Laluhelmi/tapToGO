"use client";
import { useState, useMemo } from "react";
import { SCHEDULES } from "@/data/boats";
import BoatCard from "./BoatCard";
import type { SearchParams } from "@/app/page";
import { useLang } from "@/contexts/LanguageContext";
import { getTodayString } from "@/lib/utils";
import EmptyState from "./EmptyState";

type SortKey = "departure" | "price";

interface Props {
  searchParams: SearchParams;
  onChangeDate?: (date: string) => void;
}

function formatDate(dateStr: string, lang: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === "en" ? "en-US" : "id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function ScheduleSection({ searchParams, onChangeDate }: Props) {
  const { t, lang } = useLang();
  const [sort, setSort] = useState<SortKey>("departure");
  const [priceMax, setPriceMax] = useState(1000);

  const { from, to, date, passengers } = searchParams;

  const results = useMemo(() => {
    // Only hide expired departures when the selected date is EXACTLY today.
    // Future dates (tomorrow and beyond) always show every schedule incl. earliest.
    const today = getTodayString();
    const isToday = Boolean(date) && date.trim() === today;
    const now = new Date();
    const nowHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    return SCHEDULES
      .filter(s => (!from || s.from === from) && (!to || s.to === to))
      .filter(s => s.price <= priceMax)
      .filter(s => s.availableSeats >= passengers)
      .filter(s => {
        if (!isToday) return true;            // future date → keep all
        return s.departureTime > nowHHMM;      // today → drop passed departures
      })
      .sort((a, b) =>
        sort === "price" ? a.price - b.price :
        a.departureTime.localeCompare(b.departureTime)
      );
  }, [from, to, date, priceMax, passengers, sort]);

  const routeLabel = from && to ? `${from} → ${to}` : "Semua Rute";
  const minPrice = results.length ? Math.min(...results.map(s => s.price)) : 0;
  const maxPrice = results.length ? Math.max(...results.map(s => s.price)) : 0;

  return (
    <section className="pt-4 pb-12 px-4 sm:px-6" id="schedules" style={{ background: "#f0f9ff" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
            style={{ background: "#e0f2fe", color: "#0369a1" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h3l2-3 4 6 2-3h7"/>
              <circle cx="6" cy="12" r="0.8" fill="currentColor"/>
              <circle cx="18" cy="12" r="0.8" fill="currentColor"/>
            </svg>
            {t.scheduleSection.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: "#0c4a6e" }}>
            {from && to ? (
              <>{from} <span style={{ color: "#0284c7" }}>→</span> {to}</>
            ) : t.scheduleSection.pickRoute}
          </h2>
          <p className="text-sm" style={{ color: "#64748b" }}>
            <span className="font-bold" style={{ color: "#0369a1" }}>{results.length} {t.scheduleSection.schedules}</span>
            {date && ` · ${formatDate(date, lang)}`}
            {` · ${passengers} ${t.scheduleSection.passenger}`}
            {results.length > 0 && ` · ${t.scheduleSection.startFrom} ${minPrice}K`}
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl p-4 mb-6"
          style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: "#94a3b8" }}>{t.scheduleSection.sortBy}</span>
              {([{ k: "departure", l: t.scheduleSection.time }, { k: "price", l: t.scheduleSection.price }] as { k: SortKey; l: string }[]).map(({ k, l }) => (
                <button key={k} onClick={() => setSort(k)}
                  className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                  style={sort === k
                    ? { background: "#eff6ff", color: "#0369a1", border: "1.5px solid #bae6fd" }
                    : { color: "#94a3b8" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "#64748b" }}>
                {t.scheduleSection.maxPrice} <span className="font-bold" style={{ color: "#0369a1" }}>Rp {priceMax}K</span>
              </span>
              <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "#94a3b8" }}>
                Rp {minPrice}K – {maxPrice}K
              </span>
            </div>
            <input type="range" min={300} max={1000} step={25} value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              className="price-slider"
              style={{ ["--fill" as string]: `${((priceMax - 300) / (1000 - 300)) * 100}%` }} />
          </div>
        </div>

        <p className="text-sm mb-4 px-1" style={{ color: "#64748b" }}>
          {t.scheduleSection.showing} <span className="font-bold" style={{ color: "#0369a1" }}>{results.length}</span> {t.scheduleSection.schedules}
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.length > 0 ? (
            results.map((b, i) => <BoatCard key={b.id} boat={b} index={i} date={date} passengers={passengers} />)
          ) : (
            <div className="col-span-3">
              <EmptyState
                title={t.scheduleSection.noSchedule}
                description={!from || !to ? t.scheduleSection.pickPortHint : t.scheduleSection.noMatch}
                action={
                  <div className="space-y-3">
                    {from && to && onChangeDate && (
                      <p className="text-sm" style={{ color: "#64748b" }}>{t.scheduleSection.tryNextDateHint}</p>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button onClick={() => setPriceMax(1000)}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white btn-ocean">
                        {t.scheduleSection.resetFilter}
                      </button>
                      {from && to && onChangeDate && (
                        <button
                          onClick={() => {
                            const d = new Date(date || new Date().toISOString().split("T")[0]);
                            d.setDate(d.getDate() + 1);
                            onChangeDate(d.toISOString().split("T")[0]);
                          }}
                          className="px-6 py-2.5 rounded-xl text-sm font-bold"
                          style={{ background: "white", color: "#0369a1", border: "1.5px solid #bae6fd" }}>
                          {t.scheduleSection.tryNextDate}
                        </button>
                      )}
                    </div>
                  </div>
                }
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
