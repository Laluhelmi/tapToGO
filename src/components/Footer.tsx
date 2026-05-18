"use client";
import { useLang } from "@/contexts/LanguageContext";
import Logo from "./Logo";

type LinkItem = { label: string; href: string };

export default function Footer() {
  const { t } = useLang();
  const isID = (t.footer.copyright || "").includes("Hak");

  const popularRoutes: LinkItem[] = [
    { label: "Gili T → Padang Bai", href: "/rute/gili-trawangan-padang-bai" },
    { label: "Bangsal → Padang Bai", href: "/rute/bangsal-padang-bai" },
    { label: "Gili Air → Nusa Penida", href: "/rute/gili-air-nusa-penida" },
    { label: "Gili T → Sanur", href: "/rute/gili-trawangan-sanur" },
    { label: "Bangsal → Serangan", href: "/rute/bangsal-serangan" },
  ];

  const companyLinks: LinkItem[] = [
    { label: isID ? "Tentang Kami" : "About Us", href: "/" },
    { label: isID ? "Armada" : "Fleet", href: "/armada" },
    { label: isID ? "Jadwal" : "Schedule", href: "/jadwal" },
    { label: isID ? "Brand Assets" : "Brand Assets", href: "/brand" },
    { label: isID ? "Kontak" : "Contact", href: "https://wa.me/6287821775082" },
  ];

  const helpLinks: LinkItem[] = [
    { label: isID ? "FAQ" : "FAQ", href: "/bantuan" },
    { label: isID ? "Syarat & Ketentuan" : "Terms of Service", href: "/terms" },
    { label: isID ? "Kebijakan Privasi" : "Privacy Policy", href: "/privacy" },
    { label: isID ? "Kebijakan Refund" : "Refund Policy", href: "/refund" },
  ];

  const links: Record<string, LinkItem[]> = {
    [t.footer.popularRoutes]: popularRoutes,
    [t.footer.company]: companyLinks,
    [t.footer.help]: helpLinks,
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
            <div className="mb-4">
              <Logo size={40} variant="dark" wordmarkSize="xl" />
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
                  <li key={item.label}>
                    <a href={item.href} className="text-sm transition-colors hover:text-white"
                      style={{ color: "#7dd3fc" }}>
                      {item.label}
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
