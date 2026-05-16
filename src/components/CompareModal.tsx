"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { BoatSchedule } from "@/types";
import { AMENITY_ICONS } from "@/data/boats";
import { useCompare } from "@/contexts/CompareContext";
import { useLang } from "@/contexts/LanguageContext";

export default function CompareModal({
  boats,
  onClose,
}: {
  boats: BoatSchedule[];
  onClose: () => void;
}) {
  const { t } = useLang();
  const { remove } = useCompare();
  const router = useRouter();

  // Lock body scroll while open
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  // ESC to close
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  // Highlight cheapest, fastest, most-rated
  const cheapest = Math.min(...boats.map(b => b.price));
  const fastest = boats.reduce((min, b) => {
    const mins = parseDuration(b.duration);
    return mins < min.mins ? { mins, id: b.id } : min;
  }, { mins: Infinity, id: "" });
  const topRated = Math.max(...boats.map(b => b.rating));

  const goToBooking = (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    router.push(`/booking?id=${id}&date=${today}&passengers=1`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6"
      style={{ background: "rgba(12,74,110,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl overflow-hidden w-full max-w-5xl max-h-[92vh] flex flex-col"
        style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 flex items-center justify-between shrink-0"
          style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)", color: "white" }}>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold">{t.compare.title}</h2>
            <p className="text-xs" style={{ color: "#bae6fd" }}>{boats.length} {t.compare.subtitle}</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            ✕
          </button>
        </div>

        {/* Scrollable table */}
        <div className="overflow-auto flex-1">
          <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr>
                <th className="text-left text-xs font-bold uppercase tracking-wide px-4 py-3 sticky left-0 z-10"
                  style={{ color: "#94a3b8", background: "white", minWidth: 120, borderBottom: "2px solid #e0f2fe" }} />
                {boats.map(b => (
                  <th key={b.id} className="px-3 py-3" style={{ minWidth: 200, borderBottom: "2px solid #e0f2fe", verticalAlign: "top" }}>
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-full max-w-[200px] h-24 rounded-xl overflow-hidden mb-2"
                        style={{ background: "#e0f2fe" }}>
                        <img src={b.image} alt={b.operator} className="w-full h-full object-cover" />
                        <button
                          onClick={() => { remove(b.id); if (boats.length <= 2) onClose(); }}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: "rgba(239,68,68,0.9)" }}
                          title="Hapus"
                        >
                          ×
                        </button>
                      </div>
                      <p className="font-extrabold text-sm leading-tight px-1" style={{ color: "#0c4a6e" }}>{b.operator}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Type */}
              <CompareRow label={t.compare.type}>
                {boats.map(b => (
                  <td key={b.id} className="text-center px-3 py-3" style={cellStyle}>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>
                      {b.boatType}
                    </span>
                  </td>
                ))}
              </CompareRow>

              {/* Route */}
              <CompareRow label={t.compare.route}>
                {boats.map(b => (
                  <td key={b.id} className="text-center px-3 py-3 text-sm font-semibold" style={{ ...cellStyle, color: "#334155" }}>
                    {b.from} → {b.to}
                  </td>
                ))}
              </CompareRow>

              {/* Departure */}
              <CompareRow label={t.compare.departure}>
                {boats.map(b => (
                  <td key={b.id} className="text-center px-3 py-3 text-sm font-bold tabular-nums" style={{ ...cellStyle, color: "#0369a1" }}>
                    {b.departureTime}
                  </td>
                ))}
              </CompareRow>

              {/* Arrival */}
              <CompareRow label={t.compare.arrival}>
                {boats.map(b => (
                  <td key={b.id} className="text-center px-3 py-3 text-sm font-bold tabular-nums" style={{ ...cellStyle, color: "#0369a1" }}>
                    {b.arrivalTime}
                  </td>
                ))}
              </CompareRow>

              {/* Duration with highlight */}
              <CompareRow label={t.compare.duration}>
                {boats.map(b => (
                  <td key={b.id} className="text-center px-3 py-3 text-sm font-bold" style={cellStyle}>
                    <span className="inline-flex items-center gap-1.5">
                      {b.duration}
                      {b.id === fastest.id && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md"
                          style={{ background: "#f3e8ff", color: "#7e22ce" }}>⚡ TERCEPAT</span>
                      )}
                    </span>
                  </td>
                ))}
              </CompareRow>

              {/* Price */}
              <CompareRow label={t.compare.price}>
                {boats.map(b => (
                  <td key={b.id} className="text-center px-3 py-3" style={cellStyle}>
                    <p className="text-base font-extrabold" style={{ color: "#0369a1" }}>Rp {b.price}K</p>
                    {b.price === cheapest && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md inline-block mt-1"
                        style={{ background: "#dcfce7", color: "#15803d" }}>💚 TERMURAH</span>
                    )}
                  </td>
                ))}
              </CompareRow>

              {/* Seats */}
              <CompareRow label={t.compare.seats}>
                {boats.map(b => (
                  <td key={b.id} className="text-center px-3 py-3 text-sm font-semibold" style={{ ...cellStyle, color: b.availableSeats <= 5 ? "#dc2626" : "#334155" }}>
                    {b.availableSeats} / {b.seats}
                  </td>
                ))}
              </CompareRow>

              {/* Rating */}
              <CompareRow label={t.compare.rating}>
                {boats.map(b => (
                  <td key={b.id} className="text-center px-3 py-3" style={cellStyle}>
                    <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: "#334155" }}>
                      ⭐ {b.rating.toFixed(1)}
                    </span>
                    {b.rating === topRated && (
                      <div>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md inline-block mt-1"
                          style={{ background: "#fef9c3", color: "#854d0e" }}>⭐ TERATAS</span>
                      </div>
                    )}
                  </td>
                ))}
              </CompareRow>

              {/* Amenities */}
              <CompareRow label={t.compare.amenities}>
                {boats.map(b => (
                  <td key={b.id} className="px-3 py-3 align-top" style={cellStyle}>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {b.amenities.map(a => (
                        <span key={a} className="text-[11px] px-1.5 py-0.5 rounded-md font-medium"
                          style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" }}>
                          {AMENITY_ICONS[a] ?? "✦"} {a}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </CompareRow>

              {/* CTA */}
              <tr>
                <td className="px-4 py-4 sticky left-0 z-10" style={{ background: "white" }} />
                {boats.map(b => (
                  <td key={b.id} className="text-center px-3 py-4">
                    <button onClick={() => goToBooking(b.id)}
                      className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white btn-ocean transition-all hover:scale-105">
                      {t.compare.bookNow} →
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CompareRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <td className="text-xs font-bold uppercase tracking-wide px-4 py-3 sticky left-0 z-10"
        style={{ color: "#64748b", background: "#f8fafc", borderBottom: "1px solid #f0f9ff" }}>
        {label}
      </td>
      {children}
    </tr>
  );
}

const cellStyle: React.CSSProperties = { borderBottom: "1px solid #f0f9ff" };

// Parse "2h 30m" or "2h" → minutes
function parseDuration(d: string): number {
  const h = d.match(/(\d+)h/)?.[1];
  const m = d.match(/(\d+)m/)?.[1];
  return (h ? parseInt(h) * 60 : 0) + (m ? parseInt(m) : 0);
}
