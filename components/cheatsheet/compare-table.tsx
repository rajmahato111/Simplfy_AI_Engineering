import type { CompareTable as CompareTableData } from "@/lib/cheatsheet-schema";
import { ColorBar } from "@/components/cheatsheet/color-bar";
import { StarRating } from "@/components/cheatsheet/star-rating";
import { cheatColorClasses } from "@/components/cheatsheet/colors";

export function CompareTable({ table }: { table: CompareTableData }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 shadow-sm">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead className="bg-zinc-50 text-left text-zinc-800">
          <tr className="align-top">
            <th className="px-4 py-3 font-semibold whitespace-nowrap">Aspect</th>
            {table.columns.map((col) => (
              <th
                key={col.id}
                className={`border-b-2 px-4 py-3 font-semibold whitespace-nowrap ${col.color ? cheatColorClasses[col.color].border : "border-transparent"}`}
              >
                <span className={col.color ? cheatColorClasses[col.color].text : undefined}>
                  {col.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white">
          {table.rows.map((row) => (
            <tr key={row.label} className="align-top">
              <td className="px-4 py-3 font-medium text-zinc-900 whitespace-nowrap">
                {row.label}
              </td>
              {table.columns.map((col) => {
                const cell = row.cells[col.id];
                return (
                  <td key={col.id} className="px-4 py-3 text-zinc-700 leading-relaxed">
                    {cell?.type === "text" && cell.value}
                    {cell?.type === "bar" && (
                      <ColorBar value={cell.value} color={cell.color} label={cell.label} />
                    )}
                    {cell?.type === "stars" && <StarRating value={cell.value} />}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
