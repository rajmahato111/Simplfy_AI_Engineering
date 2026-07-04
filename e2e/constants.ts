/** Polished MDX chapters — full e2e coverage. Draft corpus is scaffolded separately. */
export const POLISHED_LEARN_SLUGS = [
  "concepts/retrieval/rag-fundamentals",
  "concepts/retrieval/chunking-strategies",
  "walkthroughs/design-a-production-rag-system",
] as const;

/** @deprecated use POLISHED_LEARN_SLUGS */
export const LEARN_SLUGS = POLISHED_LEARN_SLUGS;

export const DRAFT_LEARN_SMOKE_SLUGS = [
  "concepts/retrieval/embedding-models",
  "concepts/agents/agent-fundamentals",
  "walkthroughs/conversational-agent",
] as const;

export const NAV_ROUTES = [
  { href: "/learn", label: "Learn" },
  { href: "/search", label: "Search" },
  { href: "/questions", label: "Questions" },
  { href: "/practice", label: "Practice" },
  { href: "/mock", label: "Mock" },
  { href: "/tutor", label: "Tutor" },
  { href: "/dashboard", label: "Dashboard" },
] as const;
