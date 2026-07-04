import Link from "next/link";
import { listMetaPages } from "@/lib/meta-pages";

export default function PrepHubPage() {
  const pages = listMetaPages();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900">Interview prep hub</h1>
      <p className="mt-2 text-zinc-600">
        Meta guides from the upstream corpus — frameworks, pitfalls, behavioral, job market, FAQ.
      </p>
      <ul className="mt-8 space-y-4">
        {pages.map((p) => (
          <li key={p.id}>
            <Link
              href={`/prep/${p.id}`}
              className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-brand/30"
            >
              <h2 className="font-semibold text-zinc-900">{p.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{p.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
