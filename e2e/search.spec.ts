import { test, expect } from "@playwright/test";

test.describe("search", () => {
  test("search page finds RAG content", async ({ page }) => {
    await page.goto("/search?q=RAG");
    await expect(page.getByRole("heading", { name: "Search", exact: true })).toBeVisible();
    await expect(page.getByRole("main").getByRole("link").filter({ hasText: /RAG/i }).first()).toBeVisible();
  });

  test("header search link works", async ({ page }, testInfo) => {
    await page.goto("/");
    if (testInfo.project.name === "mobile-chrome") {
      await page.getByRole("button", { name: /open menu/i }).click();
    }
    await page.getByRole("link", { name: "Search", exact: true }).click();
    await expect(page).toHaveURL("/search");
  });
});
