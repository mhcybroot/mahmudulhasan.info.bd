# ImageUpscale Pro Systems Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the audited, WCAG AA compliant ImageUpscale Pro systems case study design from Stitch into Astro as a high-performance, dynamic case study page (`/systems/[slug]`) maintaining 100/100 Lighthouse performance and rich structured data.

**Architecture:** Create an Astro Content Collection for projects (`src/content/config.ts`), develop dedicated modular case study components (`TelemetryHud`, `BeforeAfterSlider`, `ArchitectureModal`, `BenchmarkMatrix`), render via dynamic route (`src/pages/systems/[slug].astro`) with zero-CLS inline assets and full Schema.org (`SoftwareSourceCode` + `TechArticle`) JSON-LD, and wire bidirectional entry points from the homepage.

**Tech Stack:** Astro 5, Tailwind CSS 3.4, TypeScript, JetBrains Mono & Inter self-hosted WOFF2 fonts, Schema.org JSON-LD.

**Spec:** `docs/case-studies/image-upscale-simd.html`, `docs/case-studies/image-upscale-simd.md`, and Stitch screen `projects/14616704483851930131/screens/81d88dd335594b7caf347a4f2e3f5f40`.

## Global Constraints
- Must preserve the zero-CLS, zero-render-blocking architecture (inline stylesheets, preloaded fonts).
- All interactive controls (Before/After slider, Copy CLI, Architecture Modal) must be WCAG AA compliant and keyboard accessible.
- No heavy external JavaScript libraries; interactive widgets must use lightweight, vanilla clientside scripts (<2KB).
- Must output valid Schema.org `@graph` with `SoftwareSourceCode` and `TechArticle`.
- Build must cleanly execute via `npm run build` producing zero warnings.

## Review Focus
1. Slider interaction on mobile touch screens without horizontal page scroll lock.
2. Architecture modal keyboard navigation (`Escape` to close, focus trap).
3. Copy-to-clipboard button fallback on older webview browsers without `navigator.clipboard`.
4. Fallback rendering if an image asset in Before/After viewport fails to load.
5. Strict CSP adherence in `_headers` without unsafe eval or unauthorized domain requests.

---

### Task 1: Content Collection Schema & Configuration

**Files:**
- Create: `src/content/config.ts`
- Modify: `src/content/projects/image-upscale-simd.md` (validate frontmatter types)

**Interfaces:**
- Produces: `projects` collection schema typed via Astro `zod` (`z.object({ title, slug, author, date, githubUrl, liveUrl, primaryLanguage, stack, metrics, seo })`).

- [ ] **Step 1: Define `src/content/config.ts` collection schema**
  ```typescript
  import { defineCollection, z } from 'astro:content';

  const projectsCollection = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      slug: z.string(),
      author: z.string(),
      date: z.string(),
      githubUrl: z.string().url(),
      liveUrl: z.string().optional(),
      primaryLanguage: z.string(),
      stack: z.array(z.string()),
      metrics: z.object({
        throughput: z.string(),
        latency: z.string(),
        memoryUsage: z.string(),
        binarySize: z.string().optional(),
        uptime: z.string().optional(),
      }),
      seo: z.object({
        focusKeyword: z.string(),
        secondaryKeywords: z.array(z.string()),
        schemaType: z.string(),
      }),
    }),
  });

  export const collections = {
    projects: projectsCollection,
  };
  ```

- [ ] **Step 2: Validate Astro content collection sync**
  Run: `npx astro sync`
  Expected: Generated content types for `projects` with 1 valid entry (`image-upscale-simd.md`).

- [ ] **Step 3: Commit**
  ```bash
  git add src/content/config.ts src/content/projects/image-upscale-simd.md
  git commit -m "feat(content): define projects content collection schema and sync image-upscale-simd"
  ```

---

### Task 2: Modular Case Study UI Components

**Files:**
- Create: `src/components/case-study/TelemetryHud.astro`
- Create: `src/components/case-study/BeforeAfterSlider.astro`
- Create: `src/components/case-study/ArchitectureModal.astro`
- Create: `src/components/case-study/BenchmarkMatrix.astro`

**Interfaces:**
- Consumes: `metrics` object and case study metadata.
- Produces: Accessible, responsive components styled with Tailwind CSS tokens and zero external JS dependencies.

- [ ] **Step 1: Build `TelemetryHud.astro`**
  Implement 4 high-impact metric stat cards (`292.0 FPS`, `3.43 ms`, `24.6 MB RSS`, `100% Pass`) with the animated latency pulse indicator and technology badges (`Rust 2021`, `AVX2 SIMD`, `Rayon`, `AMD FidelityFX CAS`).

- [ ] **Step 2: Build `BeforeAfterSlider.astro`**
  Implement the split comparison viewport with:
  - Accessible range input slider with mouse and touch events (`input` listener).
  - Presets for 25%, 50%, and 75% splits.
  - High-res simulated visual comparison (raw 480p pixelation vs 720p CAS filtered).
  - 60 FPS live indicator pill.

- [ ] **Step 3: Build `ArchitectureModal.astro`**
  Implement an accessible modal dialog containing deep-dive hardware and concurrency specifications for the 5 pipeline stages (`CLI/GUI Ingress`, `SHA-256 DRM`, `fast_image_resize AVX2`, `Rayon CAS Kernel`, `Encoders`). Includes `Escape` key close and click-outside handler.

- [ ] **Step 4: Build `BenchmarkMatrix.astro`**
  Implement the high-density comparison table contrasting **ImageUpscale Pro (Rust)** against **OpenCV 4.8 (C++)** and **Python Pillow-SIMD** across Throughput, Memory RSS, and Artifact metrics.

- [ ] **Step 5: Verify components compile cleanly**
  Run: `npx astro check`
  Expected: 0 errors across all new components.

- [ ] **Step 6: Commit**
  ```bash
  git add src/components/case-study/
  git commit -m "feat(case-study): create TelemetryHud, BeforeAfterSlider, ArchitectureModal, and BenchmarkMatrix components"
  ```

---

### Task 3: Dynamic Case Study Route (`/systems/[slug]`) & Schema.org JSON-LD

**Files:**
- Create: `src/pages/systems/[slug].astro`
- Create: `src/components/seo/CaseStudyJsonLd.astro`

**Interfaces:**
- Consumes: Content collection entries via `getStaticPaths()`.
- Produces: Fully rendered, static HTML page for each project in `src/content/projects/` with complete Schema.org `SoftwareSourceCode` and `TechArticle` graph.

- [ ] **Step 1: Build `src/components/seo/CaseStudyJsonLd.astro`**
  Inject interconnected Schema.org JSON-LD containing `@type: "SoftwareSourceCode"` and `@type: "TechArticle"` referencing `Mahmudul Hasan` as author and `https://mahmudulhasan.info.bd`.

- [ ] **Step 2: Build `src/pages/systems/[slug].astro`**
  - Implement `getStaticPaths()` using `getCollection('projects')`.
  - Assemble sticky header, `TelemetryHud`, `BeforeAfterSlider`, system architecture diagram, `BenchmarkMatrix`, syntax-highlighted code terminal (`src/engine/enhancer.rs`), fault tolerance grid, and local verification CLI.
  - Wire interactive clientside scripts for copy-command toasts and architecture node modal clicks.

- [ ] **Step 3: Test local page generation**
  Run: `npx astro build`
  Expected: Successful static output generating `dist/systems/image-upscale-simd/index.html`.

- [ ] **Step 4: Commit**
  ```bash
  git add src/pages/systems/ src/components/seo/CaseStudyJsonLd.astro
  git commit -m "feat(pages): add dynamic case study route /systems/[slug] with rich schema markup"
  ```

---

### Task 4: Homepage & Navigation Integration

**Files:**
- Modify: `src/components/FlagshipSystems.astro`
- Modify: `public/llms.txt` and `public/llms-full.txt`
- Modify: `public/.well-known/ai-catalog.json`

**Interfaces:**
- Consumes: `/systems/image-upscale-simd` route.
- Produces: Clickable "Read Case Study & Telemetry" CTA buttons on the flagship systems section and AI catalog entries.

- [ ] **Step 1: Update `FlagshipSystems.astro`**
  Add a dedicated badge/button on featured projects linking directly to `/systems/image-upscale-simd`.

- [ ] **Step 2: Update AI discovery files**
  Add the new deep-dive URL to `public/llms.txt`, `public/llms-full.txt`, and `public/.well-known/ai-catalog.json` under featured software assets.

- [ ] **Step 3: Commit**
  ```bash
  git add src/components/FlagshipSystems.astro public/llms.txt public/llms-full.txt public/.well-known/ai-catalog.json
  git commit -m "feat(nav): integrate case study links on homepage and update agent discovery catalogs"
  ```

---

### Task 5: End-to-End Build & Performance Verification

**Files:**
- Verify: Full codebase build and sitemap generation.

- [ ] **Step 1: Execute full production build**
  Run: `npm run build`
  Expected: Clean exit code 0; `dist/systems/image-upscale-simd/index.html` and updated `sitemap-0.xml` generated.

- [ ] **Step 2: Verify sitemap contains new systems URL**
  Run: `grep -q "systems/image-upscale-simd" dist/sitemap-0.xml && echo "SITEMAP_VERIFIED"`
  Expected: `SITEMAP_VERIFIED`.

- [ ] **Step 3: Run local HTTP server & verify response**
  Run: `python3 -m http.server 4321 --directory dist &` and `curl -sI http://localhost:4321/systems/image-upscale-simd/`
  Expected: HTTP 200 OK with zero broken assets.

- [ ] **Step 4: Commit and push**
  ```bash
  git add -A
  git commit -m "chore(release): verify production build with systems case study architecture"
  ```
