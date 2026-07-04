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

/** ponytail: citation stub — swap for LLM + RAG when API key lands */
export async function answerTutorQuery(query: string): Promise<TutorResponse> {
  const q = query.trim();
  if (!q) {
    return { answer: "Ask a question about RAG, agents, evals, or system design.", citations: [] };
  }

  const normalized = normalizeQuery(q);
  const searchTerms = [q, normalized].filter((term, i, arr) => term && arr.indexOf(term) === i);

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

  if (!citations.length) citations = mergeResults(normalized || q, 5);
  else {
    citations.sort((a, b) => {
      const rank = (t: string) => (t === "concept" || t === "walkthrough" ? 0 : t === "glossary" ? 1 : 2);
      return rank(a.type) - rank(b.type);
    });
  }

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
