import { searchContentHybrid } from "./search-hybrid";
import { searchContent } from "./search";
import { anthropicComplete, isLlmConfigured } from "./llm";

export type TutorCitation = {
  title: string;
  href: string;
  excerpt: string;
  type: string;
};

export type TutorResponse = {
  answer: string;
  citations: TutorCitation[];
  mode: "llm" | "stub";
};

function normalizeQuery(query: string) {
  return query
    .replace(/^(what is|what are|explain|tell me about|how does|how do)\s+/i, "")
    .replace(/\?+$/, "")
    .trim();
}

function mergeResults(query: string, limit: number) {
  const seen = new Set<string>();
  const merged: TutorCitation[] = [];

  for (const r of searchContent(query, limit + 5)) {
    if (seen.has(r.href)) continue;
    seen.add(r.href);
    merged.push({ title: r.title, href: r.href, excerpt: r.excerpt, type: r.type });
  }

  merged.sort((a, b) => {
    const rank = (t: string) => (t === "concept" || t === "walkthrough" ? 0 : t === "glossary" ? 1 : 2);
    return rank(a.type) - rank(b.type);
  });

  return merged.slice(0, limit);
}

async function gatherCitations(query: string) {
  const normalized = normalizeQuery(query);
  const searchTerms = [query, normalized].filter((term, i, arr) => term && arr.indexOf(term) === i);

  let citations: TutorCitation[] = [];
  for (const term of searchTerms) {
    const hybrid = await searchContentHybrid(term, 5);
    if (hybrid.length) {
      citations = hybrid.map((r) => ({
        title: r.title,
        href: r.href,
        excerpt: r.excerpt,
        type: r.type,
      }));
      break;
    }
  }

  if (!citations.length) citations = mergeResults(normalized || query, 5);
  else {
    citations.sort((a, b) => {
      const rank = (t: string) => (t === "concept" || t === "walkthrough" ? 0 : t === "glossary" ? 1 : 2);
      return rank(a.type) - rank(b.type);
    });
  }

  return citations;
}

function stubAnswer(citations: TutorCitation[]): string {
  const bullets = citations.map((c, i) => `${i + 1}. ${c.title} — ${c.excerpt}`).join("\n");
  return `From the corpus:\n\n${bullets}\n\nOpen a source below for the full chapter or question.`;
}

export async function answerTutorQuery(query: string): Promise<TutorResponse> {
  const q = query.trim();
  if (!q) {
    return {
      answer: "Ask a question about RAG, agents, evals, or system design.",
      citations: [],
      mode: "stub",
    };
  }

  const citations = await gatherCitations(q);

  if (!citations.length) {
    return {
      answer:
        "Nothing in the corpus matched that yet. Try Search, the glossary, or browse /learn — more chapters ship weekly.",
      citations: [],
      mode: "stub",
    };
  }

  if (isLlmConfigured()) {
    const context = citations
      .map((c, i) => `[${i + 1}] ${c.title} (${c.href})\n${c.excerpt}`)
      .join("\n\n");
    const llmAnswer = await anthropicComplete(
      "You are an AI engineering interview coach. Answer using ONLY the provided corpus excerpts. Cite sources as [1], [2], etc. Be concise, practical, interview-focused. If the excerpts are insufficient, say so.",
      `Question: ${q}\n\nCorpus excerpts:\n${context}`,
    );
    if (llmAnswer) {
      return { answer: llmAnswer, citations, mode: "llm" };
    }
  }

  return { answer: stubAnswer(citations), citations, mode: "stub" };
}
