import { test, expect } from "@playwright/test";

test.describe("tier 3 pages", () => {
  test("practice SPIDER flow navigates phases", async ({ page }) => {
    await page.goto("/practice");
    await expect(page.getByRole("heading", { name: "SPIDER walkthrough" })).toBeVisible();
    await expect(page.getByText("Phase 1 of 6")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Scope", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Next phase" }).click();
    await expect(page.getByText("Phase 2 of 6")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Prioritize", exact: true })).toBeVisible();
  });

  test("practice SPIDER submit shows checkpoint feedback", async ({ page }) => {
    await page.goto("/practice");
    await page.getByPlaceholder("Your answer for this phase").fill(
      "Latency budget 200ms, 10k QPS, hybrid retrieval with reranking and observability metrics.",
    );
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "Next phase" }).click();
      await page.getByPlaceholder("Your answer for this phase").fill(
        "Architecture with ingestion pipeline, vector index, API gateway, eval hooks, and failure fallbacks.",
      );
    }
    await page.getByRole("button", { name: "Submit for feedback" }).click();
    await expect(page.getByText(/Checkpoint score:/)).toBeVisible({ timeout: 10000 });
  });

  test("tutor chat returns cited corpus answer", async ({ page }) => {
    await page.goto("/tutor");
    await expect(page.getByRole("heading", { name: "AI tutor" })).toBeVisible();
    await page.getByRole("textbox", { name: "Message" }).fill("What is RAG?");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("From the corpus:")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("link", { name: "RAG fundamentals" })).toBeVisible();
  });

  test("frameworks page lists SPIDER", async ({ page }) => {
    await page.goto("/frameworks");
    await expect(page.getByRole("heading", { name: "Answer frameworks" })).toBeVisible();
    await expect(page.getByText("SPIDER", { exact: true })).toBeVisible();
  });

  test("pricing checkout stub returns message", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { name: "Pricing" })).toBeVisible();
    await page.getByRole("button", { name: "Upgrade to Pro" }).click();
    await expect(page.getByText(/checkout stub|STRIPE_SECRET_KEY/i)).toBeVisible();
  });
});
