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
      const id = headingIds.has(slugifyHeading(text))
        ? slugifyHeading(text)
        : slugifyHeading(text);
      return <h2 id={id} {...props} />;
    },
    img: (props: ComponentPropsWithoutRef<"img">) => {
      const src = typeof props.src === "string" ? props.src : undefined;
      if (!src || src.startsWith("http")) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt ?? ""} />;
      }
      const asset = src.startsWith("/")
        ? src.slice(1)
        : `${slug}/${src}`.replace(/\/+/g, "/");
      // eslint-disable-next-line @next/next/no-img-element
      return <img {...props} src={`/content-assets/${asset}`} alt={props.alt ?? ""} />;
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
