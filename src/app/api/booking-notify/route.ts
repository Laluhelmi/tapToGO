import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

interface BookingPayload {
  bookingCode: string;
  passenger: { name: string; email: string; phone: string; nationality?: string };
  schedule: {
    operator: string;
    boatType: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
  };
  date: string;
  passengers: number;
  ticketTotal: number;       // in thousands IDR
  taxAmount: number;         // in thousands IDR
  payTaxInApp: boolean;
  grandTotal: number;        // in thousands IDR
  note?: string;
}

function fmtRupiah(thousands: number) {
  return "Rp " + (thousands * 1000).toLocaleString("id-ID");
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function renderEmail(b: BookingPayload) {
  const taxStatus = b.taxAmount > 0
    ? (b.payTaxInApp ? `✅ Paid (${fmtRupiah(b.taxAmount)})` : `⚠️ Pay at port (${fmtRupiah(b.taxAmount)})`)
    : "—";

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>New Booking ${b.bookingCode}</title></head>
<body style="font-family:Arial,sans-serif;color:#0c4a6e;background:#f0f9ff;padding:24px;margin:0;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e0f2fe;">
    <div style="background:linear-gradient(135deg,#0c4a6e,#0369a1);color:#fff;padding:20px 24px;">
      <p style="margin:0;font-size:11px;letter-spacing:2px;opacity:.8;">NEW BOOKING — tapToGo</p>
      <h1 style="margin:4px 0 0;font-size:22px;">${b.bookingCode}</h1>
    </div>

    <table style="width:100%;border-collapse:collapse;padding:24px;">
      <tr><td style="padding:16px 24px 8px;font-weight:bold;font-size:13px;color:#0369a1;text-transform:uppercase;letter-spacing:1px;">Route</td></tr>
      <tr><td style="padding:0 24px 16px;font-size:16px;color:#0c4a6e;">
        <strong>${b.schedule.from}</strong> → <strong>${b.schedule.to}</strong><br>
        ${fmtDate(b.date)}<br>
        ${b.schedule.departureTime} – ${b.schedule.arrivalTime} (${b.schedule.duration})
      </td></tr>

      <tr><td style="padding:8px 24px;font-weight:bold;font-size:13px;color:#0369a1;text-transform:uppercase;letter-spacing:1px;">Operator</td></tr>
      <tr><td style="padding:0 24px 16px;font-size:14px;color:#334155;">
        ${b.schedule.operator} (${b.schedule.boatType})
      </td></tr>

      <tr><td style="padding:8px 24px;font-weight:bold;font-size:13px;color:#0369a1;text-transform:uppercase;letter-spacing:1px;">Passenger</td></tr>
      <tr><td style="padding:0 24px 16px;font-size:14px;color:#334155;line-height:1.6;">
        <strong>${b.passenger.name}</strong>${b.passenger.nationality ? " · " + b.passenger.nationality : ""}<br>
        📧 ${b.passenger.email}<br>
        📞 ${b.passenger.phone}<br>
        👥 ${b.passengers} pax
      </td></tr>

      ${b.note ? `<tr><td style="padding:8px 24px;font-weight:bold;font-size:13px;color:#0369a1;text-transform:uppercase;letter-spacing:1px;">Additional Note</td></tr>
      <tr><td style="padding:0 24px 16px;font-size:14px;color:#334155;font-style:italic;">${b.note}</td></tr>` : ""}

      <tr><td style="padding:16px 24px 8px;border-top:1px solid #e0f2fe;font-weight:bold;font-size:13px;color:#0369a1;text-transform:uppercase;letter-spacing:1px;">Payment</td></tr>
      <tr><td style="padding:0 24px 8px;font-size:14px;color:#334155;">
        Ticket: ${fmtRupiah(b.ticketTotal)}<br>
        Harbour Tax: ${taxStatus}
      </td></tr>
      <tr><td style="padding:8px 24px 24px;font-size:20px;color:#0369a1;font-weight:800;">
        Total: ${fmtRupiah(b.grandTotal)}
      </td></tr>

      <tr><td style="padding:16px 24px;background:#fef3c7;border-top:1px solid #fde047;font-size:13px;color:#854d0e;">
        ⏳ <strong>Status: Pending payment</strong><br>
        Send payment instructions to customer via WhatsApp/SMS.
      </td></tr>
    </table>

    <div style="background:#f8fafc;padding:12px 24px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #e0f2fe;">
      tapToGo · taptogo.id · ${new Date().toLocaleString("en-GB", { timeZone: "Asia/Makassar" })} WITA
    </div>
  </div>
</body></html>`;
}

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY || !ADMIN_EMAIL) {
    return NextResponse.json({ ok: false, error: "Email not configured" }, { status: 500 });
  }

  try {
    const body = (await req.json()) as BookingPayload;
    if (!body.bookingCode || !body.passenger?.name) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: `tapToGo Booking <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `🚤 New Booking ${body.bookingCode} · ${body.passenger.name} · ${body.schedule.from} → ${body.schedule.to}`,
      html: renderEmail(body),
      replyTo: body.passenger.email,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Booking notify error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
