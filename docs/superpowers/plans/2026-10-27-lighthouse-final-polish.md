# Lighthouse Final Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve the 3 specific issues identified in the latest Chrome DevTools / Lighthouse audit run:
1. 🔴 **Robots.txt Validation Error:** Fix `Unknown directive: Agentmap` in `public/robots.txt`.
2. 🔴 **CSP Violation / Console Error:** Allow Cloudflare Web Analytics beacon (`https://static.cloudflareinsights.com` and `https://cloudflareinsights.com`) in `public/_headers`.
3. ⚡ **Font Chaining & Layout Shift (0.016 CLS):** Preload Latin WOFF2 fonts from `public/fonts/` directly in `<head>` to flatten the network dependency tree and eliminate the font-swap reflow on the Hero paragraph.

---

## Detailed Task Breakdown

### Task 1: Fix `robots.txt` Googlebot Validation Error
**Files:**
- Modify: `public/robots.txt`

- [x] Remove `Agentmap: https://mahmudulhasan.info.bd/.well-known/ai-catalog.json` from `public/robots.txt`.
  *(Note: AI discoverability remains 100% intact through standard `<link rel="ai-catalog">` in `<head>`, standard path `/.well-known/ai-catalog.json`, and `/llms.txt`).*
- [x] Verify `public/robots.txt` contains only standard directives (`User-agent`, `Allow`, `Sitemap`).

---

### Task 2: Fix Content Security Policy for Cloudflare Insights Beacon
**Files:**
- Modify: `public/_headers`

- [x] In `public/_headers`, update `Content-Security-Policy`:
  - Add `https://static.cloudflareinsights.com` to `script-src`
  - Add `https://cloudflareinsights.com` to `connect-src`
- [x] Full CSP:
  `default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://cloudflareinsights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`
- [x] Verify zero console errors or Issues panel warnings when loading the page.

---

### Task 3: Preload Primary Fonts & Eliminate Font-Swap CLS (0.016 → 0.000)
**Files:**
- Create: `public/fonts/inter-latin.woff2`
- Create: `public/fonts/jetbrains-mono-latin.woff2`
- Modify: `src/styles/themes.css`
- Modify: `src/layouts/Layout.astro`

- [x] Copy optimized Latin WOFF2 subsets to `public/fonts/`:
  - `public/fonts/inter-latin.woff2` (~48 KB)
  - `public/fonts/jetbrains-mono-latin.woff2` (~21 KB)
- [x] Define `@font-face` rules in `src/styles/themes.css` with `font-display: swap` pointing to `/fonts/...`.
- [x] Remove unused multi-language font imports (`@fontsource-variable/inter` and `@fontsource/jetbrains-mono`) from `src/layouts/Layout.astro` (saving ~200 KiB of unused Cyrillic/Greek font subsets).
- [x] Add font preload tags in `<head>` in `src/layouts/Layout.astro`:
  `<link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />`
  `<link rel="preload" href="/fonts/jetbrains-mono-latin.woff2" as="font" type="font/woff2" crossorigin />`
- [x] *Result:* Critical fonts download immediately in parallel with HTML, eliminating the 2-hop font chain and completely eliminating the font-swap layout shift on the Hero narrative text.

---

### Task 4: Verification, Automated Build & Git Push
**Files:**
- Verify: `dist/`

- [x] Run `pnpm build` and `npm run build`.
- [x] Verify `dist/robots.txt` has no unrecognized directives.
- [x] Verify `dist/fonts/` contains both preloaded font files.
- [x] Commit and push to GitHub `main` branch to trigger live Cloudflare deployment.
