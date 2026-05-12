export default function CtaBanner() {
  return (
    <section id="promo" className="py-20 px-4 sm:px-6" style={{ background: "linear-gradient(160deg,#0c4a6e 0%,#0369a1 50%,#0284c7 100%)" }}>
      <div className="max-w-4xl mx-auto text-center relative overflow-hidden">
        {/* Wave decoration */}
        <svg viewBox="0 0 400 60" className="absolute top-0 left-0 w-full opacity-10">
          <path d="M0,30 Q100,10 200,30 Q300,50 400,30 L400,60 L0,60Z" fill="white"/>
        </svg>

        <div className="relative z-10">
          <div className="text-6xl mb-5">🏄‍♂️</div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Siap Menjelajah Laut?
          </h2>
          <p className="text-lg mb-8" style={{ color: "#bae6fd" }}>
            Daftar sekarang dan nikmati{" "}
            <span className="text-white font-extrabold">diskon 10%</span>{" "}
            untuk pemesanan tiket pertamamu!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-8 py-4 rounded-2xl text-base font-extrabold transition-all hover:scale-105 hover:shadow-xl"
              style={{ background: "white", color: "#0369a1", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
              🎟️ Pesan Tiket Sekarang
            </button>
            <button className="px-8 py-4 rounded-2xl text-base font-semibold border-2 transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.5)", color: "white" }}>
              Lihat Semua Rute
            </button>
          </div>
          <p className="mt-5 text-sm" style={{ color: "#bae6fd", opacity: 0.8 }}>
            Gratis daftar · Tidak ada biaya tersembunyi · Batalkan kapan saja
          </p>
        </div>

        {/* Boat illustration */}
        <div className="absolute -right-10 -bottom-4 opacity-10 pointer-events-none w-64">
          <svg viewBox="0 0 220 120" fill="none"><path d="M20 90 Q25 104 55 106 L170 106 Q200 104 204 90 L195 74 L25 74 Z" fill="white"/><rect x="40" y="50" width="140" height="26" rx="4" fill="white"/><rect x="70" y="28" width="80" height="24" rx="4" fill="white"/></svg>
        </div>
      </div>
    </section>
  );
}
