export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  letter: string;
  chapter_refs: string[];
  source: "upstream";
};
