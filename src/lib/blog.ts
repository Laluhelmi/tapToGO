import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export type BlogLang = "id" | "en";

export interface BlogFrontmatter {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;       // ISO date (YYYY-MM-DD)
  updatedAt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;       // /images/blog/...
  readingTime?: string;      // e.g., "6 min read"
  lang: BlogLang;
}

export interface BlogPost extends BlogFrontmatter {
  html: string;
  excerpt: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export function getAllPosts(lang: BlogLang): BlogPost[] {
  const dir = path.join(CONTENT_DIR, lang);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const posts: BlogPost[] = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    return getPost(lang, slug)!;
  });

  // newest first
  return posts.sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1));
}

export function getPost(lang: BlogLang, slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, lang, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const fm = data as Partial<BlogFrontmatter>;
  const wordCount = content.split(/\s+/).length;
  const readingMin = Math.max(1, Math.ceil(wordCount / 220));

  const html = marked.parse(content, { breaks: false, gfm: true }) as string;
  const excerpt =
    fm.description ||
    content
      .replace(/^#.*$/gm, "")
      .replace(/[*_`~]/g, "")
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 180) + "…";

  return {
    title: fm.title || slug,
    description: fm.description || "",
    slug,
    publishedAt: fm.publishedAt || "2026-01-01",
    updatedAt: fm.updatedAt,
    author: fm.author || "tapToGo",
    category: fm.category || "Travel Guide",
    tags: fm.tags || [],
    coverImage: fm.coverImage,
    readingTime: fm.readingTime || `${readingMin} min read`,
    lang,
    html,
    excerpt,
  };
}

export function getAllSlugs(): { lang: BlogLang; slug: string }[] {
  const result: { lang: BlogLang; slug: string }[] = [];
  for (const lang of ["id", "en"] as BlogLang[]) {
    const dir = path.join(CONTENT_DIR, lang);
    if (!fs.existsSync(dir)) continue;
    fs.readdirSync(dir).forEach((file) => {
      if (file.endsWith(".md")) {
        result.push({ lang, slug: file.replace(/\.md$/, "") });
      }
    });
  }
  return result;
}
