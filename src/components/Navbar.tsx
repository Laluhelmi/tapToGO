"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import Logo from "./Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { label: t.nav.home,     href: "/" },
    { label: t.nav.schedule, href: "/jadwal" },
    { label: t.nav.rental,   href: "/rental" },
    { label: t.nav.tour,     href: "/tour" },
    { label: t.nav.fleet,    href: "/armada" },
    { label: t.nav.help,     href: "/bantuan" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid #e0f2fe" : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 20px rgba(2,132,199,0.1)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        {/* Logo */}
        <a href="/" className="shrink-0">
          <Logo size={36} variant="light" wordmarkSize="lg" />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-5">
          {navLinks.map(({ label, href }) => (
            <a key={href} href={href} className="text-sm font-semibold transition-colors duration-200"
              style={{ color: "#475569" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0369a1")}
              onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
              {label}
            </a>
          ))}
        </div>

        {/* Language switcher */}
        <div className="hidden md:flex items-center gap-1 ml-4 rounded-xl p-1"
          style={{ background: "#f0f9ff", border: "1.5px solid #e0f2fe" }}>
          <button onClick={() => setLang("id")}
            className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
            style={lang === "id"
              ? { background: "white", color: "#0369a1", boxShadow: "0 1px 4px rgba(2,132,199,0.15)" }
              : { color: "#94a3b8" }}>
            🇮🇩 ID
          </button>
          <button onClick={() => setLang("en")}
            className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
            style={lang === "en"
              ? { background: "white", color: "#0369a1", boxShadow: "0 1px 4px rgba(2,132,199,0.15)" }
              : { color: "#94a3b8" }}>
            🇬🇧 EN
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden ml-auto p-2 rounded-lg" onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: "#0369a1" }}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {mobileOpen
              ? <><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></>
              : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: mobileOpen ? "400px" : "0px",
          opacity: mobileOpen ? 1 : 0,
          borderTop: mobileOpen ? "1px solid #e0f2fe" : "1px solid transparent",
          background: "rgba(255,255,255,0.97)",
        }}>
        <div className="px-4 pb-4 pt-2">
          {navLinks.map(({ label, href }, i) => (
            <a key={href} href={href}
              className="block py-2.5 px-3 text-sm font-semibold rounded-lg mb-1 transition-all duration-200"
              style={{ color: "#334155", transform: mobileOpen ? "translateY(0)" : "translateY(-8px)", transitionDelay: `${i * 40}ms` }}
              onClick={() => setMobileOpen(false)}
              onMouseEnter={e => { e.currentTarget.style.background = "#f0f9ff"; e.currentTarget.style.color = "#0369a1"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#334155"; }}>
              {label}
            </a>
          ))}
          {/* Mobile language switcher */}
          <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: "1px solid #e0f2fe" }}>
            <button onClick={() => setLang("id")}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
              style={lang === "id"
                ? { background: "#0369a1", color: "white" }
                : { background: "#f0f9ff", color: "#64748b" }}>
              🇮🇩 Indonesia
            </button>
            <button onClick={() => setLang("en")}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
              style={lang === "en"
                ? { background: "#0369a1", color: "white" }
                : { background: "#f0f9ff", color: "#64748b" }}>
              🇬🇧 English
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
