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

const STRONG_LABELS = [
  "Strong answer covers",
  "Strong answer structure",
  "Strong answer framework",
  "Strong answer",
];

const SAMPLE_LABELS = ["Sample Answer"];
const FOLLOW_LABELS = ["Follow-up to expect", "Follow-ups", "Follow-up"];

const RUBRIC_HEADERS =
  "Sample Answer|Follow-up to expect|Follow-ups|Follow-up|Key insight to mention|Key insight|Key points to cover|Requirements|What interviewers look for|Strong answer covers|Strong answer structure|Strong answer framework|Strong answer(?!\\s+framework)";

function extractStrongAnswerBlock(body: string) {
  const specific = extractFirstBlock(body, [
    "Strong answer covers",
    "Strong answer structure",
    "Strong answer framework",
    "Strong answer",
  ]);
  if (specific) return specific;

  const m = body.match(/\*\*Strong answer(?:\s+\([^)]+\))?:\*\*\s*/i);
  if (!m || m.index === undefined) return "";
  const after = body.slice(m.index + m[0].length);
  if (/^\s*\n/.test(after)) {
    return extractMultiline(after.replace(/^\s*\n+/, ""));
  }
  return after.trimStart().split("\n")[0].trim();
}

function extractMultiline(afterHeader: string) {
  const stopRe = new RegExp(`(?=\\n\\*\\*(?:${RUBRIC_HEADERS})|\\n---|\\n###)`);
  const idx = afterHeader.search(stopRe);
  return (idx < 0 ? afterHeader : afterHeader.slice(0, idx)).trim();
}

function extractBlock(body: string, label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const headerRe = new RegExp(
    `\\*\\*${escaped}(?:\\s+to\\s+expect)?(?:\\s+to\\s+mention)?:?\\*\\*`,
    "i",
  );
  const m = body.match(headerRe);
  if (!m || m.index === undefined) return "";
  const after = body.slice(m.index + m[0].length);
  if (/^\s*\n/.test(after)) {
    return extractMultiline(after.replace(/^\s*\n+/, ""));
  }
  const inline = after.trimStart().split("\n")[0].trim();
  return inline;
}

function extractFirstBlock(body: string, labels: string[]) {
  for (const label of labels) {
    const block = extractBlock(body, label);
    if (block) return block;
  }
  return "";
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

function parseTableFirstColumn(text: string) {
  const items: string[] = [];
  let pastHeader = false;
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!/^\|.+\|$/.test(trimmed)) continue;
    if (/^\|[\s-:|]+\|$/.test(trimmed)) {
      pastHeader = true;
      continue;
    }
    if (!pastHeader) continue;
    const cells = trimmed
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    const first = cells[0]?.replace(/\*\*/g, "").trim();
    if (first && !/^(factor|strategy|pattern|feature|metric|database)$/i.test(first)) items.push(first);
  }
  return items;
}

function parseBoldSections(text: string) {
  const skip = /^(strong answer|sample|follow-up|key insight|requirements|what|when|critical principle)$/i;
  const items: string[] = [];
  for (const m of text.matchAll(/\*\*([^*\n]+?):\*\*/g)) {
    const title = m[1].trim();
    if (title.length < 4 || skip.test(title)) continue;
    items.push(title);
  }
  return items;
}

function parseProseCovers(text: string) {
  const paren = [...text.matchAll(/\(\d+\)\s+([^.\n(]+)/g)]
    .map((m) => m[1].replace(/\*\*/g, "").trim())
    .filter(Boolean);
  if (paren.length >= 2) return paren;
  const sentences = text
    .replace(/\*\*/g, "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && s.length < 220);
  if (sentences.length >= 3) return sentences.slice(0, 6);
  if (text.trim().length > 80) return [excerpt(text, 200)];
  return [];
}

function parseStrongAnswer(text: string) {
  if (!text) return [];

  const numbered = parseNumbered(text);
  const bullets = parseBullets(text);
  const tableRows = parseTableFirstColumn(text);
  const boldSections = parseBoldSections(text);

  if (numbered.length >= 2) {
    return [...new Set([...numbered, ...bullets])];
  }
  if (bullets.length >= 2) return bullets;
  if (tableRows.length >= 2) return tableRows;
  if (boldSections.length >= 2) return [...new Set([...boldSections, ...bullets])];

  const mixed = [...new Set([...numbered, ...bullets, ...tableRows, ...boldSections])].filter(Boolean);
  if (mixed.length >= 2) return mixed;
  return parseProseCovers(text);
}

function parseFollowUps(raw: string) {
  if (!raw) return [];
  const bullets = parseBullets(raw);
  if (bullets.length) return bullets;
  const cleaned = raw.replace(/\*\*/g, "").trim();
  const questions = cleaned.split(/(?<=\?)\s+/).map((s) => s.trim()).filter(Boolean);
  if (questions.length > 1) return questions;
  return [cleaned];
}

function excerpt(text: string, max = 480) {
  const flat = text.replace(/\*\*/g, "").replace(/\n+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

function capSample(text: string, max = 10_000) {
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

function inferDifficulty(topic: string, upstreamId: string): Question["difficulty"] {
  if (upstreamId.startsWith("scenario")) return "advanced";
  if (topic === "advanced") return "advanced";

  const beginner = new Set([
    "Q1", "Q2", "Q3", "Q4",
    "Q11", "Q12",
    "Q18",
    "Q22",
    "Q27",
    "Q34",
    "Q38",
  ]);
  if (beginner.has(upstreamId)) return "beginner";

  return "intermediate";
}

export function parseQuestionBank(md: string): Question[] {
  const questions: Question[] = [];
  const slugUsed = new Set<string>();
  let topic: TopicContext = { slug: "general", label: "General" };

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
    const strongBlock =
      extractStrongAnswerBlock(body) || extractBlock(body, "Key points to cover");
    let strong = parseStrongAnswer(strongBlock);
    let sample = extractFirstBlock(body, SAMPLE_LABELS);
    if (!sample && strongBlock.length > 80) {
      sample = strongBlock;
    }
    if (!strong.length && sample) {
      strong = parseStrongAnswer(sample);
    }
    const requirements = extractBlock(body, "Requirements");
    const followRaw = extractFirstBlock(body, FOLLOW_LABELS);
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
      follow_ups: followRaw ? parseFollowUps(followRaw) : undefined,
      key_insight: keyInsight ? excerpt(keyInsight, 320) : undefined,
      sample_answer_excerpt: sample ? excerpt(sample) : undefined,
      sample_answer_md: sample ? capSample(sample) : undefined,
      status: "draft",
      source: "upstream",
    });
  }

  return questions;
}
