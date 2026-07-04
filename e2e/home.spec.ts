import { test, expect } from "@playwright/test";

test.describe("home", () => {
  test("shows value prop and learn CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("How AI engineers prepare");
    await expect(page.getByRole("link", { name: "Start learning" })).toBeVisible();
  });

  test("returns 404 for unknown routes", async ({ page }) => {
    const res = await page.goto("/does-not-exist-route");
    expect(res?.status()).toBe(404);
  });
});
