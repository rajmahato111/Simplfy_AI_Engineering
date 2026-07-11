import type { CheatColorToken, CheatIconName } from "@/lib/cheatsheet-schema";
import { cheatColorClasses } from "@/components/cheatsheet/colors";
import { cheatIcons } from "@/components/cheatsheet/icons";

export function IconCallout({
  icon,
  heading,
  body,
  bullets,
  color = "brand",
}: {
  icon: CheatIconName;
  heading: string;
  body?: string;
  bullets?: string[];
  color?: CheatColorToken;
}) {
  const classes = cheatColorClasses[color];
  const Icon = cheatIcons[icon];
  return (
    <div className={`rounded-xl border ${classes.border} ${classes.muted} p-4`}>
      <div className="flex items-center gap-2">
        <Icon size={18} className={classes.text} />
        <h3 className={`text-sm font-semibold ${classes.text}`}>{heading}</h3>
      </div>
      {body && <p className="mt-2 text-sm text-zinc-700">{body}</p>}
      {bullets && bullets.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm text-zinc-700">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${classes.bg}`} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
