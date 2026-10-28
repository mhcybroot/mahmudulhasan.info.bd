---
title: "YT-Stream: High-Concurrency Media Ingestion & Multi-ISP Caching Engine"
slug: "yt-playlist-engine"
author: "Mahmudul Hasan (@mhcybroot)"
date: "2026-10-28"
githubUrl: "https://github.com/mhcybroot/yt-playlist"
primaryLanguage: "Python"
stack:
  - "Python 3.12 & yt-dlp Core Extraction Engine"
  - "aria2c Multi-Segmented TCP Acceleration (16 Conns/Stream)"
  - "Multi-Threaded Worker Pool (concurrent.futures)"
  - "Algorithmic SponsorBlock API Segment Stripping"
  - "H.265 / HEVC Hardware Video Transcode Pipeline"
  - "Multi-ISP Traffic Routing (BDIX Local Cache vs Starlink)"
  - "Jellyfin & Plex Media Server Automated Library Webhooks"
  - "Chrome Extension One-Click Queue Ingress Daemon"
metrics:
  throughput: "16 Multi-Segment TCP Sockets"
  latency: "< 180ms Ingress to Queue"
  memoryUsage: "< 38 MB Daemon RAM Footprint"
  binarySize: "100% Sponsor-Free Clean Media"
seo:
  focusKeyword: "python yt-dlp aria2c media stream caching pipeline sponsorblock jellyfin"
  secondaryKeywords:
    - "aria2c 16 connection segmented download accelerator"
    - "sponsorblock api automated video sponsor removal python"
    - "h265 hevc hardware transcoding pipeline ffmpeg"
    - "multi isp network routing bdix starlink python daemon"
  schemaType: "SoftwareSourceCode"
---

# YT-Stream: High-Concurrency Media Ingestion & Multi-ISP Caching Engine

> **At a Glance:** A production-grade distributed media ingestion, stream caching, and automated library transcoding pipeline engineered in Python 3.12, `yt-dlp`, and `aria2c`. Engineered to eliminate bandwidth throttling, buffering latency, and invasive sponsor segments, YT-Stream ingests high-resolution 4K/1080p playlists with 16-socket multi-segmented TCP acceleration, algorithmically excises sponsor segments via SponsorBlock APIs, transcodes video into space-efficient H.265/HEVC containers, dynamically routes traffic across multi-ISP gateways (Local BDIX caching vs Starlink satellite uplink), and auto-syncs ingested media directly into private Jellyfin and Plex home-theater clusters.

---

## 1. The Real-World Problem

Streaming high-definition video across home networks, educational campuses, and corporate training labs suffers from severe network friction:

1. **Bandwidth Throttling & Single-Stream Rate Limiting:** Public video platforms (YouTube, Vimeo) aggressively throttle single TCP video streams, causing endless buffering and quality drops on high-latency or shared ISP connections.
2. **Invasive Sponsor Segments & Wasted Time:** Creators routinely embed 90-second sponsor pitches, self-promotion intros, and interaction reminders directly into video timelines. In an educational playlist of 50 lectures, students waste hours of valuable study time manually scrubbing past sponsor interruptions.
3. **Massive Storage Bloat on Uncompressed Containers:** Raw VP9 and unoptimized H.264 streams consume upwards of 4 to 8 GB per hour of 4K content, rapidly overwhelming network-attached storage (NAS) arrays and mobile device storage.
4. **Multi-ISP Routing Friction:** In South Asian and developing markets, broadband setups often combine local high-speed domestic peering (BDIX / local cache at 100 Mbps) with metered international uplinks or Starlink satellite connections. Monolithic downloaders saturate expensive international bandwidth instead of routing intelligently.
5. **Disconnected Media Server Sync:** Content downloaded to local disks requires manual renaming, metadata scraping (NFO files, cover artwork, subtitles), and manual library rescans before it appears on private smart TV streaming hubs (Jellyfin, Plex).

---

## 2. The YT-Stream Architecture

YT-Stream unifies distributed downloading, media transformation, and home theater automation into a single event-driven daemon:

- **16-Socket Multi-Segmented TCP Acceleration:** Integrates `aria2c` as an external download engine (`-x 16 -s 16 -k 1M`). Splits video chunk streams into 16 concurrent socket ranges, bypassing single-stream ISP traffic shaping and saturating full fiber bandwidth.
- **Automated SponsorBlock Algorithmic Stripping:** Hooks into the global SponsorBlock community API during extraction. Automatically identifies and excises sponsor plugs, intros, outros, and subscription reminders directly in the FFmpeg stream muxer without re-encoding video tracks.
- **Hardware-Accelerated H.265 / HEVC Transcoder:** Compresses incoming media into high-efficiency H.265 containers, reducing disk storage footprint by 45–60% while preserving perceptual visual fidelity.
- **Multi-ISP Intelligent Gateway Routing:** Features dynamic routing scripts (`use-local-isp.sh` and `use-starlink.sh`) enabling the daemon to route heavy playlist ingestion over unmetered local ISP peering or fallback to low-latency satellite links during outages.
- **Private Cloud Streaming Ecosystem Sync:** Automatically compiles `.nfo` metadata envelopes, extracts multi-language VTT subtitles, and triggers instant webhook refreshes on local Jellyfin and Plex media servers.
- **Zero-Friction Ingress via Browser Extension:** A dedicated Chrome browser extension and lightweight local HTTP daemon (`queue-server.py`) allow users to enqueue entire video playlists with a single click, receiving immediate desktop notifications.
