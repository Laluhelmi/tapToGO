import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogList from "@/components/BlogList";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://taptogo.id";

export const metadata: Metadata = {
  title: "Blog — Tips & Guides for Lombok-Bali Fastboat | tapToGo",
  description:
    "Articles, guides, and tips on fastboat travel from Lombok to Bali and the Gili Islands. Latest updates for 2026.",
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: "Blog tapToGo — Tips & Guides for Lombok-Bali Fastboat",
    description:
      "Complete guides, traveler tips, and up-to-date info on fastboat travel Lombok-Bali.",
    url: `${BASE_URL}/blog`,
    type: "website",
  },
};

export default function BlogIndexPage() {
  const postsId = getAllPosts("id");
  const postsEn = getAllPosts("en");

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
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">Blog</h1>
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <BlogList postsId={postsId} postsEn={postsEn} />
      </main>

      <Footer />
    </div>
  );
}
