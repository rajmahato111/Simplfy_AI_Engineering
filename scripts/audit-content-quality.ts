#!/usr/bin/env npx tsx
/**
 * Content quality audit — MDX, questions, diagrams.
 * Run: npm run audit:content
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import questions from "../data/questions.json";
import type { Question } from "../lib/question-schema";

const CONTENT = path.join(process.cwd(), "content");
const PLACEHOLDER_ANALOGY = "running a kitchen during rush hour";
const GENERIC_SVG = 'viewBox="0 0 520 100"';
const GENERIC_TRADEOFF = "| Simpler design | Faster to ship | Less resilient |";

type MdxRow = {
  slug: string;
  status: string;
  est_minutes: number;
  computed_minutes: number;
  words: number;
  placeholder: boolean;
  generic_diagram: boolean;
  missing_sections: string[];
};

const CONCEPT_SECTIONS = [
  "The 30-second version",
  "The analogy",
  "How it actually works",
  "A concrete example",
  "The tradeoffs that matter",
  "Where people go wrong",
  "The interview lens",
  "Go deeper",
];

function walkMdx(dir: string, files: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkMdx(full, files);
    else if (e.name.endsWith(".mdx")) files.push(full);
  }
  return files;
}

function estFromWords(words: number, type: string) {
  const wpm = type === "walkthrough" ? 160 : 200;
  return Math.max(type === "walkthrough" ? 15 : 5, Math.min(45, Math.round(words / wpm)));
}

function missingSections(body: string, type: string) {
  const required = type === "walkthrough"
    ? ["The question", "What the interviewer is actually testing", "Go deeper"]
    : CONCEPT_SECTIONS;
  return required.filter((h) => !body.includes(`## ${h}`));
}

const mdxRows: MdxRow[] = [];
for (const file of walkMdx(CONTENT)) {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  const rel = path.relative(CONTENT, file).replace(/\.mdx$/, "");
  const diagrams = (data.diagrams as string[]) ?? [];
  let generic_diagram = false;
  for (const d of diagrams) {
    const svg = path.join(path.dirname(file), d);
    if (fs.existsSync(svg) && fs.readFileSync(svg, "utf8").includes(GENERIC_SVG)) {
      generic_diagram = true;
    }
  }
  mdxRows.push({
    slug: rel,
    status: data.status as string,
    est_minutes: data.est_minutes as number,
    computed_minutes: estFromWords(words, data.type as string),
    words,
    placeholder: content.includes(PLACEHOLDER_ANALOGY) || content.includes(GENERIC_TRADEOFF),
    generic_diagram,
    missing_sections: missingSections(content, data.type as string),
  });
}

const q = questions as Question[];
const diff = { beginner: 0, intermediate: 0, advanced: 0 };
for (const x of q) diff[x.difficulty]++;

console.log("=== Content quality audit ===\n");

console.log("MDX chapters:", mdxRows.length);
console.log(
  "  status:",
  Object.entries(
    mdxRows.reduce((a, r) => {
      a[r.status] = (a[r.status] ?? 0) + 1;
      return a;
    }, {} as Record<string, number>),
  )
    .map(([k, v]) => `${k}=${v}`)
    .join(", "),
);
console.log("  placeholder prose:", mdxRows.filter((r) => r.placeholder).length);
console.log("  generic diagrams:", mdxRows.filter((r) => r.generic_diagram).length);
console.log(
  "  est_minutes drift >3 min:",
  mdxRows.filter((r) => Math.abs(r.est_minutes - r.computed_minutes) > 3).length,
);

const reviewedBad = mdxRows.filter(
  (r) =>
    (r.status === "reviewed" || r.status === "approved") &&
    (r.placeholder || r.generic_diagram || r.missing_sections.length > 0),
);
if (reviewedBad.length) {
  console.log("\n  ⚠ reviewed/approved but failing quality:");
  for (const r of reviewedBad) console.log(`    - ${r.slug}`);
}

console.log("\nQuestions:", q.length);
console.log("  difficulty:", diff);
console.log("  with cohort:", q.filter((x) => x.cohort).length, "(expect ~67 for Q50+)");
console.log("  missing strong_answer_covers:", q.filter((x) => !x.strong_answer_covers?.length).length);
console.log("  missing sample_answer_md:", q.filter((x) => !x.sample_answer_md).length);

const drift = mdxRows
  .filter((r) => Math.abs(r.est_minutes - r.computed_minutes) > 3)
  .slice(0, 10);
if (drift.length) {
  console.log("\nSample est_minutes drift (first 10):");
  for (const r of drift) {
    console.log(`  ${r.slug}: frontmatter=${r.est_minutes} computed=${r.computed_minutes} (${r.words} words)`);
  }
}

const placeholders = mdxRows.filter((r) => r.placeholder).slice(0, 8);
if (placeholders.length) {
  console.log("\nSample placeholder chapters:");
  for (const r of placeholders) console.log(`  - ${r.slug} [${r.status}]`);
}

console.log("\nRun `npm run sync:mdx-metadata` to fix est_minutes on drafts.");
console.log("See docs/content-review-plan.md for the full rewrite program.");
