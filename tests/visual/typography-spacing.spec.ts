import { test, expect } from '@playwright/test';

test.describe('Typography Spacing & Inline Word Boundary Tests', () => {
  test('Hero heading must preserve proper word boundaries around inline tags', async ({ page }) => {
    await page.goto('/?theme=swiss', { waitUntil: 'domcontentloaded' });
    const heroH1 = page.locator('#hero h1:visible');
    const text = await heroH1.innerText();
    const normalizedText = text.replace(/\s+/g, ' ');

    // Verify words are not concatenated
    expect(normalizedText).toContain('Systems That Never Crash');
    expect(normalizedText).toContain('Never Crash and');
    expect(normalizedText).toContain('and Never Slow Down.');
    expect(text).not.toContain('ThatNever');
    expect(text).not.toContain('Crashand');
    expect(text).not.toContain('andNever');
  });

  test('All visible headings across site should not have camelCase concatenated words across tags', async ({ page }) => {
    await page.goto('/?theme=swiss', { waitUntil: 'domcontentloaded' });

    const concatenatedInstances = await page.evaluate(() => {
      const issues: { selector: string; text: string }[] = [];
      const headings = document.querySelectorAll('h1, h2, h3');
      for (const h of headings) {
        if (h instanceof HTMLElement && h.offsetParent !== null) {
          // Check for lowerUpper word joins that indicate missing spaces across tags (e.g. "ThatNever", "Crashand")
          // Avoid matching normal words
          const text = h.innerText;
          const matches = text.match(/\b([a-z]{3,})([A-Z][a-z]{2,})\b/g);
          if (matches) {
            issues.push({
              selector: `${h.tagName.toLowerCase()}${h.id ? '#' + h.id : ''}`,
              text: matches.join(', '),
            });
          }
        }
      }
      return issues;
    });

    expect(
      concatenatedInstances,
      `Found concatenated words due to missing HTML whitespace: ${JSON.stringify(concatenatedInstances)}`
    ).toHaveLength(0);
  });
});
