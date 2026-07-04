import { test, expect } from "@playwright/test";

test.describe("question detail", () => {
  test("loads sample question", async ({ page }) => {
    await page.goto("/questions/design-production-rag");
    await expect(page.getByRole("heading", { name: /production RAG system/i })).toBeVisible();
    await expect(page.getByText("What interviewers look for")).toBeVisible();
  });
});
