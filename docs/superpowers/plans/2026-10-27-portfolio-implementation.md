# Personal Portfolio & Brand Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the high-performance personal portfolio website for Mahmudul Hasan (@mhcybroot) using Astro 5, Tailwind CSS, and Cloudflare Pages, implementing the finalized "Animated Edition" design with Resume Dossier Modal, mobile responsiveness, and #1 Google Knowledge Graph SEO optimization.

**Architecture:** Astro 5 Static Site Generation (SSG) with zero runtime JS by default, responsive Tailwind CSS styling matching Stitch's Obsidian Telemetry design system, lightweight vanilla web components for interactive tabs and modals, embedded JSON-LD `Person` schema markup, and static asset generation for Cloudflare Edge CDN.

**Tech Stack:** Astro 5, Tailwind CSS 3.4 / 4, `@astrojs/sitemap`, TypeScript, HTML5 / Semantic Web Components.

**Design Spec Reference:** Stitch Project `14616704483851930131` ("Systems Engineer Portfolio - Animated Edition" + "Resume Dossier Modal" + "Mobile Edition").

---

## Global Constraints

- Domain: `mahmudulhasan.info.bd`
- Primary SEO Entity: `Mahmudul Hasan` mapped to `mhcybroot`
- Performance target: 100/100 Mobile & Desktop PageSpeed (Core Web Vitals)
- Zero external client JS dependencies (no heavy React/Vue runtime for static sections; vanilla micro-scripts only)
- WCAG AA accessibility compliance
- Cloudflare Pages static build compatibility (`dist/` directory)

---

## Review Focus

1. **Schema Validation:** Google Rich Results test compliance for `Person` schema with `alternateName: "mhcybroot"` and valid `sameAs` array.
2. **Mobile Layout Integrity:** Responsive collapse of 12-column grid and bento cards into clean single-column feed without horizontal overflow.
3. **Asset Resolution:** Local optimization of avatar portrait (`31_dark_studio_crossed_arms.jpg`), favicon, apple touch icon, and OG share image without layout shift (CLS = 0).
4. **Modal & Drawer Interactivity:** Seamless open/close and keyboard accessibility (`Escape`, tab trapping) for the Resume Dossier Modal and Mobile Navigation Drawer.
5. **SEO & Crawlability:** Dynamic generation of `sitemap.xml`, `robots.txt`, semantic heading hierarchy (`h1`, `h2`), and metadata tags.

---

## Implementation Tasks

### Task 1: Project Scaffolding & Asset Integration
**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`
- Create: `public/assets/images/avatar.jpg` (from `31_dark_studio_crossed_arms.jpg`)
- Create: `public/favicon.png`, `public/apple-touch-icon.png`, `public/og-image.png`, `public/manifest.json`
- Create: `public/robots.txt`

- [x] Initialize Astro project with Tailwind CSS and `@astrojs/sitemap` integration.
- [x] Configure `astro.config.mjs` with site URL `https://mahmudulhasan.info.bd`.
- [x] Configure `tailwind.config.mjs` with the "Obsidian Telemetry" design palette (`#090D16`, `#06B6D4`, `#10B981`, `#1E293B`, `#94A3B8`).
- [x] Copy and optimize all branding assets (`favicon.png`, `apple-touch-icon.png`, `og-image.png`, `avatar.jpg`, `manifest.json`) into `public/`.
- [x] Create `public/robots.txt` referencing `https://mahmudulhasan.info.bd/sitemap-index.xml`.
- [x] Verify build with `pnpm build` or `npm run build`.

---

### Task 2: Core Layout, SEO & Knowledge Graph Schema
**Files:**
- Create: `src/layouts/Layout.astro`
- Create: `src/components/seo/JsonLd.astro`
- Create: `src/components/seo/MetaTags.astro`

- [x] Create `JsonLd.astro` embedding structured `schema.org/Person` with `alternateName: ["mhcybroot"]`, job title, contact email, and official social links (`github.com/mhcybroot`, `linkedin.com/in/mhcybroot`).
- [x] Create `MetaTags.astro` containing canonical URL, OpenGraph tags, Twitter Card tags, and high-relevance search keywords.
- [x] Create `src/layouts/Layout.astro` with font preloading (Inter + JetBrains Mono), smooth scrolling, dark mode background, and semantic `<head>` and `<body>` tags.
- [x] Verify HTML output contains valid JSON-LD and meta tags.

---

### Task 3: Navigation, Terminal Header & Mobile Drawer
**Files:**
- Create: `src/components/Navbar.astro`
- Create: `src/components/MobileDrawer.astro`

- [x] Implement desktop sticky header with terminal prompt logo `~/mhcybroot v2.4-prod`, navigation links, pulsing `● Available for Projects` badge, and `Connect ↗` CTA.
- [x] Implement mobile drawer toggle button with animated hamburger icon.
- [x] Implement `MobileDrawer.astro` with keyboard accessibility, smooth slide-out transition, and backdrop blur.
- [x] Test desktop and mobile viewport transitions.

---

### Task 4: Hero Section & Real-Time Edge Telemetry
**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/EdgeTelemetry.astro`

- [x] Implement Hero copy: Eyebrow badge, primary `H1` ("Mahmudul Hasan (@mhcybroot)"), subheadline emphasizing concurrent backends (Rust & Java 21) and hardware protocols.
- [x] Add dual CTAs: `Explore Systems ↓` and `Quick View Resume ↗` (opens dossier modal).
- [x] Implement the 4 quick metric stat counters (`2.5+ Yrs`, `Rust & Java 21`, `IoT & Edge Daemons`, `7+ Cloud Nodes`).
- [x] Build the right-side profile card with optimized portrait image, Dhaka location badge (`● Based in Dhaka, BD (UTC+6)`), and live telemetry sub-card (`DHAKA POP LATENCY: 12ms`, `TOKIO ASYNC WORKERS: 16 Cores`).

---

### Task 5: Flagship Engineered Systems (Bento Grid with Interactive Tabs)
**Files:**
- Create: `src/components/FlagshipSystems.astro`
- Create: `src/components/systems/ParkingEngineCard.astro`
- Create: `src/components/systems/HrmsSuiteCard.astro`
- Create: `src/components/systems/ActivityMonitorCard.astro`

- [x] Implement top spotlight card for `PMS-V2 Smart Parking Engine`:
  - 4-Stage visual architecture pipeline (Edge RTSP Stream, Tokio Async Core, Hardware Relay RS485/GPIO, SeaORM Pool).
  - Interactive two-tab toggle: `[Architecture Topology]` and `[Live Telemetry Stream]`.
- [x] Implement `Enterprise Skylink HRMS Suite` card with ZKTeco ADMS push protocol packet preview and Java 21 Virtual Threads badges.
- [x] Implement `Workstation Activity Monitor` card with Chrome MV3 telemetry specs and AES-256 GCM buffer telemetry.
- [x] Verify tab switching interaction without page reload.

---

### Task 6: Live Commercial Deployments & Technical Arsenal
**Files:**
- Create: `src/components/CommercialDeployments.astro`
- Create: `src/components/TechnicalArsenal.astro`

- [x] Build `CommercialDeployments.astro` featuring 4 browser mockup cards for `skylinkltd.ai`, `finaraprosolutions.com`, `homesyncllc.org`, and `dreamzonebuilders.com` with live status pills and outbound links.
- [x] Build `TechnicalArsenal.astro` with 4 categorized columns:
  - Systems & Async (Rust 2024, Java 21 Loom, Tokio, WebSockets).
  - Databases & Storage (PostgreSQL 16, SeaORM, Spring Data JPA, ACID).
  - Hardware & Edge Protocols (ZKTeco ADMS, Frigate AI NVR, RTSP CCTV, PoE).
  - Frontend & DevOps (React 19, Three.js/R3F, Tailwind CSS, Docker, Linux VPS).

---

### Task 7: Career Chronicle, Leadership Endorsements & Contact Footer
**Files:**
- Create: `src/components/CareerTimeline.astro`
- Create: `src/components/Endorsements.astro`
- Create: `src/components/ContactFooter.astro`

- [x] Implement `Endorsements.astro` featuring verified quotes and credentials for Engr. Niger Sultana (HOD CST DPI) and Nazrul Hasan Raju (MD Nexus Netro Ltd).
- [x] Implement `CareerTimeline.astro` displaying professional roles (Skylink Innovations, SPY Security Solutions) and education (AMIE B.Sc. Equivalence, DPI Distinction).
- [x] Implement `ContactFooter.astro` with high-converting CTA headline, copy-to-clipboard email card (`info@mahmudulhasan.info.bd`), direct message button, and social link pills.

---

### Task 8: Resume Dossier Modal Component
**Files:**
- Create: `src/components/ResumeModal.astro`

- [x] Implement the full-screen accessible `Resume Dossier Modal` based on Stitch's `43870d09d3b84325bed8e32e7ebc27b2`.
- [x] Include quick-switch dossier sections: Executive Summary, Systems Architecture Matrix, Production Timeline, and Verified Credentials.
- [x] Add direct `Download Official PDF` action linking to the CV file.
- [x] Wire modal triggers to `Quick View Resume ↗` buttons across Header and Hero with keyboard `Escape` close and focus trap.

---

### Task 9: End-to-End Build Verification & Cloudflare Readiness
**Files:**
- Verify: `dist/index.html`, `dist/sitemap-index.xml`, `dist/robots.txt`

- [x] Run full production build (`npm run build`).
- [x] Verify zero console errors, zero dead links, and complete static HTML generation.
- [x] Test mobile responsiveness, interactive tabs, copy-email feedback, and modal open/close.
- [x] Prepare Git repository with clean commit history ready for Cloudflare Pages connection.
