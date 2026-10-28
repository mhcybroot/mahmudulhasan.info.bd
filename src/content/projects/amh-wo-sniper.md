---
title: "AMH Sniper: High-Speed Work Order Auto-Acceptor & Memory Hook Engine"
slug: "amh-wo-sniper"
author: "Mahmudul Hasan (@mhcybroot)"
date: "2026-10-28"
githubUrl: "https://github.com/mhcybroot/amh-wo-sniper"
primaryLanguage: "JavaScript"
stack:
  - "Chrome Extension Manifest V3 (MV3)"
  - "MAIN-World Memory Hook (fetch & XMLHttpRequest Monkeypatch)"
  - "ISOLATED-World Chrome Runtime Bridge (DOM & Storage Channel)"
  - "80ms In-Page Soft Refresh (Ant Design Tab Toggle - Zero Reload)"
  - "DOM MutationObserver for Terms Auto-Check & Latch Confirmation"
  - "Rate-Limit Shield with Exponential Backoff & 429 Suppressor"
  - "Web Audio API Hardware Synthesizer (Audio Alarms & Sound Effects)"
  - "Floating Glassmorphic HUD with Real-Time Ping & Cooldown Telemetry"
metrics:
  throughput: "< 80ms Soft Tab Switch"
  latency: "< 12ms Memory Hook Ingestion"
  memoryUsage: "< 18 MB RAM (Ring-Buffer Logs)"
  binarySize: "100% Unassisted WO Claim Rate"
seo:
  focusKeyword: "chrome extension manifest v3 fetch hook dom automation amh sniper work order"
  secondaryKeywords:
    - "javascript monkeypatch fetch xmlhttprequest main world content script"
    - "isolated world main world bridge chrome extension message channel"
    - "dom mutationobserver auto click accept terms chrome extension"
    - "web audio api sound synthesizer browser automation"
  schemaType: "SoftwareSourceCode"
---

# AMH Sniper: High-Speed Work Order Auto-Acceptor & Memory Hook Engine

> **At a Glance:** An enterprise high-speed browser automation and in-memory API interception engine engineered as a Chrome Extension Manifest V3 (MV3) and Tampermonkey userscript. Developed for high-stakes vendor work order portals (such as American Homes 4 Rent - AMH), where newly released maintenance contracts are claimed by competing contractors within 1 to 3 seconds, AMH Sniper bypasses standard page reload overhead entirely. By executing in the browser's `MAIN` JavaScript world, it hooks directly into `window.fetch` and `XMLHttpRequest`, detecting `VendorNewOrders` JSON payloads in memory before the DOM finishes rendering, cycles tab state in 80 milliseconds without white screens, auto-checks legal terms via MutationObservers, and confirms job acceptance in under 250 milliseconds with zero human intervention.

---

## 1. The Real-World Engineering Problem

In fast-paced property maintenance and enterprise field servicing marketplaces (like AMH Vendor Admin), job dispatching operates under a strict **First-Come, First-Served** auction mechanism:

1. **Sub-Second Job Sniping Competition:** High-value HVAC, plumbing, and electrical work orders (worth $800 to $4,500+) are broadcast to hundreds of competing licensed vendors simultaneously. Human dispatchers manually refreshing web pages are beaten 100% of the time by automated bots that claim jobs within 1.5 seconds of release.
2. **Heavy Browser Reload Overhead & White-Screen Lag:** Standard web page refreshes (`F5` or `location.reload()`) take 2,500 to 4,000 milliseconds to re-download React bundles, parse CSS styles, re-authenticate tokens, and initialize DOM trees. A contractor stuck on a blank loading screen will consistently miss new job releases.
3. **HTTP 429 Rate-Limiting & IP Banning:** Aggressive manual or script-based polling triggers web application firewalls (WAF) and Cloudflare rate limits, locking vendors out with HTTP 429 "Too Many Requests" errors and terminating vendor portal accounts.
4. **Multi-Step DOM Latency (Click $\rightarrow$ Terms $\rightarrow$ Confirm):** After an order appears, vendors must click the row, wait for the modal dialog to mount, check a nested "Accept Terms & Conditions" checkbox, and click "Confirm WO". If any step stalls or takes longer than 600ms, another vendor grabs the order.

---

## 2. The AMH Sniper Architecture

AMH Sniper transforms the browser into an ultra-low-latency event listener through dual-world architecture and memory interception:

- **Dual-World Execution Topology:**
  - **`MAIN` Execution World:** Injects `content.js` directly into the page's native execution context, allowing zero-latency monkeypatching of the page's native `window.fetch` and `XMLHttpRequest` prototypes.
  - **`ISOLATED` World Bridge:** Runs `bridge.js` to securely dispatch diagnostic telemetry, persistent audio alerts, and log downloads to Chrome Extension background service workers without polluting the page namespace.
- **In-Memory Network Hook (`fetch` / `XHR`):** Intercepts raw network JSON responses from `/VendorNewOrders` directly in memory at `document_start`. It evaluates job arrays and extracts ticket IDs in **under 12 milliseconds**, initiating the claim sequence before React even paints the table rows to the screen.
- **80ms In-Page Soft Refresh:** Instead of triggering expensive HTTP page reloads, the engine programmatically toggles Ant Design UI tabs (`#rc-tabs-0-tab-AllOpen` $\rightarrow$ `#rc-tabs-0-tab-New`) in 80 milliseconds. This triggers the portal's authenticated AJAX query with zero page flickering and zero state loss.
- **Dynamic Rate-Limit Shield & Crash Armor:** Implements exponential backoff when detecting HTTP 429 or server gateway errors (502/503/504). Automatically suppresses outgoing polling while maintaining the session, then safely ramps back up without triggering Cloudflare blocks.
- **MutationObserver Auto-Claim Latch:** Monitors DOM subtree changes on the Work Order detail modal. The millisecond the terms checkbox renders, the script sets `checkbox.checked = true`, dispatches native `change` and `input` events, and triggers the `click()` event on the "Confirm WO" button.
- **Zero-Dependency Web Audio API Synthesizer:** Synthesizes emergency frequencies (880 Hz alarm tones and melodic victory chimes) directly through the browser's hardware audio oscillator, alerting dispatchers even when the browser tab is minimized in the background.
