import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://taptogo.id";

export const metadata: Metadata = {
  title: "Blog — Tips & Panduan Fastboat Lombok-Bali | tapToGo",
  description:
    "Artikel, panduan, dan tips lengkap soal fastboat dari Lombok ke Bali, Gili Islands, dan Nusa Penida. Update terbaru 2026.",
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: "Blog tapToGo — Tips & Panduan Fastboat Lombok-Bali",
    description:
      "Panduan lengkap, tips traveler, dan info terkini soal fastboat Lombok-Bali.",
    url: `${BASE_URL}/blog`,
    type: "website",
  },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogIndexPage() {
  // Show ID posts by default (since most users are local). EN switching can come later.
  const posts = getAllPosts("id");

  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />

      {/* Hero */}
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-semibold mb-4 hover:opacity-80"
            style={{ color: "#bae6fd" }}
          >
            ← Home
          </Link>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
            Blog
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "#bae6fd" }}>
            Tips, panduan, dan info terbaru soal fastboat Lombok–Bali dan Gili Islands.
          </p>
        </div>
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 48 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff" />
          </svg>
        </div>
      </div>

      {/* Post list */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {posts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center" style={{ border: "1.5px solid #e0f2fe" }}>
            <p className="text-xl font-bold mb-2" style={{ color: "#0c4a6e" }}>Belum ada artikel</p>
            <p className="text-sm" style={{ color: "#64748b" }}>Stay tuned, artikel pertama segera publish!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-white rounded-2xl overflow-hidden transition-all hover:-translate-y-1 group"
                style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}
              >
                {post.coverImage && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs mb-3">
                    {post.category && (
                      <span
                        className="px-2 py-0.5 rounded-md font-bold"
                        style={{ background: "#e0f2fe", color: "#0369a1" }}
                      >
                        {post.category}
                      </span>
                    )}
                    <span style={{ color: "#94a3b8" }}>· {formatDate(post.publishedAt)}</span>
                    <span style={{ color: "#94a3b8" }}>· {post.readingTime}</span>
                  </div>
                  <h2 className="text-xl font-extrabold mb-2 group-hover:text-sky-600 transition-colors" style={{ color: "#0c4a6e" }}>
                    {post.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                    {post.description}
                  </p>
                  <p className="mt-4 text-sm font-bold" style={{ color: "#0369a1" }}>
                    Baca artikel →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
