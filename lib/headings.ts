export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function extractH2Headings(content: string) {
  return [...content.matchAll(/^## (.+)$/gm)].map((m) => ({
    id: slugifyHeading(m[1]),
    title: m[1],
  }));
}
