"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const FAQS = [
  {
    q: "Bagaimana cara memesan tiket fastboat?",
    a: "Pilih rute keberangkatan dan tujuan, lalu klik 'Cari Tiket'. Pilih jadwal yang sesuai, isi data penumpang, dan konfirmasi pesanan. Tim kami akan menghubungi kamu via WhatsApp untuk instruksi pembayaran.",
  },
  {
    q: "Berapa lama konfirmasi booking setelah memesan?",
    a: "Tim kami akan menghubungi kamu via WhatsApp dalam 15–30 menit setelah pemesanan. Pastikan nomor WhatsApp yang kamu masukkan aktif.",
  },
  {
    q: "Metode pembayaran apa yang tersedia?",
    a: "Saat ini kami mendukung transfer bank, kartu kredit/debit, dan e-wallet (GoPay, OVO, Dana). Untuk wisatawan mancanegara, tersedia pembayaran via kartu internasional.",
  },
  {
    q: "Bisakah saya membatalkan atau mengubah jadwal?",
    a: "Pembatalan atau perubahan jadwal bisa dilakukan minimal 24 jam sebelum keberangkatan. Hubungi kami via WhatsApp dengan menyertakan kode booking kamu.",
  },
  {
    q: "Apakah ada biaya bagasi?",
    a: "Setiap penumpang mendapat jatah bagasi gratis 15 kg. Kelebihan bagasi dikenakan biaya sesuai kebijakan masing-masing operator.",
  },
  {
    q: "Bagaimana jika kapal dibatalkan karena cuaca buruk?",
    a: "Jika perjalanan dibatalkan oleh operator karena kondisi cuaca atau keadaan darurat, kamu akan mendapatkan refund penuh atau penjadwalan ulang tanpa biaya tambahan.",
  },
  {
    q: "Apakah tiket bisa digunakan untuk penumpang anak-anak?",
    a: "Anak usia di bawah 2 tahun biasanya gratis (duduk di pangkuan orang tua). Anak usia 2–12 tahun dikenakan 50–75% dari harga tiket dewasa tergantung operator.",
  },
  {
    q: "Di mana saya bisa melihat e-tiket setelah booking?",
    a: "E-tiket akan dikirimkan ke alamat email yang kamu daftarkan. Cek juga folder spam jika tidak muncul di inbox. Kamu juga bisa request ulang via WhatsApp dengan kode booking.",
  },
];

const CONTACTS = [
  { icon: "💬", label: "WhatsApp", value: "+62 812 3456 7890", link: "https://wa.me/6281234567890", color: "#dcfce7", textColor: "#15803d" },
  { icon: "📧", label: "Email", value: "hello@taptogo.id", link: "mailto:hello@taptogo.id", color: "#e0f2fe", textColor: "#0369a1" },
  { icon: "📍", label: "Kantor", value: "Jl. Raya Seminyak, Bali", link: "#", color: "#fff7ed", textColor: "#ea580c" },
];

export default function BantuanPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />

      {/* Hero */}
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold mb-4 hover:opacity-80"
            style={{ color: "#bae6fd" }}>← Beranda</Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">Pusat Bantuan</h1>
          <p style={{ color: "#bae6fd" }}>Ada pertanyaan? Kami siap membantu 24/7</p>
        </div>
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {CONTACTS.map(c => (
            <a key={c.label} href={c.link} target="_blank" rel="noreferrer"
              className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: c.color, border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
              <span className="text-3xl">{c.icon}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: "#94a3b8" }}>{c.label}</p>
                <p className="text-sm font-bold" style={{ color: c.textColor }}>{c.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold mb-6" style={{ color: "#0c4a6e" }}>
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
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
          <h3 className="text-xl font-extrabold mb-2" style={{ color: "#0c4a6e" }}>Masih butuh bantuan?</h3>
          <p className="text-sm mb-6" style={{ color: "#64748b" }}>
            Tim support kami siap menjawab pertanyaanmu via WhatsApp setiap hari pukul 07.00–22.00 WITA.
          </p>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-extrabold text-white btn-ocean transition-all hover:scale-105">
            💬 Chat WhatsApp Sekarang
          </a>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#94a3b8" }}>
          tapToGo · Layanan pelanggan 07.00–22.00 WITA
        </p>
      </div>
    </div>
  );
}
