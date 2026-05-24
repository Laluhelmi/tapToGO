import { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className = "" }: Props) {
  return (
    <div
      className={`bg-white rounded-3xl px-6 py-16 text-center ${className}`}
      style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.04)" }}
    >
      <div className="flex justify-center mb-4">
        {icon ?? (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "#f0f9ff" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        )}
      </div>
      <p className="text-lg font-extrabold mb-1" style={{ color: "#0c4a6e" }}>
        {title}
      </p>
      {description && (
        <p className="text-sm mb-4 max-w-md mx-auto" style={{ color: "#64748b" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
