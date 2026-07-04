import { test, expect } from "@playwright/test";

test.describe("tier 2 pages", () => {
  test("glossary loads with upstream terms", async ({ page }) => {
    await page.goto("/glossary");
    await expect(page.getByRole("heading", { name: "Glossary" })).toBeVisible();
    await expect(page.getByText(/99 terms/)).toBeVisible();
    await expect(page.getByRole("heading", { name: /RAG \(Retrieval-Augmented Generation\)/i })).toBeVisible();
  });

  test("patterns loads with catalog", async ({ page }) => {
    await page.goto("/patterns");
    await expect(page.getByRole("heading", { name: "Patterns" })).toBeVisible();
    await expect(page.getByText(/52 patterns/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Hybrid Search", exact: true })).toBeVisible();
  });

  test("question bank shows 121 questions", async ({ page }) => {
    await page.goto("/questions");
    await expect(page.getByText(/121 AI system-design questions/)).toBeVisible();
  });
});
