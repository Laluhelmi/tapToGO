"use client";
import type { Vehicle } from "@/data/vehicles";
import { useLang } from "@/contexts/LanguageContext";

interface Props {
  vehicle: Vehicle;
  startDate?: string;
  duration?: number;
  quantity?: number;
}

const TYPE_LABEL: Record<string, string> = {
  matic: "Automatic",
  manual: "Manual",
  big_bike: "Big Bike",
  car: "Car",
};

export default function VehicleCard({ vehicle, startDate, duration = 1, quantity = 1 }: Props) {
  const { t } = useLang();
  const total = vehicle.pricePerDay * duration * quantity;

  const handleRent = () => {
    const adminWa = "6287821775082";
    const msg = [
      "Halo tapToGo, saya tertarik sewa kendaraan:",
      "",
      `🛵 *${vehicle.name}* (${vehicle.brand} ${vehicle.cc}cc)`,
      `📅 Mulai: ${startDate || "TBD"}`,
      `⏱️ Durasi: ${duration} hari`,
      `🔢 Jumlah: ${quantity} unit`,
      `📍 Lokasi pickup: ${vehicle.locations[0]}`,
      `💰 Total estimasi: Rp ${(total * 1000).toLocaleString("id-ID")}`,
      "",
      "Mohon konfirmasi ketersediaan & detail booking. Terima kasih!",
    ].join("\n");
    const url = `https://wa.me/${adminWa}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{
        border: "1.5px solid #e0f2fe",
        boxShadow: "0 2px 12px rgba(2,132,199,0.06)",
      }}
    >
      {/* Photo area */}
      <div
        className="relative overflow-hidden"
        style={{
          height: 180,
          background: `linear-gradient(135deg, ${vehicle.color}22, ${vehicle.color}66)`,
        }}
      >
        {vehicle.image?.startsWith("/") ? (
          <img
            src={vehicle.image}
            alt={vehicle.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span style={{ fontSize: 64, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>{vehicle.image}</span>
          </div>
        )}

        {/* Brand badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-extrabold text-white"
          style={{ background: vehicle.color, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
        >
          {vehicle.brand}
        </div>

        {/* Badge */}
        {vehicle.badge && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-white"
            style={{
              background:
                vehicle.badge === "Popular"
                  ? "linear-gradient(135deg,#f59e0b,#ea580c)"
                  : vehicle.badge === "Best Value"
                  ? "linear-gradient(135deg,#22c55e,#15803d)"
                  : vehicle.badge === "Premium"
                  ? "linear-gradient(135deg,#7c3aed,#5b21b6)"
                  : "linear-gradient(135deg,#06b6d4,#0369a1)",
            }}
          >
            {vehicle.badge}
          </div>
        )}

        {/* Type chip */}
        <div
          className="absolute bottom-3 left-3 text-xs font-bold px-2 py-0.5 rounded-md"
          style={{ background: "rgba(255,255,255,0.85)", color: "#0c4a6e" }}
        >
          {TYPE_LABEL[vehicle.type]} · {vehicle.cc}cc
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-base font-extrabold leading-tight" style={{ color: "#0c4a6e" }}>{vehicle.name}</p>
          <div className="flex items-center gap-0.5 text-xs font-bold whitespace-nowrap" style={{ color: "#f59e0b" }}>
            ★ <span style={{ color: "#334155" }}>{vehicle.rating}</span>
            <span style={{ color: "#94a3b8", fontWeight: 500 }}>({vehicle.reviewCount})</span>
          </div>
        </div>

        {vehicle.description && (
          <p className="text-xs mb-3 line-clamp-2" style={{ color: "#64748b" }}>
            {vehicle.description}
          </p>
        )}

        {/* Features (compact) */}
        <div className="flex flex-wrap gap-1 mb-3">
          {vehicle.features.slice(0, 3).map((f) => (
            <span key={f} className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold"
              style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #e0f2fe" }}>
              {f}
            </span>
          ))}
          {vehicle.features.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold" style={{ color: "#94a3b8" }}>
              +{vehicle.features.length - 3}
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid #f0f9ff" }}>
          <div>
            <p className="text-xl font-extrabold leading-none" style={{ color: "#0369a1" }}>
              Rp {vehicle.pricePerDay}K
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "#94a3b8" }}>/ day</p>
          </div>
          <button
            onClick={handleRent}
            className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white btn-ocean transition-all hover:scale-105 whitespace-nowrap"
          >
            {t.rentalSearch.searchBtn === "Search Vehicle" ? "Rent via WA" : "Sewa via WA"}
          </button>
        </div>
      </div>
    </div>
  );
}
