import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brand Assets · tapToGo",
  description: "Download tapToGo logo, brand colors, and assets for partners and press.",
};

const ICON_SIZES = [64, 128, 256, 512, 1024];

const COLORS = [
  { name: "Ocean Deep", hex: "#0c4a6e", rgb: "12, 74, 110" },
  { name: "Ocean Mid", hex: "#0369a1", rgb: "3, 105, 161" },
  { name: "Ocean Bright", hex: "#0284c7", rgb: "2, 132, 199" },
  { name: "Ocean Light", hex: "#0ea5e9", rgb: "14, 165, 233" },
  { name: "Sky", hex: "#7dd3fc", rgb: "125, 211, 252" },
  { name: "Sky Faint", hex: "#bae6fd", rgb: "186, 230, 253" },
  { name: "Sky Bg", hex: "#e0f2fe", rgb: "224, 242, 254" },
  { name: "Gold Accent", hex: "#fbbf24", rgb: "251, 191, 36" },
  { name: "Gold Dark", hex: "#f59e0b", rgb: "245, 158, 11" },
];

export default function BrandPage() {
  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      {/* Hero */}
      <div className="pt-12" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold mb-6 transition-opacity hover:opacity-80"
            style={{ color: "#bae6fd" }}>← Beranda</Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">Brand Assets</h1>
          <p className="text-base sm:text-lg max-w-2xl" style={{ color: "#e0f2fe" }}>
            Logo, warna, dan asset resmi tapToGo untuk partner, media, dan promosi.
            Semua file bisa di-download gratis di halaman ini.
          </p>
        </div>
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Section: Logo Icon (App Icon) */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-2xl font-extrabold" style={{ color: "#0c4a6e" }}>🎯 Logo Icon</h2>
              <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                Square icon untuk app, favicon, profile picture, social media.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <div className="flex items-center justify-center mb-6 p-8 rounded-2xl" style={{ background: "#f8fafc" }}>
              <img src="/brand/logo-icon.svg" alt="tapToGo Logo Icon" width="200" height="200" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <AssetDownload href="/brand/logo-icon.svg" label="SVG" size="Vector" highlight />
              {ICON_SIZES.map(s => (
                <AssetDownload key={s} href={`/brand/logo-icon-${s}.png`} label={`${s}×${s}`} size="PNG" />
              ))}
            </div>
          </div>
        </section>

        {/* Section: Full Logo (Icon + Wordmark) */}
        <section>
          <h2 className="text-2xl font-extrabold mb-1" style={{ color: "#0c4a6e" }}>📛 Full Logo</h2>
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>
            Icon + nama brand + tagline. Untuk header, footer, business card, brosur.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Light version */}
            <div className="bg-white rounded-2xl p-5"
              style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#0369a1" }}>
                Light Background
              </p>
              <div className="flex items-center justify-center p-6 rounded-xl mb-4" style={{ background: "#f8fafc" }}>
                <img src="/brand/logo-full.svg" alt="tapToGo Full Logo" className="w-full max-w-md" />
              </div>
              <div className="flex gap-2">
                <AssetDownload href="/brand/logo-full.svg" label="SVG" size="Vector" highlight compact />
                <AssetDownload href="/brand/logo-full.png" label="PNG" size="1000×240" compact />
              </div>
            </div>

            {/* Dark version */}
            <div className="bg-white rounded-2xl p-5"
              style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#0369a1" }}>
                Dark Background
              </p>
              <div className="flex items-center justify-center p-6 rounded-xl mb-4" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
                <img src="/brand/logo-full-dark.svg" alt="tapToGo Full Logo Dark" className="w-full max-w-md" />
              </div>
              <div className="flex gap-2">
                <AssetDownload href="/brand/logo-full-dark.svg" label="SVG" size="Vector" highlight compact />
                <AssetDownload href="/brand/logo-full-dark.png" label="PNG" size="1000×240" compact />
              </div>
            </div>
          </div>
        </section>

        {/* Section: Wordmark only */}
        <section>
          <h2 className="text-2xl font-extrabold mb-1" style={{ color: "#0c4a6e" }}>✍️ Wordmark Only</h2>
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>
            Hanya teks brand. Untuk minimal/clean layouts.
          </p>

          <div className="bg-white rounded-2xl p-5"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <div className="flex items-center justify-center p-6 rounded-xl mb-4" style={{ background: "#f8fafc" }}>
              <img src="/brand/logo-wordmark.svg" alt="tapToGo Wordmark" className="max-w-md" />
            </div>
            <div className="flex gap-2">
              <AssetDownload href="/brand/logo-wordmark.svg" label="SVG" size="Vector" highlight compact />
              <AssetDownload href="/brand/logo-wordmark.png" label="PNG" size="850×170" compact />
            </div>
          </div>
        </section>

        {/* Section: Colors */}
        <section>
          <h2 className="text-2xl font-extrabold mb-1" style={{ color: "#0c4a6e" }}>🎨 Brand Colors</h2>
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>
            Ocean blue gradient untuk identity, gold accent untuk emphasis.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {COLORS.map(c => (
              <div key={c.hex} className="bg-white rounded-2xl overflow-hidden"
                style={{ border: "1.5px solid #e0f2fe" }}>
                <div style={{ background: c.hex, height: 80 }} />
                <div className="p-3">
                  <p className="font-bold text-sm" style={{ color: "#0c4a6e" }}>{c.name}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: "#64748b" }}>{c.hex}</p>
                  <p className="text-[10px] font-mono" style={{ color: "#94a3b8" }}>rgb({c.rgb})</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Typography */}
        <section>
          <h2 className="text-2xl font-extrabold mb-1" style={{ color: "#0c4a6e" }}>🔤 Typography</h2>
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>
            Font system tapToGo.
          </p>
          <div className="bg-white rounded-2xl p-6"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#0369a1" }}>Primary Font</p>
                <p className="text-3xl font-extrabold" style={{ color: "#0c4a6e" }}>Plus Jakarta Sans</p>
              </div>
              <a href="https://fonts.google.com/specimen/Plus+Jakarta+Sans" target="_blank" rel="noreferrer"
                className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>
                Google Fonts ↗
              </a>
            </div>
            <div className="space-y-1 pt-3" style={{ borderTop: "1px solid #f0f9ff" }}>
              <p style={{ fontWeight: 400, fontSize: 16, color: "#475569" }}>Regular 400 — The quick brown fox</p>
              <p style={{ fontWeight: 600, fontSize: 16, color: "#475569" }}>SemiBold 600 — The quick brown fox</p>
              <p style={{ fontWeight: 700, fontSize: 16, color: "#475569" }}>Bold 700 — The quick brown fox</p>
              <p style={{ fontWeight: 800, fontSize: 16, color: "#0c4a6e" }}>ExtraBold 800 — The quick brown fox</p>
            </div>
          </div>
        </section>

        {/* Section: Brand Guidelines */}
        <section>
          <h2 className="text-2xl font-extrabold mb-1" style={{ color: "#0c4a6e" }}>📖 Brand Usage</h2>
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>
            Aturan dasar penggunaan logo & brand assets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GuidelineCard title="✅ DO" items={[
              "Pakai logo SVG untuk semua web/digital use",
              "Pakai PNG ukuran sesuai (favicon = 64-256, profile = 512+)",
              "Hormati clear space (padding) minimal 1/4 lebar logo",
              "Pakai versi 'dark' di latar gelap, 'light' di latar terang",
              "Gunakan font Plus Jakarta Sans untuk konten resmi",
            ]} />
            <GuidelineCard title="❌ DON'T" items={[
              "Jangan ubah warna logo selain dari yang disediakan",
              "Jangan distort, stretch, atau rotate logo",
              "Jangan tambah outline atau drop shadow",
              "Jangan pakai di background yang clash dengan brand color",
              "Jangan resize lebih kecil dari 32px (icon) atau 80px (full)",
            ]} dont />
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 text-center"
          style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
          <h2 className="text-xl font-extrabold mb-2" style={{ color: "#0c4a6e" }}>
            Butuh asset custom atau punya pertanyaan?
          </h2>
          <p className="text-sm mb-5" style={{ color: "#64748b" }}>
            Hubungi tim kami via WhatsApp untuk kebutuhan partnership / press.
          </p>
          <a href="https://wa.me/6287821775082" target="_blank" rel="noreferrer"
            className="inline-block px-6 py-3 rounded-xl text-sm font-extrabold text-white btn-ocean transition-all hover:scale-[1.02]">
            💬 Hubungi via WhatsApp
          </a>
        </section>
      </div>
    </div>
  );
}

function AssetDownload({ href, label, size, highlight, compact }: {
  href: string; label: string; size: string; highlight?: boolean; compact?: boolean;
}) {
  return (
    <a href={href} download
      className={`flex flex-col items-center justify-center ${compact ? "px-3 py-2" : "py-3"} rounded-xl text-center transition-all hover:scale-[1.03] hover:shadow-md`}
      style={{
        background: highlight ? "linear-gradient(135deg,#0284c7,#0369a1)" : "#f0f9ff",
        color: highlight ? "white" : "#0369a1",
        border: highlight ? "1px solid #0369a1" : "1px solid #bae6fd",
      }}>
      <span className="text-xs font-extrabold">⬇ {label}</span>
      <span className={`text-[10px] font-bold ${highlight ? "opacity-90" : "opacity-70"} mt-0.5`}>{size}</span>
    </a>
  );
}

function GuidelineCard({ title, items, dont }: { title: string; items: string[]; dont?: boolean }) {
  return (
    <div className="bg-white rounded-2xl p-5"
      style={{ border: `1.5px solid ${dont ? "#fca5a5" : "#86efac"}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
      <p className="text-sm font-extrabold mb-3" style={{ color: dont ? "#dc2626" : "#15803d" }}>
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs leading-relaxed" style={{ color: "#475569" }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
