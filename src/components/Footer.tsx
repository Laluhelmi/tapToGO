"use client";
import { useLang } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  const links: Record<string, string[]> = {
    [t.footer.popularRoutes]: ["Sanur → Nusa Penida", "Bangsal → Padang Bai", "Padang Bai → Gili T", "Sanur → Lembongan", "Amed → Nusa Penida"],
    [t.footer.company]: t.footer.companyLinks,
    [t.footer.help]: t.footer.helpLinks,
  };

  return (
    <footer style={{ background: "#0c4a6e", color: "#bae6fd" }}>
      {/* Wave top */}
      <div style={{ lineHeight: 0, background: "#f8fafc" }}>
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 48 }}>
          <path d="M0,0 Q360,60 720,0 Q1080,-60 1440,0 L1440,60 L0,60Z" fill="#0c4a6e"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#0369a1,#0c4a6e)" }}>
                <svg viewBox="0 0 32 32" fill="none" width="22" height="22">
                  <path d="M5 18 Q10 22 16 20 Q22 18 27 20 L25 24 L7 24 Z" fill="white"/>
                  <rect x="10" y="10" width="12" height="9" rx="3" fill="white" opacity="0.88"/>
                  <line x1="16" y1="5" x2="16" y2="10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M16 5 L21 7.5 L16 10Z" fill="#f97316"/>
                  <path d="M2 26 Q5 24 8 26 Q11 28 14 26" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.5"/>
                  <path d="M18 26 Q21 24 24 26 Q27 28 30 26" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.5"/>
                </svg>
              </div>
              <span className="text-2xl font-extrabold">
                <span className="text-white">tapTo</span><span style={{ color: "#f97316" }}>Go</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#7dd3fc", maxWidth: 280 }}>
              {t.footer.desc}
            </p>
            <div className="flex gap-3">
              {["𝕏", "📸", "💼", "▶️"].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#7dd3fc" }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white font-bold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm transition-colors hover:text-white"
                      style={{ color: "#7dd3fc" }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-sm" style={{ color: "#38bdf8", opacity: 0.6 }}>{t.footer.copyright}</p>
          <div className="flex items-center gap-4 text-sm" style={{ color: "#38bdf8", opacity: 0.6 }}>
            <span>🇮🇩 Indonesia</span>
            <span>·</span>
            <span>IDR (Rp)</span>
            <span>·</span>
            <a href="#" className="hover:opacity-100 transition-opacity">Bahasa Indonesia</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
