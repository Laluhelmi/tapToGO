"use client";
import { useMemo } from "react";
import { SCHEDULES } from "@/data/boats";
import { useCompare } from "@/contexts/CompareContext";
import { useLang } from "@/contexts/LanguageContext";
import CompareModal from "./CompareModal";

export default function CompareBar() {
  const { ids, remove, clear, count, max, open, setOpen } = useCompare();
  const { t } = useLang();

  const boats = useMemo(
    () => ids.map(id => SCHEDULES.find(s => s.id === id)).filter((b): b is NonNullable<typeof b> => !!b),
    [ids]
  );

  if (count === 0) return null;

  return (
    <>
      {/* Floating bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-4xl print:hidden">
        <div className="bg-white rounded-2xl flex items-center gap-3 p-3 pr-2"
          style={{
            border: "1.5px solid #bae6fd",
            boxShadow: "0 12px 40px rgba(2,132,199,0.25)",
          }}>
          {/* Thumbnails */}
          <div className="flex -space-x-2 shrink-0">
            {boats.map((b) => (
              <div key={b.id} className="relative">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white"
                  style={{ background: "#e0f2fe" }}>
                  <img src={b.image} alt={b.operator} className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => remove(b.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: "#ef4444" }}
                  title="Hapus"
                >
                  ×
                </button>
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: max - count }).map((_, i) => (
              <div key={`empty-${i}`}
                className="w-10 h-10 rounded-xl border-2 border-dashed flex items-center justify-center text-xs font-bold"
                style={{ borderColor: "#bae6fd", color: "#7dd3fc", background: "#f0f9ff" }}>
                +
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 hidden sm:block">
            <p className="text-sm font-bold leading-tight" style={{ color: "#0c4a6e" }}>
              {count} / {max} {t.compare.subtitle}
            </p>
            {count < 2 && (
              <p className="text-xs" style={{ color: "#94a3b8" }}>{t.compare.selectMore}</p>
            )}
          </div>

          {/* Actions */}
          <button onClick={clear}
            className="text-xs font-bold px-3 py-2 rounded-xl transition-all hover:scale-105"
            style={{ background: "#fee2e2", color: "#dc2626" }}>
            {t.compare.clear}
          </button>
          <button
            onClick={() => setOpen(true)}
            disabled={count < 2}
            className="text-sm font-extrabold px-4 sm:px-6 py-2.5 rounded-xl text-white whitespace-nowrap transition-all"
            style={{
              background: count < 2 ? "#cbd5e1" : "linear-gradient(135deg,#0284c7,#0369a1)",
              cursor: count < 2 ? "not-allowed" : "pointer",
              boxShadow: count >= 2 ? "0 4px 16px rgba(2,132,199,0.35)" : "none",
            }}>
            {t.compare.button} →
          </button>
        </div>
      </div>

      {/* Modal */}
      {open && <CompareModal boats={boats} onClose={() => setOpen(false)} />}
    </>
  );
}
