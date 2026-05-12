import { STATS } from "@/data/boats";

export default function StatsSection() {
  return (
    <section className="py-14 px-4" style={{ background: "linear-gradient(135deg,#0c4a6e 0%,#0369a1 50%,#0284c7 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          {STATS.map(({ value, label }, i) => (
            <div key={i} className="py-8 px-6 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
              <p className="text-4xl font-extrabold text-white tabular-nums mb-1">{value}</p>
              <p className="text-sm font-semibold" style={{ color: "#bae6fd" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
