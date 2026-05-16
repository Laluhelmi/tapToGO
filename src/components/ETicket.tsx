"use client";
import type { BoatSchedule } from "@/types";
import { useLang } from "@/contexts/LanguageContext";
import { LogoMark } from "./Logo";

interface Props {
  bookingCode: string;
  schedule: BoatSchedule;
  passengerName: string;
  email: string;
  whatsapp: string;
  date: string;
  passengers: number;
  totalPrice: number; // in thousands
  issuedAt: Date;
  payTaxInApp?: boolean;
  taxAmount?: number; // in thousands
}

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

export default function ETicket({
  bookingCode,
  schedule,
  passengerName,
  email,
  whatsapp,
  date,
  passengers,
  totalPrice,
  issuedAt,
  payTaxInApp = true,
  taxAmount = 0,
}: Props) {
  const { t, lang } = useLang();

  // QR encodes booking code (in real app, would be a signed URL/JWT)
  const qrData = encodeURIComponent(
    JSON.stringify({
      code: bookingCode,
      route: `${schedule.from}->${schedule.to}`,
      date,
      time: schedule.departureTime,
      pax: passengers,
      name: passengerName,
    })
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}&margin=8&color=0c4a6e&bgcolor=ffffff`;

  return (
    <div className="eticket-printable bg-white rounded-3xl overflow-hidden mx-auto"
      style={{
        maxWidth: 720,
        border: "1.5px solid #e0f2fe",
        boxShadow: "0 12px 40px rgba(2,132,199,0.15)",
      }}>

      {/* Header with brand & code */}
      <div className="px-6 py-5 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="flex items-center gap-3">
          <LogoMark size={42} />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#bae6fd" }}>
              {t.eticket.title}
            </p>
            <p className="text-white font-extrabold text-lg leading-tight">tapToGo</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#bae6fd" }}>
            {t.eticket.bookingCode}
          </p>
          <p className="text-white font-extrabold text-xl tabular-nums leading-tight">{bookingCode}</p>
        </div>
      </div>

      {/* Route hero */}
      <div className="px-6 py-6" style={{ background: "linear-gradient(180deg,#f0f9ff,#e0f2fe)" }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* From */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#94a3b8" }}>
              {t.booking.from}
            </p>
            <p className="text-xl sm:text-2xl font-extrabold leading-tight" style={{ color: "#0c4a6e" }}>
              {schedule.from}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold tabular-nums mt-1" style={{ color: "#0369a1" }}>
              {schedule.departureTime}
            </p>
          </div>

          {/* Arrow + duration */}
          <div className="flex flex-col items-center px-2">
            <p className="text-xs font-bold mb-2" style={{ color: "#0284c7" }}>{schedule.duration}</p>
            <svg width="80" height="20" viewBox="0 0 80 20" fill="none">
              <line x1="2" y1="10" x2="74" y2="10" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3"/>
              <path d="M70 4 L78 10 L70 16" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="2" cy="10" r="3" fill="#0284c7"/>
            </svg>
            <p className="text-[10px] font-bold mt-1" style={{ color: "#94a3b8" }}>{schedule.boatType}</p>
          </div>

          {/* To */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#94a3b8" }}>
              {t.booking.to}
            </p>
            <p className="text-xl sm:text-2xl font-extrabold leading-tight" style={{ color: "#0c4a6e" }}>
              {schedule.to}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold tabular-nums mt-1" style={{ color: "#0369a1" }}>
              {schedule.arrivalTime}
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm font-semibold" style={{ color: "#334155" }}>
            {formatDateLong(date, lang)}
          </p>
        </div>
      </div>

      {/* Perforated divider */}
      <div className="relative h-4" style={{ background: "white" }}>
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: "#f0f9ff" }} />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: "#f0f9ff" }} />
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-px border-t border-dashed" style={{ borderColor: "#cbd5e1" }} />
      </div>

      {/* Body: details + QR */}
      <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-5">
        {/* Details */}
        <div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Field label={t.eticket.passenger} value={passengerName} />
            <Field label={t.booking.passengersLabel} value={`${passengers} ${t.search.pax}`} />
            <Field label={t.compare.operator} value={schedule.operator} />
            <Field label={t.compare.type} value={schedule.boatType} />
            <Field label={t.booking.email} value={email} small />
            <Field label={t.booking.whatsapp} value={whatsapp} small />
          </div>

          <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: "1px dashed #cbd5e1" }}>
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#94a3b8" }}>
              {t.booking.totalPayment}
            </span>
            <span className="text-xl font-extrabold" style={{ color: "#0369a1" }}>
              {formatRupiah(totalPrice)}
            </span>
          </div>

          {/* Harbour Tax status */}
          {taxAmount > 0 && (
            <div className="mt-2 rounded-lg p-2 flex items-center justify-between gap-2"
              style={{
                background: payTaxInApp ? "#dcfce7" : "#fef3c7",
                border: `1px solid ${payTaxInApp ? "#86efac" : "#fde047"}`,
              }}>
              <span className="text-[11px] font-bold flex items-center gap-1.5"
                style={{ color: payTaxInApp ? "#15803d" : "#854d0e" }}>
                <span>⚓</span>
                {payTaxInApp ? `✓ ${t.booking.taxPaid}` : `⚠️ ${t.booking.harbourTax}: ${t.booking.taxPayAtPort}`}
              </span>
              <span className="text-[11px] font-extrabold tabular-nums"
                style={{ color: payTaxInApp ? "#15803d" : "#854d0e" }}>
                {formatRupiah(taxAmount)}
              </span>
            </div>
          )}
        </div>

        {/* QR */}
        <div className="flex flex-col items-center sm:items-end gap-2">
          <div className="rounded-xl p-2"
            style={{ background: "white", border: "2px solid #0c4a6e", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <img src={qrUrl} alt="QR Code" width="140" height="140" style={{ display: "block" }} />
          </div>
          <p className="text-[10px] text-center max-w-[160px]" style={{ color: "#64748b" }}>
            {t.eticket.qrInfo}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="px-6 py-4" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#0369a1" }}>
          {t.eticket.instructions}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
          {[t.eticket.inst1, t.eticket.inst2, t.eticket.inst3, t.eticket.inst4].map((inst, i) => (
            <p key={i} className="text-xs flex gap-2" style={{ color: "#475569" }}>
              <span className="font-bold" style={{ color: "#0284c7" }}>{i + 1}.</span>
              <span>{inst}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Important + footer */}
      <div className="px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
        style={{ background: "#0c4a6e", color: "#bae6fd" }}>
        <p className="text-[10px]">
          <strong style={{ color: "#fbbf24" }}>⚠ {t.eticket.important}:</strong> {t.eticket.importantDesc}
        </p>
        <p className="text-[10px] font-bold whitespace-nowrap" style={{ color: "white" }}>
          {t.eticket.poweredBy}
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: "#94a3b8" }}>
        {label}
      </p>
      <p className={`${small ? "text-xs" : "text-sm"} font-bold break-words`} style={{ color: "#0c4a6e" }}>
        {value}
      </p>
    </div>
  );
}
