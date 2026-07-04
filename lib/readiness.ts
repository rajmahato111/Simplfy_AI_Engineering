import { listUserProgress } from "./progress";
import { listUserMockSessions, parseMockScorecard } from "./mock-sessions-db";
import { listContentSlugs } from "./content";

export type ReadinessSnapshot = {
  score: number;
  chapterCoverage: number;
  mockAverage: number | null;
  label: string;
};

/** ponytail: simple readiness heuristic — refine when tracks land */
export async function computeReadiness(userId: string): Promise<ReadinessSnapshot> {
  const slugs = listContentSlugs();
  const progress = await listUserProgress(userId);
  const completed = progress.filter((p) => p.completed).length;
  const chapterCoverage = slugs.length ? Math.round((completed / slugs.length) * 100) : 0;

  const mocks = await listUserMockSessions(userId, 10);
  const scores = mocks
    .map((m) => parseMockScorecard(m.scorecard)?.overall)
    .filter((s): s is number => typeof s === "number");
  const mockAverage = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  const mockPart = mockAverage ?? 0;
  const score = Math.min(100, Math.round(chapterCoverage * 0.5 + mockPart * 0.5));

  let label = "Getting started";
  if (score >= 70) label = "Interview ready";
  else if (score >= 40) label = "Building momentum";

  return { score, chapterCoverage, mockAverage, label };
}
