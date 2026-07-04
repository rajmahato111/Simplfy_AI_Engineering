export const QUESTION_DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export type QuestionDifficulty = (typeof QUESTION_DIFFICULTIES)[number];

export type Question = {
  id: string;
  slug: string;
  title: string;
  topic: string;
  difficulty: QuestionDifficulty;
  role_tags: string[];
  company_tags: string[];
  body_md: string;
  interviewer_looks_for: string[];
  strong_answer_covers: string[];
  status: "draft" | "reviewed" | "approved";
};

export type QuestionFilters = {
  topic?: string;
  difficulty?: QuestionDifficulty;
  q?: string;
};
