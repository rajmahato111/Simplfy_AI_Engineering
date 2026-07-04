import type { MetadataRoute } from "next";
import { listContentSlugs } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const staticPages = ["", "/learn", "/questions", "/search", "/credits", "/pricing", "/login"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const chapters = listContentSlugs().map((slug) => ({
    url: `${base}/learn/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...chapters];
}
