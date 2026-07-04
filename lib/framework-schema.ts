export type FrameworkPhase = {
  letter: string;
  name: string;
  time_minutes?: number;
  purpose: string;
};

export type Framework = {
  id: string;
  name: string;
  acronym?: string;
  use_for: string;
  summary: string;
  phases: FrameworkPhase[];
  anti_patterns: string[];
  source: "upstream" | "local";
};
