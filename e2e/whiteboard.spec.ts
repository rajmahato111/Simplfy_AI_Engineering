import { test, expect } from "@playwright/test";

test.describe("whiteboard exercises", () => {
  test("lists enterprise RAG exercise", async ({ page }) => {
    await page.goto("/whiteboard");
    await expect(page.getByRole("heading", { name: "System design whiteboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Enterprise RAG System/i })).toBeVisible();
  });

  test("exercise detail shows problem and walkthrough", async ({ page }) => {
    await page.goto("/whiteboard/exercises/exercise-1-enterprise-rag-system");
    await expect(page.getByRole("heading", { name: /Enterprise RAG System/i })).toBeVisible();
    await expect(page.getByRole("paragraph").filter({ hasText: /10 million documents/i })).toBeVisible();
    await expect(page.getByText("Solution walkthrough")).toBeVisible();
    await expect(page.getByRole("link", { name: "Open guided practice" })).toBeVisible();
  });
});
