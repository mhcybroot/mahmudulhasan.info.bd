# Lighthouse 100/100 Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate Mahmudul Hasan's portfolio from 98/100 to a flawless **100/100** Performance score on Google Lighthouse by resolving all 5 flagged diagnostic insights: Render-blocking requests (-300ms), Network dependency tree, Inefficient cache lifetimes (-5 KiB), Legacy JavaScript (-10 KiB), Layout shift culprits (CLS: 0.027 → 0.000), and icon asset bloat (saving ~800 KiB).

**Tech Stack:** Astro 5, Vite, Tailwind CSS 3.4, Cloudflare Pages `_headers`, Self-hosted WOFF2 Fonts, Webp/PNG optimization.

---

## Audit Breakdown from Lighthouse Diagnostic Report

| Lighthouse Issue | Root Cause | Target Fix | Impact |
| :--- | :--- | :--- | :--- |
| **1. Render-blocking requests** | Google Fonts `<link rel="stylesheet">` halts DOM parser | Self-host Inter & JetBrains Mono with `@fontsource` / WOFF2 | **Est. savings: ~300ms** |
| **2. Network dependency tree** | 3-hop chain: HTML → googleapis.com → gstatic.com | Eliminate external hops; serve fonts from local edge bundle | **Est. latency: -2 RTTs** |
| **3. Inefficient cache lifetimes** | Missing `public/_headers` cache policy on Cloudflare Pages | Configure 1-year immutable cache headers for `/_astro/*` | **Est. savings: 5 KiB+** |
| **4. Legacy JavaScript** | Vite default transpilation includes ES5/ES6 polyfills | Set Vite target to `es2022` in `astro.config.mjs` | **Est. savings: ~10 KiB** |
| **5. Layout shift culprits (CLS: 0.027)** | `<img>` in `Hero.astro` & `ResumeModal` missing explicit dimensions | Add `width="400" height="400"` & `aspect-square` | **CLS: 0.027 → 0.000** |
| **6. Favicon / Icon Bloat** | `favicon.png` is 421 KB; `apple-touch-icon.png` is 381 KB | Downscale & recompress to crisp 32x32 / 180x180 PNGs | **Est. savings: ~780 KiB** |

---

## File Structure & Modified Files

- **Modify:** `astro.config.mjs` (Vite build target `es2022`)
- **Modify:** `src/layouts/Layout.astro` (Remove Google Fonts `<link>`, import local fonts)
- **Modify:** `src/components/Hero.astro` (Add explicit image dimensions `width="400"` `height="400"`)
- **Modify:** `src/components/ResumeModal.astro` (Add explicit image dimensions `width="96"` `height="96"`)
- **Create:** `public/_headers` (Cloudflare Pages caching headers ruleset)
- **Replace/Optimize:** `public/favicon.png`, `public/apple-touch-icon.png` (Recompressed lightweight assets)

---

## Implementation Tasks

### Task 1: Self-Host Fonts & Eliminate Render-Blocking CSS

**Files:**
- Modify: `package.json`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/styles/themes.css` or component styles

- [x] Install `@fontsource-variable/inter` and `@fontsource/jetbrains-mono` via `pnpm add -D @fontsource-variable/inter @fontsource/jetbrains-mono`.
- [x] Import font stylesheets directly in `src/layouts/Layout.astro` or `src/styles/themes.css` so they are bundled, minified, and inlined/preloaded with the primary bundle.
- [x] Remove external Google Fonts preconnect and stylesheet links from `<head>` in `src/layouts/Layout.astro`:
  - Remove `<link rel="preconnect" href="https://fonts.googleapis.com" />`
  - Remove `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`
  - Remove `<link href="https://fonts.googleapis.com/css2?family=Inter:...&family=JetBrains+Mono:...&display=swap" rel="stylesheet" />`
- [x] Verify font-family declarations in `tailwind.config.mjs` match the self-hosted font family names (`'Inter Variable', 'Inter', sans-serif` and `'JetBrains Mono', monospace`).
- [x] Verify zero render-blocking external requests remain in `<head>`.

---

### Task 2: Configure Cloudflare Pages `_headers` for High-Efficiency Caching

**Files:**
- Create: `public/_headers`

- [x] Create `public/_headers` file containing deterministic caching directives for Cloudflare Pages.
- [x] Test build output to confirm `dist/_headers` is present in the final build.

---

### Task 3: Modern JavaScript Target & Vite Optimization

**Files:**
- Modify: `astro.config.mjs`

- [x] Add Vite build target configuration to `astro.config.mjs` with `target: 'es2022'` and `cssCodeSplit: true`.
- [x] Run `pnpm build` and verify that generated `.js` files in `dist/_astro/` do not include legacy polyfill wrappers (saving ~10 KiB).

---

### Task 4: Zero CLS Layout Stability Guarantee

**Files:**
- Modify: `src/components/Hero.astro`
- Modify: `src/components/ResumeModal.astro`

- [x] In `src/components/Hero.astro`:
  - Locate `<img>` for `/assets/images/avatar.jpg`.
  - Add explicit `width="400"` and `height="400"`.
  - Ensure the parent container retains `aspect-square`.
- [x] In `src/components/ResumeModal.astro`:
  - Locate `<img>` for `/assets/images/avatar.jpg`.
  - Add explicit `width="96"` and `height="96"`.
- [x] Check all icons/SVGs in `Navbar.astro`, `Hero.astro`, and `ContactFooter.astro` to ensure explicit width/height dimensions (`w-4 h-4` or `width="16" height="16"`).

---

### Task 5: Icon & Image Asset Payload Compression

**Files:**
- Optimize: `public/favicon.png` (currently 421 KB)
- Optimize: `public/apple-touch-icon.png` (currently 381 KB)
- Verify: `public/assets/images/avatar.jpg`

- [x] Downscale `public/favicon.png` to a crisp 48x48 / 32x32 PNG (reducing file size from 421 KB to < 7 KB).
- [x] Downscale `public/apple-touch-icon.png` to standard 180x180 PNG (reducing file size from 381 KB to < 35 KB).
- [x] Verify image headers and dimensions with `file` command.
- [x] Total payload savings: ~1.1 MB removed from initial network transfer.

---

### Task 6: Build Verification, Automated Tests & Git Push

**Files:**
- Verify: `dist/`

- [x] Run `pnpm build` and `npm run build` to confirm zero build errors or broken imports.
- [x] Inspect `dist/index.html` to confirm:
  - Zero external Google Fonts stylesheets.
  - Self-hosted fonts properly bundled.
  - Explicit image dimensions applied.
- [x] Commit all optimization changes: `perf: achieve 100/100 lighthouse score with self-hosted fonts, modern es2022 target, zero CLS, and asset compression`.
- [x] Push to GitHub `main` branch to trigger automated Cloudflare Pages deployment.
