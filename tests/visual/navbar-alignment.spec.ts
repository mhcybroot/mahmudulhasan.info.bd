import { test, expect } from '@playwright/test';

test.describe('Navbar Alignment & Collision Tests', () => {
  const themes = ['swiss', 'obsidian'];

  for (const theme of themes) {
    test(`Header should have zero element overlaps and positive margins (?theme=${theme})`, async ({ page }) => {
      await page.goto(`/?theme=${theme}`, { waitUntil: 'domcontentloaded' });
      const header = page.locator('header');
      await expect(header).toBeVisible();

      // Check header horizontal overflow
      const isHeaderOverflowing = await header.evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(isHeaderOverflowing, `Header in theme ${theme} should not have horizontal overflow`).toBe(false);

      // Check for overlap between brand/coordinates and first nav link
      const coords = page.locator('header span:has-text("[23.8103° N")');
      const firstNavLink = page.locator('header nav a.nav-desktop-link:has-text("Flagship Systems")');
      const brand = page.locator('header a[href="/#hero"]');

      const isCoordsVisible = await coords.isVisible();
      const isNavVisible = await firstNavLink.isVisible();

      if (isNavVisible) {
        const navBox = await firstNavLink.boundingBox();
        expect(navBox).not.toBeNull();

        if (isCoordsVisible) {
          const coordsBox = await coords.boundingBox();
          expect(coordsBox).not.toBeNull();
          if (coordsBox && navBox) {
            // Distance between coordinates badge right edge and first nav link left edge must be >= 8px
            const clearance = navBox.x - (coordsBox.x + coordsBox.width);
            expect(
              clearance,
              `Coordinates badge must not collide with Flagship Systems link (clearance: ${clearance}px)`
            ).toBeGreaterThanOrEqual(8);
          }
        } else {
          // If coords are hidden, brand right edge must not collide with first nav link
          const brandBox = await brand.boundingBox();
          if (brandBox && navBox) {
            const clearance = navBox.x - (brandBox.x + brandBox.width);
            expect(
              clearance,
              `Brand text must not collide with Flagship Systems link (clearance: ${clearance}px)`
            ).toBeGreaterThanOrEqual(8);
          }
        }

        // Check distance between last nav link (Contact) and trailing actions (Theme Switcher / Resume button)
        const lastNavLink = page.locator('header nav a.nav-desktop-link:has-text("Contact")');
        const themeBtn = page.locator('#theme-switcher-container');
        const lastNavBox = await lastNavLink.boundingBox();
        const themeBtnBox = await themeBtn.boundingBox();
        if (lastNavBox && themeBtnBox) {
          const trailingClearance = themeBtnBox.x - (lastNavBox.x + lastNavBox.width);
          expect(
            trailingClearance,
            `Contact link must not collide with Theme Switcher (clearance: ${trailingClearance}px)`
          ).toBeGreaterThanOrEqual(8);
        }
      }

      // Visual snapshot regression check for header across themes and breakpoints
      await expect(header).toHaveScreenshot(`navbar-${theme}.png`);
    });
  }
});
