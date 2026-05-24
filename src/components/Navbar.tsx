"use client";
import { useState, useEffect, useRef } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Logo from "./Logo";

interface NavChild {
  label: string;
  href: string;
}
interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const navLinks: NavItem[] = [
    { label: t.nav.home,     href: "/" },
    { label: t.nav.fastboat, href: "/jadwal" },
    { label: t.nav.schedule, href: "/jadwal" },
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
        <div ref={dropdownRef} className="hidden md:flex flex-1 items-center justify-center gap-5">
          {navLinks.map((item) =>
            item.children ? (
              <div key={item.label} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  className="text-sm font-semibold transition-colors duration-200 flex items-center gap-1"
                  style={{ color: openDropdown === item.label ? "#0369a1" : "#475569" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0369a1")}
                  onMouseLeave={e => {
                    if (openDropdown !== item.label) e.currentTarget.style.color = "#475569";
                  }}>
                  {item.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: openDropdown === item.label ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {openDropdown === item.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-xl overflow-hidden min-w-[160px]"
                    style={{ background: "white", border: "1.5px solid #e0f2fe", boxShadow: "0 8px 24px rgba(2,132,199,0.15)" }}>
                    {item.children.map(c => (
                      <a key={c.href} href={c.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-sm font-semibold transition-colors"
                        style={{ color: "#334155" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#f0f9ff"; e.currentTarget.style.color = "#0369a1"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#334155"; }}>
                        {c.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a key={item.href} href={item.href!} className="text-sm font-semibold transition-colors duration-200"
                style={{ color: "#475569" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#0369a1")}
                onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
                {item.label}
              </a>
            )
          )}
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

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="hidden md:flex items-center justify-center ml-2 w-9 h-9 rounded-xl transition-all hover:scale-105"
          style={{ background: "#f0f9ff", border: "1.5px solid #e0f2fe", color: "#0369a1" }}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <line x1="12" y1="2" x2="12" y2="5"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
              <line x1="2" y1="12" x2="5" y2="12"/>
              <line x1="19" y1="12" x2="22" y2="12"/>
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
              <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </button>

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
          maxHeight: mobileOpen ? "500px" : "0px",
          opacity: mobileOpen ? 1 : 0,
          borderTop: mobileOpen ? "1px solid #e0f2fe" : "1px solid transparent",
          background: "rgba(255,255,255,0.97)",
        }}>
        <div className="px-4 pb-4 pt-2">
          {navLinks.map((item) =>
            item.children ? (
              <div key={item.label}>
                <button
                  onClick={() => setMobileDropdown(mobileDropdown === item.label ? null : item.label)}
                  className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-semibold rounded-lg mb-1 transition-all duration-200"
                  style={{ color: mobileDropdown === item.label ? "#0369a1" : "#334155", background: mobileDropdown === item.label ? "#f0f9ff" : "transparent" }}>
                  <span>{item.label}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: mobileDropdown === item.label ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s cubic-bezier(0.32,0.72,0.24,1)" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0.24,1)]"
                  style={{
                    maxHeight: mobileDropdown === item.label ? `${item.children.length * 48}px` : "0px",
                    opacity: mobileDropdown === item.label ? 1 : 0,
                  }}>
                  {item.children.map(c => (
                    <a key={c.href} href={c.href}
                      className="block py-2.5 pl-7 pr-3 text-sm font-semibold rounded-lg mb-1 transition-all duration-200"
                      style={{ color: "#334155" }}
                      onClick={() => setMobileOpen(false)}
                      onMouseEnter={e => { e.currentTarget.style.background = "#f0f9ff"; e.currentTarget.style.color = "#0369a1"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#334155"; }}>
                      {c.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a key={item.href} href={item.href!}
                className="block py-2.5 px-3 text-sm font-semibold rounded-lg mb-1 transition-all duration-200"
                style={{ color: "#334155" }}
                onClick={() => setMobileOpen(false)}
                onMouseEnter={e => { e.currentTarget.style.background = "#f0f9ff"; e.currentTarget.style.color = "#0369a1"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#334155"; }}>
                {item.label}
              </a>
            )
          )}
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
