#!/usr/bin/env npx tsx
import fs from "fs";
import path from "path";
import { fetchUpstreamFile } from "./lib/upstream-fetch";
import { slugify } from "./lib/slug";
import type { Pattern } from "../lib/pattern-schema";

function parseTableRows(section: string, category: string, kind: Pattern["kind"]) {
  const patterns: Pattern[] = [];
  let headerSeen = false;

  for (const line of section.split("\n")) {
    if (!line.startsWith("|")) continue;
    if (/^\|[\s|:-]+\|$/.test(line.replace(/\s/g, ""))) continue;

    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cells.length < 3) continue;

    const head = cells[0].replace(/\*\*/g, "");
    if (!headerSeen && (head === "Pattern" || head === "Anti-Pattern")) {
      headerSeen = true;
      continue;
    }
    headerSeen = true;

    const name = cells[0].replace(/\*\*/g, "").trim();
    patterns.push({
      id: slugify(`${category}-${name}`),
      name,
      category,
      use_case: cells[1],
      key_tradeoff: cells[2],
      kind,
      source: "upstream",
    });
  }
  return patterns;
}

async function main() {
  const md = await fetchUpstreamFile("PATTERNS.md");
  const patterns: Pattern[] = [];
  const chunks = md.split(/^## /m).slice(1);

  for (const chunk of chunks) {
    const titleLine = chunk.split("\n")[0].trim();
    if (/Anti-Patterns/i.test(titleLine)) {
      patterns.push(...parseTableRows(chunk, "Anti-Patterns", "anti-pattern"));
      continue;
    }
    if (titleLine.includes("Pattern Selection")) continue;
    const category = titleLine.replace(/ Patterns.*$/, "").trim();
    if (!category) continue;
    patterns.push(...parseTableRows(chunk, category, "pattern"));
  }

  const out = path.join(process.cwd(), "data", "patterns.json");
  fs.writeFileSync(out, JSON.stringify(patterns, null, 2) + "\n");
  console.log(`Wrote ${patterns.length} pattern(s) → data/patterns.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
