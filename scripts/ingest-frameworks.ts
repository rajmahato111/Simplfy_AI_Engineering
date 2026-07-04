#!/usr/bin/env npx tsx
import fs from "fs";
import path from "path";
import { fetchUpstreamFile } from "./lib/upstream-fetch";
import type { Framework, FrameworkPhase } from "../lib/framework-schema";

const MAIN_SECTIONS = [
  { heading: "## System Design Framework (SPIDER)", id: "spider", acronym: "SPIDER" },
  { heading: "## Concept Explanation Framework (ETA)", id: "eta", acronym: "ETA" },
  { heading: "## Tradeoff Analysis Framework", id: "tradeoff" },
  { heading: "## Debugging and Troubleshooting Framework", id: "debugging" },
  { heading: "## Behavioral Questions Framework (STAR-L)", id: "star-l", acronym: "STAR-L" },
];

function sectionBody(md: string, heading: string) {
  const start = md.indexOf(heading);
  if (start < 0) return "";
  const rest = md.slice(start + heading.length);
  const next = rest.search(/\n## /);
  return next < 0 ? rest : rest.slice(0, next);
}

function firstParagraph(body: string) {
  return body
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#") && !l.startsWith("```") && !l.startsWith("|"))
    ?.replace(/\*\*/g, "")
    ?.trim() ?? "";
}

function parsePhases(body: string): FrameworkPhase[] {
  const phases: FrameworkPhase[] = [];
  for (const m of body.matchAll(/^### ([A-Z]) - (.+)$/gm)) {
    const blockStart = m.index ?? 0;
    const next = body.slice(blockStart + m[0].length).search(/\n### /);
    const block = next < 0 ? body.slice(blockStart) : body.slice(blockStart, blockStart + m[0].length + next);
    const purpose = block.match(/\*\*Purpose:\*\*\s*(.+)/)?.[1]?.trim() ?? "";
    phases.push({ letter: m[1], name: m[2].trim(), purpose });
  }
  return phases;
}

function parseAntiPatterns(body: string) {
  const section = body.match(/\*\*Anti-pattern:\*\*\s*(.+)/g) ?? [];
  return section.map((s) => s.replace(/\*\*Anti-pattern:\*\*\s*/, "").trim());
}

async function main() {
  const md = await fetchUpstreamFile("00-interview-prep/02-answer-frameworks.md");
  const frameworks: Framework[] = MAIN_SECTIONS.map(({ heading, id, acronym }) => {
    const body = sectionBody(md, heading);
    const title = heading.replace(/^##\s*/, "").replace(/\s*\([^)]+\)\s*$/, "").trim();
    return {
      id,
      name: title,
      acronym,
      use_for: firstParagraph(body),
      summary: firstParagraph(body),
      phases: parsePhases(body),
      anti_patterns: parseAntiPatterns(body),
      source: "upstream" as const,
    };
  });

  const out = path.join(process.cwd(), "data", "frameworks.json");
  fs.writeFileSync(out, JSON.stringify(frameworks, null, 2) + "\n");
  console.log(`Wrote ${frameworks.length} framework(s) → data/frameworks.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
