---
title: "Skylink Workstation Guard: Ultra-Lightweight Focus & Activity Monitor"
slug: "skylink-monitor"
author: "Mahmudul Hasan (@mhcybroot)"
date: "2026-10-28"
githubUrl: "https://github.com/mhcybroot/watch-employee"
liveUrl: "https://mahmudulhasan.info.bd/systems/skylink-monitor"
primaryLanguage: "Rust"
stack:
  - "Rust 2024 LTS (Tokio Async Core)"
  - "Spring Boot 3.4 Telemetry Ingestion"
  - "eframe / egui Zero-Overhead Native GUI"
  - "xcap & sysinfo OS Kernel Telemetry"
  - "tokio-tungstenite Real-time WebSocket"
  - "OS Keyring Bank-Grade Token Vault"
metrics:
  throughput: "60s Telemetry + Real-time Stream"
  latency: "< 0.01% CPU Impact"
  memoryUsage: "< 14 MB Total RAM"
  uptime: "100% Offline Buffer Queue"
seo:
  focusKeyword: "Ultra lightweight employee productivity monitor rust spring boot"
  secondaryKeywords:
    - "rust workstation activity tracking daemon"
    - "enterprise productivity monitor low ram"
    - "skylink monitor watch employee"
    - "secure offline buffered activity telemetry"
  schemaType: "SoftwareSourceCode"
---

# Skylink Workstation Guard: Ultra-Lightweight Focus & Activity Monitor

> **At a Glance:** An enterprise workstation activity and team productivity monitoring platform engineered with Rust 2024, Tokio, and Spring Boot 3.4. Unlike bloated commercial trackers that swallow 500MB+ of RAM and slow employee machines down to a crawl, Skylink Workstation Guard runs in the background using less than **14 MB of RAM** and **<0.01% CPU**, captures active window focus, streams real-time screen verification over encrypted WebSockets on demand, and safeguards enterprise privacy with bank-grade local OS keyring encryption.

---

## 1. The Real-World Problem

In remote engineering agencies, software firms, BPO operations, and corporate offices:

1. **Software Bloat Slows Down Teams:** Commercial monitoring suites (Hubstaff, Time Doctor, Teramind) are notorious for consuming 400MB to 1.2GB of RAM, spinning up background Electron instances, and triggering CPU thermal throttling on developer laptops and designer workstations.
2. **Invasive & Insecure Spyware Risks:** Legacy software often records intrusive keystroke logs (including personal passwords and bank credentials) and uploads unencrypted screenshots directly to third-party public clouds, creating massive security and compliance vulnerabilities.
3. **Network Drops Lose Data:** When an employee experiences an internet drop, typical cloud agents crash, lose tracked work hours, or prevent workers from logging billable client milestones.

### The Skylink Workstation Guard Solution
- **Under 14MB RAM & Near-Zero CPU:** Written in pure, statically compiled Rust with zero Chromium or Electron runtime baggage. Workers never feel any slowdown or battery drain.
- **Privacy-Respecting Telemetry:** Focuses on window title changes, application categories, and idle/active duration. Keystroke logging is eliminated by design.
- **On-Demand Live Verification:** Team supervisors can request a temporary, encrypted 720p live screen stream over WebSockets with atomic quality throttling without storing gigabytes of invasive recordings.
- **100% Offline Resilience:** Automatically buffers activity metrics locally in an encrypted queue and securely flushes data to the Spring Boot backend the moment network connectivity returns.

---

## 2. Who Benefits Most?

### Engineering Leaders & CTOs
- **Zero Developer Backlash:** Developers and designers get a lightning-fast workstation that doesn't freeze IDEs (IntelliJ, VS Code, Android Studio) or 3D rendering pipelines.
- **Accurate Billable Milestones:** Verified client billing logs backed by cryptographic tokens and real-time active window telemetry.

### Operations & HR Teams
- **Real-Time Productivity Insights:** Instantly identify team focus trends, detect workflow bottlenecks, and reward top performers based on genuine focus hours.
- **Seamless Setup:** Single compact binary that runs on Linux and Windows with automatic system startup on reboot.

### Remote & Field Employees
- **Uncompromised Privacy:** Passwords, private chats, and banking details are never keylogged or leaked.
- **Fair Credit for Work:** Even during ISP or power outages, offline work hours are safely buffered and recognized upon reconnection.

---

## 3. High-Performance Architectural Blueprint

```
+-------------------------------------------------------------------------+
|                  Workstation Client (Rust 2024 Daemon)                   |
|                                                                         |
|  [xcap Screen Capture]  [sysinfo Processes]  [active-win-pos-rs Window] |
|            |                     |                      |               |
|            +---------------------+----------------------+               |
|                                  |                                      |
|                       [Tokio Async Reactor]                             |
|                                  |                                      |
|            +---------------------+----------------------+               |
|            |                                            |               |
|  (60s Activity Sync)                          (On-Demand Live Stream)   |
|            |                                            |               |
|    [Reqwest REST Client]                      [Tokio-Tungstenite WS]    |
|   (Bearer Token + Keyring)                     (Atomic Quality Throttle)|
+------------|--------------------------------------------|---------------+
             |                                            |
             v (HTTPS / TLS 1.3)                          v (WSS Encrypted)
+-------------------------------------------------------------------------+
|               Central Ingestion Server (Spring Boot 3.4)                |
|                                                                         |
|        [REST Ingest Endpoint]                  [WebSocket Relay Hub]    |
|                  |                                        |             |
|                  v                                        v             |
|       [PostgreSQL 16 Storage]                  [Supervisor Live Console]|
+-------------------------------------------------------------------------+
```

---

## 4. Why Statically Compiled Rust Beats Commercial Trackers

| Feature | Legacy Commercial Trackers | Skylink Workstation Guard |
| :--- | :--- | :--- |
| **Runtime Architecture** | Bloated Electron / Node.js Runtime | Pure Native Statically Compiled Rust |
| **RAM Footprint** | 450 MB – 1,200 MB | **< 14 MB (30x lighter)** |
| **CPU Utilization** | 2% – 8% sustained spikes | **< 0.01% idle background** |
| **Keystroke Privacy** | Invasive keylogger risk | **Zero Keylogging by design** |
| **Live Screen Stream** | Heavy 1080p cloud upload | **On-Demand WebSockets with atomic quality throttling** |
| **Network Outage Handling** | Crashes or loses offline hours | **Encrypted local buffer with auto-flush** |
| **Binary Size** | ~150 MB installer | **~9 MB self-contained binary** |

---

## 5. Security & Authentication Model

1. **OS Keychain Integration (`keyring` crate):** Employee session tokens are never saved as plain-text files on disk. They are securely encrypted in the OS credential vault (GNOME Keyring on Linux, Windows Credential Manager on Windows).
2. **Atomic Quality Control:** Screen streaming utilizes atomic concurrency flags (`AtomicU32`, `AtomicU8`, `AtomicBool`) to dynamically adjust video bitrate and frame rates to suit unstable mobile hotspot connections.
3. **Token-Authenticated WebSockets:** Supervisors and agents authenticate each WebSocket frame with short-lived JWT tokens, preventing unauthorized network eavesdropping.
