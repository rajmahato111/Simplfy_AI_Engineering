import { test, expect } from "@playwright/test";

test.describe("auth skeleton", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });

  test("dashboard redirects when signed out", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("demo sign-in reaches dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Continue as demo user/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("demo@simplify.ai")).toBeVisible();
  });
});
