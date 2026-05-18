"use client";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Link from "next/link";

interface Props {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, lastUpdated, children }: Props) {
  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      <Navbar />
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/" className="text-sm font-semibold inline-block mb-3" style={{ color: "#bae6fd" }}>
            ← Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{title}</h1>
          <p className="text-sm" style={{ color: "#bae6fd" }}>Last updated: {lastUpdated}</p>
        </div>
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 40 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f8fafc"/>
          </svg>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl p-6 sm:p-10 legal-content"
          style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}>
          {children}
        </div>

        <div className="mt-6 text-center text-sm" style={{ color: "#64748b" }}>
          <p>Need help? Chat us on{" "}
            <a href="https://wa.me/6287821775082" target="_blank" rel="noreferrer"
              className="font-bold" style={{ color: "#0369a1" }}>
              WhatsApp +62 878 2177 5082
            </a>
          </p>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        .legal-content h2 { font-size: 1.25rem; font-weight: 800; color: #0c4a6e; margin-top: 1.75rem; margin-bottom: 0.6rem; }
        .legal-content h2:first-child { margin-top: 0; }
        .legal-content h3 { font-size: 1rem; font-weight: 700; color: #0369a1; margin-top: 1.2rem; margin-bottom: 0.4rem; }
        .legal-content p { color: #334155; line-height: 1.65; margin-bottom: 0.75rem; font-size: 0.95rem; }
        .legal-content ul { margin: 0.5rem 0 0.75rem 1.25rem; }
        .legal-content ul li { color: #334155; line-height: 1.65; margin-bottom: 0.35rem; font-size: 0.95rem; list-style: disc; }
        .legal-content strong { color: #0c4a6e; }
        .legal-content a { color: #0369a1; font-weight: 600; }
        .legal-content a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
