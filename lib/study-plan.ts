import { listContentSlugs, getContentBySlug } from "./content";
import { listQuestions } from "./questions";

export type StudyPlanWeek = {
  week: number;
  items: { title: string; href: string; kind: string }[];
};

export function buildStudyPlan(role: string, weeks: number): StudyPlanWeek[] {
  const chapters = listContentSlugs()
    .map((slug) => getContentBySlug(slug))
    .filter(Boolean)
    .map((doc) => ({
      title: doc!.frontmatter.title,
      href: `/learn/${doc!.slug}`,
      kind: doc!.frontmatter.type,
    }));

  const questions = listQuestions()
    .filter((q) => q.difficulty !== "advanced" || role.includes("senior"))
    .slice(0, weeks * 3)
    .map((q) => ({
      title: q.title,
      href: `/questions/${q.slug}`,
      kind: "question",
    }));

  const pool = [...chapters, ...questions];
  const plan: StudyPlanWeek[] = [];
  const perWeek = Math.max(1, Math.ceil(pool.length / weeks));

  for (let w = 0; w < weeks; w++) {
    plan.push({
      week: w + 1,
      items: pool.slice(w * perWeek, (w + 1) * perWeek),
    });
  }
  return plan;
}
