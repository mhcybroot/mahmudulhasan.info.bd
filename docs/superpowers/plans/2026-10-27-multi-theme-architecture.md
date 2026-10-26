# Multi-Theme Architecture & Dynamic Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a 5-theme dynamic design system for Mahmudul Hasan's portfolio, enabling runtime user switching across all 5 Stitch editions (Obsidian, Amber Cockpit, Neon Synthwave, Emerald TTY, Cleanroom Lab) with localStorage persistence and build-time default configuration via `.env`.

**Architecture:** CSS Custom Properties (Variables) scoped by `[data-theme="..."]` on `<html>`, dynamic Tailwind CSS theme mapping, zero-flash inline head initialization script, interactive Navbar/Floating Theme Picker component, and Astro environment variable integration (`PUBLIC_DEFAULT_THEME`).

**Tech Stack:** Astro 5, Tailwind CSS 3.4, TypeScript, CSS Variables, Stitch Obsidian/Amber/Synthwave/Emerald/Cleanroom color tokens.

**Design Spec Reference:**
- `5f62c4f1aad94b7290fbcffa5f169929`: Animated Edition (Obsidian Telemetry)
- `74ecee324f984f599948db82d5b1b586`: Brutalist Amber Cockpit
- `c4502ce9d6c94f1b87346e85ae829bd9`: Neon Synthwave HUD
- `785ea6aea2fd4773b022522198cdc36e`: Emerald TTY Mainframe (Matrix Green)
- `fe121d269246433e847c20973fd14bc8`: Cleanroom Laboratory Spec (Light Mode)

---

## Global Constraints

- Default theme configurable via `.env` (`PUBLIC_DEFAULT_THEME=obsidian`).
- Zero flash of unstyled content (FOUC) on initial page load.
- Seamless instant theme switching without full page refresh.
- 100% WCAG AA contrast compliance across all 5 themes.
- Client persistence in `localStorage` overriding environment default if user previously picked a theme.

---

## Review Focus

1. **Theme Switching Latency:** Instant `<16ms` transition with smooth CSS color transitions.
2. **FOUC Prevention:** Synchronous `<script is:inline>` in `<head>` setting `data-theme` before CSS render.
3. **Environment Variable Fallback:** Correct fallback hierarchy (`localStorage` -> `PUBLIC_DEFAULT_THEME` -> `'obsidian'`).
4. **Light Mode High Contrast:** Proper text contrast in `cleanroom` theme (dark text `#0F172A` on white `#FFFFFF` / `#F8FAFC`).
5. **Component Styling Integrity:** Verifying that all cards, modals, tabs, and badges respond dynamically across all 5 themes.

---

## Implementation Tasks

### Task 1: Environment Configuration & Dynamic CSS Variable System
**Files:**
- Create: `.env`, `.env.example`
- Create: `src/styles/themes.css`
- Modify: `astro.config.mjs`, `tailwind.config.mjs`

- [x] Create `.env` and `.env.example` with `PUBLIC_DEFAULT_THEME=obsidian`.
- [x] Define CSS Custom Properties for all 5 themes in `src/styles/themes.css`:
  - `--bg-base`, `--bg-surface`, `--bg-card`, `--bg-lowest`
  - `--border-subtle`, `--border-strong`
  - `--text-primary`, `--text-secondary`, `--text-muted`
  - `--accent-primary`, `--accent-secondary`, `--accent-glow`
- [x] Configure `tailwind.config.mjs` to map semantic utility classes (`bg-theme-base`, `bg-theme-card`, `border-theme`, `text-theme-primary`, `accent-primary`, etc.) to CSS custom properties.
- [x] Import `themes.css` into `src/layouts/Layout.astro`.

---

### Task 2: Zero-Flash `<head>` Theme Initialization Script
**Files:**
- Modify: `src/layouts/Layout.astro`

- [x] Inject an inline, blocking script in `<head>`:
  - Read `localStorage.getItem('theme-preference')`.
  - Fall back to `import.meta.env.PUBLIC_DEFAULT_THEME || 'obsidian'`.
  - Set `document.documentElement.setAttribute('data-theme', theme)`.
  - Set `document.documentElement.classList.toggle('dark', theme !== 'cleanroom')`.
- [x] Test page reload to confirm zero flicker between themes.

---

### Task 3: Interactive Theme Switcher UI Component
**Files:**
- Create: `src/components/ThemeSwitcher.astro`
- Modify: `src/components/Navbar.astro`
- Modify: `src/components/MobileDrawer.astro`

- [x] Build `ThemeSwitcher.astro`:
  - Dropdown / modal pill featuring all 5 themes with visual color preview swatches:
    * 🌌 **Obsidian Telemetry** (Deep Slate + Cyan/Emerald)
    * ⚡ **Amber Cockpit** (Brutalist Black + Hazard Gold)
    * 🟣 **Neon Synthwave** (Abyss Violet + Hot Magenta/Cyan)
    * 🟩 **Emerald Mainframe** (Phosphor Green + Terminal Black)
    * ⚪ **Cleanroom Lab** (Modern Blueprint + Alabaster White)
  - Active checkmark indicator on current theme.
  - Event listener switching `data-theme` attribute and saving to `localStorage`.
- [x] Integrate `ThemeSwitcher` into desktop `Navbar.astro` and `MobileDrawer.astro`.

---

### Task 4: Semantic Theme Refactoring Across All Components
**Files:**
- Modify: `src/components/Hero.astro`
- Modify: `src/components/FlagshipSystems.astro`
- Modify: `src/components/CommercialDeployments.astro`
- Modify: `src/components/TechnicalArsenal.astro`
- Modify: `src/components/Endorsements.astro`
- Modify: `src/components/CareerTimeline.astro`
- Modify: `src/components/ContactFooter.astro`
- Modify: `src/components/ResumeModal.astro`

- [x] Refactor hardcoded background hexes to dynamic theme variables (`bg-theme-base`, `bg-theme-card`, `border-theme`, `text-theme-primary`, etc.).
- [x] Ensure `PMS-V2` interactive tabs and terminal log stream adopt theme-specific terminal styling (e.g., CRT scanlines/glow on Emerald, hazard yellow on Amber, neon magenta on Synthwave).
- [x] Ensure Resume Dossier Modal styling responds to the active theme.

---

### Task 5: Build Verification, Automated Test & Git Push
**Files:**
- Verify: `dist/index.html` across all 5 themes

- [x] Run `pnpm build` to verify clean static generation.
- [x] Verify `.env` variable switching: test changing `PUBLIC_DEFAULT_THEME=synthwave` and verify default render.
- [x] Commit all changes and push to GitHub `main` branch for automatic Cloudflare Pages deployment.
