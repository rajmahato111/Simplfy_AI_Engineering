#!/usr/bin/env node
/**
 * Pre-PR browser smoke tests. Requires dev server running.
 * Usage: node scripts/browser-smoke.mjs [--base-url http://127.0.0.1:3000]
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const baseIdx = args.indexOf("--base-url");
const BASE = baseIdx >= 0 ? args[baseIdx + 1] : "http://127.0.0.1:3000";
const QA_DIR = path.join(process.cwd(), ".qa");

const LEARN_SLUGS = [
  "concepts/retrieval/rag-fundamentals",
  "concepts/retrieval/chunking-strategies",
  "walkthroughs/design-a-production-rag-system",
];

const NAV = ["/learn", "/questions", "/practice", "/mock", "/tutor", "/dashboard"];

const errors = [];

function fail(id, msg) {
  errors.push(`[${id}] ${msg}`);
  console.error(`FAIL ${id}: ${msg}`);
}

async function assertOk(page, id, url, checks) {
  const res = await page.goto(url, { waitUntil: "networkidle" });
  if (!res || !res.ok()) {
    fail(id, `${url} returned ${res?.status() ?? "no response"}`);
    return;
  }
  for (const [name, fn] of checks) {
    try {
      await fn(page);
    } catch (e) {
      fail(id, `${name}: ${e.message}`);
    }
  }
}

async function main() {
  fs.mkdirSync(QA_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    // ponytail: favicon missing is noise until we add one
    if (text.includes("favicon.ico")) return;
    consoleErrors.push(text);
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  // B1 — home
  await assertOk(page, "B1", `${BASE}/`, [
    ["heading", async (p) => {
      await p.waitForSelector("h1");
      const text = await p.locator("h1").first().textContent();
      if (!text?.includes("AI-native")) throw new Error(`unexpected h1: ${text}`);
    }],
    ["learn CTA", async (p) => {
      const href = await p.locator('a[href="/learn"]').first().getAttribute("href");
      if (href !== "/learn") throw new Error("missing /learn CTA");
    }],
  ]);

  // B2 — nav routes
  for (const route of NAV) {
    await assertOk(page, "B2", `${BASE}${route}`, [
      ["h1", async (p) => {
        await p.waitForSelector("h1");
      }],
    ]);
  }

  // B3 — learn index lists slugs
  await assertOk(page, "B3", `${BASE}/learn`, [
    ["slug links", async (p) => {
      for (const slug of LEARN_SLUGS) {
        const link = p.locator(`a[href="/learn/${slug}"]`);
        if ((await link.count()) === 0) throw new Error(`missing link for ${slug}`);
      }
    }],
  ]);

  // B4 — each MDX page
  for (const slug of LEARN_SLUGS) {
    await assertOk(page, "B4", `${BASE}/learn/${slug}`, [
      ["article", async (p) => {
        await p.waitForSelector("article h1");
        const body = await p.locator("article").innerText();
        if (body.length < 200) throw new Error("body too short");
      }],
    ]);
  }

  // B5 — diagram on walkthrough
  await assertOk(page, "B5", `${BASE}/learn/walkthroughs/design-a-production-rag-system`, [
    ["diagram img", async (p) => {
      const img = p.locator('article img[src*="content-assets"]');
      await img.waitFor({ state: "visible" });
      const box = await img.boundingBox();
      if (!box || box.width < 100) throw new Error("diagram not visible");
    }],
  ]);

  // B6 — internal mdx link (rag → chunking)
  await assertOk(page, "B6", `${BASE}/learn/concepts/retrieval/rag-fundamentals`, [
    ["chunking link", async (p) => {
      const link = p.locator('a[href="/learn/concepts/retrieval/chunking-strategies"]');
      await link.first().click();
      await p.waitForURL("**/chunking-strategies");
    }],
  ]);

  // B7 — credits
  await assertOk(page, "B7", `${BASE}/credits`, [
    ["credits text", async (p) => {
      const text = await p.locator("article").innerText();
      if (!text.includes("Om Bharatiya")) throw new Error("credits missing attribution");
    }],
  ]);

  if (consoleErrors.length) {
    fail("console", consoleErrors.join("; "));
  }

  // B8 — 404 (intentional; may log resource errors — not counted)
  const r404 = await page.goto(`${BASE}/does-not-exist-route`, { waitUntil: "domcontentloaded" });
  if (r404?.status() !== 404) fail("B8", `expected 404, got ${r404?.status()}`);

  // S1 — hard refresh deepest slug
  await page.goto(`${BASE}/learn/walkthroughs/design-a-production-rag-system`, {
    waitUntil: "networkidle",
  });
  await page.reload({ waitUntil: "networkidle" });
  if (!(await page.locator("article h1").count())) fail("S1", "reload broke page");

  // S2 — sequential navigation
  for (const slug of LEARN_SLUGS) {
    await page.goto(`${BASE}/learn/${slug}`, { waitUntil: "networkidle" });
  }

  // S3 — mobile viewport
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const nav = page.locator("header nav");
  if (!(await nav.isVisible())) fail("S3", "nav not visible on mobile");

  // S4 — desktop viewport
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE}/learn`, { waitUntil: "networkidle" });

  // S5 — invalid asset (intentional 404)
  const badAsset = await page.goto(`${BASE}/content-assets/invalid/path.svg`, {
    waitUntil: "domcontentloaded",
  });
  if (badAsset?.status() !== 404) fail("S5", `expected 404 for bad asset, got ${badAsset?.status()}`);

  await page.screenshot({ path: path.join(QA_DIR, "smoke-final.png"), fullPage: true });
  await browser.close();

  if (errors.length) {
    console.error(`\n${errors.length} failure(s). Screenshots in .qa/`);
    process.exit(1);
  }
  console.log(`Browser smoke passed against ${BASE} (${LEARN_SLUGS.length} learn pages)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
