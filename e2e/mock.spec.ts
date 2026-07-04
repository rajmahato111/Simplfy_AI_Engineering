import { test, expect } from "@playwright/test";

test.describe("mock interviewer", () => {
  test("setup starts SPIDER session and shows scorecard", async ({ page }) => {
    await page.goto("/mock");
    await expect(page.getByRole("heading", { name: "AI mock interviewer" })).toBeVisible();
    await page.getByRole("button", { name: "Start mock interview" }).click();
    await expect(page).toHaveURL(/\/mock\/[^/?]+\?question=/, { timeout: 15000 });
    await expect(page.getByPlaceholder("Your response…")).toBeVisible();
    await expect(page.getByText("Phase 1 of 6")).toBeVisible();

    await page.getByPlaceholder("Your response…").fill(
      "Clarify QPS 10k, latency 200ms, hybrid retrieval with reranking, observability metrics, and failure fallbacks.",
    );
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "Next phase" }).click();
      await page.getByPlaceholder("Your response…").fill(
        "Ingestion pipeline, vector index, API gateway, eval hooks, scaling and outage handling.",
      );
    }
    await page.getByRole("button", { name: "End mock & see scorecard" }).click();
    await expect(page.getByRole("heading", { name: "Mock scorecard" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("link", { name: "New mock" })).toBeVisible();
  });
});
