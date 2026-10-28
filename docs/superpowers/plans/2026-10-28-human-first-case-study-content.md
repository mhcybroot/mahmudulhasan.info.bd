# Human-First Content & Storytelling Re-Design Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the technical case study from dense jargon into a compelling, human-friendly story that clients, recruiters, and regular users in Bangladesh and worldwide can immediately understand, while preserving an "Under The Hood" view for engineers and fixing all accessibility contrast issues to hit 100% on Lighthouse.

**Architecture:** Dual-Layered content structure (Human-First visual storytelling at top + Technical Architecture & Code Inspector in dedicated view), accessible WCAG AA contrast enhancements, clear real-world business use cases, and synchronized homepage feature cards.

**Tech Stack:** Astro 5, Tailwind CSS, TypeScript, WCAG AA Accessibility Standards.

---

### Task 1: Re-write Core Storytelling & Value Proposition
- [ ] Step 1: Update `src/content/projects/image-upscale-simd.md` with human-first copy, real-world problem statement, and everyday use cases.
- [ ] Step 2: Validate frontmatter and sync Astro content collections (`npx astro sync`).
- [ ] Step 3: Commit Task 1.

### Task 2: Re-design UI Components with Human-Friendly Metrics & WCAG AA Contrast
- [ ] Step 1: Update `TelemetryHud.astro` with human-centric metric cards (290+ Photos/Sec, 100% Private & Offline, Ultra-Lightweight <25MB, True-to-Life Quality) and high-contrast text (`text-slate-200` / `text-slate-100`).
- [ ] Step 2: Update `BeforeAfterSlider.astro` with clear before/after labels (Blurry vs Crystal-Clear) and high-contrast text.
- [ ] Step 3: Update `BenchmarkMatrix.astro` with clear non-technical explanations alongside the hard numbers.
- [ ] Step 4: Verify components compile cleanly.
- [ ] Step 5: Commit Task 2.

### Task 3: Dual-Layered Case Study Page Layout (`src/pages/systems/[slug].astro`)
- [ ] Step 1: Add interactive "Client / Story Overview" vs "Engineers & CTOs (Under The Hood)" view switcher.
- [ ] Step 2: Add Real-World Use Cases section (E-Commerce Products, Document & ID Verification, Photography Restoration).
- [ ] Step 3: Ensure all text meets WCAG AA 4.5:1 contrast requirements.
- [ ] Step 4: Verify page build with `npm run build`.
- [ ] Step 5: Commit Task 3.

### Task 4: Update Homepage Featured Card in `src/components/FlagshipSystems.astro`
- [ ] Step 1: Re-write ImageUpscale Pro card copy in `FlagshipSystems.astro` to be compelling to clients and recruiters.
- [ ] Step 2: Commit Task 4.

### Task 5: End-to-End Build & Deployment Verification
- [ ] Step 1: Execute `npm run build` and verify output.
- [ ] Step 2: Verify sitemap and local preview.
- [ ] Step 3: Commit and push to `origin main`.
