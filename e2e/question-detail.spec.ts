import { test, expect } from "@playwright/test";

test.describe("question detail", () => {
  test("loads Q1 from ingest", async ({ page }) => {
    await page.goto("/questions/walk-me-through-the-architecture-of-a-production-rag-system");
    await expect(
      page.getByRole("heading", { name: /Walk me through the architecture of a production RAG system/i }),
    ).toBeVisible();
    await expect(page.getByText("What interviewers look for")).toBeVisible();
    await expect(page.getByText("Q1")).toBeVisible();
  });
});
