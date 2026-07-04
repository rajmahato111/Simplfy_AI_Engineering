import { slugify } from "./slug";
import type { Question } from "../../lib/question-schema";

export type TopicContext = {
  slug: string;
  label: string;
  cohort?: string;
};

const SECTIONS: Array<{ re: RegExp; ctx: TopicContext }> = [
  { re: /^RAG Architecture Questions/i, ctx: { slug: "rag-architecture", label: "RAG Architecture" } },
  { re: /^Agentic Systems Questions/i, ctx: { slug: "agentic-systems", label: "Agentic Systems" } },
  { re: /^Model Selection Questions/i, ctx: { slug: "model-selection", label: "Model Selection" } },
  { re: /^Optimization Questions/i, ctx: { slug: "optimization", label: "Optimization" } },
  { re: /^Evaluation Questions/i, ctx: { slug: "evaluation", label: "Evaluation" } },
  {
    re: /^Production and MLOps Questions/i,
    ctx: { slug: "production-mlops", label: "Production & MLOps" },
  },
  {
    re: /^Tooling and Lifecycle Questions/i,
    ctx: { slug: "tooling-lifecycle", label: "Tooling & Lifecycle" },
  },
  { re: /^Ensemble Methods Questions/i, ctx: { slug: "ensemble-methods", label: "Ensemble Methods" } },
  {
    re: /^Advanced Questions \(December 2025\)/i,
    ctx: { slug: "advanced", label: "Advanced", cohort: "2025-12" },
  },
  {
    re: /^Advanced Questions - March 2026/i,
    ctx: { slug: "advanced", label: "Advanced", cohort: "2026-03" },
  },
  {
    re: /^Advanced Questions - May 2026/i,
    ctx: { slug: "advanced", label: "Advanced", cohort: "2026-05" },
  },
  {
    re: /^Advanced Questions - June 2026/i,
    ctx: { slug: "advanced", label: "Advanced", cohort: "2026-06" },
  },
  {
    re: /^System Design Scenarios/i,
    ctx: { slug: "system-design-scenario", label: "System Design Scenario" },
  },
];

function extractBlock(body: string, label: string) {
  const re = new RegExp(
    `\\*\\*${label}(?:\\s+to\\s+expect)?(?:\\s+to\\s+mention)?:?\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*|$)`,
    "i",
  );
  const m = body.match(re);
  return m ? m[1].trim() : "";
}

function parseBullets(text: string) {
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-"))
    .map((l) => l.replace(/^-\s*/, "").replace(/\*\*/g, "").trim())
    .filter(Boolean);
}

function parseNumbered(text: string) {
  if (!text) return [];
  const items: string[] = [];
  for (const line of text.split("\n")) {
    const top = line.match(/^\d+\.\s+\*\*(.+?)\*\*/);
    const num = line.match(/^\d+\.\s+(.+)/);
    if (top) items.push(top[1].trim());
    else if (num && !line.startsWith("   ")) items.push(num[1].replace(/\*\*/g, "").trim());
  }
  return items.filter(Boolean);
}

function excerpt(text: string, max = 480) {
  const flat = text.replace(/\*\*/g, "").replace(/\n+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

function inferDifficulty(topic: string, upstreamId: string): Question["difficulty"] {
  if (topic === "rag-architecture" && upstreamId.startsWith("Q")) {
    const n = parseInt(upstreamId.slice(1), 10);
    if (n <= 4) return "beginner";
    if (n <= 7) return "intermediate";
  }
  if (upstreamId.startsWith("scenario")) return "advanced";
  if (topic === "advanced") return "advanced";
  return "intermediate";
}

export function parseQuestionBank(md: string): Question[] {
  const questions: Question[] = [];
  const slugUsed = new Set<string>();
  let topic: TopicContext = { slug: "general", label: "General" };

  for (const line of md.split("\n")) {
    const section = line.match(/^## (.+)/);
    if (section) {
      const hit = SECTIONS.find((s) => s.re.test(section[1]));
      if (hit) topic = hit.ctx;
    }
  }

  // Re-walk with section tracking inline
  topic = { slug: "general", label: "General" };
  const parts = md.split(/^### /m).slice(1);

  for (const part of parts) {
    const firstLine = part.split("\n")[0];
    const qMatch = firstLine.match(/^(Q(\d+)):\s*(.+)$/);
    const sMatch = firstLine.match(/^Scenario (\d+):\s*(.+)$/);
    if (!qMatch && !sMatch) continue;

    const upstream_id = qMatch ? qMatch[1] : `scenario-${sMatch![1]}`;
    const title = (qMatch ? qMatch[3] : sMatch![2]).trim();
    const body = part.slice(firstLine.length);

    // Update topic from nearest preceding ## in full md — use part index
    const partStart = md.indexOf(`### ${firstLine}`);
    const before = md.slice(0, partStart);
    for (const line of before.split("\n")) {
      const section = line.match(/^## (.+)/);
      if (section) {
        const hit = SECTIONS.find((s) => s.re.test(section[1]));
        if (hit) topic = hit.ctx;
      }
    }

    const looksFor = parseBullets(extractBlock(body, "What interviewers look for"));
    let strong = parseNumbered(
      extractBlock(body, "Strong answer covers") ||
        extractBlock(body, "Strong answer structure") ||
        extractBlock(body, "Strong answer framework"),
    );
    if (!strong.length) strong = parseBullets(extractBlock(body, "Strong answer covers"));

    const sample = extractBlock(body, "Sample Answer") || extractBlock(body, "Strong answer");
    const requirements = extractBlock(body, "Requirements");
    const followRaw = extractBlock(body, "Follow-up to expect") || extractBlock(body, "Follow-ups");
    const keyInsight =
      extractBlock(body, "Key insight to mention") || extractBlock(body, "Key insight");

    let baseSlug = slugify(title);
    if (slugUsed.has(baseSlug)) baseSlug = `${baseSlug}-${upstream_id.toLowerCase()}`;
    slugUsed.add(baseSlug);

    const num = qMatch ? parseInt(qMatch[2], 10) : questions.length + 1;

    questions.push({
      id: `q-${String(num).padStart(3, "0")}`,
      upstream_id,
      slug: baseSlug,
      title,
      topic: topic.slug,
      topic_label: topic.label,
      cohort: topic.cohort,
      difficulty: inferDifficulty(topic.slug, upstream_id),
      role_tags: [],
      company_tags: [],
      body_md: requirements || title,
      interviewer_looks_for: looksFor,
      strong_answer_covers: strong,
      follow_ups: followRaw ? [followRaw.replace(/\*\*/g, "").trim()] : undefined,
      key_insight: keyInsight ? excerpt(keyInsight, 320) : undefined,
      sample_answer_excerpt: sample ? excerpt(sample) : undefined,
      status: "draft",
      source: "upstream",
    });
  }

  return questions;
}
