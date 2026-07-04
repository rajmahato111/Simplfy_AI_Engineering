/** MDX frontmatter schema — binding fields from docs/content-style-guide.md §3 */

export const CONTENT_TYPES = ["concept", "walkthrough"] as const;
export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export const CONTENT_STATUSES = ["draft", "reviewed", "approved"] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export type ContentFrontmatter = {
  title: string;
  slug: string;
  type: ContentType;
  area: string;
  difficulty: Difficulty;
  tags: string[];
  diagrams: string[];
  est_minutes: number;
  source_attribution: string;
  last_reviewed: string;
  status: ContentStatus;
};

export type FrontmatterIssue = {
  field: string;
  message: string;
};

export type FrontmatterValidation = {
  ok: boolean;
  data?: ContentFrontmatter;
  issues: FrontmatterIssue[];
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((item) => typeof item === "string");
}

function isEnum<T extends string>(v: unknown, allowed: readonly T[]): v is T {
  return typeof v === "string" && (allowed as readonly string[]).includes(v);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function normalizeDate(v: unknown): string | null {
  if (typeof v === "string" && DATE_RE.test(v)) return v;
  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    return v.toISOString().slice(0, 10);
  }
  return null;
}

/** Validate parsed YAML frontmatter against the style guide. */
export function validateFrontmatter(
  raw: unknown,
  opts?: { fileSlug?: string },
): FrontmatterValidation {
  const issues: FrontmatterIssue[] = [];
  if (!isRecord(raw)) {
    return { ok: false, issues: [{ field: "_root", message: "Frontmatter must be an object" }] };
  }

  const title = raw.title;
  const slug = raw.slug;
  const type = raw.type;
  const area = raw.area;
  const difficulty = raw.difficulty;
  const tags = raw.tags;
  const diagrams = raw.diagrams;
  const estMinutes = raw.est_minutes;
  const sourceAttribution = raw.source_attribution;
  const lastReviewed = raw.last_reviewed;
  const status = raw.status;

  const lastReviewedNorm = normalizeDate(lastReviewed);

  if (!isNonEmptyString(title)) issues.push({ field: "title", message: "Required non-empty string" });
  if (!isNonEmptyString(slug)) issues.push({ field: "slug", message: "Required non-empty string" });
  if (!isEnum(type, CONTENT_TYPES)) {
    issues.push({ field: "type", message: `Must be one of: ${CONTENT_TYPES.join(", ")}` });
  }
  if (!isNonEmptyString(area)) issues.push({ field: "area", message: "Required non-empty string" });
  if (!isEnum(difficulty, DIFFICULTIES)) {
    issues.push({ field: "difficulty", message: `Must be one of: ${DIFFICULTIES.join(", ")}` });
  }
  if (!isStringArray(tags) || tags.length === 0) {
    issues.push({ field: "tags", message: "Required non-empty string array" });
  }
  if (!isStringArray(diagrams)) {
    issues.push({ field: "diagrams", message: "Required string array (use [] if none)" });
  }
  if (typeof estMinutes !== "number" || !Number.isFinite(estMinutes) || estMinutes <= 0) {
    issues.push({ field: "est_minutes", message: "Required positive number" });
  }
  if (!isNonEmptyString(sourceAttribution)) {
    issues.push({ field: "source_attribution", message: "Required non-empty string" });
  }
  if (!lastReviewedNorm) {
    issues.push({ field: "last_reviewed", message: "Required date string (YYYY-MM-DD)" });
  }
  if (!isEnum(status, CONTENT_STATUSES)) {
    issues.push({ field: "status", message: `Must be one of: ${CONTENT_STATUSES.join(", ")}` });
  }

  if (opts?.fileSlug && isNonEmptyString(slug)) {
    const expected = opts.fileSlug.split("/").pop()!;
    if (slug !== expected) {
      issues.push({
        field: "slug",
        message: `Must match filename: expected "${expected}", got "${slug}"`,
      });
    }
  }

  if (issues.length > 0) return { ok: false, issues };

  return {
    ok: true,
    issues: [],
    data: {
      title: title as string,
      slug: slug as string,
      type: type as ContentType,
      area: area as string,
      difficulty: difficulty as Difficulty,
      tags: tags as string[],
      diagrams: diagrams as string[],
      est_minutes: estMinutes as number,
      source_attribution: sourceAttribution as string,
      last_reviewed: lastReviewedNorm!,
      status: status as ContentStatus,
    },
  };
}
