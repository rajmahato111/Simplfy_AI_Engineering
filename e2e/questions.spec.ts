import { test, expect } from "@playwright/test";

test.describe("question bank shell", () => {
  test("questions page shows empty state and filters", async ({ page }) => {
    await page.goto("/questions");
    await expect(page.getByRole("heading", { name: "Question bank" })).toBeVisible();
    await expect(page.getByText("No questions in the bank yet")).toBeVisible();
    await expect(page.getByRole("button", { name: "Filter" })).toBeVisible();
  });
});
