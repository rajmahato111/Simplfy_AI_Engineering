import { test, expect } from "@playwright/test";

test.describe("content assets", () => {
  test("serves walkthrough architecture SVG", async ({ request }) => {
    const res = await request.get(
      "/content-assets/walkthroughs/design-a-production-rag-system/diagrams/design-a-production-rag-system--architecture.svg",
    );
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/svg");
  });

  test("returns 404 for invalid asset path", async ({ request }) => {
    const res = await request.get("/content-assets/invalid/path.svg");
    expect(res.status()).toBe(404);
  });
});
