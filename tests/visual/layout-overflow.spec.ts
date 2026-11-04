import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const distSitemap = path.join(rootDir, 'dist', 'sitemap-0.xml');

// Collect all routes from sitemap
let routes: string[] = ['/'];
if (fs.existsSync(distSitemap)) {
  const xml = fs.readFileSync(distSitemap, 'utf-8');
  const regex = /<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g;
  let match;
  routes = [];
  while ((match = regex.exec(xml)) !== null) {
    routes.push(match[1] || '/');
  }
}

test.describe('Global Layout Overflow & Clipping Tests', () => {
  for (const route of routes) {
    test(`Route ${route} should have zero horizontal overflow (?theme=swiss)`, async ({ page }) => {
      await page.goto(`${route}?theme=swiss`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(100);

      const overflowResult = await page.evaluate(() => {
        const bodyWidth = document.body.clientWidth;
        const windowWidth = window.innerWidth;
        const htmlScroll = document.documentElement.scrollWidth;

        // Find elements with horizontal overflow beyond viewport
        const overflowingElements: { selector: string; scrollWidth: number; clientWidth: number }[] = [];
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          if (
            el instanceof HTMLElement &&
            !['HTML', 'BODY', 'svg', 'path', 'g'].includes(el.tagName) &&
            !el.classList.contains('overflow-x-auto') &&
            !el.classList.contains('overflow-x-scroll') &&
            !el.closest('pre') &&
            !el.closest('.overflow-x-auto')
          ) {
            if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0 && el.scrollWidth > windowWidth) {
              const id = el.id ? `#${el.id}` : '';
              const className = el.className ? `.${String(el.className).trim().split(/\s+/).slice(0, 2).join('.')}` : '';
              overflowingElements.push({
                selector: `${el.tagName.toLowerCase()}${id}${className}`,
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth,
              });
            }
          }
        }

        return {
          windowWidth,
          htmlScroll,
          hasWindowOverflow: htmlScroll > windowWidth + 1,
          overflowingElements: overflowingElements.slice(0, 5),
        };
      });

      expect(
        overflowResult.hasWindowOverflow,
        `Page ${route} has horizontal viewport overflow: ${overflowResult.htmlScroll}px > ${overflowResult.windowWidth}px. Culprits: ${JSON.stringify(overflowResult.overflowingElements)}`
      ).toBe(false);
    });
  }
});
