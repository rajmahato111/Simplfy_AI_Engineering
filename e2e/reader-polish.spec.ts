import { test, expect } from "@playwright/test";

test.describe("SEO & reader polish", () => {
  test("sitemap.xml lists learn routes", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain("/learn/concepts/retrieval/rag-fundamentals");
    expect(body).toContain("/learn/walkthroughs/design-a-production-rag-system");
  });

  test("robots.txt references sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain("Sitemap:");
  });

  test("prev/next navigation between chapters", async ({ page }) => {
    await page.goto("/learn/concepts/retrieval/rag-fundamentals");
    await page.getByRole("link", { name: /Next →/ }).click();
    await expect(page).toHaveURL(/chunking-strategies/);
    await page.getByRole("link", { name: /← Previous/ }).click();
    await expect(page).toHaveURL(/rag-fundamentals/);
  });

  test("chapter has meta description in head", async ({ page }) => {
    await page.goto("/learn/concepts/retrieval/rag-fundamentals");
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content", /.+/);
  });
});
