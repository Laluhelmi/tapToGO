"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { VEHICLES } from "@/data/vehicles";
import { useLang } from "@/contexts/LanguageContext";
import Spinner from "@/components/Spinner";
import { getTodayString } from "@/lib/utils";
import { COUNTRIES, TOP_COUNTRY_CODES } from "@/data/countries";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return false;
  if (digits.startsWith("62")) {
    if (digits.length < 10 || digits.length > 13) return false;
    if (!digits.startsWith("628")) return false;
  } else if (digits.startsWith("0")) {
    if (digits.length < 10 || digits.length > 13) return false;
    if (!digits.startsWith("08")) return false;
  }
  if (/(\d)\1{4,}/.test(digits)) return false;
  for (let i = 0; i <= digits.length - 6; i++) {
    const s = digits.slice(i, i + 6);
    let asc = true, desc = true;
    for (let j = 1; j < s.length; j++) {
      if (+s[j] !== +s[j - 1] + 1) asc = false;
      if (+s[j] !== +s[j - 1] - 1) desc = false;
    }
    if (asc || desc) return false;
  }
  return true;
}

function formatWhatsApp(value: string) {
  let v = value.replace(/[^\d+]/g, "");
  if (v.startsWith("08")) v = "+62" + v.slice(1);
  if (!v.startsWith("+") && v.length > 0) v = "+" + v;
  const match = v.match(/^(\+\d{1,3})(\d{0,4})(\d{0,4})(\d{0,4})$/);
  if (match) return [match[1], match[2], match[3], match[4]].filter(Boolean).join(" ");
  return v;
}

function formatRupiah(thousands: number) {
  return "Rp " + (thousands * 1000).toLocaleString("id-ID");
}

function formatDate(iso: string, lang: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

type Step = "form" | "confirm" | "done";

function RentalBookingInner() {
  const sp = useSearchParams();
  const { t, lang } = useLang();

  const vehicleId = sp.get("vehicle") || "";
  const vehicle = useMemo(() => VEHICLES.find(v => v.id === vehicleId), [vehicleId]);

  const today = useMemo(() => getTodayString(), []);
  const [step, setStep] = useState<Step>("form");
  const [startDate, setStartDate] = useState(sp.get("start") || today);
  const [duration, setDuration] = useState(Number(sp.get("duration") || "1"));
  const [quantity, setQuantity] = useState(Number(sp.get("quantity") || "1"));

  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    nationality: "Indonesia",
    licenseType: "SIM C / International Driving Permit",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderCode] = useState(() => `RT-${Date.now().toString(36).toUpperCase()}`);
  const [issuedAt] = useState(() => new Date());
  const [isConfirming, setIsConfirming] = useState(false);

  const setField = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validName = form.name.trim().length >= 2;
  const validEmail = EMAIL_RE.test(form.email);
  const validWa = isValidPhone(form.whatsapp);
  const validNat = form.nationality.trim().length > 0;
  const isFormValid = validName && validEmail && validWa && validNat;

  const subtotal = vehicle ? vehicle.pricePerDay * duration * quantity : 0;

  const handleConfirmStep = () => {
    const e: Record<string, string> = {};
    if (!validName) e.name = lang === "id" ? "Nama minimal 2 karakter" : "Name min. 2 characters";
    if (!validEmail) e.email = lang === "id" ? "Email tidak valid" : "Invalid email";
    if (!validWa) e.whatsapp = lang === "id" ? "Nomor telepon tidak valid (contoh: +62 812 3456 7890)" : "Invalid phone (e.g. +62 812 3456 7890)";
    if (!validNat) e.nationality = lang === "id" ? "Kewarganegaraan wajib diisi" : "Nationality required";
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setStep("confirm");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleConfirm = () => {
    if (isConfirming || !vehicle) return;
    setIsConfirming(true);
    setTimeout(() => {
      setStep("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsConfirming(false);
    }, 400);

    // Notify admin via email
    if (!vehicle) return;
    fetch("/api/booking-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingType: "rental",
        bookingCode: orderCode,
        passenger: {
          name: form.name,
          email: form.email,
          phone: form.whatsapp,
          nationality: form.nationality,
        },
        rental: {
          vehicle: `${vehicle.brand} ${vehicle.name} (${vehicle.cc}cc)`,
          pickupLocation: vehicle.locations[0] || "Bangsal",
          startDate,
          durationDays: duration,
          quantity,
          pricePerDay: vehicle.pricePerDay,
          licenseType: form.licenseType,
        },
        grandTotal: subtotal,
        note: form.note || "",
      }),
    }).catch(err => console.warn("Rental notify failed:", err));
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#f0f9ff" }}>
        <div className="text-center max-w-md">
          <p className="text-xl font-bold mb-2" style={{ color: "#0c4a6e" }}>
            {lang === "id" ? "Kendaraan tidak ditemukan" : "Vehicle not found"}
          </p>
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>
            {lang === "id" ? "Pilih kendaraan dari halaman rental." : "Choose a vehicle from the rental page."}
          </p>
          <Link href="/rental" className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold text-white btn-ocean">
            ← {lang === "id" ? "Kembali ke Rental" : "Back to Rental"}
          </Link>
        </div>
      </div>
    );
  }

  const stepIndex: 0 | 1 | 2 = step === "form" ? 0 : step === "confirm" ? 1 : 2;

  const Stepper = () => {
    const steps = lang === "id"
      ? ["Data", "Konfirmasi", "Selesai"]
      : ["Details", "Confirm", "Done"];
    return (
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
        {steps.map((label, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <div key={label} className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300"
                  style={
                    done ? { background: "#22c55e", color: "white" }
                    : active ? { background: "white", color: "#0369a1", boxShadow: "0 0 0 4px rgba(255,255,255,0.35)", transform: "scale(1.1)" }
                    : { background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.7)" }
                  }>
                  {done ? "✓" : i + 1}
                </div>
                <span className="text-xs sm:text-sm font-bold hidden sm:inline"
                  style={{ color: active || done ? "white" : "rgba(255,255,255,0.6)" }}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="relative w-6 sm:w-12 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                  <div className="absolute inset-0 rounded-full transition-all duration-500"
                    style={{ background: "#22c55e", width: done ? "100%" : active ? "50%" : "0%" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ── DONE ──
  if (step === "done") {
    return (
      <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
        <Navbar />
        <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
            <Stepper />
          </div>
          <div style={{ lineHeight: 0 }}>
            <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
              <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
            </svg>
          </div>
        </div>

        <div className="py-6 px-4 max-w-3xl mx-auto pb-32">
          <div className="bg-white rounded-3xl overflow-hidden mb-4"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 4px 20px rgba(2,132,199,0.1)" }}>

            <div className="px-6 py-5 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#bae6fd" }}>
                  {lang === "id" ? "Booking Rental" : "Rental Booking"}
                </p>
                <p className="text-white font-extrabold text-lg leading-tight">tapToGo</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#bae6fd" }}>
                  {lang === "id" ? "Kode Booking" : "Booking Code"}
                </p>
                <p className="text-white font-extrabold text-xl tabular-nums leading-tight">{orderCode}</p>
              </div>
            </div>

            <div className="px-6 py-6" style={{ background: "linear-gradient(180deg,#f0f9ff,#e0f2fe)" }}>
              <div className="flex items-center gap-4">
                <img src={vehicle.image} alt={vehicle.name} className="w-24 h-24 rounded-2xl object-cover"
                  style={{ border: "1.5px solid #bae6fd" }} />
                <div>
                  <p className="text-xs font-bold uppercase" style={{ color: "#0369a1" }}>{vehicle.brand}</p>
                  <p className="text-xl font-extrabold" style={{ color: "#0c4a6e" }}>{vehicle.name}</p>
                  <p className="text-xs" style={{ color: "#64748b" }}>{vehicle.cc}cc · {quantity} unit · {duration} {lang === "id" ? "hari" : "days"}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#94a3b8" }}>
                    {lang === "id" ? "Penyewa" : "Renter"}
                  </p>
                  <p className="font-bold" style={{ color: "#0c4a6e" }}>{form.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#94a3b8" }}>
                    {lang === "id" ? "Pickup" : "Pickup Location"}
                  </p>
                  <p className="font-bold" style={{ color: "#0c4a6e" }}>{vehicle.locations[0] || "Bangsal"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#94a3b8" }}>
                    {lang === "id" ? "Tanggal Mulai" : "Start Date"}
                  </p>
                  <p className="font-bold" style={{ color: "#0c4a6e" }}>{formatDate(startDate, lang)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#94a3b8" }}>
                    {lang === "id" ? "Total" : "Total"}
                  </p>
                  <p className="font-extrabold text-lg" style={{ color: "#0369a1" }}>{formatRupiah(subtotal)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team will contact you */}
          <div className="mt-5 rounded-2xl p-5 text-center"
            style={{ background: "#ecfdf5", border: "1.5px solid #a7f3d0" }}>
            <div className="flex justify-center mb-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <p className="text-sm font-extrabold mb-1" style={{ color: "#065f46" }}>
              {lang === "id" ? "Booking diterima — tim kami akan menghubungi Anda" : "Booking received — our team will contact you"}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#047857" }}>
              {lang === "id"
                ? "Tim kami akan menghubungi Anda via WhatsApp dalam 15 menit (07:00–22:00 WITA) untuk konfirmasi ketersediaan, deposit, dan detail pickup. Pastikan nomor telepon Anda aktif."
                : "Our team will reach out via WhatsApp within 15 minutes (07:00–22:00 WITA) to confirm availability, deposit, and pickup details. Please keep your phone reachable."}
            </p>
          </div>

          <Link href="/" className="mt-4 max-w-md mx-auto block w-full py-3 rounded-2xl text-sm font-extrabold text-center transition-all hover:scale-[1.01]"
            style={{ background: "#f0f9ff", color: "#0369a1", border: "1.5px solid #bae6fd" }}>
            {lang === "id" ? "Kembali ke Home" : "Back to Home"}
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
            <Stepper />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-1">
              {lang === "id" ? "Konfirmasi Booking" : "Booking Confirmation"}
            </h1>
            <p className="text-center text-sm" style={{ color: "#e0f2fe" }}>
              {vehicle.brand} {vehicle.name} · {duration} {lang === "id" ? "hari" : "days"} · {quantity} unit
            </p>
          </div>
          <div style={{ lineHeight: 0 }}>
            <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
              <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
            </svg>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-32">
          <div className="bg-white rounded-2xl p-5 mb-4"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <div className="flex items-center gap-3 mb-4">
              <img src={vehicle.image} alt={vehicle.name} className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <p className="font-bold" style={{ color: "#0c4a6e" }}>{vehicle.brand} {vehicle.name}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>{vehicle.cc}cc Matic</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: lang === "id" ? "Pickup" : "Pickup", value: vehicle.locations[0] || "Bangsal" },
                { label: lang === "id" ? "Mulai" : "Start", value: formatDate(startDate, lang).split(",")[1]?.trim() || startDate },
                { label: lang === "id" ? "Durasi" : "Duration", value: `${duration} ${lang === "id" ? "hari" : "days"}` },
                { label: lang === "id" ? "Jumlah" : "Quantity", value: `${quantity} unit` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl p-3" style={{ background: "#f0f9ff" }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: "#94a3b8" }}>{label}</p>
                  <p className="text-sm font-bold" style={{ color: "#0c4a6e" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Renter summary */}
          <div className="bg-white rounded-2xl p-5 mb-4"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#94a3b8" }}>
              {lang === "id" ? "Data Penyewa" : "Renter Details"}
            </p>
            <div className="space-y-2">
              {[
                { label: lang === "id" ? "Nama" : "Name", value: form.name },
                { label: lang === "id" ? "Email" : "Email", value: form.email },
                { label: lang === "id" ? "No. Telepon" : "Phone", value: form.whatsapp },
                { label: lang === "id" ? "Kewarganegaraan" : "Nationality", value: form.nationality },
                { label: lang === "id" ? "SIM" : "License", value: form.licenseType },
                ...(form.note ? [{ label: lang === "id" ? "Catatan" : "Note", value: form.note }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-3 py-1.5"
                  style={{ borderBottom: "1px solid #f0f9ff" }}>
                  <span className="text-sm shrink-0" style={{ color: "#64748b" }}>{label}</span>
                  <span className="text-sm font-semibold text-right" style={{ color: "#334155", whiteSpace: "pre-wrap" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-white rounded-2xl p-5 mb-4"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm" style={{ color: "#64748b" }}>
                {lang === "id" ? "Harga per hari" : "Price per day"}
              </span>
              <span className="text-sm font-semibold" style={{ color: "#334155" }}>
                {formatRupiah(vehicle.pricePerDay)} × {duration} × {quantity}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3" style={{ borderTop: "1.5px solid #e0f2fe" }}>
              <span className="font-bold" style={{ color: "#0c4a6e" }}>
                {lang === "id" ? "Total" : "Total"}
              </span>
              <span className="text-2xl font-extrabold" style={{ color: "#0369a1" }}>{formatRupiah(subtotal)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("form")}
              className="flex-1 py-3.5 rounded-2xl text-sm font-bold border-2 transition-all"
              style={{ borderColor: "#e0f2fe", color: "#64748b" }}>
              ← {lang === "id" ? "Edit Data" : "Edit Details"}
            </button>
            <button onClick={handleConfirm} disabled={isConfirming}
              className="flex-[2] py-3.5 rounded-2xl text-sm font-extrabold text-white btn-ocean transition-all hover:scale-[1.02] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2">
              {isConfirming ? (
                <><Spinner size={16} color="white" /> {lang === "id" ? "Memproses…" : "Processing…"}</>
              ) : (
                <>✓ {lang === "id" ? "Konfirmasi & Booking" : "Confirm & Book"}</>
              )}
            </button>
          </div>

          <p className="mt-3 text-center text-[11px]" style={{ color: "#64748b" }}>
            {lang === "id" ? (
              <>Dengan melanjutkan, kamu menyetujui{" "}
                <Link href="/terms" className="font-bold" style={{ color: "#0369a1" }}>Syarat & Ketentuan</Link>,{" "}
                <Link href="/privacy" className="font-bold" style={{ color: "#0369a1" }}>Privasi</Link>, dan{" "}
                <Link href="/refund" className="font-bold" style={{ color: "#0369a1" }}>Refund Policy</Link>.
              </>
            ) : (
              <>By continuing you agree to tapToGo&apos;s{" "}
                <Link href="/terms" className="font-bold" style={{ color: "#0369a1" }}>Terms</Link>,{" "}
                <Link href="/privacy" className="font-bold" style={{ color: "#0369a1" }}>Privacy</Link>, and{" "}
                <Link href="/refund" className="font-bold" style={{ color: "#0369a1" }}>Refund Policy</Link>.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  // ── FORM (default) ──
  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/rental" className="inline-flex items-center gap-1 text-sm font-semibold mb-4 hover:opacity-80" style={{ color: "#bae6fd" }}>
            ← {lang === "id" ? "Kembali ke Rental" : "Back to Rental"}
          </Link>
          <Stepper />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-1">
            {lang === "id" ? "Data Penyewa" : "Renter Details"}
          </h1>
          <p className="text-center text-sm" style={{ color: "#e0f2fe" }}>
            {vehicle.brand} {vehicle.name} ({vehicle.cc}cc)
          </p>
        </div>
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-32">
        {/* Vehicle preview */}
        <div className="bg-white rounded-2xl p-4 mb-4 flex items-center gap-3"
          style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
          <img src={vehicle.image} alt={vehicle.name} className="w-20 h-20 rounded-xl object-cover" />
          <div className="flex-1">
            <p className="font-bold" style={{ color: "#0c4a6e" }}>{vehicle.brand} {vehicle.name}</p>
            <p className="text-xs" style={{ color: "#64748b" }}>{vehicle.cc}cc · {lang === "id" ? "Pickup" : "Pickup"}: {vehicle.locations[0] || "Bangsal"}</p>
            <p className="text-sm font-bold mt-1" style={{ color: "#0369a1" }}>{formatRupiah(vehicle.pricePerDay)} / {lang === "id" ? "hari" : "day"}</p>
          </div>
        </div>

        {/* Date + Duration + Quantity */}
        <div className="bg-white rounded-2xl p-5 mb-4"
          style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                {lang === "id" ? "Mulai" : "Start"}
              </label>
              <input type="date" value={startDate} min={today}
                onChange={e => { const v = e.target.value; if (v && v >= today) setStartDate(v); }}
                className="w-full h-12 px-2 rounded-xl text-xs font-bold"
                style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0369a1" }} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                {lang === "id" ? "Durasi" : "Duration"}
              </label>
              <div className="flex items-center gap-1 h-12 px-2 rounded-xl"
                style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
                <button onClick={() => setDuration(d => Math.max(1, d - 1))} className="w-7 h-7 rounded-lg font-bold"
                  style={{ background: "#eff6ff", color: "#0284c7" }}>−</button>
                <div className="flex-1 text-center">
                  <p className="text-sm font-extrabold leading-none" style={{ color: "#0369a1" }}>{duration}</p>
                  <p className="text-[9px]" style={{ color: "#94a3b8" }}>{lang === "id" ? "hari" : "days"}</p>
                </div>
                <button onClick={() => setDuration(d => Math.min(60, d + 1))} className="w-7 h-7 rounded-lg font-bold"
                  style={{ background: "#eff6ff", color: "#0284c7" }}>+</button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                {lang === "id" ? "Jumlah" : "Quantity"}
              </label>
              <div className="flex items-center gap-1 h-12 px-2 rounded-xl"
                style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-7 h-7 rounded-lg font-bold"
                  style={{ background: "#eff6ff", color: "#0284c7" }}>−</button>
                <div className="flex-1 text-center">
                  <p className="text-sm font-extrabold leading-none" style={{ color: "#0369a1" }}>{quantity}</p>
                  <p className="text-[9px]" style={{ color: "#94a3b8" }}>unit</p>
                </div>
                <button onClick={() => setQuantity(q => Math.min(vehicle.available, q + 1))} className="w-7 h-7 rounded-lg font-bold"
                  style={{ background: "#eff6ff", color: "#0284c7" }}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Renter form */}
        <div className="bg-white rounded-2xl p-5"
          style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
          <p className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#0369a1" }}>
            {lang === "id" ? "Data Penyewa" : "Renter Details"}
          </p>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                {lang === "id" ? "Nama Lengkap" : "Full Name"} <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input type="text" value={form.name}
                onChange={e => setField("name", e.target.value)}
                placeholder={lang === "id" ? "Sesuai paspor / KTP" : "As shown on passport / ID"}
                className="w-full h-12 px-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "#f8fafc",
                  border: `1.5px solid ${errors.name ? "#fca5a5" : validName && form.name ? "#86efac" : "#e2e8f0"}`,
                  color: "#0c4a6e",
                }} />
              {errors.name && <p className="text-xs mt-1 font-semibold" style={{ color: "#dc2626" }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                Email <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input type="email" value={form.email}
                onChange={e => setField("email", e.target.value)}
                placeholder="email@example.com"
                className="w-full h-12 px-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "#f8fafc",
                  border: `1.5px solid ${errors.email ? "#fca5a5" : validEmail && form.email ? "#86efac" : "#e2e8f0"}`,
                  color: "#0c4a6e",
                }} />
              {errors.email && <p className="text-xs mt-1 font-semibold" style={{ color: "#dc2626" }}>{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                {lang === "id" ? "Nomor Telepon" : "Phone Number"} <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input type="tel" value={form.whatsapp}
                onChange={e => setField("whatsapp", formatWhatsApp(e.target.value))}
                placeholder="+62 812 xxxx xxxx"
                className="w-full h-12 px-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "#f8fafc",
                  border: `1.5px solid ${errors.whatsapp ? "#fca5a5" : validWa && form.whatsapp ? "#86efac" : "#e2e8f0"}`,
                  color: "#0c4a6e",
                }} />
              {errors.whatsapp && <p className="text-xs mt-1 font-semibold" style={{ color: "#dc2626" }}>{errors.whatsapp}</p>}
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                {lang === "id" ? "Kewarganegaraan" : "Nationality"} <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <select value={form.nationality}
                onChange={e => setField("nationality", e.target.value)}
                className="w-full h-12 px-3 rounded-xl text-sm font-semibold"
                style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0c4a6e" }}>
                <optgroup label={lang === "id" ? "Populer" : "Popular"}>
                  {COUNTRIES.filter(c => TOP_COUNTRY_CODES.has(c.code)).map(c =>
                    <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                  )}
                </optgroup>
                <optgroup label={lang === "id" ? "Semua negara" : "All countries"}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
                </optgroup>
              </select>
            </div>

            {/* License */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                {lang === "id" ? "Jenis SIM / License" : "License Type"}
              </label>
              <select value={form.licenseType}
                onChange={e => setField("licenseType", e.target.value)}
                className="w-full h-12 px-3 rounded-xl text-sm font-semibold"
                style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0c4a6e" }}>
                <option>SIM C / International Driving Permit</option>
                <option>SIM C (Indonesian)</option>
                <option>International Driving Permit (IDP)</option>
                <option>{lang === "id" ? "Lainnya" : "Other"}</option>
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                {lang === "id" ? "Catatan Tambahan" : "Additional Note"} <span className="ml-1 font-normal lowercase tracking-normal" style={{ color: "#94a3b8" }}>{lang === "id" ? "opsional" : "optional"}</span>
              </label>
              <textarea value={form.note}
                onChange={e => setField("note", e.target.value)}
                rows={3}
                placeholder={lang === "id" ? "Permintaan khusus (helm extra, jam pickup, dll)" : "Special requests (extra helmet, pickup time, etc)"}
                className="w-full p-3 rounded-xl text-sm font-semibold resize-none"
                style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#0c4a6e" }} />
            </div>
          </div>
        </div>

        {/* Total + CTA */}
        <div className="fixed bottom-0 left-0 right-0 px-4 py-3 backdrop-blur"
          style={{ background: "rgba(255,255,255,0.95)", borderTop: "1px solid #e0f2fe" }}>
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <div>
              <p className="text-xs" style={{ color: "#94a3b8" }}>
                {formatRupiah(vehicle.pricePerDay)} × {duration} × {quantity}
              </p>
              <p className="text-xl font-extrabold" style={{ color: "#0369a1" }}>{formatRupiah(subtotal)}</p>
            </div>
            <button onClick={handleConfirmStep}
              className="px-6 py-3 rounded-xl text-white text-sm font-extrabold btn-ocean transition-all hover:scale-[1.02] disabled:opacity-50"
              disabled={!isFormValid}>
              {lang === "id" ? "Lanjut →" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RentalBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f9ff" }}><Spinner size={32} color="#0369a1" /></div>}>
      <RentalBookingInner />
    </Suspense>
  );
}
