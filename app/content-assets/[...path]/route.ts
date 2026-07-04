import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const CONTENT_DIR = path.join(process.cwd(), "content");

type Props = { params: Promise<{ path: string[] }> };

export async function GET(_req: Request, { params }: Props) {
  const segments = (await params).path;
  if (segments.length < 2) return new NextResponse("Not found", { status: 404 });

  for (let i = segments.length - 1; i >= 1; i--) {
    const slug = segments.slice(0, i).join("/");
    const assetPath = segments.slice(i).join("/");
    const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`);
    const assetAbs = path.normalize(path.join(CONTENT_DIR, slug, assetPath));

    if (
      mdxPath.startsWith(CONTENT_DIR) &&
      assetAbs.startsWith(CONTENT_DIR) &&
      fs.existsSync(mdxPath) &&
      fs.existsSync(assetAbs)
    ) {
      const body = fs.readFileSync(assetAbs);
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
  }

  return new NextResponse("Not found", { status: 404 });
}
