export const QUESTION_DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export type QuestionDifficulty = (typeof QUESTION_DIFFICULTIES)[number];

export type Question = {
  id: string;
  upstream_id?: string;
  slug: string;
  title: string;
  topic: string;
  topic_label?: string;
  difficulty: QuestionDifficulty;
  cohort?: string;
  role_tags: string[];
  company_tags: string[];
  body_md: string;
  interviewer_looks_for: string[];
  strong_answer_covers: string[];
  follow_ups?: string[];
  key_insight?: string;
  sample_answer_excerpt?: string;
  status: "draft" | "reviewed" | "approved";
  source?: "upstream" | "local";
};

export type QuestionFilters = {
  topic?: string;
  difficulty?: QuestionDifficulty;
  q?: string;
};
