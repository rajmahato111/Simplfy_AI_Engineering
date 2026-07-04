import { test, expect } from "@playwright/test";
import { NAV_ROUTES } from "./constants";

test.describe("top-level navigation", () => {
  for (const { href, label } of NAV_ROUTES) {
    test(`${label} (${href}) loads`, async ({ page }) => {
      await page.goto(href);
      await expect(page.locator("h1")).toBeVisible();
    });
  }

  test("header links match PRD nav", async ({ page }, testInfo) => {
    await page.goto("/");
    if (testInfo.project.name === "mobile-chrome") {
      await page.getByRole("button", { name: /open menu/i }).click();
    }
    for (const { href, label } of NAV_ROUTES) {
      await expect(page.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: "Dashboard", exact: true })).toBeVisible();
  });
});
