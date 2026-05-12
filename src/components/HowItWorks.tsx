const STEPS = [
  { n: "01", icon: "🔍", title: "Cari Rute", desc: "Pilih pelabuhan asal & tujuan, tanggal, dan jumlah penumpang.", color: "#f0f9ff", border: "#bbf7d0", num: "#0369a1" },
  { n: "02", icon: "⛵", title: "Pilih Fastboat", desc: "Bandingkan harga, jadwal, fasilitas & rating operator resmi.", color: "#f0fdfa", border: "#bae6fd", num: "#0284c7" },
  { n: "03", icon: "💳", title: "Bayar Aman", desc: "Bayar via kartu, transfer, atau e-wallet. Semua terenkripsi.", color: "#fff7ed", border: "#fed7aa", num: "#ea580c" },
  { n: "04", icon: "🎟️", title: "E-Tiket Siap", desc: "E-tiket langsung ke email. Tunjukkan QR saat boarding!", color: "#fdf4ff", border: "#e9d5ff", num: "#7c3aed" },
];

export default function HowItWorks() {
  return (
    <section id="cara-pesan" className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#f0f9ff", color: "#0369a1" }}>
            ✨ Cara Pesan
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color: "#0c4a6e" }}>
            4 Langkah{" "}
            <span style={{ background: "linear-gradient(135deg,#0284c7,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Menuju Laut
            </span>
          </h2>
          <p style={{ color: "#64748b", maxWidth: 480, margin: "0 auto" }}>
            Dari cari tiket hingga boarding — semua selesai dalam hitungan menit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5"
            style={{ background: "linear-gradient(90deg,#bbf7d0,#bae6fd,#fed7aa,#e9d5ff)" }} />

          {STEPS.map((s, i) => (
            <div key={i} className="relative rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ background: s.color, border: `1.5px solid ${s.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-extrabold mb-4 relative z-10"
                style={{ background: "white", color: s.num, border: `2px solid ${s.border}`, boxShadow: `0 4px 12px ${s.border}` }}>
                {s.n}
              </div>
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="text-lg font-extrabold mb-2" style={{ color: "#0c4a6e" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
