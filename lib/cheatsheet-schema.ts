/** Cheat-sheet JSON schema — companion visual-summary view for a content chapter. */

export const CHEAT_COLOR_TOKENS = ["brand", "indigo", "amber", "rose", "emerald"] as const;
export type CheatColorToken = (typeof CHEAT_COLOR_TOKENS)[number];

export const CHEAT_ICON_NAMES = [
  "zap",
  "dollar-sign",
  "clock",
  "cpu",
  "memory-stick",
  "gauge",
  "lightbulb",
  "check-circle-2",
  "alert-triangle",
  "info",
  "target",
  "layers",
  "git-branch",
  "scale",
  "shield",
  "sparkles",
  "list-checks",
  "help-circle",
  "trending-up",
  "trending-down",
  "wrench",
  "database",
  "server",
  "rocket",
] as const;
export type CheatIconName = (typeof CHEAT_ICON_NAMES)[number];

export type MethodCard = {
  id: string;
  name: string;
  tagline: string;
  formula?: string;
  bullets: string[];
  color?: CheatColorToken;
  diagram?: string;
};

export type CompareCell =
  | { type: "text"; value: string }
  | { type: "bar"; value: number; color: CheatColorToken; label?: string }
  | { type: "stars"; value: number };

export type CompareColumn = { id: string; label: string; color?: CheatColorToken };
export type CompareRow = { label: string; cells: Record<string, CompareCell> };
export type CompareTable = { columns: CompareColumn[]; rows: CompareRow[] };

export type IconCallout = {
  icon: CheatIconName;
  heading: string;
  body?: string;
  bullets?: string[];
  color?: CheatColorToken;
};

export type StatSegment = { label: string; value: number; color: CheatColorToken };
export type WorkedExample = {
  heading: string;
  body: string;
  stat?: { label: string; segments: StatSegment[] };
};

export type CoreIntuition = { heading: string; body: string };
export type QuestionListItem = { question: string; hint?: string };
export type IconListItem = { icon: CheatIconName; text: string };
export type ChecklistItem = { text: string };

export type DecisionNode = { id: string; label: string; sublabel?: string };
export type DecisionEdge = { from: string; to: string; label?: string };
export type DecisionTree = {
  nodes: DecisionNode[];
  edges: DecisionEdge[];
};

export type CheatSheet = {
  title: string;
  subtitle?: string;
  source_attribution?: string;
  methodCards: MethodCard[];
  compareTable: CompareTable;
  whenToChoose: IconCallout[];
  workedExample?: WorkedExample;
  coreIntuition?: CoreIntuition;
  interviewQuestions: QuestionListItem[];
  productionConsiderations: IconListItem[];
  checklist: ChecklistItem[];
  keyTakeaways: string[];
  decisionTree?: DecisionTree;
};

export type CheatSheetIssue = { field: string; message: string };
export type CheatSheetValidation = {
  ok: boolean;
  data?: CheatSheet;
  issues: CheatSheetIssue[];
  warnings: string[];
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}
function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.length > 0 && v.every((item) => typeof item === "string");
}
function isColorToken(v: unknown): v is CheatColorToken {
  return typeof v === "string" && (CHEAT_COLOR_TOKENS as readonly string[]).includes(v);
}
function isIconName(v: unknown): v is CheatIconName {
  return typeof v === "string" && (CHEAT_ICON_NAMES as readonly string[]).includes(v);
}

export function validateCheatSheet(raw: unknown): CheatSheetValidation {
  const issues: CheatSheetIssue[] = [];
  const warnings: string[] = [];

  if (!isRecord(raw)) {
    return { ok: false, issues: [{ field: "_root", message: "Must be a JSON object" }], warnings };
  }

  if (!isNonEmptyString(raw.title)) {
    issues.push({ field: "title", message: "Required non-empty string" });
  }
  if (raw.source_attribution !== undefined && !isNonEmptyString(raw.source_attribution)) {
    issues.push({ field: "source_attribution", message: "If present, must be a non-empty string" });
  }

  // methodCards
  const methodCardsRaw = raw.methodCards;
  const methodCards: MethodCard[] = [];
  if (!Array.isArray(methodCardsRaw) || methodCardsRaw.length < 2) {
    issues.push({ field: "methodCards", message: "Required array with at least 2 entries" });
  } else {
    const seenIds = new Set<string>();
    methodCardsRaw.forEach((raw, i) => {
      if (!isRecord(raw)) {
        issues.push({ field: `methodCards[${i}]`, message: "Must be an object" });
        return;
      }
      if (!isNonEmptyString(raw.id)) {
        issues.push({ field: `methodCards[${i}].id`, message: "Required non-empty string" });
      } else if (seenIds.has(raw.id)) {
        issues.push({ field: `methodCards[${i}].id`, message: `Duplicate id "${raw.id}"` });
      } else {
        seenIds.add(raw.id);
      }
      if (!isNonEmptyString(raw.name)) {
        issues.push({ field: `methodCards[${i}].name`, message: "Required non-empty string" });
      }
      if (!isNonEmptyString(raw.tagline)) {
        issues.push({ field: `methodCards[${i}].tagline`, message: "Required non-empty string" });
      }
      if (!isStringArray(raw.bullets)) {
        issues.push({ field: `methodCards[${i}].bullets`, message: "Required non-empty string array" });
      }
      if (raw.color !== undefined && !isColorToken(raw.color)) {
        issues.push({ field: `methodCards[${i}].color`, message: `Must be one of: ${CHEAT_COLOR_TOKENS.join(", ")}` });
      }
      if (raw.formula !== undefined && typeof raw.formula !== "string") {
        issues.push({ field: `methodCards[${i}].formula`, message: "Must be a string" });
      }
      if (raw.diagram !== undefined && typeof raw.diagram !== "string") {
        issues.push({ field: `methodCards[${i}].diagram`, message: "Must be a string" });
      }
      methodCards.push(raw as unknown as MethodCard);
    });
    if (methodCardsRaw.length > 4) warnings.push(`methodCards has ${methodCardsRaw.length} entries (>4 may not lay out well)`);
  }

  // compareTable
  const compareTableRaw = raw.compareTable;
  let compareTable: CompareTable = { columns: [], rows: [] };
  if (!isRecord(compareTableRaw)) {
    issues.push({ field: "compareTable", message: "Required object with columns[] and rows[]" });
  } else {
    const columnsRaw = compareTableRaw.columns;
    const columnIds = new Set<string>();
    if (!Array.isArray(columnsRaw) || columnsRaw.length < 2) {
      issues.push({ field: "compareTable.columns", message: "Required array with at least 2 entries" });
    } else {
      columnsRaw.forEach((col, i) => {
        if (!isRecord(col) || !isNonEmptyString(col.id) || !isNonEmptyString(col.label)) {
          issues.push({ field: `compareTable.columns[${i}]`, message: "Requires non-empty id and label" });
          return;
        }
        if (columnIds.has(col.id)) {
          issues.push({ field: `compareTable.columns[${i}].id`, message: `Duplicate id "${col.id}"` });
        }
        columnIds.add(col.id);
        if (col.color !== undefined && !isColorToken(col.color)) {
          issues.push({ field: `compareTable.columns[${i}].color`, message: `Must be one of: ${CHEAT_COLOR_TOKENS.join(", ")}` });
        }
      });
    }

    const rowsRaw = compareTableRaw.rows;
    if (!Array.isArray(rowsRaw) || rowsRaw.length < 1) {
      issues.push({ field: "compareTable.rows", message: "Required array with at least 1 entry" });
    } else {
      const rowLabels = new Set<string>();
      rowsRaw.forEach((row, i) => {
        if (!isRecord(row) || !isNonEmptyString(row.label) || !isRecord(row.cells)) {
          issues.push({ field: `compareTable.rows[${i}]`, message: "Requires non-empty label and a cells object" });
          return;
        }
        if (rowLabels.has(row.label)) {
          issues.push({ field: `compareTable.rows[${i}].label`, message: `Duplicate row label "${row.label}" (used as a React key — must be unique)` });
        }
        rowLabels.add(row.label);
        const cellKeys = new Set(Object.keys(row.cells));
        if (columnIds.size > 0) {
          const missing = [...columnIds].filter((id) => !cellKeys.has(id));
          const extra = [...cellKeys].filter((id) => !columnIds.has(id));
          if (missing.length > 0) {
            issues.push({ field: `compareTable.rows[${i}].cells`, message: `Missing cell(s) for column(s): ${missing.join(", ")}` });
          }
          if (extra.length > 0) {
            issues.push({ field: `compareTable.rows[${i}].cells`, message: `Extra cell(s) for unknown column(s): ${extra.join(", ")}` });
          }
        }
        for (const [colId, cell] of Object.entries(row.cells)) {
          if (!isRecord(cell) || typeof cell.type !== "string") {
            issues.push({ field: `compareTable.rows[${i}].cells.${colId}`, message: "Must be an object with a type" });
            continue;
          }
          if (cell.type === "text") {
            if (!isNonEmptyString(cell.value)) {
              issues.push({ field: `compareTable.rows[${i}].cells.${colId}.value`, message: "Required non-empty string" });
            }
          } else if (cell.type === "bar") {
            if (typeof cell.value !== "number" || cell.value < 0 || cell.value > 100) {
              issues.push({ field: `compareTable.rows[${i}].cells.${colId}.value`, message: "Required number in [0, 100]" });
            }
            if (!isColorToken(cell.color)) {
              issues.push({ field: `compareTable.rows[${i}].cells.${colId}.color`, message: `Must be one of: ${CHEAT_COLOR_TOKENS.join(", ")}` });
            }
          } else if (cell.type === "stars") {
            if (typeof cell.value !== "number" || !Number.isInteger(cell.value) || cell.value < 0 || cell.value > 5) {
              issues.push({ field: `compareTable.rows[${i}].cells.${colId}.value`, message: "Required integer in [0, 5]" });
            }
          } else {
            issues.push({ field: `compareTable.rows[${i}].cells.${colId}.type`, message: 'Must be "text", "bar", or "stars"' });
          }
        }
      });
    }

    compareTable = compareTableRaw as unknown as CompareTable;
  }

  // whenToChoose
  const whenToChooseRaw = raw.whenToChoose;
  if (!Array.isArray(whenToChooseRaw) || whenToChooseRaw.length < 1) {
    issues.push({ field: "whenToChoose", message: "Required array with at least 1 entry" });
  } else {
    whenToChooseRaw.forEach((item, i) => {
      if (!isRecord(item) || !isIconName(item.icon) || !isNonEmptyString(item.heading)) {
        issues.push({ field: `whenToChoose[${i}]`, message: "Requires a valid icon and non-empty heading" });
        return;
      }
      if (item.color !== undefined && !isColorToken(item.color)) {
        issues.push({ field: `whenToChoose[${i}].color`, message: `Must be one of: ${CHEAT_COLOR_TOKENS.join(", ")}` });
      }
      if (item.body !== undefined && typeof item.body !== "string") {
        issues.push({ field: `whenToChoose[${i}].body`, message: "Must be a string" });
      }
      if (item.bullets !== undefined && !isStringArray(item.bullets)) {
        issues.push({ field: `whenToChoose[${i}].bullets`, message: "Must be a non-empty string array" });
      }
    });
    if (whenToChooseRaw.length > 4) warnings.push(`whenToChoose has ${whenToChooseRaw.length} entries (>4 may not lay out well)`);
  }

  // workedExample (optional)
  if (raw.workedExample !== undefined) {
    const we = raw.workedExample;
    if (!isRecord(we) || !isNonEmptyString(we.heading) || !isNonEmptyString(we.body)) {
      issues.push({ field: "workedExample", message: "Requires non-empty heading and body" });
    } else if (we.stat !== undefined) {
      const stat = we.stat;
      if (!isRecord(stat) || !isNonEmptyString(stat.label) || !Array.isArray(stat.segments) || stat.segments.length < 1) {
        issues.push({ field: "workedExample.stat", message: "Requires non-empty label and at least 1 segment" });
      } else {
        let sum = 0;
        stat.segments.forEach((seg, i) => {
          if (!isRecord(seg) || typeof seg.value !== "number" || seg.value <= 0 || !isNonEmptyString(seg.label) || !isColorToken(seg.color)) {
            issues.push({ field: `workedExample.stat.segments[${i}]`, message: "Requires positive value, non-empty label, valid color" });
            return;
          }
          sum += seg.value;
        });
        if (sum < 99 || sum > 101) {
          issues.push({ field: "workedExample.stat.segments", message: `Segment values sum to ${sum}, expected ~100` });
        }
      }
    }
  }

  // coreIntuition (optional)
  if (raw.coreIntuition !== undefined) {
    const ci = raw.coreIntuition;
    if (!isRecord(ci) || !isNonEmptyString(ci.heading) || !isNonEmptyString(ci.body)) {
      issues.push({ field: "coreIntuition", message: "Requires non-empty heading and body" });
    }
  }

  // interviewQuestions
  const iqRaw = raw.interviewQuestions;
  if (!Array.isArray(iqRaw) || iqRaw.length < 1) {
    issues.push({ field: "interviewQuestions", message: "Required array with at least 1 entry" });
  } else {
    iqRaw.forEach((q, i) => {
      if (!isRecord(q) || !isNonEmptyString(q.question)) {
        issues.push({ field: `interviewQuestions[${i}].question`, message: "Required non-empty string" });
      }
    });
  }

  // productionConsiderations
  const pcRaw = raw.productionConsiderations;
  if (!Array.isArray(pcRaw) || pcRaw.length < 1) {
    issues.push({ field: "productionConsiderations", message: "Required array with at least 1 entry" });
  } else {
    pcRaw.forEach((item, i) => {
      if (!isRecord(item) || !isIconName(item.icon) || !isNonEmptyString(item.text)) {
        issues.push({ field: `productionConsiderations[${i}]`, message: "Requires a valid icon and non-empty text" });
      }
    });
  }

  // checklist
  const checklistRaw = raw.checklist;
  if (!Array.isArray(checklistRaw) || checklistRaw.length < 1) {
    issues.push({ field: "checklist", message: "Required array with at least 1 entry" });
  } else {
    checklistRaw.forEach((item, i) => {
      if (!isRecord(item) || !isNonEmptyString(item.text)) {
        issues.push({ field: `checklist[${i}].text`, message: "Required non-empty string" });
      }
    });
  }

  // keyTakeaways
  if (!isStringArray(raw.keyTakeaways)) {
    issues.push({ field: "keyTakeaways", message: "Required non-empty string array" });
  }

  // decisionTree (optional)
  if (raw.decisionTree !== undefined) {
    const dt = raw.decisionTree;
    if (!isRecord(dt) || !Array.isArray(dt.nodes) || !Array.isArray(dt.edges)) {
      issues.push({ field: "decisionTree", message: "Requires nodes[] and edges[]" });
    } else {
      const nodes = dt.nodes;
      const edges = dt.edges;
      if (nodes.length < 2 || nodes.length > 6) {
        issues.push({ field: "decisionTree.nodes", message: "Must have between 2 and 6 nodes" });
      }
      const nodeIds = new Set<string>();
      let nodesValid = true;
      nodes.forEach((n, i) => {
        if (!isRecord(n) || !isNonEmptyString(n.id) || !isNonEmptyString(n.label)) {
          issues.push({ field: `decisionTree.nodes[${i}]`, message: "Requires non-empty id and label" });
          nodesValid = false;
          return;
        }
        if (nodeIds.has(n.id)) {
          issues.push({ field: `decisionTree.nodes[${i}].id`, message: `Duplicate id "${n.id}"` });
        }
        nodeIds.add(n.id);
      });

      if (nodesValid) {
        const incomingCount = new Map<string, number>();
        for (const id of nodeIds) incomingCount.set(id, 0);
        let edgesValid = true;
        edges.forEach((e, i) => {
          if (!isRecord(e) || !isNonEmptyString(e.from) || !isNonEmptyString(e.to)) {
            issues.push({ field: `decisionTree.edges[${i}]`, message: "Requires non-empty from and to" });
            edgesValid = false;
            return;
          }
          if (!nodeIds.has(e.from)) {
            issues.push({ field: `decisionTree.edges[${i}].from`, message: `Unknown node id "${e.from}"` });
            edgesValid = false;
          }
          if (!nodeIds.has(e.to)) {
            issues.push({ field: `decisionTree.edges[${i}].to`, message: `Unknown node id "${e.to}"` });
            edgesValid = false;
          }
          if (edgesValid) {
            incomingCount.set(e.to, (incomingCount.get(e.to) ?? 0) + 1);
          }
        });

        if (edgesValid) {
          const roots = [...incomingCount.entries()].filter(([, c]) => c === 0);
          const multiParent = [...incomingCount.entries()].filter(([, c]) => c > 1);
          if (roots.length !== 1) {
            issues.push({ field: "decisionTree.edges", message: `Expected exactly 1 root node (0 incoming edges), found ${roots.length}` });
          }
          if (multiParent.length > 0) {
            issues.push({ field: "decisionTree.edges", message: `Node(s) with more than 1 incoming edge: ${multiParent.map(([id]) => id).join(", ")} — must be a tree` });
          }
        }
      }
    }
  }

  if (issues.length > 0) {
    return { ok: false, issues, warnings };
  }

  return {
    ok: true,
    issues: [],
    warnings,
    data: {
      title: raw.title as string,
      subtitle: typeof raw.subtitle === "string" ? raw.subtitle : undefined,
      source_attribution: isNonEmptyString(raw.source_attribution) ? raw.source_attribution : undefined,
      methodCards,
      compareTable,
      whenToChoose: whenToChooseRaw as unknown as IconCallout[],
      workedExample: raw.workedExample as unknown as WorkedExample | undefined,
      coreIntuition: raw.coreIntuition as unknown as CoreIntuition | undefined,
      interviewQuestions: iqRaw as unknown as QuestionListItem[],
      productionConsiderations: pcRaw as unknown as IconListItem[],
      checklist: checklistRaw as unknown as ChecklistItem[],
      keyTakeaways: raw.keyTakeaways as string[],
      decisionTree: raw.decisionTree as unknown as DecisionTree | undefined,
    },
  };
}
