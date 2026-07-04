import { test, expect } from "@playwright/test";

test.describe("credits", () => {
  test("shows upstream attribution", async ({ page }) => {
    await page.goto("/credits");
    await expect(page.locator("article, .prose").first()).toContainText("Om Bharatiya");
  });
});
