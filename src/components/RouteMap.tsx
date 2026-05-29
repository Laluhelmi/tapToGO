"use client";
import { useId } from "react";

// Normalized port coordinates on a 800 × 440 viewBox
// Positions approximate the real Bali–Lombok geography.
const PORT_COORDS: Record<string, { x: number; y: number }> = {
  // Bali (left)
  "Padang Bai": { x: 250, y: 232 },
  "Candidasa": { x: 268, y: 218 },
  "Amed": { x: 322, y: 162 },
  "Sanur": { x: 138, y: 322 },
  "Serangan": { x: 126, y: 352 },
  "Nusa Lembongan": { x: 250, y: 330 },
  "Nusa Penida": { x: 276, y: 360 },
  // Lombok (right)
  "Bangsal": { x: 560, y: 188 },
  "Senggigi": { x: 536, y: 250 },
  // Gili Islands (north of Bangsal)
  "Gili Trawangan": { x: 496, y: 150 },
  "Gili Meno": { x: 516, y: 150 },
  "Gili Air": { x: 536, y: 154 },
};

interface Props {
  from: string;
  to: string;
  durationSeconds?: number; // boat travel animation duration
}

export default function RouteMap({ from, to, durationSeconds = 4 }: Props) {
  const uid = useId().replace(/:/g, "");
  const a = PORT_COORDS[from];
  const b = PORT_COORDS[to];

  if (!a || !b) {
    // Fallback if coords missing
    return (
      <div className="rounded-2xl p-6 text-center" style={{ background: "#e0f2fe", color: "#0369a1" }}>
        {from} → {to}
      </div>
    );
  }

  // Build a curved (arc) path between the two ports
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  // Perpendicular offset to make the arc bow upward
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const norm = dist === 0 ? 1 : dist;
  const offset = Math.min(70, dist * 0.25);
  const cx = mx + (-dy / norm) * offset;
  const cy = my + (dx / norm) * offset;
  const pathD = `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid #bae6fd" }}>
      <svg viewBox="0 0 800 440" className="w-full h-auto block" style={{ background: "linear-gradient(180deg,#bae6fd,#7dd3fc)" }}>
        <defs>
          <linearGradient id={`route-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
          <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0c4a6e" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* ── Landmasses (stylized) ── */}
        {/* Bali */}
        <path
          d="M -20 120 Q 60 70 160 90 Q 250 105 300 150 Q 340 185 350 230 L 320 245 Q 300 250 280 245 L 250 250 Q 200 270 160 310 Q 130 345 120 380 Q 90 410 40 410 L -20 410 Z"
          fill="#fde68a" stroke="#fbbf24" strokeWidth="1.5"
        />
        {/* Bali — Bukit peninsula (south) */}
        <path
          d="M 110 360 Q 150 350 190 365 Q 200 385 170 400 Q 130 410 100 395 Q 90 375 110 360 Z"
          fill="#fde68a" stroke="#fbbf24" strokeWidth="1.5"
        />
        {/* Lombok */}
        <path
          d="M 590 110 Q 680 80 800 95 L 840 95 L 840 420 L 600 420 Q 560 380 555 320 Q 552 280 545 255 L 558 245 Q 575 230 575 195 Q 575 150 590 110 Z"
          fill="#fde68a" stroke="#fbbf24" strokeWidth="1.5"
        />

        {/* Nusa Penida + Lembongan */}
        <path d="M 240 330 Q 270 320 295 335 Q 305 360 285 378 Q 255 385 238 365 Q 230 345 240 330 Z" fill="#fde68a" stroke="#fbbf24" strokeWidth="1.5" />

        {/* Gili Islands (3 small) */}
        <circle cx="496" cy="150" r="9" fill="#fde68a" stroke="#fbbf24" strokeWidth="1.5" />
        <circle cx="516" cy="150" r="7" fill="#fde68a" stroke="#fbbf24" strokeWidth="1.5" />
        <circle cx="536" cy="154" r="7" fill="#fde68a" stroke="#fbbf24" strokeWidth="1.5" />

        {/* ── Animated route ── */}
        {/* Static faded full path */}
        <path d={pathD} fill="none" stroke="#0369a1" strokeWidth="2.5" strokeDasharray="6 6" strokeOpacity="0.35" strokeLinecap="round" />
        {/* Animated drawing overlay */}
        <path d={pathD} fill="none" stroke={`url(#route-${uid})`} strokeWidth="3" strokeLinecap="round" pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: 1,
            animation: `routeDraw-${uid} ${durationSeconds}s ease-in-out infinite`,
          }} />

        {/* Origin marker */}
        <g filter={`url(#shadow-${uid})`}>
          <circle cx={a.x} cy={a.y} r="6" fill="#22c55e" stroke="white" strokeWidth="2" />
        </g>
        {/* Destination marker (pin) */}
        <g filter={`url(#shadow-${uid})`} transform={`translate(${b.x}, ${b.y})`}>
          <path d="M 0 -16 C 7 -16 11 -11 11 -5 C 11 3 0 12 0 12 C 0 12 -11 3 -11 -5 C -11 -11 -7 -16 0 -16 Z" fill="#dc2626" stroke="white" strokeWidth="1.5" />
          <circle cx="0" cy="-5" r="3.5" fill="white" />
        </g>

        {/* Moving boat along the route */}
        <g>
          <text fontSize="22" textAnchor="middle" dominantBaseline="middle">
            ⛴️
            <animateMotion dur={`${durationSeconds}s`} repeatCount="indefinite" rotate="0" path={pathD} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
          </text>
        </g>

        {/* Port labels */}
        <g fontFamily="system-ui, sans-serif">
          {/* From */}
          <g transform={`translate(${a.x}, ${a.y})`}>
            <rect x="-4" y="10" width={from.length * 6.2 + 12} height="18" rx="9" fill="white" fillOpacity="0.92"
              transform={`translate(${-(from.length * 6.2 + 12) / 2 + 4}, 0)`} />
            <text x="0" y="23" fontSize="11" fontWeight="700" fill="#15803d" textAnchor="middle">{from}</text>
          </g>
          {/* To */}
          <g transform={`translate(${b.x}, ${b.y})`}>
            <rect x="-4" y="14" width={to.length * 6.2 + 12} height="18" rx="9" fill="white" fillOpacity="0.92"
              transform={`translate(${-(to.length * 6.2 + 12) / 2 + 4}, 0)`} />
            <text x="0" y="27" fontSize="11" fontWeight="700" fill="#dc2626" textAnchor="middle">{to}</text>
          </g>
        </g>

        {/* Region labels */}
        <text x="90" y="200" fontSize="20" fontWeight="800" fill="#92400e" fillOpacity="0.5" textAnchor="middle">BALI</text>
        <text x="710" y="280" fontSize="20" fontWeight="800" fill="#92400e" fillOpacity="0.5" textAnchor="middle">LOMBOK</text>
      </svg>

      <style>{`
        @keyframes routeDraw-${uid} {
          0% { stroke-dashoffset: 1; }
          60% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
