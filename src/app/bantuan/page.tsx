"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLang } from "@/contexts/LanguageContext";

const CONTACTS = [
  { icon: "💬", label: "WhatsApp", value: "+62 878 2177 5082", link: "https://wa.me/6287821775082", color: "#dcfce7", textColor: "#15803d" },
  { icon: "🕐", label: "Operating Hours", value: "07:00 – 22:00 WITA", link: null, color: "#e0f2fe", textColor: "#0369a1" },
];

export default function BantuanPage() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />

      {/* Hero */}
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold mb-4 hover:opacity-80"
            style={{ color: "#bae6fd" }}>{t.bantuan.backHome}</Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{t.bantuan.title}</h1>
          <p style={{ color: "#bae6fd" }}>{t.bantuan.subtitle}</p>
        </div>
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {CONTACTS.map(c => {
            const inner = (
              <>
                <span className="text-3xl">{c.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: "#94a3b8" }}>{c.label}</p>
                  <p className="text-sm font-bold" style={{ color: c.textColor }}>{c.value}</p>
                </div>
              </>
            );
            const cls = "rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5";
            const style = { background: c.color, border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" };
            return c.link ? (
              <a key={c.label} href={c.link} target="_blank" rel="noreferrer" className={cls} style={style}>{inner}</a>
            ) : (
              <div key={c.label} className={cls} style={style}>{inner}</div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold mb-6" style={{ color: "#0c4a6e" }}>
            {t.bantuan.faqTitle}
          </h2>
          <div className="space-y-3">
            {t.bantuan.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden transition-all duration-200"
                style={{ border: `1.5px solid ${open === i ? "#bae6fd" : "#e0f2fe"}`, boxShadow: "0 2px 12px rgba(2,132,199,0.06)" }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-sm font-bold pr-4" style={{ color: "#0c4a6e" }}>{faq.q}</span>
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-transform"
                    style={{
                      background: open === i ? "#0369a1" : "#f0f9ff",
                      color: open === i ? "white" : "#0369a1",
                      transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}>+</span>
                </button>
                {open === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still need help */}
        <div className="bg-white rounded-2xl p-8 text-center"
          style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
          <div className="text-4xl mb-3">🤝</div>
          <h3 className="text-xl font-extrabold mb-2" style={{ color: "#0c4a6e" }}>{t.bantuan.stillNeedHelp}</h3>
          <p className="text-sm mb-6" style={{ color: "#64748b" }}>
            {t.bantuan.helpDesc}
          </p>
          <a href="https://wa.me/6287821775082" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-extrabold text-white btn-ocean transition-all hover:scale-105">
            {t.bantuan.chatWa}
          </a>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#94a3b8" }}>
          {t.bantuan.serviceHours}
        </p>
      </div>
    </div>
  );
}
