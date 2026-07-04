import { searchContentHybrid } from "./search-hybrid";
import { searchContent } from "./search";

export type TutorCitation = {
  title: string;
  href: string;
  excerpt: string;
  type: string;
};

export type TutorResponse = {
  answer: string;
  citations: TutorCitation[];
};

function mergeResults(query: string, limit: number) {
  const seen = new Set<string>();
  const merged: TutorCitation[] = [];

  for (const r of [...searchContent(query, limit)]) {
    if (seen.has(r.href)) continue;
    seen.add(r.href);
    merged.push({ title: r.title, href: r.href, excerpt: r.excerpt, type: r.type });
  }

  return merged.slice(0, limit);
}

/** ponytail: citation stub — swap for LLM + RAG when API key lands */
export async function answerTutorQuery(query: string): Promise<TutorResponse> {
  const q = query.trim();
  if (!q) {
    return { answer: "Ask a question about RAG, agents, evals, or system design.", citations: [] };
  }

  const hybrid = await searchContentHybrid(q, 5);
  const citations: TutorCitation[] = hybrid.length
    ? hybrid.map((r) => ({
        title: r.title,
        href: r.href,
        excerpt: r.excerpt,
        type: r.type,
      }))
    : mergeResults(q, 5);

  if (!citations.length) {
    return {
      answer:
        "Nothing in the corpus matched that yet. Try Search, the glossary, or browse /learn — more chapters ship weekly.",
      citations: [],
    };
  }

  const bullets = citations
    .map((c, i) => `${i + 1}. ${c.title} — ${c.excerpt}`)
    .join("\n");

  return {
    answer: `From the corpus:\n\n${bullets}\n\nOpen a source below for the full chapter or question.`,
    citations,
  };
}
