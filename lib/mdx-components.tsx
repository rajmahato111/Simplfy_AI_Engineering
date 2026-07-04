import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { slugifyHeading } from "@/lib/headings";

/** MDX img paths are relative to the MDX file; prefix with slug for the asset route. */
export function mdxComponents(
  slug: string,
  headings?: { id: string; title: string }[],
): MDXComponents {
  const headingIds = new Set(headings?.map((h) => h.id));

  return {
    h2: (props: ComponentPropsWithoutRef<"h2">) => {
      const text = typeof props.children === "string" ? props.children : "";
      const id = slugifyHeading(text);
      return <h2 id={id} {...props} />;
    },
    table: (props: ComponentPropsWithoutRef<"table">) => (
      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-zinc-200 shadow-sm">
        <table {...props} className="w-full min-w-[480px] border-collapse text-sm" />
      </div>
    ),
    thead: (props: ComponentPropsWithoutRef<"thead">) => (
      <thead className="bg-zinc-50 text-left text-zinc-800" {...props} />
    ),
    tbody: (props: ComponentPropsWithoutRef<"tbody">) => (
      <tbody className="divide-y divide-zinc-200 bg-white" {...props} />
    ),
    tr: (props: ComponentPropsWithoutRef<"tr">) => <tr className="align-top" {...props} />,
    th: (props: ComponentPropsWithoutRef<"th">) => (
      <th className="px-4 py-3 font-semibold whitespace-nowrap" {...props} />
    ),
    td: (props: ComponentPropsWithoutRef<"td">) => (
      <td className="px-4 py-3 text-zinc-700 leading-relaxed" {...props} />
    ),
    img: (props: ComponentPropsWithoutRef<"img">) => {
      const src = typeof props.src === "string" ? props.src : undefined;
      if (!src || src.startsWith("http")) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt ?? ""} className="my-8 w-full rounded-xl border border-zinc-200 shadow-sm" />;
      }
      const asset = src.startsWith("/")
        ? src.slice(1)
        : `${slug}/${src}`.replace(/\/+/g, "/");
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <img
          {...props}
          src={`/content-assets/${asset}`}
          alt={props.alt ?? ""}
          className="my-8 w-full rounded-xl border border-zinc-200 shadow-sm"
        />
      );
    },
    a: (props: ComponentPropsWithoutRef<"a">) => {
      const href = props.href ?? "";
      if (href.startsWith("/") || href.startsWith("http")) {
        return <a {...props} />;
      }
      if (href.endsWith(".mdx")) {
        const target = href.replace(/^\.\//, "").replace(/\.mdx$/, "");
        const base = slug.includes("/") ? slug.replace(/\/[^/]+$/, "") : "";
        const full = base ? `${base}/${target}` : target;
        return <a {...props} href={`/learn/${full.replace(/\/+/g, "/")}`} />;
      }
      return <a {...props} />;
    },
  };
}
