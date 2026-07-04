import { test, expect } from "@playwright/test";

test.describe("question detail", () => {
  test("loads Q1 from ingest", async ({ page }) => {
    await page.goto("/questions/walk-me-through-the-architecture-of-a-production-rag-system");
    await expect(
      page.getByRole("heading", { name: /Walk me through the architecture of a production RAG system/i }),
    ).toBeVisible();
    await expect(page.getByText("Interview rubric")).toBeVisible();
    await expect(page.getByText("Q1")).toBeVisible();
    await expect(page.getByRole("button", { name: "Reveal strong answer" })).toBeVisible();
    await page.getByRole("button", { name: "Reveal strong answer" }).click();
    await expect(page.getByText("Strong answer covers")).toBeVisible();
  });
});
