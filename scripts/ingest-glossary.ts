#!/usr/bin/env npx tsx
import fs from "fs";
import path from "path";
import { fetchUpstreamFile } from "./lib/upstream-fetch";
import { slugify } from "./lib/slug";
import type { GlossaryTerm } from "../lib/glossary-schema";

const TERM_RE = /^\*\*(.+?)\*\*\s*-\s*(.+)$/;
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function stripLinks(text: string) {
  return text.replace(LINK_RE, "$1").trim();
}

function extractChapterRefs(text: string) {
  const refs: string[] = [];
  for (const m of text.matchAll(LINK_RE)) {
    if (m[2].endsWith(".md")) refs.push(m[2].replace(/\.md$/, ""));
  }
  return refs;
}

async function main() {
  const md = await fetchUpstreamFile("GLOSSARY.md");
  const terms: GlossaryTerm[] = [];
  let letter = "";

  for (const line of md.split("\n")) {
    const heading = line.match(/^## ([A-Z])$/);
    if (heading) {
      letter = heading[1];
      continue;
    }
    const m = line.match(TERM_RE);
    if (!m || !letter) continue;
    const term = m[1].trim();
    const definition = stripLinks(m[2].trim());
    terms.push({
      id: slugify(term.split("(")[0].trim()),
      term,
      definition,
      letter,
      chapter_refs: extractChapterRefs(line),
      source: "upstream",
    });
  }

  const out = path.join(process.cwd(), "data", "glossary.json");
  fs.writeFileSync(out, JSON.stringify(terms, null, 2) + "\n");
  console.log(`Wrote ${terms.length} glossary term(s) → data/glossary.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
