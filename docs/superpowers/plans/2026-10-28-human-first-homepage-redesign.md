# Human-First Homepage Redesign Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the homepage from dense engineering jargon into a compelling, human-friendly showcase that clearly explains to business owners, clients, and global recruiters what Mahmudul Hasan actually builds and solves, while keeping technical depth accessible for CTOs.

**Architecture:** Dual-Layered narrative structure (Human-First value propositions + clear business problem solving + accessible technical depth), zero-CLS preservation, and high-contrast WCAG AA accessible typography.

**Tech Stack:** Astro 5, Tailwind CSS, TypeScript.

---

### Task 1: Hero Section Human-First Copy & Value Proposition
- Files: `src/components/Hero.astro`
- Deliverable: Compelling headline, clear value statement for Bangladesh and global clients, and 4 trust assurance badges.

### Task 2: Flagship Systems Business Storytelling
- Files: `src/components/FlagshipSystems.astro`
- Deliverable: PMS-V2 (Smart Parking), Skylink HRMS (Biometrics), Workstation Monitor, and ImageUpscale Pro framed around business problems solved.

### Task 3: Commercial Deployments & Technical Arsenal Clarity
- Files: `src/components/CommercialDeployments.astro`, `src/components/TechnicalArsenal.astro`
- Deliverable: Real-world client production proof and technical capabilities organized into 4 practical problem-solving categories.

### Task 4: Career Timeline & Contact Call-to-Action
- Files: `src/components/CareerTimeline.astro`, `src/components/ContactFooter.astro`
- Deliverable: Outcome-driven career chronicle and client-inviting contact section.

### Task 5: End-to-End Build & Verification
- Files: `dist/`, Git repository
- Deliverable: Verified production build, zero CLS, sitemap validation, and git push.
