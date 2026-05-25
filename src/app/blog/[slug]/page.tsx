import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllPosts, getAllSlugs, getPost } from "@/lib/blog";

const BASE_URL = "https://taptogo.id";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("id", slug) || getPost("en", slug);
  if (!post) return { title: "Article not found · tapToGo" };

  return {
    title: `${post.title} | tapToGo`,
    description: post.description,
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      images: post.coverImage ? [{ url: `${BASE_URL}${post.coverImage}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.coverImage ? [`${BASE_URL}${post.coverImage}`] : undefined,
    },
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost("id", slug) || getPost("en", slug);
  if (!post) notFound();

  const relatedPosts = getAllPosts(post.lang).filter((p) => p.slug !== post.slug).slice(0, 3);

  // JSON-LD Article schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.coverImage ? `${BASE_URL}${post.coverImage}` : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { "@type": "Organization", name: post.author || "tapToGo" },
    publisher: {
      "@type": "Organization",
      name: "tapToGo",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/icon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${post.slug}` },
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="pt-16" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold mb-4 hover:opacity-80"
            style={{ color: "#bae6fd" }}
          >
            ← Semua Artikel
          </Link>

          <div className="flex items-center gap-2 text-xs mb-4">
            {post.category && (
              <span className="px-2.5 py-1 rounded-md font-bold" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                {post.category}
              </span>
            )}
            <span style={{ color: "#bae6fd" }}>· {formatDate(post.publishedAt)} · {post.readingTime}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg" style={{ color: "#bae6fd" }}>{post.description}</p>
        </div>
        <div style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 48 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#f0f9ff" />
          </svg>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {post.coverImage && (
          <div className="rounded-3xl overflow-hidden mb-8" style={{ border: "1.5px solid #e0f2fe" }}>
            <img src={post.coverImage} alt={post.title} className="w-full h-auto object-cover" />
          </div>
        )}

        <article
          className="bg-white rounded-3xl p-6 sm:p-10 blog-content"
          style={{ border: "1.5px solid #e0f2fe", boxShadow: "0 2px 12px rgba(2,132,199,0.07)" }}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: "white", color: "#0369a1", border: "1px solid #bae6fd" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 p-6 rounded-3xl text-center" style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1)", boxShadow: "0 8px 32px rgba(3,105,161,0.25)" }}>
          <p className="text-white text-xl font-extrabold mb-2">Siap pesan tiket fastboat?</p>
          <p className="text-sm mb-4" style={{ color: "#bae6fd" }}>
            145 jadwal dari 21 operator resmi. Booking 2 menit, konfirmasi via WhatsApp.
          </p>
          <Link href="/jadwal" className="inline-block px-6 py-3 rounded-2xl text-sm font-extrabold transition-all hover:scale-105"
            style={{ background: "white", color: "#0369a1" }}>
            🔍 Cek Jadwal Sekarang →
          </Link>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h3 className="text-xl font-extrabold mb-4" style={{ color: "#0c4a6e" }}>Artikel Terkait</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`}
                  className="block bg-white rounded-2xl p-4 hover:-translate-y-0.5 transition-all"
                  style={{ border: "1.5px solid #e0f2fe" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: "#0369a1" }}>{formatDate(p.publishedAt)}</p>
                  <p className="text-sm font-bold leading-snug" style={{ color: "#0c4a6e" }}>{p.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      <style>{`
        .blog-content h2 { font-size: 1.5rem; font-weight: 800; color: #0c4a6e; margin-top: 2rem; margin-bottom: 0.75rem; }
        .blog-content h3 { font-size: 1.15rem; font-weight: 700; color: #0369a1; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .blog-content h2:first-child, .blog-content h3:first-child { margin-top: 0; }
        .blog-content p { color: #334155; line-height: 1.75; margin-bottom: 1rem; font-size: 1rem; }
        .blog-content ul, .blog-content ol { margin: 0.75rem 0 1rem 1.5rem; }
        .blog-content ul li { list-style: disc; color: #334155; line-height: 1.75; margin-bottom: 0.35rem; }
        .blog-content ol li { list-style: decimal; color: #334155; line-height: 1.75; margin-bottom: 0.35rem; }
        .blog-content a { color: #0369a1; font-weight: 600; text-decoration: underline; text-decoration-color: #bae6fd; }
        .blog-content a:hover { text-decoration-color: #0369a1; }
        .blog-content strong { color: #0c4a6e; font-weight: 700; }
        .blog-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
        .blog-content th { background: #f0f9ff; color: #0369a1; padding: 0.5rem; text-align: left; font-weight: 700; border-bottom: 2px solid #bae6fd; }
        .blog-content td { padding: 0.5rem; border-bottom: 1px solid #e0f2fe; color: #334155; }
        .blog-content blockquote { border-left: 4px solid #0284c7; padding: 0.5rem 1rem; margin: 1rem 0; background: #f0f9ff; color: #475569; font-style: italic; }
        .blog-content code { background: #f0f9ff; color: #0369a1; padding: 0.125rem 0.375rem; border-radius: 4px; font-family: monospace; font-size: 0.875em; }
        .blog-content pre { background: #0c4a6e; color: white; padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0; }
        .blog-content pre code { background: transparent; color: white; padding: 0; }
      `}</style>
    </div>
  );
}
