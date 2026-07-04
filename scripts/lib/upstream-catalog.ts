import { readUpstreamLock } from "./upstream-fetch";

export type UpstreamChapter = {
  upstream_path: string;
  section: string;
  section_num: string;
  filename: string;
  title_guess: string;
};

const SECTION_AREAS: Record<string, string> = {
  "01-foundations": "foundations",
  "02-model-landscape": "models",
  "03-training-and-adaptation": "training",
  "04-inference-optimization": "inference",
  "05-prompting-and-context": "prompting",
  "06-retrieval-systems": "retrieval",
  "07-agentic-systems": "agents",
  "08-memory-and-state": "memory",
  "09-frameworks-and-tools": "frameworks",
  "10-document-processing": "document-processing",
  "11-infrastructure-and-mlops": "mlops",
  "12-security-and-access": "security",
  "13-reliability-and-safety": "reliability",
  "14-evaluation-and-observability": "evals",
  "15-ai-design-patterns": "patterns",
  "16-case-studies": "case-studies",
  "17-tool-use-and-computer-agents": "tool-use",
  "18-voice-and-audio-agents": "voice",
  "19-multimodal-generation": "multimodal",
};

export async function listUpstreamChapters(): Promise<UpstreamChapter[]> {
  const { repo, ref } = readUpstreamLock();
  const res = await fetch(`https://api.github.com/repos/${repo}/git/trees/${ref}?recursive=1`);
  if (!res.ok) throw new Error(`GitHub tree fetch failed: ${res.status}`);
  const data = (await res.json()) as { tree: Array<{ path: string; type: string }> };

  const chapters: UpstreamChapter[] = [];
  for (const node of data.tree) {
    if (node.type !== "blob") continue;
    const m = node.path.match(/^(\d{2}-[^/]+)\/(\d{2}-.+\.md)$/);
    if (!m) continue;
    const [, section, filename] = m;
    const title_guess = filename
      .replace(/^\d{2}-/, "")
      .replace(/\.md$/, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    chapters.push({
      upstream_path: node.path,
      section,
      section_num: section.slice(0, 2),
      filename,
      title_guess,
    });
  }

  return chapters.sort((a, b) => a.upstream_path.localeCompare(b.upstream_path));
}

export function areaForSection(section: string) {
  return SECTION_AREAS[section] ?? section.replace(/^\d{2}-/, "").replace(/-/g, "-");
}

export function slugFromUpstream(filename: string) {
  return filename.replace(/^\d{2}-/, "").replace(/\.md$/, "");
}

export function targetMdxPath(chapter: UpstreamChapter, kind: "concept" | "walkthrough" = "concept") {
  const slug = slugFromUpstream(chapter.filename);
  const area = areaForSection(chapter.section);
  if (kind === "walkthrough" || chapter.section === "16-case-studies") {
    return `content/walkthroughs/${slug}.mdx`;
  }
  return `content/concepts/${area}/${slug}.mdx`;
}
