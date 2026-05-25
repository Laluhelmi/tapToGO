"use client";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import type { BlogPost } from "@/lib/blog";

interface Props {
  postsId: BlogPost[];
  postsEn: BlogPost[];
}

function formatDate(iso: string, lang: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function BlogList({ postsId, postsEn }: Props) {
  const { lang } = useLang();
  const posts = lang === "en" ? postsEn : postsId;
  const isID = lang === "id";

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-16 text-center" style={{ border: "1.5px solid #e0f2fe" }}>
        <p className="text-xl font-bold mb-2" style={{ color: "#0c4a6e" }}>
          {isID ? "Belum ada artikel" : "No articles yet"}
        </p>
        <p className="text-sm" style={{ color: "#64748b" }}>
          {isID ? "Stay tuned, artikel pertama segera publish!" : "Stay tuned, the first article is coming soon!"}
        </p>
      </div>
    );
  }

  return (
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
              <img src={post.coverImage} alt={post.title} loading="lazy" decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          )}
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs mb-3 flex-wrap">
              {post.category && (
                <span className="px-2 py-0.5 rounded-md font-bold" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                  {post.category}
                </span>
              )}
              <span style={{ color: "#94a3b8" }}>· {formatDate(post.publishedAt, lang)}</span>
              <span style={{ color: "#94a3b8" }}>· {post.readingTime}</span>
            </div>
            <h2 className="text-xl font-extrabold mb-2 group-hover:text-sky-600 transition-colors" style={{ color: "#0c4a6e" }}>
              {post.title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
              {post.description}
            </p>
            <p className="mt-4 text-sm font-bold" style={{ color: "#0369a1" }}>
              {isID ? "Baca artikel →" : "Read article →"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
