import { test, expect } from "@playwright/test";
import { auditAllContent } from "../lib/content-audit";

const audits = auditAllContent();
const polished = audits.filter((a) => a.status === "reviewed" || a.status === "approved");
const draftSmoke = audits.filter((a) => a.status === "draft").slice(0, 5);

test.describe("content rendering QA", () => {
  for (const audit of polished) {
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

  for (const audit of draftSmoke) {
    test(`${audit.slug} — draft chapter loads`, async ({ page }) => {
      await page.goto(`/learn/${audit.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }
});
