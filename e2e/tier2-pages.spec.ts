import { test, expect } from "@playwright/test";

test.describe("tier 2 pages", () => {
  test("glossary loads", async ({ page }) => {
    await page.goto("/glossary");
    await expect(page.getByRole("heading", { name: "Glossary" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "RAG", exact: true })).toBeVisible();
  });

  test("patterns loads", async ({ page }) => {
    await page.goto("/patterns");
    await expect(page.getByRole("heading", { name: "Patterns" })).toBeVisible();
    await expect(page.getByText("Hybrid retrieval")).toBeVisible();
  });
});
