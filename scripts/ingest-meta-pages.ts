#!/usr/bin/env npx tsx
import fs from "fs";
import path from "path";
import { fetchUpstreamFile } from "./lib/upstream-fetch";
import { slugify } from "./lib/slug";
import type { MetaPage, MetaSection } from "../lib/meta-page-schema";

const PAGES = [
  { file: "00-interview-prep/03-common-pitfalls.md", id: "pitfalls", title: "Common pitfalls" },
  { file: "00-interview-prep/05-behavioral-for-ai-roles.md", id: "behavioral", title: "Behavioral for AI roles" },
  { file: "00-interview-prep/06-job-market-trends-2026.md", id: "job-market", title: "Job market 2026" },
  { file: "00-interview-prep/07-faq.md", id: "faq", title: "FAQ" },
];

function cleanBody(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\*\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

function parseSections(md: string): MetaSection[] {
  const sections: MetaSection[] = [];
  for (const m of md.matchAll(/^## (.+)$/gm)) {
    const title = m[1].replace(/⭐.*$/, "").trim();
    if (/table of contents/i.test(title)) continue;
    const start = (m.index ?? 0) + m[0].length;
    const rest = md.slice(start);
    const next = rest.search(/\n## /);
    const body = cleanBody(next < 0 ? rest : rest.slice(0, next)).slice(0, 1200);
    if (!body) continue;
    sections.push({ id: slugify(title), title, body });
  }
  return sections;
}

async function main() {
  const pages: MetaPage[] = [];
  for (const spec of PAGES) {
    const md = await fetchUpstreamFile(spec.file);
    const sections = parseSections(md);
    const summary = sections[0]?.body.slice(0, 280) ?? "";
    pages.push({
      id: spec.id,
      title: spec.title,
      summary,
      sections,
      source: "upstream",
    });
  }
  const out = path.join(process.cwd(), "data", "meta-pages.json");
  fs.writeFileSync(out, JSON.stringify(pages, null, 2) + "\n");
  console.log(`Wrote ${pages.length} meta page(s) → data/meta-pages.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
