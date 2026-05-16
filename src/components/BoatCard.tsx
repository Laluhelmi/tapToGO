"use client";
import type { BoatSchedule } from "@/types";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useCompare } from "@/contexts/CompareContext";

const BADGE_STYLES = {
  "Best Price":    { bg: "#dcfce7", text: "#15803d", icon: "💚" },
  "Most Popular":  { bg: "#e0f2fe", text: "#0369a1", icon: "🔥" },
  "Fastest":       { bg: "#f3e8ff", text: "#7e22ce", icon: "⚡" },
  "Recommended":   { bg: "#fef9c3", text: "#854d0e", icon: "⭐" },
};

export default function BoatCard({ boat, date, passengers = 1 }: { boat: BoatSchedule; index?: number; date?: string; passengers?: number }) {
  const router = useRouter();
  const { t } = useLang();
  const compare = useCompare();
  const badge = boat.badge ? BADGE_STYLES[boat.badge] : null;
  const almostFull = boat.availableSeats <= 5;
  const selected = compare.isSelected(boat.id);

  const goToDetail = () => {
    router.push(`/armada/${encodeURIComponent(boat.operator)}`);
  };

  const goToBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    const d = date || new Date().toISOString().split("T")[0];
    router.push(`/booking?id=${boat.id}&date=${d}&passengers=${passengers}`);
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    compare.toggle(boat.id);
  };

  return (
    <div onClick={goToDetail}
      className="bg-white rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
      style={{
        border: "1.5px solid #e0f2fe",
        boxShadow: "0 2px 16px rgba(2,132,199,0.08)",
        ...(almostFull ? { borderColor: "#fca5a5" } : {}),
        ...(selected ? { borderColor: "#0284c7", borderWidth: "2.5px", boxShadow: "0 8px 28px rgba(2,132,199,0.2)" } : {}),
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(2,132,199,0.18)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(2,132,199,0.08)"; }}>

      {/* Top: Boat photo */}
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        <img
          src={boat.image}
          alt={boat.operator}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ background: "#e0f2fe" }}
        />
        {/* Dark overlay gradient at bottom */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 100%)" }} />
        {/* Operator badge */}
        <div className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold text-white shadow-md"
          style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>
          {boat.logo}
        </div>
        {badge && (
          <span className="absolute top-3 right-[110px] flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: badge.bg, color: badge.text }}>
            {badge.icon} {boat.badge}
          </span>
        )}
        {/* Compare toggle */}
        <button onClick={toggleCompare}
          title={selected ? t.compare.added : t.compare.add}
          disabled={!selected && !compare.canAdd}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all shadow-md hover:scale-105"
          style={{
            background: selected ? "linear-gradient(135deg,#0284c7,#0369a1)" : "rgba(255,255,255,0.95)",
            color: selected ? "white" : "#0369a1",
            opacity: !selected && !compare.canAdd ? 0.5 : 1,
            cursor: !selected && !compare.canAdd ? "not-allowed" : "pointer",
          }}>
          {selected ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>{t.compare.added}</span>
            </>
          ) : (
            <span>{t.compare.add}</span>
          )}
        </button>
        {/* Boat type pill bottom-left */}
        <span className="absolute bottom-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full text-white"
          style={{ background: "rgba(3,105,161,0.85)", backdropFilter: "blur(4px)" }}>
          {boat.boatType}
        </span>
      </div>

      {/* Bottom: Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Operator name + type */}
        <div>
          <p className="font-bold text-sm" style={{ color: "#0c4a6e" }}>{boat.operator}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "#f0f9ff", color: "#0369a1" }}>{boat.boatType}</span>
          </div>
        </div>

        {/* Time route */}
        <div className="flex items-center gap-2">
          <div className="text-center">
            <p className="text-xl font-extrabold tabular-nums" style={{ color: "#0369a1" }}>{boat.departureTime}</p>
            <p className="text-xs font-semibold" style={{ color: "#64748b" }}>{boat.from}</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <p className="text-xs font-semibold mb-1" style={{ color: "#94a3b8" }}>{boat.duration}</p>
            <div className="w-full flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full border-2" style={{ borderColor: "#0284c7" }} />
              <div className="flex-1 h-0.5 rounded-full" style={{ background: "linear-gradient(90deg,#0284c7,#0ea5e9)" }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#0ea5e9" }} />
            </div>
            <p className="text-xs mt-1 font-semibold" style={{ color: "#0284c7" }}>{t.scheduleSection.direct}</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold tabular-nums" style={{ color: "#0369a1" }}>{boat.arrivalTime}</p>
            <p className="text-xs font-semibold" style={{ color: "#64748b" }}>{boat.to}</p>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: "1px solid #f0f9ff" }}>
          <div>
            {boat.originalPrice && (
              <p className="text-xs line-through" style={{ color: "#94a3b8" }}>Rp {boat.originalPrice}K</p>
            )}
            <p className="text-xl font-extrabold" style={{ background: "linear-gradient(135deg,#0369a1,#0284c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Rp {boat.price}K
            </p>
            <p className="text-xs" style={{ color: "#94a3b8" }}>/pax</p>
          </div>
          <button onClick={goToBooking} className="px-5 py-2.5 rounded-2xl text-sm font-extrabold text-white transition-all hover:scale-105 btn-ocean">
            {t.boatCard.select}
          </button>
        </div>
      </div>
    </div>
  );
}
