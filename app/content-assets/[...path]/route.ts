import { NextResponse } from "next/server";
import path from "path";
import { readContentAsset } from "@/lib/content";

type Props = { params: Promise<{ path: string[] }> };

export async function GET(_req: Request, { params }: Props) {
  const segments = (await params).path;
  if (segments.length < 2) return new NextResponse("Not found", { status: 404 });

  // URL: /content-assets/{slug...}/{assetPath...} — asset resolves relative to the MDX file dir
  for (let i = segments.length - 1; i >= 1; i--) {
    const slug = segments.slice(0, i).join("/");
    const assetPath = segments.slice(i).join("/");
    const body = readContentAsset(slug, assetPath);
    if (!body) continue;

    const ext = path.extname(assetPath).toLowerCase();
    const type =
      ext === ".svg"
        ? "image/svg+xml"
        : ext === ".png"
          ? "image/png"
          : "application/octet-stream";

    return new NextResponse(body, {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=3600" },
    });
  }

  return new NextResponse("Not found", { status: 404 });
}
