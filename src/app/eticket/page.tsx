"use client";
import { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SCHEDULES } from "@/data/boats";
import { LogoMark } from "@/components/Logo";

// Port → physical address + lat/lng (real coords)
const PORT_LOCATIONS: Record<string, { address: string; lat: number; lng: number }> = {
  "Gili Trawangan": { address: "Gili Trawangan Harbour, Pemenang, Kabupaten Lombok Utara, Nusa Tenggara Bar. 83352, Indonesia", lat: -8.34998, lng: 116.0388 },
  "Gili Meno":      { address: "Gili Meno Harbour, Gili Indah, Pemenang, Kabupaten Lombok Utara, Nusa Tenggara Bar. 83352, Indonesia", lat: -8.35333, lng: 116.057 },
  "Gili Air":       { address: "Gili Air Harbour, Gili Indah, Pemenang, Kabupaten Lombok Utara, Nusa Tenggara Bar. 83352, Indonesia", lat: -8.36307, lng: 116.0848 },
  "Bangsal":        { address: "Pelabuhan Bangsal, Jl. Pelabuhan Bangsal, Pemenang Bar., Kabupaten Lombok Utara, Nusa Tenggara Bar. 83352, Indonesia", lat: -8.39462, lng: 116.09984 },
  "Senggigi":       { address: "Pelabuhan Senggigi, Jl. Raya Senggigi, Batu Layar, Kabupaten Lombok Barat, Nusa Tenggara Bar. 83355, Indonesia", lat: -8.49152, lng: 116.04201 },
  "Padang Bai":     { address: "Pelabuhan Padang Bai, Jl. Pelabuhan Padang Bai, Karangasem, Bali 80872, Indonesia", lat: -8.5325, lng: 115.50997 },
  "Sanur":          { address: "Pelabuhan Sanur, Jl. Hang Tuah, Sanur, Denpasar Selatan, Bali 80228, Indonesia", lat: -8.6779, lng: 115.2627 },
  "Nusa Penida":    { address: "Pelabuhan Banjar Nyuh / Buyuk, Jl. Ped-Buyuk, Kutampi Kaler, Nusa Penida, Kabupaten Klungkung, Bali 80771, Indonesia", lat: -8.67461, lng: 115.54652 },
  "Nusa Lembongan": { address: "Pelabuhan Jungut Batu, Jungut Batu, Nusa Penida, Kabupaten Klungkung, Bali 80771, Indonesia", lat: -8.6789, lng: 115.4416 },
  "Serangan":       { address: "Pelabuhan Tanjung Benoa Serangan, Jl. Pulau Serangan, Denpasar Selatan, Bali 80229, Indonesia", lat: -8.7269, lng: 115.2358 },
};

function formatRupiah(thousands: number): string {
  return "Rp " + (thousands * 1000).toLocaleString("id-ID");
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function addDurationTo(timeHHMM: string, durationStr: string): string {
  // duration formatted as "1h 15m" or "2h" or "45m"
  const [h, m] = timeHHMM.split(":").map(Number);
  const hMatch = durationStr.match(/(\d+)h/);
  const mMatch = durationStr.match(/(\d+)m/);
  const totalMin = h * 60 + m + (hMatch ? Number(hMatch[1]) * 60 : 0) + (mMatch ? Number(mMatch[1]) : 0);
  const eh = Math.floor(totalMin / 60) % 24;
  const em = totalMin % 60;
  return `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
}

function ETicketInner() {
  const sp = useSearchParams();

  const code = sp.get("code") || "TPG00000";
  const scheduleId = sp.get("id") || "";
  const name = sp.get("name") || "—";
  const email = sp.get("email") || "—";
  const phone = sp.get("phone") || "—";
  const nationality = sp.get("nationality") || "";
  const date = sp.get("date") || "";
  const pax = Number(sp.get("pax") || "1");
  const payTaxInApp = sp.get("tax") === "1";
  const note = sp.get("note") || "";

  const schedule = useMemo(() => SCHEDULES.find(s => s.id === scheduleId), [scheduleId]);

  // Generate QR code via free public service (no API key needed)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(code)}`;

  useEffect(() => {
    document.title = `E-Ticket ${code} · tapToGo`;
  }, [code]);

  if (!schedule) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#f0f9ff" }}>
        <div className="text-center">
          <p className="text-xl font-bold mb-2" style={{ color: "#0c4a6e" }}>E-Ticket not found</p>
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>Missing or invalid schedule id.</p>
          <Link href="/" className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const fromLoc = PORT_LOCATIONS[schedule.from];
  const toLoc = PORT_LOCATIONS[schedule.to];

  const departure = `${formatDate(date)} ${schedule.departureTime}`;
  const arrival = `${formatDate(date)} ${schedule.arrivalTime || addDurationTo(schedule.departureTime, schedule.duration)}`;

  const totalPrice = schedule.price * pax;
  const taxAmount = payTaxInApp ? 20 * pax : 0;
  const grandTotal = totalPrice + taxAmount;

  const handlePrint = () => window.print();

  return (
    <div className="eticket-bg min-h-screen" style={{ background: "#f8fafc" }}>
      {/* Toolbar (hidden on print) */}
      <div className="eticket-toolbar sticky top-0 z-20 backdrop-blur"
        style={{ background: "rgba(255,255,255,0.85)", borderBottom: "1px solid #e2e8f0" }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="text-sm font-bold" style={{ color: "#0369a1" }}>← Home</Link>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white inline-flex items-center gap-2"
              style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* PAGE 1 */}
      <div className="eticket-page max-w-3xl mx-auto bg-white" style={{ padding: "32px 32px 40px", margin: "16px auto", boxShadow: "0 4px 24px rgba(15,23,42,0.06)" }}>
        <p className="text-center text-xs mb-4" style={{ color: "#64748b" }}>
          This is your e-ticket. Please show at check-in. Printing is not mandatory.
        </p>

        {/* Header: brand · QR · Booking ID */}
        <div className="grid grid-cols-3 items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <LogoMark size={44} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#0369a1" }}>fastboat ticket</p>
              <p className="font-extrabold text-lg leading-tight" style={{ color: "#0c4a6e" }}>tapToGo</p>
            </div>
          </div>
          <div className="flex justify-center">
            <img src={qrUrl} alt="QR Code" width={120} height={120} style={{ width: 120, height: 120 }} />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>Booking ID</p>
            <p className="font-extrabold text-lg tabular-nums" style={{ color: "#0c4a6e" }}># {code}</p>
          </div>
        </div>

        {/* Voucher PAID banner */}
        <div className="flex items-center justify-between rounded-md px-4 py-2 mb-4"
          style={{ background: "#dcfce7", border: "1px solid #86efac" }}>
          <p className="text-sm font-extrabold tracking-wide" style={{ color: "#15803d" }}>
            VOUCHER <span style={{ background: "#15803d", color: "white", padding: "2px 8px", borderRadius: 4, marginLeft: 4 }}>PAID</span>
          </p>
          <p className="text-xs font-semibold" style={{ color: "#15803d" }}>{formatRupiah(grandTotal)}</p>
        </div>

        {/* ITINERARY */}
        <div className="mb-1 px-3 py-1.5 rounded-sm" style={{ background: "#e0f2fe" }}>
          <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "#0c4a6e" }}>
            ITINERARY: {schedule.from} — {schedule.to}, {schedule.operator}
          </p>
        </div>
        <table className="w-full text-sm mb-4" style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td className="py-1.5 pr-3 align-top w-[90px] font-bold" style={{ color: "#0c4a6e" }}>From:</td>
              <td className="py-1.5 pr-6 align-top" style={{ color: "#334155" }}>{schedule.from}</td>
              <td className="py-1.5 pr-3 align-top w-[100px] font-bold" style={{ color: "#0c4a6e" }}>Operator:</td>
              <td className="py-1.5 align-top" style={{ color: "#334155" }}>{schedule.operator}</td>
            </tr>
            <tr>
              <td className="py-1.5 pr-3 align-top font-bold" style={{ color: "#0c4a6e" }}>To:</td>
              <td className="py-1.5 pr-6 align-top" style={{ color: "#334155" }}>{schedule.to}</td>
              <td className="py-1.5 pr-3 align-top font-bold" style={{ color: "#0c4a6e" }}>Class:</td>
              <td className="py-1.5 align-top" style={{ color: "#334155" }}>{schedule.boatType}</td>
            </tr>
            <tr>
              <td className="py-1.5 pr-3 align-top font-bold" style={{ color: "#0c4a6e" }}>Date:</td>
              <td className="py-1.5 pr-6 align-top" style={{ color: "#334155" }}>
                {departure}
                <div className="text-xs" style={{ color: "#64748b" }}>Estimated Arrival {arrival}</div>
              </td>
              <td className="py-1.5 pr-3 align-top font-bold" style={{ color: "#0c4a6e" }}>Hotline:</td>
              <td className="py-1.5 align-top" style={{ color: "#334155" }}>+62 878 2177 5082</td>
            </tr>
            <tr>
              <td className="py-1.5 pr-3 align-top font-bold" style={{ color: "#0c4a6e" }}>TripNo:</td>
              <td className="py-1.5 pr-6 align-top" style={{ color: "#334155" }}>{code}</td>
              <td className="py-1.5 pr-3 align-top font-bold" style={{ color: "#0c4a6e" }}>Duration:</td>
              <td className="py-1.5 align-top" style={{ color: "#334155" }}>{schedule.duration}</td>
            </tr>
          </tbody>
        </table>

        {/* PASSENGERS */}
        <div className="mb-1 px-3 py-1.5 rounded-sm" style={{ background: "#e0f2fe" }}>
          <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "#0c4a6e" }}>
            PASSENGERS · Adult {pax}
          </p>
        </div>
        <div className="mb-4 px-3 py-2 text-sm" style={{ color: "#0c4a6e" }}>
          <p className="font-bold">{name}{nationality && <span className="font-normal" style={{ color: "#64748b" }}> · {nationality}</span>}</p>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{email} · {phone}</p>
          {note && <p className="text-xs mt-1 italic" style={{ color: "#64748b" }}>Note: {note}</p>}
        </div>

        {/* INFORMATION */}
        <div className="mb-1 px-3 py-1.5 rounded-sm" style={{ background: "#e0f2fe" }}>
          <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "#0c4a6e" }}>INFORMATION</p>
        </div>
        <ul className="px-3 py-2 text-xs space-y-1" style={{ color: "#334155" }}>
          <li>
            <strong>Important Note:</strong> Passengers for Sanur, Nusa Penida, and Nusa Lembongan must pay the
            island retribution fee prior to boarding. This fee is payable on-site and is not included in your ticket.
          </li>
          <li>* Passengers are required to check in at least 30 minutes before departure.</li>
          <li>* Infants under 2 years of age can travel free of charge on their parent's lap.</li>
          <li>* Each passenger is allowed 20 kg of luggage. Surfboards: please contact support.</li>
          <li>* Non-refundable for trip delays due to weather conditions.</li>
          <li>* We do not accept responsibility for missed boats due to late check-in.</li>
          <li>
            * For trips from/to Padang Bai, Serangan, Gili Trawangan, Gili Meno, Gili Air, Bangsal, and Senggigi,
            passengers are required to pay <strong>Harbour Tax IDR 20,000</strong> at the port
            {payTaxInApp
              ? <> — <span style={{ color: "#15803d", fontWeight: 700 }}>already paid in app</span>.</>
              : <> — <span style={{ color: "#b45309", fontWeight: 700 }}>pay in cash at port</span>.</>
            }
          </li>
          <li>* For routes to/from Nusa Lembongan, the operator will arrange a shuttle boat via Nusa Penida.</li>
        </ul>

        <p className="text-center text-base font-bold mt-6" style={{ color: "#0c4a6e" }}>Have a nice trip!</p>

        {/* Footer */}
        <div className="mt-6 pt-3 text-center text-[10px]" style={{ borderTop: "1px solid #e2e8f0", color: "#94a3b8" }}>
          <p><a href="https://taptogo.id" style={{ color: "#0369a1" }}>taptogo.id</a> · Contact our support team via WhatsApp +62 878 2177 5082</p>
          <p className="mt-1">Booking# {code}, issued {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
          <p className="mt-1">© 2026 tapToGo · Lombok–Bali Fastboat Booking</p>
        </div>
      </div>

      {/* PAGE 2: Boarding & Arrival */}
      <div className="eticket-page eticket-page-break max-w-3xl mx-auto bg-white" style={{ padding: "32px", margin: "16px auto", boxShadow: "0 4px 24px rgba(15,23,42,0.06)" }}>
        <div className="mb-1 px-3 py-1.5 rounded-sm" style={{ background: "#e0f2fe" }}>
          <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "#0c4a6e" }}>
            Boarding & Arrival Points
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {/* Boarding */}
          <div>
            <p className="text-sm font-extrabold mb-2" style={{ color: "#0c4a6e" }}>Boarding point</p>
            <p className="text-xs mb-2" style={{ color: "#334155" }}>{fromLoc?.address || schedule.from}</p>
            {fromLoc && (
              <>
                <a href={`https://www.google.com/maps/search/?api=1&query=${fromLoc.lat},${fromLoc.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs font-bold inline-block mb-2" style={{ color: "#0369a1" }}>
                  Coordinates {fromLoc.lat}, {fromLoc.lng} →
                </a>
                <div className="rounded-md overflow-hidden" style={{ border: "1px solid #e2e8f0", aspectRatio: "4 / 3" }}>
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${fromLoc.lng - 0.01},${fromLoc.lat - 0.008},${fromLoc.lng + 0.01},${fromLoc.lat + 0.008}&layer=mapnik&marker=${fromLoc.lat},${fromLoc.lng}`}
                    style={{ border: 0, width: "100%", height: "100%" }}
                    title={`${schedule.from} location`}
                  />
                </div>
              </>
            )}
          </div>

          {/* Arrival */}
          <div>
            <p className="text-sm font-extrabold mb-2" style={{ color: "#0c4a6e" }}>Arrival point</p>
            <p className="text-xs mb-2" style={{ color: "#334155" }}>{toLoc?.address || schedule.to}</p>
            {toLoc && (
              <>
                <a href={`https://www.google.com/maps/search/?api=1&query=${toLoc.lat},${toLoc.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs font-bold inline-block mb-2" style={{ color: "#0369a1" }}>
                  Coordinates {toLoc.lat}, {toLoc.lng} →
                </a>
                <div className="rounded-md overflow-hidden" style={{ border: "1px solid #e2e8f0", aspectRatio: "4 / 3" }}>
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${toLoc.lng - 0.01},${toLoc.lat - 0.008},${toLoc.lng + 0.01},${toLoc.lat + 0.008}&layer=mapnik&marker=${toLoc.lat},${toLoc.lng}`}
                    style={{ border: 0, width: "100%", height: "100%" }}
                    title={`${schedule.to} location`}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-3 text-center text-[10px]" style={{ borderTop: "1px solid #e2e8f0", color: "#94a3b8" }}>
          <p><a href="https://taptogo.id" style={{ color: "#0369a1" }}>taptogo.id</a> · Contact our support team via WhatsApp +62 878 2177 5082</p>
          <p className="mt-1">Booking# {code}</p>
          <p className="mt-1">© 2026 tapToGo · Lombok–Bali Fastboat Booking</p>
        </div>
      </div>

      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          .eticket-toolbar { display: none !important; }
          .eticket-bg { background: white !important; }
          .eticket-page {
            box-shadow: none !important;
            margin: 0 auto !important;
            padding: 16mm !important;
            max-width: 100% !important;
            page-break-inside: avoid;
          }
          .eticket-page-break { page-break-before: always; }
          @page { size: A4; margin: 0; }
          html, body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

export default function ETicketPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f9ff" }}><p style={{ color: "#0369a1" }}>Loading e-ticket…</p></div>}>
      <ETicketInner />
    </Suspense>
  );
}
