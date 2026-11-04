# Playwright Visual Regression Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement automated visual regression testing with Playwright to catch responsive alignment collisions, text wraps, and element overlaps across multiple screen sizes and themes (Swiss Light and Obsidian Dark).

**Architecture:** Playwright test runner configured with system Chromium (`/usr/bin/chromium`) running against a local preview server on `http://localhost:4321`. Tests capture component and full-page visual snapshots (`toHaveScreenshot()`) across a 5-tier responsive breakpoint matrix (`375px`, `768px`, `1024px`, `1280px`, `1536px`) and dual themes (`?theme=swiss`, `?theme=obsidian`). A dedicated test will replicate and permanently guard against the Navbar coordinate-link collision identified at 1024px.

**Tech Stack:** Playwright (`@playwright/test`), system Chromium, Astro preview server, TypeScript.

**Spec:** Responsive UI alignment verification and automated pixel-diff regression suite.

## Global Constraints
- Must use existing system Chromium (`/usr/bin/chromium`) without forcing external headless browser downloads.
- Must support dual themes via query params (`?theme=swiss` and `?theme=obsidian`).
- Visual snapshot comparisons must tolerate minor anti-aliasing variations (`maxDiffPixelRatio: 0.01` or `threshold: 0.2`) to avoid flakiness across environments.
- Self-contained web server lifecycle: automatically spin up and tear down `npm run preview` during test runs.

## Review Focus
1. **1024px Breakpoint Navbar Collision:** At 1024px (`lg`), the coordinates badge `[23.8103° N, 90.4125° E]` overlaps with `FLAGSHIP SYSTEMS`. The fix must decouple or collapse badges before collision.
2. **Mobile Drawer / Hamburger Toggle:** At `< 768px`, verify desktop navigation links are hidden and mobile menu hamburger is correctly aligned.
3. **Telemetry Card Grid Collisions:** At `768px` to `1024px`, verify telemetry metric boxes in case studies wrap or stack without overlapping text or numbers.
4. **Interactive Simulators Clipping:** Verify complex simulators (e.g. `SecureNotesSimulator`, `FintechLedgerSimulator`) do not induce horizontal page scrollbars on mobile (`375px`).
5. **Theme Switching Visual Parity:** Ensure dark and light themes render clean element boundaries without missing backgrounds or illegible borders.

---

### Task 1: Install Playwright & Create Configuration

**Files:**
- Modify: `package.json`
- Create: `playwright.config.ts`

- [ ] **Step 1: Install `@playwright/test` as a dev dependency**
  Run `npm install -D @playwright/test` without downloading redundant browser binaries.
- [ ] **Step 2: Create `playwright.config.ts`**
  Configure Playwright with:
  - `webServer`: command `npm run preview -- --port 4321`, port 4321, reuseExistingServer: true.
  - `use`: `baseURL: 'http://localhost:4321'`, `executablePath: '/usr/bin/chromium'`, `headless: true`.
  - `projects`: Breakpoint matrix:
    - `mobile` (`width: 375, height: 667`)
    - `tablet` (`width: 768, height: 1024`)
    - `laptop-sm` (`width: 1024, height: 800`) — critical collision zone
    - `laptop-md` (`width: 1280, height: 800`)
    - `desktop` (`width: 1536, height: 900`)
  - Snapshot directory: `tests/visual/__snapshots__/`
- [ ] **Step 3: Verify Playwright config loads**
  Run `npx playwright test --version` and ensure configuration parses without error.
- [ ] **Step 4: Commit configuration scaffolding**
  `git commit -m "chore(visual): setup playwright configuration and responsive breakpoint matrix"`

---

### Task 2: Create Failing Visual Regression Tests

**Files:**
- Create: `tests/visual/navbar-alignment.spec.ts`
- Create: `tests/visual/case-study-alignment.spec.ts`

- [ ] **Step 1: Write Navbar Alignment spec**
  Test navigation header snapshot across `laptop-sm` (1024px) in Swiss theme:
  ```ts
  import { test, expect } from '@playwright/test';

  test.describe('Navbar Alignment & Collision Tests', () => {
    test('header should not have overlapping items at 1024px', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 800 });
      await page.goto('/?theme=swiss');
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // Bounding box collision assertion
      const coords = page.locator('header span:has-text("[23.8103° N")');
      const firstLink = page.locator('nav a:has-text("Flagship Systems")');
      
      if (await coords.isVisible() && await firstLink.isVisible()) {
        const coordsBox = await coords.boundingBox();
        const linkBox = await firstLink.boundingBox();
        expect(coordsBox.x + coordsBox.width).toBeLessThan(linkBox.x);
      }
    });
  });
  ```
- [ ] **Step 2: Run test to observe failure at 1024px**
  Run `npx playwright test tests/visual/navbar-alignment.spec.ts`.
  Confirm that the bounding box overlap causes the test to fail as expected on the current code.
- [ ] **Step 3: Write Case Study Telemetry alignment spec**
  Add visual snapshot assertions for `/systems/secure-notes-cloud/` header telemetry cards.

---

### Task 3: Fix Navbar Spacing & Alignment Root Cause

**Files:**
- Modify: `src/components/Navbar.astro:9-29`

- [ ] **Step 1: Update responsive breakpoints and spacing**
  - Shift coordinates badge from `hidden lg:inline-block` to `hidden xl:inline-block` (only show coordinates when there is ample width >= 1280px).
  - Adjust desktop nav link spacing to scale dynamically: `space-x-3 lg:space-x-5 xl:space-x-8`.
  - Ensure `shrink-0` on brand container and trailing action buttons, with `flex-wrap` or minimum gap preservation.
- [ ] **Step 2: Re-run the Navbar alignment test**
  Run `npx playwright test tests/visual/navbar-alignment.spec.ts`.
  Verify the test now passes with positive gap between brand and navigation links.
- [ ] **Step 3: Run existing contrast audit**
  Run `npm run test:contrast` to guarantee zero contrast regressions from the navbar adjustment.
- [ ] **Step 4: Commit the alignment fix**
  `git commit -m "fix(navbar): resolve 1024px navigation link and coordinates overlap"`

---

### Task 4: Generate Baseline Snapshots & Full Suite Verification

**Files:**
- Create: `tests/visual/__snapshots__/**/*.png` (generated by Playwright)

- [ ] **Step 1: Generate initial golden baseline snapshots**
  Run `npx playwright test --update-snapshots` across all projects.
- [ ] **Step 2: Run complete test suite against baselines**
  Run `npx playwright test` and verify all tests pass with 0 pixel discrepancies.
- [ ] **Step 3: Verify dual-theme visual snapshot tests**
  Ensure Swiss (`?theme=swiss`) and Obsidian (`?theme=obsidian`) snapshots are properly cataloged.
- [ ] **Step 4: Commit baseline snapshots and test specs**
  `git commit -m "test(visual): establish golden baseline snapshots across 5 responsive breakpoints"`

---

### Task 5: Add NPM Scripts & Developer Documentation

**Files:**
- Modify: `package.json`
- Modify: `README.md` or `docs/superpowers/plans/`

- [ ] **Step 1: Add convenience scripts to `package.json`**
  ```json
  "scripts": {
    "test:visual": "playwright test",
    "test:visual:update": "playwright test --update-snapshots",
    "test:visual:ui": "playwright test --ui"
  }
  ```
- [ ] **Step 2: Verify scripts execute smoothly**
  Run `npm run test:visual`.
- [ ] **Step 3: Commit final scripts**
  `git commit -m "feat(scripts): register visual regression test commands in package.json"`
