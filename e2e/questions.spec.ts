import { test, expect } from "@playwright/test";

test.describe("question bank shell", () => {
  test("questions page shows filters and Q1", async ({ page }) => {
    await page.goto("/questions");
    await expect(page.getByRole("heading", { name: "Question bank" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Filter" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Walk me through the architecture of a production RAG system/i }),
    ).toBeVisible();
  });
});
