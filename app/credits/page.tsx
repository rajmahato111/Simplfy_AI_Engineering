import fs from "fs";
import path from "path";

export default function CreditsPage() {
  const credits = fs.readFileSync(path.join(process.cwd(), "CREDITS.md"), "utf8");

  return (
    <article className="prose max-w-none whitespace-pre-wrap text-sm leading-relaxed">
      <h1 className="mb-4 text-2xl font-semibold not-prose">Credits</h1>
      {credits.replace(/^# Credits[^\n]*\n+/m, "")}
    </article>
  );
}
