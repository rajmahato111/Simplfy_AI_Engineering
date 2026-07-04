import fs from "fs";
import path from "path";

const LOCK_PATH = path.join(process.cwd(), "data", "upstream-lock.json");

type UpstreamLock = {
  repo: string;
  ref: string;
};

export function readUpstreamLock(): UpstreamLock {
  const raw = JSON.parse(fs.readFileSync(LOCK_PATH, "utf8")) as UpstreamLock;
  return raw;
}

export async function fetchUpstreamFile(filePath: string): Promise<string> {
  const { repo, ref } = readUpstreamLock();
  const url = `https://raw.githubusercontent.com/${repo}/${ref}/${filePath}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}
