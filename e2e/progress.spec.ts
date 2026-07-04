import { test, expect } from "@playwright/test";

test.describe("progress", () => {
  test.skip(!process.env.DATABASE_URL, "DATABASE_URL required");

  test("bookmark and complete persist on dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Continue as demo user/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto("/learn/concepts/retrieval/rag-fundamentals");
    await page.getByRole("button", { name: "Bookmark" }).click();
    await page.getByRole("button", { name: "Mark complete" }).click();
    await expect(page.getByRole("button", { name: "Bookmarked" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Completed ✓" })).toBeVisible();

    await page.goto("/dashboard");
    await expect(page.getByText("RAG Fundamentals")).toBeVisible();
    await expect(page.getByText("Bookmarked")).toBeVisible();
    await expect(page.getByText("Done")).toBeVisible();
  });
});
