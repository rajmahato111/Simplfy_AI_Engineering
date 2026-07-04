export type WhiteboardSection = {
  id: string;
  title: string;
  body_md: string;
  level: 3 | 4;
};

export type WhiteboardExercise = {
  id: string;
  number: number;
  slug: string;
  title: string;
  summary: string;
  problem_statement: string;
  time_allocation_md?: string;
  sections: WhiteboardSection[];
  source: "upstream" | "local";
};
