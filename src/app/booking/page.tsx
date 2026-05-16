"use client";
import { useState, useMemo, Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { SCHEDULES } from "@/data/boats";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ETicket from "@/components/ETicket";
import { useLang } from "@/contexts/LanguageContext";
import { COUNTRIES, TOP_COUNTRY_CODES } from "@/data/countries";

// ── Constants ──
const HARBOUR_TAX_PER_PAX = 20; // in thousands (Rp 20,000)

// ── Helpers ──
function formatRupiah(thousands: number): string {
  return "Rp " + (thousands * 1000).toLocaleString("id-ID");
}

function formatDateLong(iso: string, lang: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Auto-format WhatsApp: keep leading + and group digits
function formatWhatsApp(value: string) {
  let v = value.replace(/[^\d+]/g, "");
  if (v.startsWith("08")) v = "+62" + v.slice(1);
  if (!v.startsWith("+") && v.length > 0) v = "+" + v;
  // Group: +62 812 3456 7890
  const match = v.match(/^(\+\d{1,3})(\d{0,4})(\d{0,4})(\d{0,4})$/);
  if (match) {
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(" ");
  }
  return v;
}

// Email validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


// ── SVG Icons ──
const Icon = {
  Pin: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Flag: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 22V4"/><path d="M4 4h13l-2 4 2 4H4"/>
    </svg>
  ),
  Clock: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>
  ),
  Timer: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M10 3h4"/>
    </svg>
  ),
  Calendar: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4"/><path d="M16 3v4"/>
    </svg>
  ),
  User: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>
    </svg>
  ),
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Lock: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    </svg>
  ),
  Refresh: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>
    </svg>
  ),
  ChevronDown: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  Download: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Print: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
    </svg>
  ),
};

// ── Stepper ──
function Stepper({ current, t }: { current: 0 | 1 | 2; t: ReturnType<typeof useLang>["t"] }) {
  const steps = [t.booking.stepData, t.booking.stepConfirm, t.booking.stepDone];
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-6">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-1.5 sm:gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all"
                style={
                  done
                    ? { background: "#22c55e", color: "white" }
                    : active
                    ? { background: "white", color: "#0369a1", boxShadow: "0 0 0 3px rgba(255,255,255,0.35)" }
                    : { background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.7)" }
                }
              >
                {done ? <Icon.Check width={14} height={14} /> : i + 1}
              </div>
              <span
                className="text-xs sm:text-sm font-bold hidden sm:inline"
                style={{ color: active || done ? "white" : "rgba(255,255,255,0.7)" }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-6 sm:w-12 h-0.5 rounded-full"
                style={{ background: done ? "#22c55e" : "rgba(255,255,255,0.25)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Country Picker ──
function CountryPicker({
  value,
  onChange,
  error,
  t,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  t: ReturnType<typeof useLang>["t"];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const selected = COUNTRIES.find(c => c.name === value);
  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase() === search.toLowerCase()
  );

  // Split into "Popular" + "Others" groups when no search
  const showGroups = !search;
  const popular = filtered.filter(c => TOP_COUNTRY_CODES.has(c.code));
  const others = filtered.filter(c => !TOP_COUNTRY_CODES.has(c.code));

  const renderItem = (c: typeof filtered[number]) => (
    <button key={c.code} type="button"
      onClick={() => { onChange(c.name); setOpen(false); setSearch(""); }}
      className="w-full px-4 py-2 text-sm font-medium text-left flex items-center gap-3 transition-colors"
      style={{ color: "#334155", background: c.name === value ? "#f0f9ff" : "transparent" }}
      onMouseEnter={e => (e.currentTarget.style.background = "#f0f9ff")}
      onMouseLeave={e => (e.currentTarget.style.background = c.name === value ? "#f0f9ff" : "transparent")}>
      <span className="text-lg">{c.flag}</span>
      <span className="flex-1">{c.name}</span>
      {c.name === value && <Icon.Check width={14} height={14} style={{ color: "#0369a1" }} />}
    </button>
  );

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-all flex items-center justify-between"
        style={{ background: "#f8fafc", border: `1.5px solid ${error ? "#fca5a5" : open ? "#38bdf8" : "#e2e8f0"}`, color: value ? "#334155" : "#94a3b8" }}>
        <span className="flex items-center gap-2">
          {selected ? <><span className="text-lg">{selected.flag}</span>{selected.name}</> : t.booking.natPlaceholder}
        </span>
        <Icon.ChevronDown width={16} height={16} style={{ color: "#94a3b8", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div className="absolute z-20 mt-1.5 left-0 right-0 rounded-xl shadow-lg overflow-hidden"
          style={{ background: "white", border: "1.5px solid #e0f2fe", maxHeight: 340 }}>
          <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t.booking.countrySearch}
            className="w-full px-4 py-2.5 text-sm focus:outline-none"
            style={{ borderBottom: "1px solid #e0f2fe", color: "#334155" }} />
          <div className="overflow-y-auto" style={{ maxHeight: 280 }}>
            {filtered.length === 0 ? (
              <p className="px-4 py-4 text-sm text-center" style={{ color: "#94a3b8" }}>{t.booking.countryNoResult}</p>
            ) : showGroups ? (
              <>
                <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest sticky top-0"
                  style={{ color: "#0369a1", background: "#f0f9ff", borderBottom: "1px solid #e0f2fe" }}>
                  ⭐ Popular
                </div>
                {popular.map(renderItem)}
                <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest sticky top-0"
                  style={{ color: "#64748b", background: "#f8fafc", borderTop: "1px solid #e0f2fe", borderBottom: "1px solid #e0f2fe" }}>
                  🌍 All Countries
                </div>
                {others.map(renderItem)}
              </>
            ) : (
              <>
                <div className="px-4 py-1 text-[10px] font-bold" style={{ color: "#94a3b8" }}>
                  {filtered.length} {filtered.length === 1 ? "result" : "results"}
                </div>
                {filtered.map(renderItem)}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Validated Input ──
function ValidatedInput({
  label, value, onChange, placeholder, error, valid, validText, type = "text", required,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
  error?: string; valid?: boolean; validText?: string; type?: string; required?: boolean;
}) {
  const [touched, setTouched] = useState(false);
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
        {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
      </label>
      <div className="relative">
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-all"
          style={{ background: "#f8fafc", border: `1.5px solid ${error ? "#fca5a5" : valid && touched ? "#86efac" : "#e2e8f0"}`, color: "#334155", paddingRight: valid && touched || error ? 40 : 16 }}
          onFocus={e => e.target.style.borderColor = "#38bdf8"} />
        {valid && touched && !error && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#22c55e" }}>
            <Icon.Check width={18} height={18} />
          </span>
        )}
      </div>
      {error && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#dc2626" }}>✕ {error}</p>}
      {valid && touched && !error && validText && (
        <p className="text-xs mt-1" style={{ color: "#16a34a" }}>✓ {validText}</p>
      )}
    </div>
  );
}

// ── Harbour Tax Row ──
function HarbourTaxRow({
  payInApp,
  onToggle,
  taxAmount,
  t,
  compact = false,
}: {
  payInApp: boolean;
  onToggle: () => void;
  taxAmount: number;
  t: ReturnType<typeof useLang>["t"];
  compact?: boolean;
}) {
  return (
    <div className={`rounded-lg ${compact ? "p-2" : "p-2.5"}`}
      style={{ background: payInApp ? "#f0f9ff" : "#fef3c7", border: `1px solid ${payInApp ? "#bae6fd" : "#fde047"}` }}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-start gap-1.5 min-w-0">
          <span className="text-sm leading-none mt-0.5">⚓</span>
          <div className="min-w-0">
            <p className="text-xs font-extrabold leading-tight" style={{ color: payInApp ? "#0c4a6e" : "#854d0e" }}>
              {t.booking.harbourTax}
            </p>
            <p className="text-[10px] leading-tight mt-0.5" style={{ color: payInApp ? "#64748b" : "#a16207" }}>
              {t.booking.harbourTaxInfo}
            </p>
          </div>
        </div>
        <span className="text-xs font-extrabold tabular-nums shrink-0"
          style={{ color: payInApp ? "#0369a1" : "#94a3b8", textDecoration: payInApp ? "none" : "line-through" }}>
          {formatRupiah(taxAmount)}
        </span>
      </div>
      {/* Toggle */}
      <button onClick={onToggle}
        className="w-full flex items-center justify-between rounded-md px-2 py-1 text-[10px] font-bold transition-all"
        style={{ background: "white", border: `1px solid ${payInApp ? "#bae6fd" : "#fde047"}` }}>
        <span className="flex items-center gap-1.5" style={{ color: payInApp ? "#0369a1" : "#854d0e" }}>
          {payInApp ? "✓" : "○"} {t.booking.payInApp}
        </span>
        {/* Mini iOS-style toggle */}
        <span className="relative inline-block transition-all"
          style={{
            width: 28, height: 16, borderRadius: 999,
            background: payInApp ? "#0284c7" : "#cbd5e1",
          }}>
          <span className="absolute top-0.5 transition-all"
            style={{
              width: 12, height: 12, borderRadius: 999,
              background: "white",
              left: payInApp ? 14 : 2,
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }} />
        </span>
      </button>
    </div>
  );
}

function BookingContent() {
  const { t, lang } = useLang();
  const params = useSearchParams();
  const id = params.get("id");
  const date = params.get("date") ?? "";
  const initPassengers = Number(params.get("passengers") ?? 1);

  const schedule = useMemo(() => SCHEDULES.find(s => s.id === id), [id]);

  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [passengers, setPassengers] = useState(initPassengers);
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    nationality: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderCode] = useState(() => `TG-${Date.now().toString(36).toUpperCase()}`);
  const [issuedAt] = useState(() => new Date());
  const [payTaxInApp, setPayTaxInApp] = useState(true);
  const [mobileFormComplete, setMobileFormComplete] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Clear an error key when the related field becomes valid
  const setField = (key: keyof typeof form, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) {
      setErrors(e => {
        const copy = { ...e };
        delete copy[key];
        return copy;
      });
    }
  };

  if (!schedule) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#f0f9ff" }}>
        <div className="text-5xl mb-4">⚠️</div>
        <p className="font-bold text-lg mb-2" style={{ color: "#0c4a6e" }}>{t.booking.notFound}</p>
        <Link href="/jadwal" className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold text-white btn-ocean">
          {t.booking.backBtn}
        </Link>
      </div>
    );
  }

  const ticketSubtotal = schedule.price * passengers;
  const taxAmount = HARBOUR_TAX_PER_PAX * passengers;
  const totalPrice = ticketSubtotal + (payTaxInApp ? taxAmount : 0);

  // Real-time validation states
  const validName = form.name.trim().length >= 3;
  const validEmail = EMAIL_RE.test(form.email);
  const validWa = form.whatsapp.replace(/\D/g, "").length >= 10;
  const validNat = !!form.nationality;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!validName) e.name = t.booking.errorName;
    if (!validEmail) e.email = t.booking.errorEmail;
    if (!validWa) e.whatsapp = t.booking.errorWa;
    if (!validNat) e.nationality = t.booking.errorNat;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setStep("confirm");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Mobile 2-stage CTA:
  //   stage 1 (mobileFormComplete=false): tap → validate → scroll to summary
  //   stage 2 (mobileFormComplete=true): tap → handleSubmit (proceed to confirm)
  const handleMobileCta = () => {
    if (mobileFormComplete) {
      handleSubmit();
      return;
    }
    if (!validate()) return;
    setMobileFormComplete(true);
    // Smooth scroll to summary section
    setTimeout(() => {
      summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleConfirm = () => {
    setStep("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Stepper position
  const stepIndex: 0 | 1 | 2 = step === "form" ? 0 : step === "confirm" ? 1 : 2;

  // Summary rows (used in sidebar)
  const summaryRows = [
    { icon: <Icon.Pin width={14} height={14} />, label: t.booking.from, value: schedule.from },
    { icon: <Icon.Flag width={14} height={14} />, label: t.booking.to, value: schedule.to },
    { icon: <Icon.Clock width={14} height={14} />, label: t.booking.departs, value: schedule.departureTime },
    { icon: <Icon.Timer width={14} height={14} />, label: t.booking.duration, value: schedule.duration },
    { icon: <Icon.Calendar width={14} height={14} />, label: t.booking.dateLabel, value: formatDateLong(date, lang) },
  ];

  // ── DONE ──
  if (step === "done") {
    const handlePrint = () => window.print();

    const waMessage = encodeURIComponent(
      `🎫 *${t.eticket.title} ${schedule.operator}*\n\n` +
      `📋 *${t.eticket.bookingCode}:* ${orderCode}\n` +
      `🚤 ${schedule.from} → ${schedule.to}\n` +
      `📅 ${formatDateLong(date, lang)}\n` +
      `🕐 ${schedule.departureTime} (${schedule.duration})\n` +
      `👤 ${form.name} · ${passengers} ${t.search.pax}\n` +
      `💰 ${formatRupiah(totalPrice)}\n\n` +
      `${t.eticket.qrInfo}`
    );

    const emailSubject = encodeURIComponent(`${t.eticket.title} ${orderCode} — tapToGo`);
    const emailBody = encodeURIComponent(
      `Halo ${form.name},\n\n` +
      `Berikut detail tiket Anda:\n\n` +
      `Kode Booking: ${orderCode}\n` +
      `Rute: ${schedule.from} → ${schedule.to}\n` +
      `Tanggal: ${formatDateLong(date, lang)}\n` +
      `Waktu: ${schedule.departureTime} (${schedule.duration})\n` +
      `Penumpang: ${passengers} ${t.search.pax}\n` +
      `Total: ${formatRupiah(totalPrice)}\n\n` +
      `Tunjukkan tiket di taptogo.id atau cetak halaman ini.\n\n` +
      `tapToGo`
    );

    return (
      <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
        <Navbar />
        <div className="pt-16 print:hidden" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <Stepper current={2} t={t} />
            <div className="flex flex-col items-center mt-2">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                style={{ background: "#22c55e", color: "white" }}>
                <Icon.Check width={28} height={28} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{t.booking.successTitle}</h1>
              <p className="text-sm text-center" style={{ color: "#e0f2fe" }}>{t.booking.successDesc}</p>
            </div>
          </div>
          <div style={{ lineHeight: 0 }}>
            <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
              <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
            </svg>
          </div>
        </div>

        <div className="py-6 px-4 max-w-3xl mx-auto">
          <ETicket
            bookingCode={orderCode}
            schedule={schedule}
            passengerName={form.name}
            email={form.email}
            whatsapp={form.whatsapp}
            date={date}
            passengers={passengers}
            totalPrice={totalPrice}
            issuedAt={issuedAt}
            payTaxInApp={payTaxInApp}
            taxAmount={taxAmount}
          />

          {/* Actions */}
          <div className="print:hidden mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-[720px] mx-auto">
            <button onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-extrabold text-white btn-ocean transition-all hover:scale-105">
              <Icon.Download width={16} height={16} /> {t.eticket.download}
            </button>
            <button onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ background: "white", color: "#0369a1", border: "1.5px solid #bae6fd" }}>
              <Icon.Print width={16} height={16} /> {t.eticket.print}
            </button>
            <a href={`https://wa.me/?text=${waMessage}`} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ background: "#dcfce7", color: "#15803d", border: "1.5px solid #86efac" }}>
              💬 WhatsApp
            </a>
            <a href={`mailto:${form.email}?subject=${emailSubject}&body=${emailBody}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ background: "white", color: "#0369a1", border: "1.5px solid #bae6fd" }}>
              📧 Email
            </a>
          </div>

          <p className="print:hidden text-xs mt-4 text-center" style={{ color: "#64748b" }}>
            {t.booking.waNotif} <strong>{form.whatsapp}</strong> {t.booking.waTime}
          </p>

          <Link href="/" className="print:hidden mt-4 max-w-md mx-auto block w-full py-3 rounded-2xl text-sm font-extrabold text-center transition-all hover:scale-[1.01]"
            style={{ background: "#f0f9ff", color: "#0369a1", border: "1.5px solid #bae6fd" }}>
            {t.booking.backHome}
          </Link>
        </div>
      </div>
    );
  }

  // ── CONFIRM ──
  if (step === "confirm") {
    return (
      <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
        <Navbar />
        <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <Stepper current={1} t={t} />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-1">{t.booking.confirmTitle}</h1>
            <p className="text-center text-sm" style={{ color: "#e0f2fe" }}>{schedule.from} → {schedule.to} · {formatDateLong(date, lang)} · {schedule.departureTime}</p>
          </div>
          <div style={{ lineHeight: 0 }}>
            <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
              <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
            </svg>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-32">
          {/* Schedule summary */}
          <div className="bg-white rounded-2xl p-5 mb-4"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{ background: "#e0f2fe" }}>
                {schedule.image ? (
                  <img src={schedule.image} alt={schedule.operator} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-extrabold text-white"
                    style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>{schedule.logo}</div>
                )}
              </div>
              <div>
                <p className="font-bold" style={{ color: "#0c4a6e" }}>{schedule.operator}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>{schedule.boatType}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: t.booking.from, value: schedule.from },
                { label: t.booking.to, value: schedule.to },
                { label: t.booking.departs, value: schedule.departureTime },
                { label: t.booking.duration, value: schedule.duration },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl p-3" style={{ background: "#f0f9ff" }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: "#94a3b8" }}>{label}</p>
                  <p className="text-sm font-bold" style={{ color: "#0c4a6e" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Passenger summary */}
          <div className="bg-white rounded-2xl p-5 mb-4"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#94a3b8" }}>{t.booking.passengerSummary}</p>
            <div className="space-y-2">
              {[
                { label: t.booking.name, value: form.name },
                { label: t.booking.email, value: form.email },
                { label: t.booking.whatsapp, value: form.whatsapp },
                { label: t.booking.nationality, value: form.nationality },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5"
                  style={{ borderBottom: "1px solid #f0f9ff" }}>
                  <span className="text-sm" style={{ color: "#64748b" }}>{label}</span>
                  <span className="text-sm font-semibold text-right" style={{ color: "#334155" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-white rounded-2xl p-5 mb-4"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm" style={{ color: "#64748b" }}>{t.booking.pricePerPax}</span>
              <span className="text-sm font-semibold" style={{ color: "#334155" }}>{formatRupiah(schedule.price)} × {passengers}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm" style={{ color: "#64748b" }}>{t.booking.subtotal}</span>
              <span className="text-sm font-semibold" style={{ color: "#334155" }}>{formatRupiah(ticketSubtotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm flex items-center gap-1.5" style={{ color: "#64748b" }}>
                <span>⚓</span> {t.booking.harbourTax}
              </span>
              {payTaxInApp ? (
                <span className="text-sm font-semibold" style={{ color: "#334155" }}>{formatRupiah(taxAmount)}</span>
              ) : (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: "#fef3c7", color: "#854d0e" }}>
                  ⚠️ {t.booking.taxPayAtPort}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center pt-3" style={{ borderTop: "1.5px solid #e0f2fe" }}>
              <span className="font-bold" style={{ color: "#0c4a6e" }}>{t.booking.totalPayment}</span>
              <span className="text-2xl font-extrabold" style={{ color: "#0369a1" }}>{formatRupiah(totalPrice)}</span>
            </div>
            {!payTaxInApp && (
              <div className="mt-3 rounded-lg p-2.5 flex items-start gap-2"
                style={{ background: "#fef3c7", border: "1px solid #fde047" }}>
                <span style={{ color: "#a16207" }}>⚠️</span>
                <p className="text-xs leading-snug font-semibold" style={{ color: "#854d0e" }}>
                  {t.booking.payAtPortWarning}: <strong>{formatRupiah(taxAmount)}</strong>
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("form")}
              className="flex-1 py-3.5 rounded-2xl text-sm font-bold border-2 transition-all"
              style={{ borderColor: "#e0f2fe", color: "#64748b" }}>
              {t.booking.editData}
            </button>
            <button onClick={handleConfirm}
              className="flex-[2] py-3.5 rounded-2xl text-sm font-extrabold text-white btn-ocean transition-all hover:scale-[1.02]">
              {t.booking.confirmBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── FORM ──
  return (
    <div className="min-h-screen pb-24 lg:pb-8" style={{ background: "#f0f9ff" }}>
      <Navbar />

      {/* Hero with stepper + trip summary */}
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/jadwal" className="inline-flex items-center gap-1 text-sm font-semibold mb-4 hover:opacity-80"
            style={{ color: "#e0f2fe" }}>{t.booking.backToSchedule}</Link>

          <Stepper current={0} t={t} />

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-1">
            {schedule.from} <span style={{ color: "#7dd3fc" }}>→</span> {schedule.to}
          </h1>
          <p className="text-center text-sm sm:text-base mb-4" style={{ color: "#e0f2fe" }}>
            {formatDateLong(date, lang)} · {schedule.departureTime} → {schedule.arrivalTime} ({schedule.duration}) · {passengers} {t.search.pax}
          </p>

          {/* Mini trip card */}
          <div className="max-w-md mx-auto rounded-2xl px-3 py-2.5 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)" }}>
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{ background: "rgba(255,255,255,0.1)" }}>
              {schedule.image ? (
                <img src={schedule.image} alt={schedule.operator} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-extrabold text-white"
                  style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>{schedule.logo}</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-bold text-sm leading-tight truncate">{schedule.operator}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap"
                  style={{ background: "rgba(255,255,255,0.18)", color: "white" }}>{schedule.boatType}</span>
                <span className="text-[10px] font-semibold" style={{ color: "#bae6fd" }}>
                  ⏱ {schedule.duration} · {schedule.availableSeats} {t.jadwal.seats}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

          {/* Form */}
          <div className="bg-white rounded-2xl p-5 sm:p-6"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <p className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#0369a1" }}>
              {t.booking.passengerData}
            </p>

            <div className="space-y-3.5">
              <ValidatedInput
                label={t.booking.fullName}
                value={form.name}
                onChange={v => setField("name", v)}
                placeholder={t.booking.namePlaceholder}
                error={errors.name}
                valid={validName}
                validText={t.booking.nameValid}
                required
              />

              <ValidatedInput
                label={t.booking.email}
                type="email"
                value={form.email}
                onChange={v => setField("email", v)}
                placeholder={t.booking.emailPlaceholder}
                error={errors.email}
                valid={validEmail}
                validText={t.booking.emailValid}
                required
              />

              <ValidatedInput
                label={t.booking.whatsapp}
                type="tel"
                value={form.whatsapp}
                onChange={v => setField("whatsapp", formatWhatsApp(v))}
                placeholder={t.booking.waPlaceholder}
                error={errors.whatsapp}
                valid={validWa}
                validText={t.booking.waValid}
                required
              />

              {/* Nationality */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                  {t.booking.nationality} <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <CountryPicker value={form.nationality} onChange={v => setField("nationality", v)} error={errors.nationality} t={t} />
                {errors.nationality && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>✕ {errors.nationality}</p>}
              </div>

            </div>

            <button onClick={handleSubmit}
              className="hidden lg:block mt-6 w-full py-4 rounded-2xl text-white text-sm font-extrabold btn-ocean transition-all hover:scale-[1.01]">
              {t.booking.nextBtn}
            </button>
          </div>

          {/* Order summary — visible on all screens */}
          <div ref={summaryRef} className="space-y-4 scroll-mt-20">
            <div className="bg-white rounded-2xl p-5 lg:sticky lg:top-20"
              style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: "#94a3b8" }}>{t.booking.orderSummary}</p>

              {/* Operator with photo */}
              <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid #f0f9ff" }}>
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{ background: "#e0f2fe" }}>
                  {schedule.image ? (
                    <img src={schedule.image} alt={schedule.operator} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-extrabold text-white"
                      style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>{schedule.logo}</div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: "#0c4a6e" }}>{schedule.operator}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>{schedule.boatType}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {summaryRows.map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <span className="text-xs flex items-center gap-1.5" style={{ color: "#94a3b8" }}>
                      <span style={{ color: "#0369a1" }}>{icon}</span> {label}
                    </span>
                    <span className="text-xs font-semibold text-right" style={{ color: "#334155" }}>{value}</span>
                  </div>
                ))}

                {/* Passengers — editable */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs flex items-center gap-1.5" style={{ color: "#94a3b8" }}>
                    <span style={{ color: "#0369a1" }}><Icon.User width={14} height={14} /></span> {t.booking.passengersLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPassengers(p => Math.max(1, p - 1))}
                      className="w-6 h-6 rounded-lg text-sm font-bold flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: "#eff6ff", color: "#0284c7" }}>−</button>
                    <span className="text-sm font-extrabold w-5 text-center" style={{ color: "#0369a1" }}>{passengers}</span>
                    <button onClick={() => setPassengers(p => Math.min(schedule.availableSeats, p + 1))}
                      className="w-6 h-6 rounded-lg text-sm font-bold flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: "#eff6ff", color: "#0284c7" }}>+</button>
                  </div>
                </div>
              </div>

              {/* Per-pax breakdown */}
              <div className="mt-4 pt-4 space-y-1.5" style={{ borderTop: "1px solid #e0f2fe" }}>
                <div className="flex justify-between items-center text-xs" style={{ color: "#94a3b8" }}>
                  <span>Tiket {formatRupiah(schedule.price)} × {passengers}</span>
                  <span>{formatRupiah(ticketSubtotal)}</span>
                </div>

                {/* Harbour Tax row with toggle */}
                <HarbourTaxRow
                  payInApp={payTaxInApp}
                  onToggle={() => setPayTaxInApp(v => !v)}
                  taxAmount={taxAmount}
                  t={t}
                />

                <div className="flex justify-between items-center pt-2 mt-1" style={{ borderTop: "1px solid #e0f2fe" }}>
                  <span className="text-sm font-bold" style={{ color: "#0c4a6e" }}>{t.booking.total}</span>
                  <span className="text-xl font-extrabold" style={{ color: "#0369a1" }}>{formatRupiah(totalPrice)}</span>
                </div>

                {!payTaxInApp && (
                  <div className="mt-2 rounded-lg p-2.5 flex items-start gap-2"
                    style={{ background: "#fef3c7", border: "1px solid #fde047" }}>
                    <span style={{ color: "#a16207" }}>⚠️</span>
                    <p className="text-[10px] leading-snug font-semibold" style={{ color: "#854d0e" }}>
                      {t.booking.payAtPortWarning} <strong>{formatRupiah(taxAmount)}</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Collapsible facilities */}
              {schedule.amenities.length > 0 && (
                <details className="mt-4 pt-4" style={{ borderTop: "1px solid #f0f9ff" }}>
                  <summary className="text-xs font-bold uppercase tracking-wide cursor-pointer flex items-center justify-between" style={{ color: "#94a3b8" }}>
                    {t.booking.facilities} ({schedule.amenities.length})
                    <Icon.ChevronDown width={14} height={14} />
                  </summary>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {schedule.amenities.map(a => (
                      <span key={a} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                        style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar — compact CTA only (summary now visible inline below form) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{ background: "white", borderTop: "1.5px solid #e0f2fe", boxShadow: "0 -4px 20px rgba(2,132,199,0.08)" }}>
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold truncate" style={{ color: "#64748b" }}>
              <span className="tabular-nums">Rp {schedule.price}K × {passengers}</span>
              {payTaxInApp && (
                <> + <span style={{ color: "#0369a1" }}>⚓ {HARBOUR_TAX_PER_PAX}K</span></>
              )}
            </p>
            <p className="text-lg font-extrabold leading-tight" style={{ color: "#0369a1" }}>
              {formatRupiah(totalPrice)}
            </p>
          </div>
          <button onClick={handleMobileCta}
            className="flex-1 py-3 rounded-xl text-white text-sm font-extrabold btn-ocean transition-all">
            {mobileFormComplete ? t.booking.nextBtn : t.booking.continueBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f9ff" }}>
      <p style={{ color: "#0369a1" }}>...</p>
    </div>}>
      <BookingContent />
    </Suspense>
  );
}
