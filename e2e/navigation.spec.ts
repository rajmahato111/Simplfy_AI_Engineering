import { test, expect } from "@playwright/test";
import { NAV_ROUTES } from "./constants";

test.describe("top-level navigation", () => {
  for (const { href, label } of NAV_ROUTES) {
    test(`${label} (${href}) loads`, async ({ page }) => {
      await page.goto(href);
      await expect(page.locator("h1")).toBeVisible();
    });
  }

  test("header links match PRD nav", async ({ page }) => {
    await page.goto("/");
    for (const { href, label } of NAV_ROUTES) {
      await expect(page.locator(`header nav a[href="${href}"]`)).toHaveText(label);
    }
  });
});
