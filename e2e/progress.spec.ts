import { test, expect } from "@playwright/test";

test.describe("progress", () => {
  test.describe.configure({ mode: "serial" });
  test.skip(!process.env.DATABASE_URL, "DATABASE_URL required");

  test("bookmark and complete persist on dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Continue as demo user/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    const chapter = "/learn/concepts/retrieval/rag-fundamentals";

    await page.goto(chapter);

    const bookmarked = page.getByRole("button", { name: "Bookmarked" });
    if (!(await bookmarked.isVisible())) {
      await page.getByRole("button", { name: "Bookmark" }).click();
      await expect(bookmarked).toBeVisible({ timeout: 15_000 });
    }

    // Reload only after the server action finishes — navigating too early aborts the save.
    await page.reload();
    await expect(bookmarked).toBeVisible();

    const completed = page.getByRole("button", { name: "Completed ✓" });
    if (!(await completed.isVisible())) {
      await page.getByRole("button", { name: "Mark complete" }).click();
      await expect(completed).toBeVisible({ timeout: 15_000 });
    }

    await page.reload();
    await expect(completed).toBeVisible();

    await page.goto("/dashboard");
    await expect(
      page.getByRole("link", { name: /RAG Fundamentals: Give Your LLM an Open Book/i }),
    ).toBeVisible();
    await expect(page.getByText("Bookmarked", { exact: true })).toBeVisible();
    await expect(page.getByText("Done", { exact: true })).toBeVisible();
  });
});
