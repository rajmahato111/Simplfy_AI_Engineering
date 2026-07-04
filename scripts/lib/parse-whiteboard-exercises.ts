import { slugify } from "./slug";
import type { WhiteboardExercise, WhiteboardSection } from "../../lib/whiteboard-schema";

function excerpt(text: string, max = 280) {
  const flat = text.replace(/\*\*/g, "").replace(/\n+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

function parseSections(block: string, level: 3 | 4): WhiteboardSection[] {
  const sections: WhiteboardSection[] = [];
  const re = level === 3 ? /^### (.+)$/gm : /^#### (.+)$/gm;

  for (const m of block.matchAll(re)) {
    const title = m[1].replace(/⭐.*$/, "").trim();
    const start = (m.index ?? 0) + m[0].length;
    const rest = block.slice(start);
    const next = rest.search(level === 3 ? /\n### / : /\n#### /);
    const body = (next < 0 ? rest : rest.slice(0, next)).trim();
    if (!body) continue;
    sections.push({
      id: slugify(title),
      title,
      body_md: body,
      level,
    });
  }

  if (!sections.length && block.trim()) {
    sections.push({ id: "content", title: "Overview", body_md: block.trim(), level });
  }

  return sections;
}

export function parseWhiteboardExercises(md: string): WhiteboardExercise[] {
  const exercises: WhiteboardExercise[] = [];
  const chunks = md.split(/^## Exercise (\d+): /m).slice(1);

  for (let i = 0; i < chunks.length; i += 2) {
    const number = parseInt(chunks[i], 10);
    const rest = chunks[i + 1];
    if (!rest || Number.isNaN(number)) continue;

    const title = rest.split("\n")[0].replace(/⭐.*$/, "").trim();
    const body = rest.slice(rest.indexOf("\n") + 1);
    const slug = slugify(`exercise-${number}-${title}`);

    const topSections = parseSections(body, 3);
    const problem =
      topSections.find((s) => /problem statement/i.test(s.title))?.body_md ??
      topSections[0]?.body_md ??
      "";
    const timeAllocation = topSections.find((s) => /time allocation/i.test(s.title))?.body_md;

    const walkthrough = topSections.find((s) => /solution walkthrough/i.test(s.title));
    const walkthroughSections = walkthrough ? parseSections(walkthrough.body_md, 4) : [];

    const sections: WhiteboardSection[] = [
      ...topSections.filter((s) => s !== walkthrough),
      ...walkthroughSections,
    ];

    exercises.push({
      id: `wb-${String(number).padStart(2, "0")}`,
      number,
      slug,
      title,
      summary: excerpt(problem),
      problem_statement: problem.trim(),
      time_allocation_md: timeAllocation?.trim(),
      sections,
      source: "upstream",
    });
  }

  return exercises;
}
