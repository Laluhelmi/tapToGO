export default function SkeletonCard() {
  return (
    <div
      className="bg-white rounded-3xl overflow-hidden animate-pulse"
      style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.04)" }}
    >
      {/* Image */}
      <div className="w-full h-44" style={{ background: "linear-gradient(135deg,#e0f2fe,#bae6fd)" }} />

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="h-5 rounded" style={{ background: "#e0f2fe", width: "60%" }} />
        <div className="h-3 rounded" style={{ background: "#f0f9ff", width: "40%" }} />

        <div className="flex items-center justify-between pt-3">
          <div className="space-y-1">
            <div className="h-6 w-14 rounded" style={{ background: "#e0f2fe" }} />
            <div className="h-3 w-10 rounded" style={{ background: "#f0f9ff" }} />
          </div>
          <div className="flex-1 mx-3 h-0.5 rounded" style={{ background: "#e0f2fe" }} />
          <div className="space-y-1">
            <div className="h-6 w-14 rounded" style={{ background: "#e0f2fe" }} />
            <div className="h-3 w-10 rounded" style={{ background: "#f0f9ff" }} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #f0f9ff" }}>
          <div className="space-y-1">
            <div className="h-6 w-16 rounded" style={{ background: "#e0f2fe" }} />
            <div className="h-3 w-8 rounded" style={{ background: "#f0f9ff" }} />
          </div>
          <div className="h-10 w-20 rounded-2xl" style={{ background: "#e0f2fe" }} />
        </div>
      </div>
    </div>
  );
}
