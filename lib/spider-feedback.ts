import { SPIDER_PHASES } from "./spider-phases";
import { getQuestionBySlug } from "./questions";
import { anthropicJson, isLlmConfigured } from "./llm";

const PHASE_KEYWORDS: Record<string, string[]> = {
  scope: ["latency", "qps", "scale", "users", "requirement", "constraint", "budget", "volume", "accuracy"],
  prioritize: ["priority", "risk", "bottleneck", "tradeoff", "rank", "critical", "first"],
  initial: ["architecture", "component", "pipeline", "api", "ingestion", "index", "retrieval", "gateway"],
  "deep-dive": ["chunk", "embedding", "rerank", "hybrid", "vector", "agent", "tool", "cache"],
  eval: ["metric", "eval", "monitor", "observ", "quality", "regression", "offline", "online"],
  reliability: ["fail", "outage", "scale", "fallback", "stale", "retry", "degrad", "cache"],
};

export type PhaseFeedback = {
  phase: string;
  score: number;
  feedback: string;
};

export type SpiderFeedback = {
  overall: number;
  phases: PhaseFeedback[];
  mode: "llm" | "stub";
};

function rubricHits(text: string, rubric: string[]) {
  return rubric.filter((line) => {
    const terms = line
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 5);
    return terms.some((t) => text.includes(t));
  });
}

function scoreSpiderStub(notes: string[], rubric: string[]): Omit<SpiderFeedback, "mode"> {
  const phases = SPIDER_PHASES.map((phase, i) => {
    const text = (notes[i] ?? "").trim().toLowerCase();
    const keywords = PHASE_KEYWORDS[phase.id] ?? [];
    const hitKw = keywords.filter((k) => text.includes(k));
    const hitRub = rubricHits(text, rubric);

    let score = 0;
    if (text.length >= 40) score += 25;
    if (text.length >= 120) score += 15;
    score += Math.min(30, hitKw.length * 10);
    score += Math.min(30, hitRub.length * 15);
    score = Math.min(100, score);

    const tips: string[] = [];
    if (text.length < 40) tips.push("Add more detail — name numbers, components, or tradeoffs.");
    if (hitKw.length === 0 && keywords.length) {
      tips.push(`This phase often mentions: ${keywords.slice(0, 3).join(", ")}.`);
    }
    if (hitRub.length === 0 && rubric.length) {
      tips.push("Tie your answer to what interviewers look for on this question.");
    }
    if (score >= 70) tips.push("Solid checkpoint — keep this depth in the mock.");

    return {
      phase: phase.name,
      score,
      feedback: tips.join(" ") || "Good start — expand with specifics.",
    };
  });

  const overall = Math.round(phases.reduce((sum, p) => sum + p.score, 0) / phases.length);
  return { overall, phases };
}

type LlmScorecard = {
  overall: number;
  phases: { phase: string; score: number; feedback: string }[];
};

export async function scoreSpiderPractice(notes: string[], questionSlug?: string): Promise<SpiderFeedback> {
  const question = questionSlug ? getQuestionBySlug(questionSlug) : null;
  const rubric = question?.interviewer_looks_for ?? [];

  if (isLlmConfigured() && question) {
    const phasesText = SPIDER_PHASES.map(
      (p, i) => `## ${p.name}\nPrompt: ${p.prompt}\nCandidate answer:\n${notes[i] || "(empty)"}`,
    ).join("\n\n");

    const llm = await anthropicJson<LlmScorecard>(
      "You grade AI system design interview answers using the SPIDER framework. Score each phase 0-100. Be constructive and specific. Reference the rubric signals when relevant.",
      `Question: ${question.title}\n\nRubric (what interviewers look for):\n${rubric.map((r) => `- ${r}`).join("\n")}\n\n${phasesText}\n\nReturn JSON: {"overall": number, "phases": [{"phase": string, "score": number, "feedback": string}]}`,
      2048,
    );

    if (llm?.phases?.length) {
      return {
        overall: Math.min(100, Math.max(0, Math.round(llm.overall))),
        phases: llm.phases.map((p) => ({
          phase: p.phase,
          score: Math.min(100, Math.max(0, Math.round(p.score))),
          feedback: p.feedback,
        })),
        mode: "llm",
      };
    }
  }

  return { ...scoreSpiderStub(notes, rubric), mode: "stub" };
}
