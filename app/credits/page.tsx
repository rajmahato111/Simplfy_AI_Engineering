import fs from "fs";
import path from "path";
import { PageHero } from "@/components/page-hero";

export default function CreditsPage() {
  const credits = fs.readFileSync(path.join(process.cwd(), "CREDITS.md"), "utf8");
  const body = credits.replace(/^# Credits[^\n]*\n+/m, "");

  return (
    <>
      <PageHero title="Credits & attribution" description="Licensing and acknowledgments." />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose max-w-none whitespace-pre-wrap text-sm">{body}</article>
      </div>
    </>
  );
}
