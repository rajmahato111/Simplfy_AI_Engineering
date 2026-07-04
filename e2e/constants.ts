/** Shared routes/content slugs for frontend automation — keep in sync with content/. */
export const LEARN_SLUGS = [
  "concepts/retrieval/rag-fundamentals",
  "concepts/retrieval/chunking-strategies",
  "walkthroughs/design-a-production-rag-system",
] as const;

export const NAV_ROUTES = [
  { href: "/learn", label: "Learn" },
  { href: "/questions", label: "Questions" },
  { href: "/practice", label: "Practice" },
  { href: "/mock", label: "Mock Interview" },
  { href: "/tutor", label: "Tutor" },
  { href: "/dashboard", label: "Dashboard" },
] as const;
