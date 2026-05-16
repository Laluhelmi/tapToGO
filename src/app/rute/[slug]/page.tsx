import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ALL_ROUTES,
  findRouteBySlug,
  getSchedulesForRoute,
  getRelatedRoutes,
  getAllRouteSlugs,
} from "@/lib/routes";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// SSG: pre-build every route page at deploy time
export function generateStaticParams() {
  return getAllRouteSlugs().map(slug => ({ slug }));
}

// SEO metadata per route
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = findRouteBySlug(slug);
  if (!route) {
    return { title: "Route not found · tapToGo" };
  }
  const title = `Fastboat ${route.from} ke ${route.to} · Mulai Rp ${route.minPrice}K | tapToGo`;
  const description = `Pesan tiket fastboat ${route.from} → ${route.to} online. ${route.scheduleCount} jadwal harian dari ${route.operators.length} operator resmi. Durasi ${route.duration}. Harga mulai Rp ${route.minPrice}K. Booking aman & cepat di tapToGo.`;

  return {
    title,
    description,
    keywords: [
      `fastboat ${route.from}`,
      `fastboat ke ${route.to}`,
      `tiket ${route.from} ${route.to}`,
      `kapal ${route.from} ke ${route.to}`,
      `harga fastboat ${route.from}`,
      "fastboat lombok bali",
      "tiket fastboat online",
      "tapToGo",
    ].join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://taptogo-rouge.vercel.app/rute/${slug}`,
      siteName: "tapToGo",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://taptogo-rouge.vercel.app/rute/${slug}`,
    },
  };
}

function formatRupiah(thousands: number): string {
  return "Rp " + (thousands * 1000).toLocaleString("id-ID");
}

export default async function RoutePage({ params }: PageProps) {
  const { slug } = await params;
  const route = findRouteBySlug(slug);
  if (!route) notFound();

  const schedules = getSchedulesForRoute(route.from, route.to);
  const related = getRelatedRoutes(route, 4);
  const cheapest = schedules.reduce((min, s) => s.price < min.price ? s : min, schedules[0]);
  const earliestTime = schedules[0]?.departureTime ?? "—";
  const latestTime = schedules[schedules.length - 1]?.departureTime ?? "—";

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        "@id": `https://taptogo-rouge.vercel.app/rute/${slug}#trip`,
        name: `Fastboat ${route.from} ke ${route.to}`,
        description: `Layanan tiket fastboat dari ${route.from} ke ${route.to}, durasi ${route.duration}. ${route.scheduleCount} jadwal harian.`,
        touristType: "Tourist",
        itinerary: {
          "@type": "ItemList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: { "@type": "Place", name: route.from, address: { "@type": "PostalAddress", addressCountry: "ID" } },
            },
            {
              "@type": "ListItem",
              position: 2,
              item: { "@type": "Place", name: route.to, address: { "@type": "PostalAddress", addressCountry: "ID" } },
            },
          ],
        },
        offers: {
          "@type": "AggregateOffer",
          lowPrice: route.minPrice * 1000,
          highPrice: route.maxPrice * 1000,
          priceCurrency: "IDR",
          offerCount: route.scheduleCount,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Berapa lama perjalanan fastboat ${route.from} ke ${route.to}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Perjalanan fastboat ${route.from} ke ${route.to} memakan waktu sekitar ${route.duration}.`,
            },
          },
          {
            "@type": "Question",
            name: `Berapa harga tiket fastboat ${route.from} ke ${route.to}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Harga tiket dimulai dari Rp ${route.minPrice}K hingga Rp ${route.maxPrice}K per orang, tergantung operator dan kelas.`,
            },
          },
          {
            "@type": "Question",
            name: `Berapa banyak operator yang melayani rute ${route.from} ke ${route.to}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${route.operators.length} operator resmi melayani rute ini dengan total ${route.scheduleCount} jadwal harian.`,
            },
          },
          {
            "@type": "Question",
            name: `Apakah harga sudah termasuk harbour tax?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Harga tiket belum termasuk Harbour Tax (Rp 20.000 per orang) yang dipungut di pelabuhan asal. Anda dapat membayar via aplikasi atau langsung di pelabuhan.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />

      {/* JSON-LD schema for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold mb-4 transition-opacity hover:opacity-80"
            style={{ color: "#bae6fd" }}>← Beranda</Link>

          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#fbbf24" }}>
            🚤 Tiket Fastboat
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-2">
            {route.from} <span style={{ color: "#7dd3fc" }}>→</span> {route.to}
          </h1>
          <p className="text-base sm:text-lg" style={{ color: "#e0f2fe" }}>
            {route.scheduleCount} jadwal harian · {route.operators.length} operator resmi · Durasi {route.duration}
          </p>

          {/* Hero stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 max-w-3xl">
            <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#bae6fd" }}>Mulai dari</p>
              <p className="text-xl sm:text-2xl font-extrabold text-white">Rp {route.minPrice}K</p>
            </div>
            <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#bae6fd" }}>Jadwal</p>
              <p className="text-xl sm:text-2xl font-extrabold text-white">{earliestTime} – {latestTime}</p>
            </div>
            <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#bae6fd" }}>Durasi</p>
              <p className="text-xl sm:text-2xl font-extrabold text-white">{route.duration}</p>
            </div>
            <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#bae6fd" }}>Operator</p>
              <p className="text-xl sm:text-2xl font-extrabold text-white">{route.operators.length} brand</p>
            </div>
          </div>
        </div>
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* Main column */}
        <div className="space-y-6">

          {/* About this route */}
          <section className="bg-white rounded-2xl p-5 sm:p-6"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <h2 className="text-xl font-extrabold mb-3" style={{ color: "#0c4a6e" }}>
              Tentang Rute {route.from} → {route.to}
            </h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "#475569" }}>
              Rute fastboat <strong>{route.from} ke {route.to}</strong> adalah salah satu jalur pelayaran
              populer dari Lombok menuju Bali. Perjalanan memakan waktu sekitar <strong>{route.duration}</strong>{" "}
              dengan kapal cepat modern berstandar keselamatan internasional. Tersedia{" "}
              <strong>{route.scheduleCount} jadwal harian</strong> dari{" "}
              <strong>{route.operators.length} operator resmi</strong>, mulai dari pukul {earliestTime} sampai{" "}
              {latestTime}.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
              Harga tiket {route.from} ke {route.to} dimulai dari{" "}
              <strong style={{ color: "#0369a1" }}>{formatRupiah(route.minPrice)}</strong> per orang.
              Booking online di tapToGo memudahkan kamu pesan tiket tanpa antri, langsung dapat konfirmasi e-ticket,
              dan dilayani operator resmi seperti {route.operators.slice(0, 3).join(", ")}
              {route.operators.length > 3 && ` dan ${route.operators.length - 3} operator lainnya`}.
            </p>
          </section>

          {/* All schedules */}
          <section className="bg-white rounded-2xl p-5 sm:p-6"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold" style={{ color: "#0c4a6e" }}>
                Jadwal Fastboat {route.from} → {route.to}
              </h2>
              <span className="text-sm font-bold" style={{ color: "#0369a1" }}>
                {schedules.length} jadwal
              </span>
            </div>

            <div className="space-y-2.5">
              {schedules.map(s => (
                <Link key={s.id} href={`/booking?id=${s.id}&date=${new Date().toISOString().split("T")[0]}&passengers=1`}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01] hover:shadow-md"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0" style={{ background: "#e0f2fe" }}>
                    {s.image ? <img src={s.image} alt={s.operator} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: "#0c4a6e" }}>{s.operator}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>
                      <span className="font-bold tabular-nums" style={{ color: "#0369a1" }}>{s.departureTime}</span>
                      {" → "}
                      <span className="tabular-nums">{s.arrivalTime}</span>
                      {" · "}{s.duration}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-extrabold leading-none" style={{ color: "#0369a1" }}>Rp {s.price}K</p>
                    <p className="text-[10px]" style={{ color: "#94a3b8" }}>per pax</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Operators */}
          <section className="bg-white rounded-2xl p-5 sm:p-6"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <h2 className="text-xl font-extrabold mb-3" style={{ color: "#0c4a6e" }}>
              Operator Fastboat untuk Rute Ini
            </h2>
            <div className="flex flex-wrap gap-2">
              {route.operators.map(op => (
                <Link key={op} href={`/armada/${encodeURIComponent(op)}`}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
                  style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>
                  🚤 {op}
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-2xl p-5 sm:p-6"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <h2 className="text-xl font-extrabold mb-4" style={{ color: "#0c4a6e" }}>
              Pertanyaan Umum
            </h2>
            <div className="space-y-3">
              <FaqItem
                q={`Berapa lama perjalanan fastboat ${route.from} ke ${route.to}?`}
                a={`Perjalanan fastboat ${route.from} ke ${route.to} memakan waktu sekitar ${route.duration}. Waktu sebenarnya dapat bervariasi tergantung cuaca dan kondisi laut.`}
              />
              <FaqItem
                q={`Berapa harga tiket fastboat ${route.from} ke ${route.to}?`}
                a={`Harga tiket fastboat ${route.from} → ${route.to} dimulai dari Rp ${route.minPrice}K hingga Rp ${route.maxPrice}K per orang, tergantung operator yang dipilih. Operator dengan kelas yang lebih premium biasanya menawarkan fasilitas tambahan seperti WiFi, snack, dan kursi lebih nyaman.`}
              />
              <FaqItem
                q={`Apa operator paling murah?`}
                a={`Operator dengan harga termurah untuk rute ini adalah ${cheapest?.operator} mulai dari ${formatRupiah(cheapest?.price ?? route.minPrice)} per orang.`}
              />
              <FaqItem
                q={`Jam berapa saja fastboat berangkat?`}
                a={`Tersedia ${route.scheduleCount} jadwal harian, mulai dari pukul ${earliestTime} sampai ${latestTime}. Disarankan booking di muka untuk jadwal pagi karena cepat penuh.`}
              />
              <FaqItem
                q={`Apakah harga sudah termasuk harbour tax?`}
                a={`Belum. Harbour Tax (Rp 20.000 per orang) dipungut di pelabuhan asal ${route.from}. Anda dapat membayarnya via aplikasi tapToGo saat booking, atau langsung di pelabuhan dengan cash.`}
              />
              <FaqItem
                q={`Bagaimana cara booking tiket?`}
                a={`Pilih jadwal yang Anda inginkan di atas, klik untuk lanjut ke halaman booking. Isi data penumpang (nama, email, WhatsApp), pilih metode pembayaran, dan konfirmasi. E-ticket akan dikirim ke email dan WhatsApp Anda.`}
              />
            </div>
          </section>

          {/* Related routes */}
          {related.length > 0 && (
            <section className="bg-white rounded-2xl p-5 sm:p-6"
              style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
              <h2 className="text-xl font-extrabold mb-4" style={{ color: "#0c4a6e" }}>
                Rute Populer Lainnya
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map(r => (
                  <Link key={r.slug} href={`/rute/${r.slug}`}
                    className="block p-3 rounded-xl transition-all hover:scale-[1.02] hover:shadow-md"
                    style={{ background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                    <p className="font-bold text-sm" style={{ color: "#0c4a6e" }}>
                      {r.from} <span style={{ color: "#0284c7" }}>→</span> {r.to}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                      {r.scheduleCount} jadwal · mulai{" "}
                      <strong style={{ color: "#0369a1" }}>Rp {r.minPrice}K</strong>
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar — quick book CTA */}
        <aside className="lg:sticky lg:top-20 self-start">
          <div className="bg-white rounded-2xl p-5"
            style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#0369a1" }}>
              Pesan Tiket Sekarang
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span style={{ color: "#64748b" }}>Rute</span>
                <span className="font-bold text-right" style={{ color: "#0c4a6e" }}>{route.from} → {route.to}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#64748b" }}>Durasi</span>
                <span className="font-bold" style={{ color: "#0c4a6e" }}>{route.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#64748b" }}>Jadwal</span>
                <span className="font-bold" style={{ color: "#0c4a6e" }}>{route.scheduleCount} hari</span>
              </div>
              <div className="flex justify-between items-end pt-2" style={{ borderTop: "1px solid #e0f2fe" }}>
                <span className="text-sm" style={{ color: "#64748b" }}>Mulai dari</span>
                <span className="text-2xl font-extrabold" style={{ color: "#0369a1" }}>Rp {route.minPrice}K</span>
              </div>
            </div>

            <Link href={`/?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`}
              className="block w-full py-3 rounded-xl text-white text-sm font-extrabold text-center btn-ocean transition-all hover:scale-[1.02]">
              🔍 Cari Jadwal &amp; Pesan →
            </Link>

            <p className="text-[10px] text-center mt-3" style={{ color: "#94a3b8" }}>
              ✓ Booking online · ✓ Konfirmasi instan · ✓ Operator resmi
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl overflow-hidden"
      style={{ border: "1px solid #e0f2fe", background: "#f8fafc" }}>
      <summary className="px-4 py-3 cursor-pointer flex items-center justify-between gap-3 list-none transition-colors">
        <span className="text-sm font-bold flex-1" style={{ color: "#0c4a6e" }}>{q}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: "#0369a1" }}
          className="transition-transform group-open:rotate-180">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </summary>
      <div className="px-4 pb-3 text-sm leading-relaxed" style={{ color: "#475569" }}>
        {a}
      </div>
    </details>
  );
}

// Limit how often we rebuild this page (in seconds) — useful for dynamic deploys
export const dynamic = "force-static";
export const revalidate = 3600; // re-validate hourly
