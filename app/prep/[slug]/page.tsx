import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMetaPage } from "@/lib/meta-pages";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getMetaPage(slug);
  if (!page) return { title: "Not found" };
  return { title: page.title, description: page.summary.slice(0, 160) };
}

export default async function MetaPrepPage({ params }: Props) {
  const { slug } = await params;
  const page = getMetaPage(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/prep" className="text-sm font-medium text-brand hover:underline">
        ← Prep hub
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-zinc-900">{page.title}</h1>
      <p className="mt-3 text-zinc-600">{page.summary}</p>
      <ul className="mt-10 space-y-8">
        {page.sections.map((s) => (
          <li key={s.id} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">{s.title}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">{s.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
