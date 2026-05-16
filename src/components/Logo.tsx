"use client";

/**
 * tapToGo Logo Mark
 * - Abstract wave-arrow combining: ocean wave + forward motion + journey
 * - Bold sweeping curve = speed/direction
 * - Subtle ripples below = water
 * - Golden dot at tip = destination / point of arrival
 */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center shadow-sm transition-transform"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg,#0ea5e9 0%,#0369a1 55%,#0c4a6e 100%)",
        boxShadow: "0 4px 12px rgba(2,132,199,0.25), inset 0 1px 0 rgba(255,255,255,0.18)",
      }}
    >
      <svg viewBox="0 0 40 40" fill="none" width={size * 0.7} height={size * 0.7}>
        {/* Subtle background ripple */}
        <path
          d="M5 30 Q11 27 17 29.5 T29 29.5 T36 28"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        {/* Main bold wave-arrow */}
        <path
          d="M5 23 C10 13, 19 13, 23 18 C26.5 22, 30 20.5, 34 13.5"
          stroke="white"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Golden destination spark */}
        <circle cx="34" cy="13.5" r="2.4" fill="#fbbf24" />
        <circle cx="34" cy="13.5" r="2.4" fill="#fbbf24" opacity="0.5">
          <animate attributeName="r" values="2.4;3.4;2.4" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

export function LogoWordmark({ size = "lg", variant = "light" }: { size?: "sm" | "md" | "lg" | "xl"; variant?: "light" | "dark" }) {
  const sizes = { sm: "text-base", md: "text-lg", lg: "text-xl", xl: "text-2xl" };
  const tapColor = variant === "light" ? "#0c4a6e" : "#ffffff";
  return (
    <span className={`${sizes[size]} font-extrabold tracking-tight`}>
      <span style={{ color: tapColor }}>tapTo</span>
      <span style={{ color: "#f59e0b" }}>Go</span>
    </span>
  );
}

export default function Logo({ size = 36, variant = "light", wordmarkSize = "lg" }: { size?: number; variant?: "light" | "dark"; wordmarkSize?: "sm" | "md" | "lg" | "xl" }) {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className="group-hover:scale-105 transition-transform">
        <LogoMark size={size} />
      </div>
      <LogoWordmark size={wordmarkSize} variant={variant} />
    </div>
  );
}
