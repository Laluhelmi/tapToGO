"use client";
import { useState, useMemo } from "react";
import { SCHEDULES } from "@/data/boats";
import BoatCard from "./BoatCard";
import type { SearchParams } from "@/app/page";
import { useLang } from "@/contexts/LanguageContext";

type SortKey = "departure" | "price";

interface Props {
  searchParams: SearchParams;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function ScheduleSection({ searchParams }: Props) {
  const { t } = useLang();
  const [sort, setSort] = useState<SortKey>("departure");
  const [priceMax, setPriceMax] = useState(1000);

  const { from, to, date, passengers } = searchParams;

  const results = useMemo(() => {
    return SCHEDULES
      .filter(s => (!from || s.from === from) && (!to || s.to === to))
      .filter(s => s.price <= priceMax)
      .filter(s => s.availableSeats >= passengers)
      .sort((a, b) =>
        sort === "price" ? a.price - b.price :
        a.departureTime.localeCompare(b.departureTime)
      );
  }, [from, to, priceMax, passengers, sort]);

  const routeLabel = from && to ? `${from} → ${to}` : "Semua Rute";
  const minPrice = results.length ? Math.min(...results.map(s => s.price)) : 0;
  const maxPrice = results.length ? Math.max(...results.map(s => s.price)) : 0;

  return (
    <section className="py-20 px-4 sm:px-6" id="schedules" style={{ background: "#f0f9ff" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#e0f2fe", color: "#0369a1" }}>
            {t.scheduleSection.badge}
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-3" style={{ color: "#0c4a6e" }}>
            {from && to ? (
              <>{from} <span style={{ color: "#0284c7" }}>→</span> {to}</>
            ) : t.scheduleSection.pickRoute}
          </h2>
          <p style={{ color: "#64748b" }}>
            <span className="font-bold" style={{ color: "#0369a1" }}>{results.length} {t.scheduleSection.schedules}</span>
            {date && ` · ${formatDate(date)}`}
            {` · ${passengers} ${t.scheduleSection.passenger}`}
            {results.length > 0 && ` · Mulai Rp ${minPrice}K`}
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
          <div className="mt-3 flex items-center gap-4">
            <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "#64748b" }}>
              {t.scheduleSection.maxPrice} <span className="font-bold" style={{ color: "#0369a1" }}>Rp {priceMax}K</span>
            </span>
            <input type="range" min={300} max={1000} step={25} value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#0284c7" }} />
            <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "#94a3b8" }}>
              Rp {minPrice}K – {maxPrice}K
            </span>
          </div>
        </div>

        <p className="text-sm mb-4 px-1" style={{ color: "#64748b" }}>
          {t.scheduleSection.showing} <span className="font-bold" style={{ color: "#0369a1" }}>{results.length}</span> {t.scheduleSection.schedules} · {t.scheduleSection.priceIncluded}
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.length > 0 ? (
            results.map((b, i) => <BoatCard key={b.id} boat={b} index={i} date={date} passengers={passengers} />)
          ) : (
            <div className="col-span-3 bg-white rounded-3xl p-16 text-center"
              style={{ border: "1.5px solid #e0f2fe" }}>
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-bold mb-2" style={{ color: "#0c4a6e" }}>{t.scheduleSection.noSchedule}</p>
              <p className="text-sm mb-4" style={{ color: "#64748b" }}>
                {!from || !to
                  ? t.scheduleSection.pickPortHint
                  : t.scheduleSection.noMatch}
              </p>
              <button onClick={() => setPriceMax(1000)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white btn-ocean">
                {t.scheduleSection.resetFilter}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
