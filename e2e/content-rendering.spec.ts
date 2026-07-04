import { test, expect } from "@playwright/test";
import { auditAllContent } from "../lib/content-audit";

const audits = auditAllContent();

test.describe("content rendering QA", () => {
  for (const audit of audits) {
    test(`${audit.slug} — tables and diagrams render`, async ({ page }) => {
      await page.goto(`/learn/${audit.slug}`);

      if (audit.markdownTables > 0) {
        await expect(page.locator("article table")).toHaveCount(audit.markdownTables, {
          timeout: 10_000,
        });
        const firstHeader = page.locator("article table th").first();
        await expect(firstHeader).toBeVisible();
      }

      for (const imgPath of audit.expectedRenderedImages) {
        const fragment = imgPath.split("/").pop()!;
        const img = page.locator(`article img[src*="${fragment}"]`);
        await expect(img.first()).toBeVisible();
        const box = await img.first().boundingBox();
        expect(box?.width ?? 0).toBeGreaterThan(100);
      }
    });
  }
});
