import type { MetadataRoute } from "next";
import { getAllRouteSlugs } from "@/lib/routes";
import { SCHEDULES } from "@/data/boats";

const BASE_URL = "https://taptogo-rouge.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static top-level pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/jadwal`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/armada`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/rental`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/tour`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/bantuan`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/promo`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  // Per-route SEO landing pages (24 routes)
  const routePages: MetadataRoute.Sitemap = getAllRouteSlugs().map(slug => ({
    url: `${BASE_URL}/rute/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Per-operator detail pages
  const uniqueOperators = Array.from(new Set(SCHEDULES.map(s => s.operator)));
  const operatorPages: MetadataRoute.Sitemap = uniqueOperators.map(op => ({
    url: `${BASE_URL}/armada/${encodeURIComponent(op)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...routePages, ...operatorPages];
}
