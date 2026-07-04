export const SPIDER_PHASES = [
  {
    id: "scope",
    name: "Scope",
    prompt: "Clarify requirements: QPS, corpus size, latency budget, and constraints.",
  },
  {
    id: "prioritize",
    name: "Prioritize",
    prompt: "Rank the top 2–3 risks or bottlenecks before drawing boxes.",
  },
  {
    id: "initial",
    name: "Initial architecture",
    prompt: "Sketch ingestion + query paths. Name each component.",
  },
  {
    id: "deep-dive",
    name: "Deep dive",
    prompt: "Pick one component and explain tradeoffs (chunking, hybrid search, etc.).",
  },
  {
    id: "eval",
    name: "Eval",
    prompt: "How do you measure retrieval quality and catch regressions?",
  },
  {
    id: "reliability",
    name: "Reliability",
    prompt: "Failure modes, freshness, and what happens when the index is stale.",
  },
] as const;
