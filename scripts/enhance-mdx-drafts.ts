#!/usr/bin/env npx tsx
/**
 * Scaffold missing style-guide section headings on draft MDX only.
 * Does NOT mark reviewed, does NOT invent analogies/diagrams — human rewrite required.
 * Skips reviewed/approved files.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT = path.join(process.cwd(), "content");
const ATTRIBUTION =
  "Factual basis: AI System Design Guide (MIT) by Om Bharatiya; structured reader edition with interview lens. See CREDITS.md.";

function walkMdx(dir: string, files: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkMdx(full, files);
    else if (e.name.endsWith(".mdx")) files.push(full);
  }
  return files;
}

function splitSections(body: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const part of body.split(/^## /m)) {
    if (!part.trim()) continue;
    const nl = part.indexOf("\n");
    const title = (nl < 0 ? part : part.slice(0, nl)).trim();
    const content = nl < 0 ? "" : part.slice(nl + 1).trim();
    if (title) map.set(title, content);
  }
  return map;
}

function firstParagraph(text: string) {
  for (const block of text.split(/\n{2,}/)) {
    const t = block.trim();
    if (t && !t.startsWith("#") && !t.startsWith("|") && !t.startsWith("```") && t.length > 40) {
      return t.replace(/\*\*/g, "");
    }
  }
  return "";
}

function firstTable(text: string) {
  const lines = text.split("\n");
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].trim().startsWith("|") && /^\|[\s-:|]+\|$/.test(lines[i + 1]?.trim() ?? "")) {
      const table: string[] = [lines[i], lines[i + 1]];
      for (let j = i + 2; j < lines.length; j++) {
        if (!lines[j].trim().startsWith("|")) break;
        table.push(lines[j]);
      }
      return table.join("\n");
    }
  }
  return "";
}

function bulletSection(text: string, min = 3) {
  const bullets = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-"))
    .map((l) => l.replace(/^-\s*/, "").replace(/\*\*/g, ""))
    .filter((l) => l.length > 10);
  return bullets.length >= min ? bullets.slice(0, 5).map((b) => `- ${b}`).join("\n") : "";
}

function interviewBlock(text: string) {
  const m = text.match(/## Interview Questions[\s\S]*/i);
  if (m) return m[0].replace(/^## Interview Questions\s*/i, "").trim();
  const bullets = bulletSection(text, 2);
  if (bullets) return bullets;
  return "- What tradeoffs would you highlight in an interview?\n- How would you measure success in production?\n- What failure modes would you design for?";
}


function enhanceConcept(title: string, sections: Map<string, string>) {
  const main =
    sections.get("How it actually works") ??
    [...sections.values()].find((v) => v.length > 200) ??
    "";
  const summary = sections.get("The 30-second version") || firstParagraph(main) || title;

  if (!sections.has("The 30-second version")) {
    sections.set("The 30-second version", summary);
  }
  if (!sections.has("The analogy")) {
    sections.set(
      "The analogy",
      `<!-- TODO: write a chapter-specific analogy with mapping table (see content-style-guide.md) -->`,
    );
  }
  if (!sections.has("How it actually works") && main) {
    sections.set("How it actually works", main);
  }
  if (!sections.has("A concrete example")) {
    const ex =
      bulletSection(main, 1) ||
      firstParagraph(main) ||
      "Walk through one realistic request with latency, cost, and failure handling numbers in the interview.";
    sections.set("A concrete example", ex);
  }
  if (!sections.has("The tradeoffs that matter")) {
    const table = firstTable(main);
    sections.set(
      "The tradeoffs that matter",
      table ||
        "| Choice | Upside | Cost |\n|--------|--------|------|\n| Simpler design | Faster to ship | Less resilient |\n| Heavier retrieval | Better grounding | More latency |\n| Bigger model | Higher quality | Higher $/query |",
    );
  }
  if (!sections.has("Where people go wrong")) {
    sections.set(
      "Where people go wrong",
      bulletSection(main, 3) ||
        "- Skipping evaluation and hoping demos generalize\n- Ignoring latency/cost until production traffic arrives\n- Treating retrieval quality as a generation problem",
    );
  }
  if (!sections.has("The interview lens")) {
    sections.set("The interview lens", interviewBlock(main));
  }
  if (!sections.has("Go deeper")) {
    sections.set(
      "Go deeper",
      "- [Question bank](/questions) for related prompts\n- [SPIDER practice](/practice) for timed walkthroughs\n- [Mock interview](/mock) for full simulation",
    );
  }

  const order = [
    "The 30-second version",
    "The analogy",
    "How it actually works",
    "A concrete example",
    "The tradeoffs that matter",
    "Where people go wrong",
    "The interview lens",
    "Go deeper",
  ];
  return order
    .filter((h) => sections.has(h))
    .map((h) => `## ${h}\n\n${sections.get(h)}`)
    .join("\n\n");
}

function enhanceWalkthrough(title: string, sections: Map<string, string>) {
  const main = sections.get("How it actually works") || [...sections.values()].join("\n\n");
  if (!sections.has("The question")) {
    sections.set("The question", firstParagraph(main) || title);
  }
  if (!sections.has("What the interviewer is actually testing")) {
    sections.set(
      "What the interviewer is actually testing",
      bulletSection(main, 2) ||
        "- End-to-end system thinking\n- Tradeoff articulation under time pressure\n- Production concerns: evals, reliability, cost",
    );
  }
  if (!sections.has("How it actually works")) {
    sections.set("How it actually works", main);
  }
  if (!sections.has("Go deeper")) {
    sections.set("Go deeper", "- [Whiteboard exercises](/whiteboard)\n- [Practice mode](/practice)");
  }
  const order = [
    "The question",
    "What the interviewer is actually testing",
    "How it actually works",
    "The interview lens",
    "Go deeper",
  ];
  return order
    .filter((h) => sections.has(h))
    .map((h) => `## ${h}\n\n${sections.get(h)}`)
    .join("\n\n");
}

let enhanced = 0;
for (const file of walkMdx(CONTENT)) {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  if (data.status === "reviewed" || data.status === "approved") continue;

  const slug = data.slug as string;
  const title = data.title as string;
  const type = data.type as string;

  const sections = splitSections(content);
  const body =
    type === "walkthrough" ? enhanceWalkthrough(title, sections) : enhanceConcept(title, sections);

  const diagrams = Array.isArray(data.diagrams) ? data.diagrams : [];

  const updated = {
    ...data,
    diagrams,
    source_attribution: data.source_attribution ?? ATTRIBUTION,
    status: "draft",
  };

  fs.writeFileSync(file, matter.stringify(body, updated));
  enhanced++;
}

console.log(`Scaffolded ${enhanced} draft MDX file(s) (still draft — needs human rewrite)`);
