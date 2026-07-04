import { test, expect } from "@playwright/test";
import { auditAllContent } from "../lib/content-audit";
import { POLISHED_LEARN_SLUGS } from "./constants";

const audits = auditAllContent();
const pilots = audits.filter((a) => (POLISHED_LEARN_SLUGS as readonly string[]).includes(a.slug));
const enhancedSmoke = audits
  .filter((a) => !(POLISHED_LEARN_SLUGS as readonly string[]).includes(a.slug))
  .slice(0, 8);

test.describe("content rendering QA", () => {
  for (const audit of pilots) {
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

  for (const audit of enhancedSmoke) {
    test(`${audit.slug} — enhanced chapter loads with diagram`, async ({ page }) => {
      await page.goto(`/learn/${audit.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      if (audit.expectedRenderedImages.length > 0) {
        const fragment = audit.expectedRenderedImages[0].split("/").pop()!;
        await expect(page.locator(`article img[src*="${fragment}"]`).first()).toBeVisible();
      }
    });
  }
});
