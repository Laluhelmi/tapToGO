"use client";
import { useMemo } from "react";
import Link from "next/link";
import { SCHEDULES } from "@/data/boats";
import { LogoMark } from "@/components/Logo";

export default function PromoPage() {
  // Find min price per popular route
  const routes = useMemo(() => {
    const popular: { from: string; to: string }[] = [
      { from: "Gili Trawangan", to: "Padang Bai" },
      { from: "Bangsal", to: "Padang Bai" },
      { from: "Gili Air", to: "Nusa Penida" },
      { from: "Gili Trawangan", to: "Sanur" },
    ];
    return popular.map(r => {
      const found = SCHEDULES.filter(s => s.from === r.from && s.to === r.to);
      return { ...r, price: found.length ? Math.min(...found.map(s => s.price)) : 0 };
    }).filter(r => r.price > 0);
  }, []);

  const cheapestPrice = routes.length ? Math.min(...routes.map(r => r.price)) : 300;

  // QR code to app
  const appUrl = "https://taptogo-rouge.vercel.app";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(appUrl)}&margin=2&color=0c4a6e&bgcolor=ffffff`;
  const whatsapp = "+62 878 2177 5082";
  const waLink = "https://wa.me/6287821775082";

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4" style={{ background: "linear-gradient(180deg,#e0f2fe 0%,#bae6fd 100%)" }}>

      {/* Top action bar (hidden on print) */}
      <div className="print:hidden w-full max-w-3xl flex flex-wrap items-center justify-between gap-3 mb-4">
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ color: "#0369a1" }}>← Kembali ke Beranda</Link>
        <div className="flex gap-2">
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold text-white btn-ocean transition-all hover:scale-105">
            🖨️ Cetak / Simpan PDF
          </button>
          <a href={waLink} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background: "#dcfce7", color: "#15803d", border: "1.5px solid #86efac" }}>
            💬 WhatsApp
          </a>
        </div>
      </div>

      {/* ── BROCHURE A4 portrait ── */}
      <div
        className="brochure-printable shadow-2xl overflow-hidden relative"
        style={{
          width: "100%",
          maxWidth: 794, // A4 width @ 96dpi
          aspectRatio: "210 / 297",
          background: "white",
        }}
      >
        {/* HERO TOP — dark ocean gradient with floating clouds */}
        <div className="relative" style={{
          height: "58%",
          background: "linear-gradient(165deg, #0ea5e9 0%, #0369a1 50%, #0c4a6e 100%)",
          overflow: "hidden",
        }}>
          {/* Sun glow */}
          <div className="absolute rounded-full" style={{
            width: 220, height: 220, top: -80, right: -40,
            background: "radial-gradient(circle, rgba(251,191,36,0.55) 0%, rgba(251,191,36,0) 65%)",
          }} />

          {/* Cloud decorations */}
          <Cloud style={{ top: 30, left: 50, opacity: 0.6 }} scale={1} />
          <Cloud style={{ top: 90, right: 70, opacity: 0.45 }} scale={1.3} />
          <Cloud style={{ top: 200, left: 120, opacity: 0.35 }} scale={0.85} />

          {/* TOP: Logo + tagline */}
          <div className="absolute z-20 flex items-center gap-2.5" style={{ top: 28, left: 32 }}>
            <LogoMark size={42} />
            <div>
              <p className="font-extrabold text-2xl leading-none">
                <span style={{ color: "white" }}>tapTo</span>
                <span style={{ color: "#fbbf24" }}>Go</span>
              </p>
              <p className="text-[10px] font-bold tracking-widest uppercase mt-0.5" style={{ color: "#bae6fd" }}>
                Fastboat Booking
              </p>
            </div>
          </div>

          {/* Promo badge top-right */}
          <div className="absolute z-20 px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase shadow-lg"
            style={{ top: 32, right: 32, background: "#fbbf24", color: "#92400e" }}>
            ✨ PROMO LAUNCH
          </div>

          {/* HEADLINE */}
          <div className="absolute z-20 inset-x-0 text-center" style={{ top: "20%" }}>
            <p className="font-bold tracking-[0.5em] mb-1" style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
              T A P &nbsp; T O &nbsp; G O
            </p>
            <h1 className="font-black leading-[0.95]" style={{
              fontSize: 56, color: "white",
              textShadow: "0 6px 24px rgba(0,0,0,0.3)",
              letterSpacing: "-0.02em",
            }}>
              ONLY {cheapestPrice}K
            </h1>
            <h2 className="font-black leading-tight mt-1" style={{
              fontSize: 28, color: "#fbbf24",
              letterSpacing: "0.04em",
              textShadow: "0 4px 16px rgba(0,0,0,0.25)",
            }}>
              FASTBOAT TO BALI
            </h2>
            <p className="text-xs font-medium mt-3 max-w-sm mx-auto px-4" style={{ color: "#e0f2fe" }}>
              Pesan tiket fastboat ke Bali, Lombok &amp; Gili —
              harga transparan, konfirmasi instan, operator resmi
            </p>
          </div>

          {/* PHONE MOCKUPS — 3 phones, layered/staggered */}
          <div className="absolute z-10" style={{ bottom: 40, left: "50%", transform: "translateX(-50%)", width: "100%" }}>
            <div className="flex items-end justify-center gap-2 sm:gap-3">
              {/* Left phone */}
              <PhoneMockup src="/screenshots/4-search.png" tilt={-8} scale={0.9} elevation={0} />
              {/* Center (taller) phone */}
              <PhoneMockup src="/screenshots/2-detail.png" tilt={0} scale={1} elevation={32} highlight />
              {/* Right phone */}
              <PhoneMockup src="/screenshots/1-list.png" tilt={8} scale={0.9} elevation={0} />
            </div>
          </div>

          {/* Wave divider bottom */}
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none"
            className="absolute bottom-0 left-0 right-0" style={{ width: "100%", height: 38 }}>
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
          </svg>
        </div>

        {/* MIDDLE SECTION — features + routes */}
        <div className="px-7 pt-4 pb-4">

          {/* 4 Features */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { icon: "💰", title: "Harga", subtitle: "Transparan" },
              { icon: "⚡", title: "Konfirmasi", subtitle: "Instan" },
              { icon: "✓", title: "Operator", subtitle: "Resmi" },
              { icon: "🛟", title: "Asuransi", subtitle: "Inklusif" },
            ].map((b, i) => (
              <div key={i} className="text-center rounded-xl py-2.5"
                style={{ background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                <div className="text-xl mb-0.5">{b.icon}</div>
                <p className="text-[10px] font-extrabold leading-tight" style={{ color: "#0c4a6e" }}>{b.title}</p>
                <p className="text-[9px] leading-tight" style={{ color: "#64748b" }}>{b.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Routes table */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: "#0369a1" }}>
              ⭐ Rute Populer
            </span>
            <div className="flex-1 h-px" style={{ background: "#e0f2fe" }} />
            <span className="text-[9px] font-bold" style={{ color: "#94a3b8" }}>Mulai dari · per pax</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {routes.map(r => (
              <div key={`${r.from}-${r.to}`} className="rounded-xl px-3 py-2 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)", border: "1px solid #bae6fd" }}>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold leading-tight" style={{ color: "#0c4a6e" }}>
                    {r.from}
                  </p>
                  <p className="text-[9px] font-semibold leading-tight" style={{ color: "#64748b" }}>
                    → {r.to}
                  </p>
                </div>
                <p className="text-base font-black leading-none ml-2 shrink-0" style={{ color: "#0369a1" }}>
                  Rp {r.price}K
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA — dark band with QR + contact */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4"
          style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)", color: "white" }}>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Left: URL */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#bae6fd" }}>
                Pesan Online
              </p>
              <p className="font-black leading-tight text-base">Buka Sekarang ›</p>
              <a href={appUrl} className="inline-block mt-0.5 text-[11px] font-bold underline" style={{ color: "#fbbf24" }}>
                taptogo-rouge.vercel.app
              </a>
            </div>

            {/* Center: QR */}
            <div className="flex flex-col items-center">
              <div className="rounded-lg p-1.5" style={{ background: "white" }}>
                <img src={qrUrl} alt="QR" width="72" height="72" style={{ display: "block" }} />
              </div>
              <p className="text-[8px] font-bold mt-0.5" style={{ color: "#bae6fd" }}>SCAN QR</p>
            </div>

            {/* Right: WhatsApp */}
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#bae6fd" }}>
                WhatsApp
              </p>
              <p className="font-black leading-tight text-base">{whatsapp}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "#bae6fd" }}>
                Customer Service 24/7
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tip below brochure (hidden on print) */}
      <p className="print:hidden text-xs mt-4 max-w-md text-center" style={{ color: "#64748b" }}>
        💡 Klik <strong>Cetak / Simpan PDF</strong> → pilih <strong>Save as PDF</strong> di dialog browser untuk download brosur,
        atau pilih printer untuk cetak fisik (A4).
      </p>
    </div>
  );
}

// ── iPhone Mockup Component ──
function PhoneMockup({
  src,
  tilt = 0,
  scale = 1,
  elevation = 0,
  highlight = false,
}: {
  src: string;
  tilt?: number;
  scale?: number;
  elevation?: number;
  highlight?: boolean;
}) {
  const WIDTH = 145;
  return (
    <div
      style={{
        width: WIDTH * scale,
        transform: `rotate(${tilt}deg) translateY(-${elevation}px)`,
        transition: "transform 0.4s",
      }}>
      <div
        style={{
          position: "relative",
          paddingBottom: "215%", // aspect ratio (iPhone ~9:19.5)
          borderRadius: 26 * scale,
          background: "#1a1a1a",
          padding: 4 * scale,
          boxShadow: highlight
            ? "0 24px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)"
            : "0 16px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08)",
        }}>
        {/* Screen */}
        <div style={{
          position: "absolute",
          inset: 4 * scale,
          borderRadius: 22 * scale,
          overflow: "hidden",
          background: "white",
        }}>
          <img src={src} alt="App screenshot"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        </div>
        {/* Dynamic Island */}
        <div style={{
          position: "absolute",
          top: 8 * scale,
          left: "50%",
          transform: "translateX(-50%)",
          width: 40 * scale,
          height: 9 * scale,
          borderRadius: 12,
          background: "#000",
          zIndex: 2,
        }} />
      </div>
    </div>
  );
}

// Cloud SVG decoration
function Cloud({ style, scale = 1 }: { style?: React.CSSProperties; scale?: number }) {
  return (
    <svg style={{ position: "absolute", ...style }}
      width={120 * scale} height={50 * scale} viewBox="0 0 120 50" fill="white">
      <ellipse cx="25" cy="30" rx="25" ry="14" />
      <ellipse cx="55" cy="22" rx="28" ry="16" />
      <ellipse cx="92" cy="28" rx="25" ry="14" />
    </svg>
  );
}
