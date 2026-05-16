"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import type { BoatSchedule } from "@/types";
import type { RouteInfo } from "@/lib/routes";
import { useLang } from "@/contexts/LanguageContext";

function formatRupiah(thousands: number): string {
  return "Rp " + (thousands * 1000).toLocaleString("id-ID");
}

interface Props {
  route: RouteInfo;
  schedules: BoatSchedule[];
  related: RouteInfo[];
}

export default function RouteContent({ route, schedules, related }: Props) {
  const { t } = useLang();
  const cheapest = schedules.reduce((min, s) => (s.price < min.price ? s : min), schedules[0]);
  const earliestTime = schedules[0]?.departureTime ?? "—";
  const latestTime = schedules[schedules.length - 1]?.departureTime ?? "—";
  const arrow = "→";
  const todayParam = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />

      {/* Hero */}
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold mb-4 transition-opacity hover:opacity-80"
            style={{ color: "#bae6fd" }}>{t.rute.backHome}</Link>

          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#fbbf24" }}>
            {t.rute.badge}
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-2">
            {route.from} <span style={{ color: "#7dd3fc" }}>{arrow}</span> {route.to}
          </h1>
          <p className="text-base sm:text-lg" style={{ color: "#e0f2fe" }}>
            {route.scheduleCount} {t.rute.dailySchedules} · {route.operators.length} {t.rute.officialOperators} · {t.rute.durationLabel} {route.duration}
          </p>

          {/* Hero stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 max-w-3xl">
            <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#bae6fd" }}>{t.rute.startFrom}</p>
              <p className="text-xl sm:text-2xl font-extrabold text-white">Rp {route.minPrice}K</p>
            </div>
            <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#bae6fd" }}>{t.rute.schedule}</p>
              <p className="text-xl sm:text-2xl font-extrabold text-white">{earliestTime} – {latestTime}</p>
            </div>
            <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#bae6fd" }}>{t.rute.duration}</p>
              <p className="text-xl sm:text-2xl font-extrabold text-white">{route.duration}</p>
            </div>
            <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#bae6fd" }}>{t.rute.operators}</p>
              <p className="text-xl sm:text-2xl font-extrabold text-white">{route.operators.length} {t.rute.brand}</p>
            </div>
          </div>
        </div>
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* Main column */}
        <div className="space-y-6">

          {/* About this route */}
          <section className="bg-white rounded-2xl p-5 sm:p-6"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <h2 className="text-xl font-extrabold mb-3" style={{ color: "#0c4a6e" }}>
              {t.rute.aboutTitle} {route.from} {arrow} {route.to}
            </h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "#475569" }}>
              {t.rute.aboutP1Pre} <strong>{route.from} {arrow} {route.to}</strong> {t.rute.aboutP1Mid}{" "}
              <strong>{route.duration}</strong> {t.rute.aboutP1End1}{" "}
              <strong>{route.scheduleCount} {t.rute.dailySchedules}</strong> {t.rute.aboutP1End2}{" "}
              <strong>{route.operators.length} {t.rute.officialOperators}</strong>{t.rute.aboutP1End3} {earliestTime} {t.rute.aboutP1End4} {latestTime}.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
              {t.rute.aboutP2Pre} {route.from} {arrow} {route.to} {t.rute.aboutP2Mid}{" "}
              <strong style={{ color: "#0369a1" }}>{formatRupiah(route.minPrice)}</strong>{" "}
              {t.rute.aboutP2End} {route.operators.slice(0, 3).join(", ")}
              {route.operators.length > 3 && ` ${t.rute.aboutP2OpsMore} ${route.operators.length - 3} ${t.rute.aboutP2OpsMoreEnd}`}.
            </p>
          </section>

          {/* All schedules */}
          <section className="bg-white rounded-2xl p-5 sm:p-6"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold" style={{ color: "#0c4a6e" }}>
                {t.rute.scheduleTitle} {route.from} {arrow} {route.to}
              </h2>
              <span className="text-sm font-bold" style={{ color: "#0369a1" }}>
                {schedules.length} {t.rute.scheduleCount}
              </span>
            </div>

            <div className="space-y-2.5">
              {schedules.map(s => (
                <Link key={s.id} href={`/booking?id=${s.id}&date=${todayParam}&passengers=1`}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01] hover:shadow-md"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0" style={{ background: "#e0f2fe" }}>
                    {s.image ? <img src={s.image} alt={s.operator} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: "#0c4a6e" }}>{s.operator}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>
                      <span className="font-bold tabular-nums" style={{ color: "#0369a1" }}>{s.departureTime}</span>
                      {" → "}
                      <span className="tabular-nums">{s.arrivalTime}</span>
                      {" · "}{s.duration}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-extrabold leading-none" style={{ color: "#0369a1" }}>Rp {s.price}K</p>
                    <p className="text-[10px]" style={{ color: "#94a3b8" }}>{t.rute.perPax}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Operators */}
          <section className="bg-white rounded-2xl p-5 sm:p-6"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <h2 className="text-xl font-extrabold mb-3" style={{ color: "#0c4a6e" }}>
              {t.rute.operatorTitle}
            </h2>
            <div className="flex flex-wrap gap-2">
              {route.operators.map(op => (
                <Link key={op} href={`/armada/${encodeURIComponent(op)}`}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
                  style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>
                  🚤 {op}
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-2xl p-5 sm:p-6"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <h2 className="text-xl font-extrabold mb-4" style={{ color: "#0c4a6e" }}>
              {t.rute.faqTitle}
            </h2>
            <div className="space-y-3">
              <FaqItem
                q={`${t.rute.faq1Q} ${route.from} ${t.rute.faq1Q2} ${route.to}?`}
                a={`${t.rute.faq1A} ${route.from} ${t.rute.faq1AMid} ${route.to} ${t.rute.faq1AEnd} ${route.duration}${t.rute.faq1AClose}`}
              />
              <FaqItem
                q={`${t.rute.faq2Q} ${route.from} ${t.rute.faq1Q2} ${route.to}?`}
                a={`${t.rute.faq2A} ${route.from} ${t.rute.faq2AMid} ${route.to} ${t.rute.faq2AEnd} Rp ${route.minPrice}K ${t.rute.faq2APriceMid} Rp ${route.maxPrice}K ${t.rute.faq2AClose}`}
              />
              <FaqItem
                q={t.rute.faq3Q}
                a={`${t.rute.faq3A} ${cheapest?.operator} ${t.rute.faq3AEnd} ${formatRupiah(cheapest?.price ?? route.minPrice)} ${t.rute.faq3AClose}`}
              />
              <FaqItem
                q={t.rute.faq4Q}
                a={`${t.rute.faq4A} ${route.scheduleCount} ${t.rute.faq4AMid} ${earliestTime} ${t.rute.faq4AMid2} ${latestTime}${t.rute.faq4AClose}`}
              />
              <FaqItem
                q={t.rute.faq5Q}
                a={`${t.rute.faq5A} ${route.from}${t.rute.faq5AClose}`}
              />
              <FaqItem
                q={t.rute.faq6Q}
                a={t.rute.faq6A}
              />
            </div>
          </section>

          {/* Related routes */}
          {related.length > 0 && (
            <section className="bg-white rounded-2xl p-5 sm:p-6"
              style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
              <h2 className="text-xl font-extrabold mb-4" style={{ color: "#0c4a6e" }}>
                {t.rute.relatedTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map(r => (
                  <Link key={r.slug} href={`/rute/${r.slug}`}
                    className="block p-3 rounded-xl transition-all hover:scale-[1.02] hover:shadow-md"
                    style={{ background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                    <p className="font-bold text-sm" style={{ color: "#0c4a6e" }}>
                      {r.from} <span style={{ color: "#0284c7" }}>{arrow}</span> {r.to}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                      {r.scheduleCount} {t.rute.relatedSchedules} · {t.rute.relatedStart}{" "}
                      <strong style={{ color: "#0369a1" }}>Rp {r.minPrice}K</strong>
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar — quick book CTA */}
        <aside className="lg:sticky lg:top-20 self-start">
          <div className="bg-white rounded-2xl p-5"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#0369a1" }}>
              {t.rute.bookCta}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span style={{ color: "#64748b" }}>{t.rute.routeLabel}</span>
                <span className="font-bold text-right" style={{ color: "#0c4a6e" }}>{route.from} {arrow} {route.to}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#64748b" }}>{t.rute.duration}</span>
                <span className="font-bold" style={{ color: "#0c4a6e" }}>{route.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#64748b" }}>{t.rute.schedule}</span>
                <span className="font-bold" style={{ color: "#0c4a6e" }}>{route.scheduleCount} {t.rute.daysLabel}</span>
              </div>
              <div className="flex justify-between items-end pt-2" style={{ borderTop: "1px solid #e0f2fe" }}>
                <span className="text-sm" style={{ color: "#64748b" }}>{t.rute.startFrom}</span>
                <span className="text-2xl font-extrabold" style={{ color: "#0369a1" }}>Rp {route.minPrice}K</span>
              </div>
            </div>

            <Link href={`/?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`}
              className="block w-full py-3 rounded-xl text-white text-sm font-extrabold text-center btn-ocean transition-all hover:scale-[1.02]">
              {t.rute.searchCta}
            </Link>

            <p className="text-[10px] text-center mt-3" style={{ color: "#94a3b8" }}>
              {t.rute.benefits}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl overflow-hidden"
      style={{ border: "1px solid #e0f2fe", background: "#f8fafc" }}>
      <summary className="px-4 py-3 cursor-pointer flex items-center justify-between gap-3 list-none transition-colors">
        <span className="text-sm font-bold flex-1" style={{ color: "#0c4a6e" }}>{q}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: "#0369a1" }}
          className="transition-transform group-open:rotate-180">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </summary>
      <div className="px-4 pb-3 text-sm leading-relaxed" style={{ color: "#475569" }}>
        {a}
      </div>
    </details>
  );
}
