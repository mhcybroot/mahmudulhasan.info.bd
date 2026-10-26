# Comprehensive Lighthouse Full-Suite Audit Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve all 5 audit areas identified in the Google Lighthouse / Chrome DevTools report:
1. 🤖 **Agent Discoverability:** Implement spec-compliant `/llms.txt`, `/llms-full.txt`, and ARD 1.0 `/.well-known/ai-catalog.json` with `Agentmap` in `robots.txt`.
2. ⚡ **Performance & Zero Render-Blocking Network Tree:** Inline CSS via `build.inlineStylesheets: 'always'` and wrap email addresses in `<!--email_off-->` to eliminate Cloudflare's injected `/cdn-cgi/scripts/email-decode.min.js` (eliminating network dependency tree and legacy JS flags).
3. 🔒 **Trust & Safety / Security Headers:** Add Content Security Policy (CSP), strong HSTS preload (`max-age=63072000; includeSubDomains; preload`), Cross-Origin-Opener-Policy (COOP), and Cross-Origin-Resource-Policy (CORP) in `public/_headers`.
4. ♿ **Accessibility & WCAG AA Checklist:** Wrap page sections in semantic `<main id="main-content">` landmark, apply `inert` and `aria-hidden` to closed modals/drawers, ensure clear `:focus-visible` keyboard rings, and complete ARIA attributes.
5. 🔍 **SEO & Rich Results Structured Data:** Validate and enrich `schema.org` with `WebSite` entity, `ProfilePage`, and verified knowledge graph identifiers.

---

## Audit Problem Breakdown & Solutions

| Category | Finding in Screenshot | Root Cause | Target Solution |
| :--- | :--- | :--- | :--- |
| **Agent Discoverability** | 🔴 `llms.txt does not follow recommendations` | Missing or non-standard `/llms.txt` format | Create spec-compliant `/llms.txt` with H1, blockquote summary, and structured Markdown links |
| **Agent Discoverability** | 🔴 `ai-catalog.json schema is invalid` | Missing ARD (Agent Resource Discovery) manifest | Create `/.well-known/ai-catalog.json` (ARD 1.0 spec), link in `<head>`, and declare `Agentmap:` in `robots.txt` |
| **Performance** | 🔴 Network dependency tree & Legacy JS | Cloudflare email obfuscation auto-injects `/cdn-cgi/scripts/email-decode.min.js` | Wrap email links in `<!--email_off-->...<!--/email_off-->` to prevent external script injection |
| **Performance** | 🟡 Render-blocking CSS requests | External stylesheet `<link rel="stylesheet" href="/_astro/index...css">` | Set `build: { inlineStylesheets: 'always' }` in `astro.config.mjs` for 0 external CSS requests |
| **Trust & Safety** | ⚪ CSP, HSTS, COOP, DOM XSS | Missing advanced HTTP security headers | Add CSP, HSTS with preload, COOP, CORP, and Permissions-Policy in `public/_headers` |
| **Accessibility** | ⚪ HTML5 landmarks & interactive state | Missing `<main>` landmark element; modal missing `inert` | Add `<main id="main-content">`, `inert` on closed modals/drawers, and `:focus-visible` rings |
| **SEO** | ⚪ Structured data is valid | Needs comprehensive graph verification | Enrich `JsonLd.astro` with interconnected `Person`, `WebSite`, and `ProfilePage` nodes |

---

## Implementation Tasks

### Task 1: Agent Discoverability (`llms.txt`, `llms-full.txt`, and ARD `ai-catalog.json`)

**Files:**
- Create: `public/llms.txt`
- Create: `public/llms-full.txt`
- Create: `public/.well-known/ai-catalog.json`
- Create: `public/ai-catalog.json` (alias)
- Modify: `public/robots.txt`
- Modify: `src/layouts/Layout.astro`

- [x] Create `public/llms.txt` strictly following the standard specification.
- [x] Create `public/llms-full.txt` containing full textual documentation of Mahmudul's systems, resume dossier, and technical capabilities for language models.
- [x] Create `public/.well-known/ai-catalog.json` adhering to the ARD 1.0 schema.
- [x] Copy or symlink to `public/ai-catalog.json` for root discovery.
- [x] Update `public/robots.txt` to add:
  `Agentmap: https://mahmudulhasan.info.bd/.well-known/ai-catalog.json`
- [x] Add discovery link in `src/layouts/Layout.astro` `<head>`:
  `<link rel="ai-catalog" type="application/json" href="/.well-known/ai-catalog.json" />`

---

### Task 2: Eliminate Network Dependency Tree & Injected Scripts

**Files:**
- Modify: `astro.config.mjs`
- Modify: `src/components/ContactFooter.astro`
- Modify: `src/components/ResumeModal.astro`

- [x] Wrap all `info@mahmudulhasan.info.bd` email strings and links in `<!--email_off-->...<!--/email_off-->`.
- [x] In `astro.config.mjs`, enable stylesheet inlining with `build: { inlineStylesheets: 'always' }`.

---

### Task 3: Trust & Safety Security Headers (CSP, HSTS, COOP, CORP)

**Files:**
- Modify: `public/_headers`

- [x] Update `public/_headers` to enforce comprehensive modern security policies (CSP, HSTS preload, COOP, CORP, Permissions-Policy).
- [x] Add caching directives for `/.well-known/ai-catalog.json`, `/ai-catalog.json`, `/llms.txt`, and `/llms-full.txt`.

---

### Task 4: Accessibility & Semantic Structure (Landmarks, ARIA, Focus Trap)

**Files:**
- Modify: `src/layouts/Layout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/ThemeSwitcher.astro`
- Modify: `src/components/MobileDrawer.astro`
- Modify: `src/components/ResumeModal.astro`

- [x] Wrap main page sections in `<main id="main-content" class="flex-1">` in `src/pages/index.astro`.
- [x] Add "Skip to main content" link for keyboard users.
- [x] Ensure all closed dialogs/drawers have `inert` and `aria-hidden="true"` when closed, and remove when open.
- [x] Add keyboard focus trap to `ResumeModal.astro` and `MobileDrawer.astro`.
- [x] Add visible `:focus-visible` styling across all clickable controls.

---

### Task 5: Structured Data Enrichment & Validation

**Files:**
- Modify: `src/components/seo/JsonLd.astro`

- [x] Enrich JSON-LD structured data with interconnected `@graph` containing `WebSite`, `ProfilePage`, and `Person`.
- [x] Verify JSON-LD syntax passes Schema.org and Google Rich Results guidelines.

---

### Task 6: Build Verification, Automated Tests & Git Push

**Files:**
- Verify: `dist/`

- [x] Run `pnpm build` and `npm run build` to confirm zero errors.
- [x] Inspect `dist/index.html` to confirm:
  - `<main>` landmark exists.
  - Zero external CSS or JS links.
  - No Cloudflare email-protection tokens.
  - `ai-catalog` link and Agentmap in `robots.txt` exist.
- [x] Verify `dist/llms.txt`, `dist/.well-known/ai-catalog.json`, and `dist/_headers` exist.
- [x] Commit and push to GitHub `main` branch to trigger Cloudflare Pages live deployment.
