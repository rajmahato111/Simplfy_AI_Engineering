import type { DecisionTree as DecisionTreeData, DecisionNode } from "@/lib/cheatsheet-schema";
import { Badge } from "@/components/ui/badge";

function findRoot(tree: DecisionTreeData): DecisionNode | null {
  const hasIncoming = new Set(tree.edges.map((e) => e.to));
  return tree.nodes.find((n) => !hasIncoming.has(n.id)) ?? null;
}

// validateCheatSheet guarantees every edge.to resolves to a real node (strict-tree check),
// so this trusts that invariant rather than defensively re-filtering.
function childrenOf(tree: DecisionTreeData, nodeId: string) {
  const nodesById = new Map(tree.nodes.map((n) => [n.id, n]));
  return tree.edges
    .filter((e) => e.from === nodeId)
    .map((e) => ({ node: nodesById.get(e.to)!, label: e.label }));
}

function NodeBox({ node }: { node: DecisionNode }) {
  return (
    <div className="rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-center shadow-sm">
      <p className="text-sm font-semibold text-zinc-900">{node.label}</p>
      {node.sublabel && <p className="mt-0.5 text-xs text-zinc-500">{node.sublabel}</p>}
    </div>
  );
}

function Branch({ tree, nodeId }: { tree: DecisionTreeData; nodeId: string }) {
  const node = tree.nodes.find((n) => n.id === nodeId);
  if (!node) return null;
  const children = childrenOf(tree, nodeId);

  return (
    <div className="flex flex-col items-center">
      <NodeBox node={node} />
      {children.length > 0 && (
        <>
          <div className="h-5 w-px bg-zinc-300" />
          <div className="flex flex-wrap items-start justify-center gap-6">
            {children.map(({ node: child, label }) => (
              <div key={child.id} className="flex flex-col items-center">
                {label && <Badge className="mb-1">{label}</Badge>}
                <Branch tree={tree} nodeId={child.id} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function DecisionTree({ tree }: { tree: DecisionTreeData }) {
  const root = findRoot(tree);
  if (!root) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50/50 p-6">
      <Branch tree={tree} nodeId={root.id} />
    </div>
  );
}
