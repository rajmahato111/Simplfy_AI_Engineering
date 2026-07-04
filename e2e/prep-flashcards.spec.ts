import { test, expect } from "@playwright/test";

test.describe("prep hub", () => {
  test("FAQ meta page loads", async ({ page }) => {
    await page.goto("/prep/faq");
    await expect(page.getByRole("heading", { name: "FAQ" })).toBeVisible();
  });
});

test.describe("flashcards", () => {
  test("shows glossary term", async ({ page }) => {
    await page.goto("/flashcards");
    await expect(page.getByRole("heading", { name: "Flashcards" })).toBeVisible();
    await expect(page.getByText(/Term · 1\//)).toBeVisible();
  });
});
