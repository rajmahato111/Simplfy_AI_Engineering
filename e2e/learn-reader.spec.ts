import { test, expect } from "@playwright/test";
import { LEARN_SLUGS } from "./constants";

test.describe("learn reader", () => {
  test("index lists all committed MDX slugs", async ({ page }) => {
    await page.goto("/learn");
    for (const slug of LEARN_SLUGS) {
      const link = page.locator(`a[href="/learn/${slug}"]`).first();
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible();
    }
  });

  for (const slug of LEARN_SLUGS) {
    test(`renders ${slug}`, async ({ page }) => {
      await page.goto(`/learn/${slug}`);
      await expect(page.locator("article h1").first()).toBeVisible();
      const body = await page.locator("article .prose, article").last().innerText();
      expect(body.length).toBeGreaterThan(200);
    });
  }

  test("walkthrough diagram loads from content-assets", async ({ page }) => {
    await page.goto("/learn/walkthroughs/design-a-production-rag-system");
    const img = page.locator('article img[src*="content-assets"]');
    await expect(img).toBeVisible();
    const box = await img.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(100);
  });

  test("internal MDX link navigates between concepts", async ({ page }) => {
    await page.goto("/learn/concepts/retrieval/rag-fundamentals");
    await page.locator('a[href="/learn/concepts/retrieval/chunking-strategies"]').first().click();
    await expect(page).toHaveURL(/chunking-strategies/);
    await expect(page.locator("article h1")).toBeVisible();
  });

  test("survives hard refresh on longest slug", async ({ page }) => {
    await page.goto("/learn/walkthroughs/design-a-production-rag-system");
    await page.reload();
    await expect(page.locator("article h1")).toBeVisible();
  });

  test("sequential navigation across learn pages", async ({ page }) => {
    for (const slug of LEARN_SLUGS) {
      await page.goto(`/learn/${slug}`);
      await expect(page.locator("article h1")).toBeVisible();
    }
  });
});
