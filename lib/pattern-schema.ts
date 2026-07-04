export type Pattern = {
  id: string;
  name: string;
  category: string;
  use_case: string;
  key_tradeoff: string;
  kind: "pattern" | "anti-pattern";
  source: "upstream";
};
