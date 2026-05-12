"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SCHEDULES } from "@/data/boats";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function BookingContent() {
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
    idNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!schedule) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#f0f9ff" }}>
        <div className="text-5xl mb-4">⚠️</div>
        <p className="font-bold text-lg mb-2" style={{ color: "#0c4a6e" }}>Jadwal tidak ditemukan</p>
        <Link href="/jadwal" className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold text-white btn-ocean">
          ← Kembali ke Jadwal
        </Link>
      </div>
    );
  }

  const totalPrice = schedule.price * passengers;
  const orderCode = `TG-${Date.now().toString(36).toUpperCase()}`;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Email tidak valid";
    if (!form.whatsapp.trim()) e.whatsapp = "Nomor WhatsApp wajib diisi";
    if (!form.nationality.trim()) e.nationality = "Kewarganegaraan wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setStep("confirm");
  };

  const handleConfirm = () => {
    setStep("done");
  };

  // ── DONE ──
  if (step === "done") {
    return (
      <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
        <Navbar />
        <div className="pt-24 pb-16 flex flex-col items-center px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 8px 40px rgba(2,132,199,0.1)" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ background: "#dcfce7" }}>✓</div>
            <h2 className="text-2xl font-extrabold mb-1" style={{ color: "#0c4a6e" }}>Booking Berhasil!</h2>
            <p className="text-sm mb-6" style={{ color: "#64748b" }}>Cek email kamu untuk e-tiket dan instruksi pembayaran.</p>

            <div className="rounded-2xl p-4 mb-6 text-left" style={{ background: "#f0f9ff" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#94a3b8" }}>Detail Booking</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#64748b" }}>Kode Booking</span>
                  <span className="text-sm font-extrabold" style={{ color: "#0369a1" }}>{orderCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#64748b" }}>Rute</span>
                  <span className="text-sm font-semibold" style={{ color: "#334155" }}>{schedule.from} → {schedule.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#64748b" }}>Tanggal</span>
                  <span className="text-sm font-semibold" style={{ color: "#334155" }}>{date || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#64748b" }}>Keberangkatan</span>
                  <span className="text-sm font-semibold" style={{ color: "#334155" }}>{schedule.departureTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#64748b" }}>Penumpang</span>
                  <span className="text-sm font-semibold" style={{ color: "#334155" }}>{passengers} pax</span>
                </div>
                <div className="flex justify-between pt-2" style={{ borderTop: "1px solid #e0f2fe" }}>
                  <span className="text-sm font-bold" style={{ color: "#0c4a6e" }}>Total</span>
                  <span className="text-base font-extrabold" style={{ color: "#0369a1" }}>Rp {totalPrice}K</span>
                </div>
              </div>
            </div>

            <p className="text-xs mb-6" style={{ color: "#64748b" }}>
              Tim kami akan menghubungi kamu via WhatsApp ke <strong>{form.whatsapp}</strong> dalam 15 menit.
            </p>

            <Link href="/" className="block w-full py-3 rounded-2xl text-sm font-extrabold text-white btn-ocean text-center">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── CONFIRM ──
  if (step === "confirm") {
    return (
      <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
        <Navbar />
        <div className="pt-24 pb-16 max-w-2xl mx-auto px-4">
          <Link href="/jadwal" className="inline-flex items-center gap-1 text-sm font-semibold mb-6"
            style={{ color: "#0369a1" }}>← Kembali</Link>
          <h1 className="text-2xl font-extrabold mb-6" style={{ color: "#0c4a6e" }}>Konfirmasi Booking</h1>

          {/* Schedule summary */}
          <div className="bg-white rounded-2xl p-5 mb-4"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold text-white"
                style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>{schedule.logo}</div>
              <div>
                <p className="font-bold" style={{ color: "#0c4a6e" }}>{schedule.operator}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>{schedule.boatType}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Dari", value: schedule.from },
                { label: "Ke", value: schedule.to },
                { label: "Jam", value: schedule.departureTime },
                { label: "Durasi", value: schedule.duration },
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
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#94a3b8" }}>Data Penumpang</p>
            <div className="space-y-2">
              {[
                { label: "Nama", value: form.name },
                { label: "Email", value: form.email },
                { label: "WhatsApp", value: form.whatsapp },
                { label: "Kewarganegaraan", value: form.nationality },
                { label: "No. Paspor / KTP", value: form.idNumber || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5"
                  style={{ borderBottom: "1px solid #f0f9ff" }}>
                  <span className="text-sm" style={{ color: "#64748b" }}>{label}</span>
                  <span className="text-sm font-semibold" style={{ color: "#334155" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="bg-white rounded-2xl p-5 mb-6"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm" style={{ color: "#64748b" }}>Harga tiket</span>
              <span className="text-sm font-semibold" style={{ color: "#334155" }}>Rp {schedule.price}K × {passengers}</span>
            </div>
            <div className="flex justify-between items-center pt-3" style={{ borderTop: "1.5px solid #e0f2fe" }}>
              <span className="font-bold" style={{ color: "#0c4a6e" }}>Total Pembayaran</span>
              <span className="text-2xl font-extrabold" style={{ color: "#0369a1" }}>Rp {totalPrice}K</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("form")}
              className="flex-1 py-3.5 rounded-2xl text-sm font-bold border-2 transition-all"
              style={{ borderColor: "#e0f2fe", color: "#64748b" }}>
              ← Edit Data
            </button>
            <button onClick={handleConfirm}
              className="flex-[2] py-3.5 rounded-2xl text-sm font-extrabold text-white btn-ocean transition-all hover:scale-[1.02]">
              ✓ Konfirmasi & Pesan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── FORM ──
  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />

      {/* Hero */}
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/jadwal" className="inline-flex items-center gap-1 text-sm font-semibold mb-4 hover:opacity-80"
            style={{ color: "#bae6fd" }}>← Kembali ke Jadwal</Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Isi Data Penumpang</h1>
          <p style={{ color: "#bae6fd" }}>Pastikan data sesuai dengan dokumen perjalanan</p>
        </div>
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

          {/* Form */}
          <div className="bg-white rounded-2xl p-6"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <p className="text-sm font-bold uppercase tracking-wide mb-5" style={{ color: "#0369a1" }}>
              Data Penumpang Utama
            </p>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                  Nama Lengkap <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Sesuai paspor / KTP"
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-all"
                  style={{ background: "#f8fafc", border: `1.5px solid ${errors.name ? "#fca5a5" : "#e2e8f0"}`, color: "#334155" }}
                  onFocus={e => e.target.style.borderColor = "#38bdf8"}
                  onBlur={e => e.target.style.borderColor = errors.name ? "#fca5a5" : "#e2e8f0"} />
                {errors.name && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                  Email <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="email@contoh.com"
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-all"
                  style={{ background: "#f8fafc", border: `1.5px solid ${errors.email ? "#fca5a5" : "#e2e8f0"}`, color: "#334155" }}
                  onFocus={e => e.target.style.borderColor = "#38bdf8"}
                  onBlur={e => e.target.style.borderColor = errors.email ? "#fca5a5" : "#e2e8f0"} />
                {errors.email && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.email}</p>}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                  Nomor WhatsApp <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input type="tel" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="+62 812 xxxx xxxx"
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-all"
                  style={{ background: "#f8fafc", border: `1.5px solid ${errors.whatsapp ? "#fca5a5" : "#e2e8f0"}`, color: "#334155" }}
                  onFocus={e => e.target.style.borderColor = "#38bdf8"}
                  onBlur={e => e.target.style.borderColor = errors.whatsapp ? "#fca5a5" : "#e2e8f0"} />
                {errors.whatsapp && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.whatsapp}</p>}
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                  Kewarganegaraan <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })}
                  placeholder="Indonesia / Australia / dll"
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-all"
                  style={{ background: "#f8fafc", border: `1.5px solid ${errors.nationality ? "#fca5a5" : "#e2e8f0"}`, color: "#334155" }}
                  onFocus={e => e.target.style.borderColor = "#38bdf8"}
                  onBlur={e => e.target.style.borderColor = errors.nationality ? "#fca5a5" : "#e2e8f0"} />
                {errors.nationality && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.nationality}</p>}
              </div>

              {/* ID Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#64748b" }}>
                  No. Paspor / KTP
                </label>
                <input value={form.idNumber} onChange={e => setForm({ ...form, idNumber: e.target.value })}
                  placeholder="Opsional"
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-all"
                  style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#334155" }}
                  onFocus={e => e.target.style.borderColor = "#38bdf8"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
            </div>

            <button onClick={handleSubmit}
              className="mt-6 w-full py-4 rounded-2xl text-white text-sm font-extrabold btn-ocean transition-all hover:scale-[1.01]">
              Lanjut ke Konfirmasi →
            </button>
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5"
              style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: "#94a3b8" }}>Ringkasan Pesanan</p>

              {/* Operator */}
              <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid #f0f9ff" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>{schedule.logo}</div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#0c4a6e" }}>{schedule.operator}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>{schedule.boatType}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: "📍", label: "Dari", value: schedule.from },
                  { icon: "🏁", label: "Ke", value: schedule.to },
                  { icon: "🕐", label: "Berangkat", value: schedule.departureTime },
                  { icon: "⏱️", label: "Durasi", value: schedule.duration },
                  { icon: "📅", label: "Tanggal", value: date || "—" },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#94a3b8" }}>{icon} {label}</span>
                    <span className="text-xs font-semibold" style={{ color: "#334155" }}>{value}</span>
                  </div>
                ))}

                {/* Passengers — editable */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs" style={{ color: "#94a3b8" }}>👤 Penumpang</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPassengers(p => Math.max(1, p - 1))}
                      className="w-6 h-6 rounded-lg text-sm font-bold flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: "#eff6ff", color: "#0284c7" }}>−</button>
                    <span className="text-sm font-extrabold w-5 text-center" style={{ color: "#0369a1" }}>{passengers}</span>
                    <button
                      onClick={() => setPassengers(p => Math.min(schedule.availableSeats, p + 1))}
                      className="w-6 h-6 rounded-lg text-sm font-bold flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: "#eff6ff", color: "#0284c7" }}>+</button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 flex justify-between items-center" style={{ borderTop: "1.5px solid #e0f2fe" }}>
                <span className="text-sm font-bold" style={{ color: "#0c4a6e" }}>Total</span>
                <span className="text-xl font-extrabold" style={{ color: "#0369a1" }}>Rp {totalPrice}K</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-5"
              style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#94a3b8" }}>Fasilitas</p>
              <div className="flex flex-wrap gap-1.5">
                {schedule.amenities.map(a => (
                  <span key={a} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                    style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f9ff" }}>
      <p style={{ color: "#0369a1" }}>Memuat...</p>
    </div>}>
      <BookingContent />
    </Suspense>
  );
}
