/** Canonical site URL for metadata, sitemap, and auth callbacks. */
export function siteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return url.replace(/\/$/, "");
}
