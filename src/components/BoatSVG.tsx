export type BoatVariant = "speedboat" | "fastboat" | "ferry" | "catamaran" | "cruiser" | "express";

const boats: Record<BoatVariant, { svg: string; color: string }> = {
  speedboat: {
    color: "#0ea5e9",
    svg: `<svg viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Water -->
  <ellipse cx="110" cy="105" rx="105" ry="12" fill="#bae6fd" opacity="0.5"/>
  <!-- Wake lines -->
  <path d="M20 108 Q50 103 80 108" stroke="#7dd3fc" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M140 108 Q170 103 200 108" stroke="#7dd3fc" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <!-- Hull -->
  <path d="M30 90 Q35 100 55 102 L160 102 Q185 100 190 88 L175 75 Q160 70 140 70 L70 70 Q50 70 40 78 Z" fill="#0369a1"/>
  <path d="M30 90 Q35 98 55 100 L160 100 Q183 98 188 88" stroke="#0284c7" stroke-width="1" fill="none"/>
  <!-- Deck stripe -->
  <path d="M55 72 L155 72 Q170 72 175 78 L170 80 Q160 74 140 74 L70 74 Q55 74 48 80 Z" fill="#0ea5e9"/>
  <!-- Cabin -->
  <rect x="80" y="50" width="65" height="24" rx="8" fill="#38bdf8"/>
  <rect x="80" y="50" width="65" height="10" rx="4" fill="#7dd3fc"/>
  <!-- Windows -->
  <rect x="88" y="55" width="14" height="10" rx="3" fill="#e0f2fe" opacity="0.9"/>
  <rect x="108" y="55" width="14" height="10" rx="3" fill="#e0f2fe" opacity="0.9"/>
  <rect x="128" y="55" width="12" height="10" rx="3" fill="#e0f2fe" opacity="0.9"/>
  <!-- Windshield -->
  <path d="M80 50 L75 58 L80 74 L80 50" fill="#7dd3fc" opacity="0.5"/>
  <!-- Antenna -->
  <line x1="120" y1="50" x2="120" y2="35" stroke="#0369a1" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="120" cy="33" r="2.5" fill="#0ea5e9"/>
  <!-- Engine exhaust -->
  <path d="M188 85 Q196 82 198 78 Q200 74 196 72" stroke="#94a3b8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- Flag -->
  <line x1="145" y1="50" x2="145" y2="38" stroke="#0369a1" stroke-width="1.5"/>
  <path d="M145 38 L158 43 L145 48 Z" fill="#f43f5e"/>
</svg>`,
  },
  fastboat: {
    color: "#0284c7",
    svg: `<svg viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Water -->
  <ellipse cx="110" cy="106" rx="108" ry="11" fill="#bae6fd" opacity="0.45"/>
  <!-- Speed lines -->
  <path d="M5 90 L35 90" stroke="#bae6fd" stroke-width="2" stroke-linecap="round"/>
  <path d="M5 97 L28 97" stroke="#bae6fd" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M5 104 L22 104" stroke="#bae6fd" stroke-width="1" stroke-linecap="round"/>
  <!-- Hull - sleek -->
  <path d="M25 92 Q30 100 50 102 L170 102 Q195 98 205 88 L195 76 Q180 68 160 68 L80 68 Q55 68 40 78 Z" fill="#0369a1"/>
  <path d="M50 70 L160 70 Q178 70 193 80 L188 84 Q175 74 158 74 L78 74 Q58 74 46 82 Z" fill="#0ea5e9"/>
  <!-- Cabin angular -->
  <path d="M90 52 L155 52 Q165 52 168 58 L168 70 L85 70 L82 62 Z" fill="#38bdf8"/>
  <path d="M90 52 L155 52 Q163 52 165 56 L165 59 L88 59 Z" fill="#7dd3fc"/>
  <!-- Windows row -->
  <rect x="96" y="56" width="13" height="9" rx="2.5" fill="#e0f2fe" opacity="0.95"/>
  <rect x="114" y="56" width="13" height="9" rx="2.5" fill="#e0f2fe" opacity="0.95"/>
  <rect x="132" y="56" width="13" height="9" rx="2.5" fill="#e0f2fe" opacity="0.95"/>
  <rect x="150" y="56" width="10" height="9" rx="2.5" fill="#e0f2fe" opacity="0.95"/>
  <!-- Bow angled -->
  <path d="M82 62 L68 84 L85 84 L90 70 Z" fill="#38bdf8" opacity="0.7"/>
  <!-- Twin engines -->
  <rect x="185" y="86" width="18" height="8" rx="3" fill="#475569"/>
  <path d="M203 90 Q210 88 212 90 Q210 92 203 90" fill="#64748b"/>
  <!-- Radar -->
  <line x1="130" y1="52" x2="130" y2="38" stroke="#0369a1" stroke-width="1.5"/>
  <ellipse cx="130" cy="37" rx="10" ry="4" fill="none" stroke="#0ea5e9" stroke-width="1.5"/>
  <line x1="125" y1="37" x2="135" y2="37" stroke="#0ea5e9" stroke-width="1.5"/>
</svg>`,
  },
  ferry: {
    color: "#0369a1",
    svg: `<svg viewBox="0 0 220 130" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Water -->
  <ellipse cx="110" cy="114" rx="108" ry="12" fill="#bae6fd" opacity="0.5"/>
  <!-- Hull large -->
  <path d="M20 95 Q25 108 55 110 L165 110 Q195 108 200 95 L195 80 L25 80 Z" fill="#0369a1"/>
  <path d="M55 82 L165 82 L193 82 L193 88 L55 88 Z" fill="#0284c7" opacity="0.5"/>
  <!-- Main deck -->
  <rect x="30" y="58" width="160" height="24" rx="3" fill="#0ea5e9"/>
  <rect x="30" y="58" width="160" height="7" rx="3" fill="#38bdf8"/>
  <!-- Upper cabin -->
  <rect x="55" y="34" width="110" height="26" rx="4" fill="#7dd3fc"/>
  <rect x="55" y="34" width="110" height="8" rx="4" fill="#bae6fd" opacity="0.8"/>
  <!-- Windows deck 1 -->
  <rect x="40" y="64" width="14" height="11" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <rect x="60" y="64" width="14" height="11" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <rect x="80" y="64" width="14" height="11" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <rect x="100" y="64" width="14" height="11" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <rect x="120" y="64" width="14" height="11" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <rect x="140" y="64" width="14" height="11" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <rect x="160" y="64" width="14" height="11" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <!-- Windows cabin upper -->
  <rect x="63" y="40" width="12" height="9" rx="2" fill="white" opacity="0.85"/>
  <rect x="81" y="40" width="12" height="9" rx="2" fill="white" opacity="0.85"/>
  <rect x="99" y="40" width="12" height="9" rx="2" fill="white" opacity="0.85"/>
  <rect x="117" y="40" width="12" height="9" rx="2" fill="white" opacity="0.85"/>
  <rect x="135" y="40" width="12" height="9" rx="2" fill="white" opacity="0.85"/>
  <rect x="153" y="40" width="12" height="9" rx="2" fill="white" opacity="0.85"/>
  <!-- Funnel / chimney -->
  <rect x="94" y="18" width="16" height="18" rx="4" fill="#0369a1"/>
  <rect x="94" y="18" width="16" height="5" rx="3" fill="#475569"/>
  <!-- Smoke -->
  <circle cx="98" cy="13" r="5" fill="#cbd5e1" opacity="0.4"/>
  <circle cx="104" cy="8" r="4" fill="#cbd5e1" opacity="0.3"/>
  <!-- Flag -->
  <line x1="165" y1="34" x2="165" y2="22" stroke="#0369a1" stroke-width="1.5"/>
  <path d="M165 22 L178 27 L165 32 Z" fill="#f43f5e"/>
  <!-- Anchor -->
  <circle cx="40" cy="92" r="5" fill="none" stroke="#7dd3fc" stroke-width="1.5"/>
  <line x1="40" y1="87" x2="40" y2="97" stroke="#7dd3fc" stroke-width="1.5"/>
</svg>`,
  },
  catamaran: {
    color: "#06b6d4",
    svg: `<svg viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Water -->
  <ellipse cx="110" cy="108" rx="108" ry="10" fill="#a5f3fc" opacity="0.4"/>
  <!-- Hull left -->
  <path d="M20 90 Q25 102 45 104 L90 104 Q100 102 100 92 L90 78 L45 78 Q30 78 20 90Z" fill="#0369a1"/>
  <!-- Hull right -->
  <path d="M120 90 Q125 102 145 104 L190 104 Q202 100 205 90 L195 78 L145 78 Q130 78 120 90Z" fill="#0369a1"/>
  <!-- Deck stripes -->
  <path d="M45 80 L90 80 L97 85 L40 85 Z" fill="#0ea5e9" opacity="0.6"/>
  <path d="M145 80 L190 80 L198 85 L138 85 Z" fill="#0ea5e9" opacity="0.6"/>
  <!-- Cross beams -->
  <rect x="55" y="74" width="110" height="6" rx="2" fill="#0284c7"/>
  <rect x="65" y="58" width="90" height="5" rx="2" fill="#0284c7"/>
  <!-- Main sail platform -->
  <rect x="70" y="44" width="80" height="30" rx="6" fill="#38bdf8"/>
  <rect x="70" y="44" width="80" height="9" rx="5" fill="#7dd3fc"/>
  <!-- Windows -->
  <rect x="80" y="51" width="12" height="9" rx="2" fill="white" opacity="0.85"/>
  <rect x="98" y="51" width="12" height="9" rx="2" fill="white" opacity="0.85"/>
  <rect x="116" y="51" width="12" height="9" rx="2" fill="white" opacity="0.85"/>
  <rect x="134" y="51" width="10" height="9" rx="2" fill="white" opacity="0.85"/>
  <!-- Mast -->
  <line x1="110" y1="44" x2="110" y2="16" stroke="#0369a1" stroke-width="2"/>
  <!-- Sail -->
  <path d="M110 18 L130 40 L110 44 Z" fill="#bae6fd" opacity="0.7" stroke="#7dd3fc" stroke-width="1"/>
  <path d="M110 18 L90 40 L110 44 Z" fill="#e0f2fe" opacity="0.7" stroke="#7dd3fc" stroke-width="1"/>
  <!-- Wake -->
  <path d="M18 104 Q35 100 55 104" stroke="#7dd3fc" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M165 104 Q185 100 208 104" stroke="#7dd3fc" stroke-width="1.5" stroke-linecap="round" fill="none"/>
</svg>`,
  },
  cruiser: {
    color: "#0284c7",
    svg: `<svg viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Water -->
  <ellipse cx="110" cy="106" rx="106" ry="11" fill="#bae6fd" opacity="0.45"/>
  <!-- Hull -->
  <path d="M18 90 Q22 104 50 106 L170 106 Q198 104 202 90 L195 75 L25 75 Z" fill="#1e40af"/>
  <!-- Red stripe -->
  <rect x="25" y="77" width="170" height="4" fill="#ef4444" opacity="0.7"/>
  <!-- White stripe -->
  <rect x="25" y="81" width="170" height="3" fill="white" opacity="0.8"/>
  <!-- Main cabin -->
  <rect x="35" y="52" width="150" height="26" rx="4" fill="#0284c7"/>
  <rect x="35" y="52" width="150" height="8" rx="4" fill="#0ea5e9"/>
  <!-- Upper deck -->
  <rect x="60" y="32" width="100" height="22" rx="4" fill="#38bdf8"/>
  <rect x="60" y="32" width="100" height="7" rx="4" fill="#7dd3fc"/>
  <!-- Top bridge -->
  <rect x="85" y="18" width="50" height="16" rx="3" fill="#0369a1"/>
  <rect x="85" y="18" width="50" height="5" rx="2" fill="#0ea5e9" opacity="0.7"/>
  <!-- Windows lower -->
  <rect x="44" y="58" width="13" height="12" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <rect x="62" y="58" width="13" height="12" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <rect x="80" y="58" width="13" height="12" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <rect x="98" y="58" width="13" height="12" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <rect x="116" y="58" width="13" height="12" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <rect x="134" y="58" width="13" height="12" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <rect x="152" y="58" width="13" height="12" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <rect x="170" y="58" width="10" height="12" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <!-- Windows upper -->
  <rect x="68" y="37" width="11" height="9" rx="2" fill="white" opacity="0.85"/>
  <rect x="84" y="37" width="11" height="9" rx="2" fill="white" opacity="0.85"/>
  <rect x="100" y="37" width="11" height="9" rx="2" fill="white" opacity="0.85"/>
  <rect x="116" y="37" width="11" height="9" rx="2" fill="white" opacity="0.85"/>
  <rect x="132" y="37" width="11" height="9" rx="2" fill="white" opacity="0.85"/>
  <rect x="148" y="37" width="9" height="9" rx="2" fill="white" opacity="0.85"/>
  <!-- Bridge window -->
  <rect x="93" y="22" width="34" height="8" rx="2" fill="#e0f2fe" opacity="0.9"/>
  <!-- Funnel -->
  <rect x="100" y="10" width="20" height="10" rx="3" fill="#0369a1"/>
  <!-- Lifeboats -->
  <ellipse cx="65" cy="54" rx="12" ry="4" fill="#f97316" opacity="0.85"/>
  <ellipse cx="155" cy="54" rx="12" ry="4" fill="#f97316" opacity="0.85"/>
  <!-- Flag -->
  <line x1="170" y1="32" x2="170" y2="20" stroke="#0369a1" stroke-width="1.5"/>
  <path d="M170 20 L183 25 L170 30Z" fill="#f43f5e"/>
</svg>`,
  },
  express: {
    color: "#7c3aed",
    svg: `<svg viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Water ripple -->
  <ellipse cx="110" cy="106" rx="106" ry="11" fill="#bae6fd" opacity="0.4"/>
  <!-- Speed lines -->
  <path d="M5 82 L40 82" stroke="#bae6fd" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M5 90 L32 90" stroke="#bae6fd" stroke-width="2" stroke-linecap="round"/>
  <path d="M5 98 L25 98" stroke="#bae6fd" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Hull - very sleek -->
  <path d="M28 94 Q32 104 55 105 L175 105 Q200 102 208 90 L198 74 L185 70 L55 70 Q38 72 28 84 Z" fill="#1d4ed8"/>
  <!-- Top hull stripe -->
  <path d="M55 72 L183 72 Q196 72 200 80 L196 78 Q185 74 170 74 L58 74 Q44 74 36 80 Z" fill="#3b82f6"/>
  <!-- Cabin ultra slim -->
  <path d="M88 46 L185 46 L190 52 L190 70 L83 70 L78 60 Z" fill="#0ea5e9"/>
  <path d="M88 46 L185 46 L187 50 L86 50 Z" fill="#7dd3fc"/>
  <!-- Windows elongated -->
  <rect x="94" y="53" width="16" height="10" rx="3" fill="#e0f2fe" opacity="0.95"/>
  <rect x="116" y="53" width="16" height="10" rx="3" fill="#e0f2fe" opacity="0.95"/>
  <rect x="138" y="53" width="16" height="10" rx="3" fill="#e0f2fe" opacity="0.95"/>
  <rect x="160" y="53" width="14" height="10" rx="3" fill="#e0f2fe" opacity="0.95"/>
  <!-- Sharp bow -->
  <path d="M78 60 L58 76 L72 78 L88 70 Z" fill="#3b82f6" opacity="0.8"/>
  <!-- Twin engines rear -->
  <rect x="192" y="80" width="20" height="7" rx="2" fill="#475569"/>
  <rect x="192" y="90" width="20" height="7" rx="2" fill="#475569"/>
  <path d="M212 83 Q220 82 218 84 Q220 83 212 83" fill="#64748b"/>
  <path d="M212 93 Q220 92 218 94 Q220 93 212 93" fill="#64748b"/>
  <!-- Radar dome -->
  <circle cx="145" cy="42" r="6" fill="none" stroke="#0369a1" stroke-width="1.5"/>
  <line x1="139" y1="42" x2="151" y2="42" stroke="#0ea5e9" stroke-width="1.5"/>
  <line x1="145" y1="46" x2="145" y2="36" stroke="#0ea5e9" stroke-width="1.5"/>
  <!-- Antenna -->
  <line x1="100" y1="46" x2="105" y2="30" stroke="#0369a1" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="105" cy="29" r="2" fill="#0ea5e9"/>
</svg>`,
  },
};

export default function BoatSVG({
  variant = "fastboat",
  className = "",
}: {
  variant?: BoatVariant;
  className?: string;
}) {
  const boat = boats[variant];
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: boat.svg }}
    />
  );
}
