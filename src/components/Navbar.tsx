"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

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
        <a href="/" className="flex items-center gap-2 group shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg,#0369a1,#0c4a6e)" }}
          >
            <svg viewBox="0 0 32 32" fill="none" width="22" height="22">
              <path d="M5 18 Q10 22 16 20 Q22 18 27 20 L25 24 L7 24 Z" fill="white"/>
              <rect x="10" y="10" width="12" height="9" rx="3" fill="white" opacity="0.88"/>
              <line x1="16" y1="5" x2="16" y2="10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M16 5 L21 7.5 L16 10Z" fill="#f97316"/>
              <path d="M2 26 Q5 24 8 26 Q11 28 14 26" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.5"/>
              <path d="M18 26 Q21 24 24 26 Q27 28 30 26" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            <span style={{ color: "#0c4a6e" }}>tapTo</span><span style={{ color: "#ea580c" }}>Go</span>
          </span>
        </a>

        {/* Desktop links — centered */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-7">
          {[
            { label: "Beranda", href: "/" },
            { label: "Jadwal",  href: "/jadwal" },
            { label: "Armada",  href: "/armada" },
            { label: "Bantuan", href: "/bantuan" },
          ].map(({ label, href }) => (
            <a key={label} href={href} className="text-sm font-semibold transition-colors duration-200"
              style={{ color: "#475569" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0369a1")}
              onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
              {label}
            </a>
          ))}
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
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: mobileOpen ? "400px" : "0px",
          opacity: mobileOpen ? 1 : 0,
          borderTop: mobileOpen ? "1px solid #e0f2fe" : "1px solid transparent",
          background: "rgba(255,255,255,0.97)",
        }}
      >
        <div className="px-4 pb-4 pt-2">
          {[
            { label: "Beranda", href: "/" },
            { label: "Jadwal",  href: "/jadwal" },
            { label: "Armada",  href: "/armada" },
            { label: "Bantuan", href: "/bantuan" },
          ].map(({ label, href }, i) => (
            <a key={label} href={href}
              className="block py-2.5 px-3 text-sm font-semibold rounded-lg mb-1 transition-all duration-200"
              style={{
                color: "#334155",
                transform: mobileOpen ? "translateY(0)" : "translateY(-8px)",
                transitionDelay: `${i * 40}ms`,
              }}
              onClick={() => setMobileOpen(false)}
              onMouseEnter={e => { e.currentTarget.style.background = "#f0f9ff"; e.currentTarget.style.color = "#0369a1"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#334155"; }}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
