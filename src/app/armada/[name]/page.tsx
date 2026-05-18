"use client";
import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SCHEDULES, OPERATOR_GALLERY } from "@/data/boats";
import Navbar from "@/components/Navbar";
import { useLang } from "@/contexts/LanguageContext";

export default function ArmadaDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const operatorName = decodeURIComponent(name);
  const router = useRouter();
  const { t } = useLang();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const gallery = OPERATOR_GALLERY[operatorName] ?? [];
  const goPrev = () => setCarouselIdx(i => (i - 1 + gallery.length) % gallery.length);
  const goNext = () => setCarouselIdx(i => (i + 1) % gallery.length);

  const schedules = useMemo(
    () => SCHEDULES.filter(s => s.operator === operatorName),
    [operatorName]
  );

  if (schedules.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
        <Navbar />
        <div className="pt-24 max-w-2xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🚢</div>
          <h1 className="text-2xl font-extrabold mb-2" style={{ color: "#0c4a6e" }}>
            {t.armadaDetail.notFound}
          </h1>
          <p className="text-sm mb-6" style={{ color: "#64748b" }}>{operatorName}</p>
          <Link href="/armada" className="inline-block px-6 py-3 rounded-xl font-bold text-white btn-ocean">
            {t.armadaDetail.backToList}
          </Link>
        </div>
      </div>
    );
  }

  const first = schedules[0];
  const destinations = Array.from(new Set(schedules.map(s => s.to)));
  const origins = Array.from(new Set(schedules.map(s => s.from)));
  const minPrice = Math.min(...schedules.map(s => s.price));
  const maxPrice = Math.max(...schedules.map(s => s.price));
  const avgRating = (schedules.reduce((a, s) => a + s.rating, 0) / schedules.length).toFixed(1);

  const goToBooking = (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    router.push(`/booking?id=${id}&date=${today}&passengers=1`);
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />

      {/* Hero with photo */}
      <div className="pt-16 relative" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          <Link href="/armada" className="inline-flex items-center gap-1 text-sm font-semibold mb-4 transition-opacity hover:opacity-80"
            style={{ color: "#bae6fd" }}>{t.armadaDetail.backArmada}</Link>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Photo */}
            <div className="w-full md:w-[360px] h-[220px] rounded-3xl overflow-hidden shrink-0 relative"
              style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}>
              <img src={first.image} alt={operatorName} className="w-full h-full object-cover" style={{ objectPosition: "center 70%" }} />
              <div className="absolute top-3 left-3 w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-extrabold text-white shadow-md"
                style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>
                {first.logo}
              </div>
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.95)", color: "#0369a1" }}>
                {t.armada.official}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-white">
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">{operatorName}</h1>
              <p className="mb-4" style={{ color: "#bae6fd" }}>{first.boatType}</p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-center sm:text-left">
                <div>
                  <p className="font-extrabold text-2xl">{schedules.length}</p>
                  <p style={{ color: "#bae6fd" }}>{t.armadaDetail.totalSchedules}</p>
                </div>
                <div className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.2)" }} />
                <div>
                  <p className="font-extrabold text-2xl">{destinations.length}</p>
                  <p style={{ color: "#bae6fd" }}>{t.armadaDetail.totalRoutes}</p>
                </div>
                <div className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.2)" }} />
                <div>
                  <p className="font-extrabold text-2xl">⭐ {avgRating}</p>
                  <p style={{ color: "#bae6fd" }}>{t.armadaDetail.operatorRating}</p>
                </div>
                <div className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.2)" }} />
                <div>
                  <p className="font-extrabold text-2xl">Rp {minPrice}K{maxPrice !== minPrice && <span className="text-sm font-bold" style={{ color: "#bae6fd" }}> – {maxPrice}K</span>}</p>
                  <p style={{ color: "#bae6fd" }}>{t.armadaDetail.priceRange}</p>
                </div>
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

      {/* Gallery section (only if operator has photos) */}
      {gallery.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-white rounded-2xl p-5"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold flex items-center gap-2" style={{ color: "#0c4a6e" }}>
                📸 {t.armadaDetail.gallery}
              </h2>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>
                {gallery.length} {t.armadaDetail.photoCount}
              </span>
            </div>
            {/* Main carousel image */}
            <div className="relative rounded-2xl overflow-hidden mb-3 mx-auto"
              style={{ background: "#0c4a6e", aspectRatio: "16/9", maxHeight: 480, maxWidth: 854 }}>
              <img src={gallery[carouselIdx]} alt={`${operatorName} ${carouselIdx + 1}`}
                onClick={() => setLightboxIdx(carouselIdx)}
                className="w-full h-full object-cover cursor-zoom-in transition-opacity duration-300" />

              {/* Prev/Next buttons */}
              {gallery.length > 1 && (
                <>
                  <button onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all hover:scale-110"
                    style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}>
                    ‹
                  </button>
                  <button onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all hover:scale-110"
                    style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}>
                    ›
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
                {carouselIdx + 1} / {gallery.length}
              </div>

              {/* Expand icon */}
              <button onClick={() => setLightboxIdx(carouselIdx)}
                className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm transition-all hover:scale-110"
                style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
                ⛶
              </button>
            </div>

            {/* Thumbnails strip */}
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 justify-center" style={{ scrollbarWidth: "thin" }}>
                {gallery.map((src, i) => (
                  <button key={src} onClick={() => setCarouselIdx(i)}
                    className="shrink-0 overflow-hidden rounded-lg transition-all"
                    style={{
                      width: 84, height: 56,
                      border: carouselIdx === i ? "2.5px solid #0284c7" : "2.5px solid transparent",
                      opacity: carouselIdx === i ? 1 : 0.6,
                    }}>
                    <img src={src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox modal */}
      {lightboxIdx !== null && gallery[lightboxIdx] && (
        <div onClick={() => setLightboxIdx(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          style={{ background: "rgba(0,0,0,0.85)" }}>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold"
            style={{ background: "rgba(255,255,255,0.15)" }}>✕</button>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + gallery.length) % gallery.length); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{ background: "rgba(255,255,255,0.15)" }}>‹</button>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % gallery.length); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{ background: "rgba(255,255,255,0.15)" }}>›</button>
          <img src={gallery[lightboxIdx]} alt={`${operatorName} ${lightboxIdx + 1}`}
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm font-bold text-white"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            {lightboxIdx + 1} / {gallery.length}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column: Overview, facilities, routes */}
        <div className="lg:col-span-1 flex flex-col gap-5">

          {/* Overview */}
          <div className="bg-white rounded-2xl p-5"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <h2 className="text-lg font-extrabold mb-2" style={{ color: "#0c4a6e" }}>
              {t.armadaDetail.overview}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
              {t.armadaDetail.overviewDesc}
            </p>
          </div>

{/* Routes served */}
          <div className="bg-white rounded-2xl p-5"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <h2 className="text-lg font-extrabold mb-4" style={{ color: "#0c4a6e" }}>
              {t.armadaDetail.routesServed}
            </h2>
            <div className="flex flex-col divide-y" style={{ borderColor: "#f0f9ff" }}>
              {origins.map((o, idx) => {
                const dests = Array.from(new Set(schedules.filter(s => s.from === o).map(s => s.to)));
                return (
                  <div key={o} className={`flex items-start gap-3 ${idx === 0 ? "pb-3" : "py-3"} ${idx === origins.length - 1 ? "pt-3 pb-0" : ""}`}
                    style={{ borderTop: idx === 0 ? "none" : "1px solid #f0f9ff" }}>
                    {/* Origin column */}
                    <div className="shrink-0 flex items-center gap-2 w-[120px]">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#0284c7" }} />
                      <span className="text-sm font-bold leading-tight" style={{ color: "#0c4a6e" }}>{o}</span>
                    </div>
                    {/* Arrow */}
                    <span className="shrink-0 text-base mt-0.5" style={{ color: "#bae6fd" }}>→</span>
                    {/* Destinations */}
                    <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                      {dests.map(d => (
                        <span key={d} className="text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap"
                          style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: schedules */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold" style={{ color: "#0c4a6e" }}>
              {t.armadaDetail.allSchedules}
            </h2>
            <span className="text-sm font-semibold" style={{ color: "#0369a1" }}>
              {schedules.length} {t.armadaDetail.schedulesFound}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {schedules
              .slice()
              .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
              .map(s => (
                <div key={s.id}
                  className="bg-white rounded-2xl px-4 py-4 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>

                  {/* Time block */}
                  <div className="shrink-0 w-[78px]">
                    <p className="text-lg font-extrabold tabular-nums leading-none" style={{ color: "#0369a1" }}>{s.departureTime}</p>
                    <p className="text-xs mt-1 font-semibold" style={{ color: "#94a3b8" }}>→ {s.arrivalTime}</p>
                  </div>

                  <div className="w-px self-stretch" style={{ background: "#e0f2fe" }} />

                  {/* Route */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold truncate" style={{ color: "#334155" }}>{s.from}</span>
                      <span style={{ color: "#bae6fd" }}>→</span>
                      <span className="text-sm font-bold truncate" style={{ color: "#334155" }}>{s.to}</span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                      {s.duration}
                    </p>
                  </div>

                  {/* Price + CTA */}
                  <div className="shrink-0 text-right">
                    <p className="text-base font-extrabold leading-none" style={{ color: "#0369a1" }}>Rp {s.price}K</p>
                    <button onClick={() => goToBooking(s.id)}
                      className="mt-2 px-3 py-1.5 rounded-lg text-xs font-extrabold text-white btn-ocean whitespace-nowrap">
                      {t.armadaDetail.bookNow}
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-4 text-center">
            <Link href={`/jadwal?operator=${encodeURIComponent(operatorName)}`}
              className="inline-block px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ background: "#f0f9ff", color: "#0369a1", border: "1.5px solid #bae6fd" }}>
              {t.armadaDetail.viewJadwal}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
