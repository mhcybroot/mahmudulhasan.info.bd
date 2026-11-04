# Automated Color-Contrast Crawler (Pa11y-CI + Axe-Core) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and integrate an automated headless color-contrast crawler that audits every route (all 27 pages in the Astro sitemap) in both Light Theme (`swiss`) and Dark Theme (`obsidian`), detecting any WCAG AA contrast ratio failures (< 4.5:1 for body text, < 3:1 for large text/icons) and enforcing zero contrast errors before deployment.

**Architecture:** 
- Uses **Pa11y-CI** with the **Axe-core runner** on headless Chromium (`/usr/bin/chromium`).
- Dual-theme test matrix: crawls all 27 URLs first under `data-theme="swiss"`, then under `data-theme="obsidian"` (54 total audits).
- Generates a granular terminal report specifying URL, exact CSS selector, HTML snippet, and failing contrast ratio.
- Integrates into `package.json` as `npm run test:contrast` and adds a GitHub Actions CI workflow to block unreadable UI changes automatically.

**Tech Stack:**
- Pa11y-CI 5.0.0 (`axe` runner)
- Astro 7.4.2 (Static Build & Preview)
- Chromium (system headless binary at `/usr/bin/chromium`)
- GitHub Actions CI

---

## Global Constraints
- Must run in local Linux CLI and in CI without desktop GUI (`--headless`, `--no-sandbox`).
- Must evaluate computed styles against real background colors (`getComputedStyle`), never hardcoded assumptions.
- Must cover both light mode (`data-theme="swiss"`) and dark mode (`data-theme="obsidian"`).
- Strict zero-error threshold (`threshold: 0`): any contrast violation exits with non-zero code.

---

## Tasks

### Task 1: Create Dual-Theme Pa11y-CI Configuration Matrix
**Files:**
- Create: `config/pa11yci.json`
- Create: `scripts/run-contrast-audit.mjs`

- [ ] **Step 1: Define Pa11y configuration file**
  Create `config/pa11yci.json` configuring:
  - `chromeLaunchConfig`: `{ "executablePath": "/usr/bin/chromium", "args": ["--no-sandbox", "--disable-setuid-sandbox", "--headless"] }`
  - `runners`: `["axe"]`
  - `standard`: `"WCAG2AA"`
  - `includeWarnings`: `false`, `includeNotices`: `false`, `threshold`: `0`
  - `rules`: `["color-contrast"]`

- [ ] **Step 2: Create dynamic dual-theme crawler runner**
  Write `scripts/run-contrast-audit.mjs` to:
  1. Parse all 27 routes from `dist/sitemap-0.xml` or `src/pages/systems/[slug].astro`.
  2. Generate 54 audit configurations (each URL tested with `actions`: `["set attribute data-theme of html to swiss"]`, and then with `["set attribute data-theme of html to obsidian"]`).
  3. Execute `pa11y-ci` and format errors into a readable terminal summary.

- [ ] **Step 3: Test runner against a single URL**
  Run `node scripts/run-contrast-audit.mjs --single /systems/amh-wo-sniper/` and verify that the 11 contrast issues are captured with full selector paths.

---

### Task 2: Fix Baseline Color-Contrast Violations Identified by Axe
**Files:**
- Modify: `src/pages/systems/[slug].astro`
- Modify: `src/components/case-study/WorkOrderSniperSimulator.astro`

- [ ] **Step 1: Fix checklist checkmark color token**
  In `src/pages/systems/[slug].astro`, upgrade `✓` span colors to a high-contrast theme-adaptive class that achieves > 5:1 contrast against both `#F8F9FF` (Swiss) and `#05080F` (Obsidian).

- [ ] **Step 2: Fix simulator reset button contrast**
  In `WorkOrderSniperSimulator.astro` (and any other simulator having `#btn-reset-claim-sim`), upgrade:
  - From: `bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700`
  - To: `bg-theme-surface hover:bg-theme-card text-theme-secondary hover:text-theme-primary border border-theme-border`

- [ ] **Step 3: Fix pipeline card arrow indicators**
  In `src/pages/systems/[slug].astro` lines 3340-6400, replace low-contrast arrows (`text-amber-400`, `text-cyan-400`, `text-rose-400`, `text-emerald-400`, `text-purple-400` inside dark buttons) with high-contrast variants (`text-theme-accent` or bold high-luminance tokens).

- [ ] **Step 4: Re-run Pa11y on `/systems/amh-wo-sniper/`**
  Verify error count drops from 11 to 0.

---

### Task 3: Full-Site Sweep & Automated NPM Script Integration
**Files:**
- Modify: `package.json`
- Test: Full 27-route sweep across Swiss and Obsidian themes

- [ ] **Step 1: Add package.json scripts**
  Add:
  - `"test:contrast"`: `"astro build && node scripts/run-contrast-audit.mjs"`
  - `"test:contrast:quick"`: `"node scripts/run-contrast-audit.mjs"`

- [ ] **Step 2: Execute full site crawl (54 test runs)**
  Run `npm run test:contrast`. Ensure all 27 pages pass with 0 errors in both themes.

- [ ] **Step 3: Fix any secondary issues flagged across the other 24 case studies**
  Resolve any newly discovered contrast failures in other system routes.

---

### Task 4: GitHub Actions CI Workflow Setup
**Files:**
- Create: `.github/workflows/contrast-check.yml`

- [ ] **Step 1: Write CI workflow**
  Create `.github/workflows/contrast-check.yml`:
  - Triggers on: `pull_request`, `push: branches: [main]`
  - Runs on: `ubuntu-latest`
  - Installs Node, dependencies, and Chromium
  - Runs `npm run build && npm run test:contrast`
  - Fails the build if any contrast issues are detected.

- [ ] **Step 2: Commit and push**
  Commit all crawler files, fixed components, and workflow. Push to `main`.
