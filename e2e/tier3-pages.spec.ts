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

  test("tutor chat shell sends stub reply", async ({ page }) => {
    await page.goto("/tutor");
    await expect(page.getByRole("heading", { name: "AI tutor" })).toBeVisible();
    await page.getByRole("textbox", { name: "Message" }).fill("What is hybrid search?");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("Grounded tutor responses ship in P2")).toBeVisible();
  });

  test("pricing checkout stub returns message", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { name: "Pricing" })).toBeVisible();
    await page.getByRole("button", { name: "Upgrade to Pro" }).click();
    await expect(page.getByText(/checkout stub|STRIPE_SECRET_KEY/i)).toBeVisible();
  });
});
