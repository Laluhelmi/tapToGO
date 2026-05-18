"use client";
import { TESTIMONIALS } from "@/data/boats";

export default function TestimoniSection() {
  return (
    <section id="bantuan" className="py-20 px-4 sm:px-6" style={{ background: "#f8fafc" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#f0f9ff", color: "#0369a1" }}>
            💬 Testimoni
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color: "#0c4a6e" }}>
            Kata Mereka yang{" "}
            <span style={{ background: "linear-gradient(135deg,#0369a1,#0284c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Sudah Berlayar
            </span>
          </h2>
          <p style={{ color: "#64748b" }}>Cerita perjalanan dari penumpang tapToGo</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="bg-white rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
              style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.06)" }}>
              <div className="text-4xl font-serif mb-3" style={{ color: "#bae6fd" }}>"</div>
              <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: "#334155" }}>{t.comment}</p>
              <div className="flex gap-0.5 mb-4">
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ color: s <= t.rating ? "#f59e0b" : "#e2e8f0", fontSize: 14 }}>★</span>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid #f0f9ff" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-extrabold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#0c4a6e" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>{t.origin} · {t.route}</p>
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: "#cbd5e1" }}>{t.date}</p>
            </div>
          ))}
        </div>

        {/* Trust row */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {["🏆 Operator Resmi","📩 E-Tiket Instan","💬 Support 07–22 WITA","🎯 Tanpa Biaya Tersembunyi"].map(b => (
            <span key={b} className="text-sm font-semibold" style={{ color: "#64748b" }}>{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
