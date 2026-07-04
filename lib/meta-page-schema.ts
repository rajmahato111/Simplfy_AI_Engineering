export type MetaSection = {
  id: string;
  title: string;
  body: string;
};

export type MetaPage = {
  id: string;
  title: string;
  summary: string;
  sections: MetaSection[];
  source: "upstream" | "local";
};
