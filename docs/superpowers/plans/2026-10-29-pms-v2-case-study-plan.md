# Implementation Plan: PMS-V2 Autonomous Smart Parking System Case Study

**Target URL:** `https://mahmudulhasan.info.bd/systems/pms-v2`  
**Source Repository:** [`https://github.com/mhcybroot/PMS-V2`](https://github.com/mhcybroot/PMS-V2) (Local: `/home/mhcybroot/Projects/PMS-V2`)  
**Objective:** Add Mahmudul Hasan's flagship smart parking and hardware automation platform (`PMS-V2`) as the next authoritative, human-first case study on the portfolio, connecting business value (zero revenue leakage, zero manual delay) with deep engineering rigor (Rust 2024, Axum, SeaORM, ZKTeco ADMS, Flutter BLoC).

---

## 1. Executive Context & Value Narrative

### The Real-World Business Problem
In commercial shopping malls, high-rise office towers, and toll plazas in Bangladesh (and developing urban centers):
1. **Revenue Leakage:** Manual paper ticket systems and cash-in-hand operators lose 15–30% of daily parking revenue due to unrecorded exits and manipulated timestamps.
2. **Shift-Change & Rush-Hour Traffic Jams:** Cars queue onto main roads during 8:00 AM–10:00 AM and 5:00 PM–7:00 PM because manual gatekeepers take 20–40 seconds per vehicle.
3. **Hardware Fragility & Crashing:** Generic parking software built on interpreted runtimes (Node.js/Python) frequently crashes under continuous CCTV RTSP streams and serial COM port glitches.

### How Mahmudul Hasan Solved It with PMS-V2
- **Sub-Second Gate Lifts:** Combined camera OCR with a zero-cost async Rust core (Axum + Tokio) to process authorization and lift barrier arms in under 840 milliseconds.
- **100% Leak-Proof Audit Trail:** Every transaction is tied to anti-passback logic, camera plate snapshots, and atomic PostgreSQL ledger transactions using SeaORM.
- **Fail-Safe Offline Multi-Terminal Architecture:** Even if the internet drops, local edge gates continue processing vehicles and auto-sync when reconnected.

---

## 2. Technical Profile & Verified Metrics

| Dimension | Specification |
| :--- | :--- |
| **Backend Core** | Rust 2024 (Axum 0.8.9, Tokio 1.52, SeaORM 1.1.20) |
| **Cross-Platform UI** | Flutter 3 (Clean Architecture, BLoC, MediaKit Video, Thermal POS) |
| **Hardware Interfacing** | ZKTeco ADMS (HTTP Push), RTSP H.264 CCTV, RS485 / Relay Triggers |
| **Database & Cache** | PostgreSQL 16 (ACID pools), Argon2 + JWT Security |
| **Deployment** | Docker Compose, Multi-stage builds, Nginx Reverse Proxy |
| **Gate Latency** | < 0.84 seconds (Camera detection to physical barrier open) |
| **Concurrency** | 10,000+ requests/sec with 0 drops under peak vehicle bursts |
| **Memory Footprint** | < 35 MB RAM idle (90% lower than Python/Node alternatives) |

---

## 3. Step-by-Step Task Breakdown

### Task 1: Create Content Data File (`src/content/projects/pms-v2.md`)
- Adhere to `src/content.config.ts` schema:
  - Title, slug (`pms-v2`), author, githubUrl, stack, metrics, seo metadata.
- Structure content into human-first sections:
  1. **The Executive Pitch:** Why parking automation fails in real life and what PMS-V2 fixes.
  2. **Everyday Human Impact:** For property owners (revenue protection), drivers (no queuing), and operators (error-free accounting).
  3. **The 4-Stage Automated Pipeline:**
     - Stage 1: Smart Camera Plate OCR (Frigate AI RTSP)
     - Stage 2: Rust 2024 Concurrency Reactor & Anti-Passback
     - Stage 3: Hardware Relay & Ground Loop Safety Lock
     - Stage 4: Financial Database Ledger & POS Thermal Ticket
  4. **The Flutter POS & Operator Control Center:** Multiplatform desktop/tablet UI, real-time CCTV stream integration (`media_kit_video`), live parking slot visualizer.
  5. **Production Reliability & Fail-Safe Architecture:** Offline mode, database connection pooling, auto-reconnect watchdog.
  6. **Under The Hood (For CTOs):** Code snippets from `backend/src/service/zk_adms_service.rs`, `slot_service.rs`, and SeaORM transaction boundaries.

### Task 2: Enhance System Case Study Template (`src/pages/systems/[slug].astro`)
- Ensure rich support for PMS-V2 interactive elements:
  - Add an **Interactive Gate Automation Simulator** or specialized **Parking Lane Visualizer** widget that lets visitors test an inbound vehicle cycle.
  - High-contrast WCAG AA styling with tabs for *Business Value* vs *Engineering Architecture*.
  - Link directly to Mahmudul's GitHub repo (`https://github.com/mhcybroot/PMS-V2`).

### Task 3: Link Homepage to the New Case Study
- Update `src/components/FlagshipSystems.astro`:
  - Add a primary CTA button on the PMS-V2 Spotlight Card:
    `[Explore PMS-V2 Architecture & Live Flow →](/systems/pms-v2)`
- Update navigation and sitemap to ensure instant crawlability and internal linking.

### Task 4: Static Build, Lighthouse & Production Push
- Execute `npm run build` to verify 3 static HTML outputs:
  - `/index.html`
  - `/systems/image-upscale-simd/index.html`
  - `/systems/pms-v2/index.html`
- Validate `sitemap-0.xml` includes the new URL.
- Commit and push to `origin/main`.
