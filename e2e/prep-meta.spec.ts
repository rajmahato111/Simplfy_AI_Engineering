import { test, expect } from "@playwright/test";

test.describe("prep meta pages", () => {
  test("lists frameworks and pitfalls", async ({ page }) => {
    await page.goto("/prep");
    await expect(page.getByRole("heading", { name: "Answer frameworks" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Common pitfalls" })).toBeVisible();
  });

  test("frameworks page loads sections", async ({ page }) => {
    await page.goto("/prep/frameworks");
    await expect(page.getByRole("heading", { name: "Answer frameworks" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });
});
