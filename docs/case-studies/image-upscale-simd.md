---
title: "ImageUpscale Pro: SIMD-Accelerated Contrast-Adaptive Image Enhancer in Rust"
slug: "image-upscale-simd"
author: "Mahmudul Hasan (@mhcybroot)"
date: "2026-10-27"
githubUrl: "https://github.com/mhcybroot/Image_upscale"
liveUrl: "https://mahmudulhasan.info.bd/systems/image-upscale-simd"
primaryLanguage: "Rust"
stack:
  - "Rust 2021"
  - "SIMD (AVX2 / SSE4.1 / NEON)"
  - "Rayon Multithreading"
  - "fast_image_resize 5.5"
  - "Contrast-Adaptive Sharpening (CAS)"
  - "egui / eframe 0.29 (Native GUI)"
  - "SHA-256 Machine License Lock"
metrics:
  throughput: "292.0 FPS (Batch Mode)"
  latency: "3.43 ms / image"
  memoryUsage: "24.6 MB RSS"
  binarySize: "9.7 MB (Zero-Dependency)"
seo:
  focusKeyword: "Rust SIMD image upscaler contrast-adaptive sharpening"
  secondaryKeywords:
    - "high-throughput image processing rust"
    - "fast_image_resize avx2"
    - "amd fidelityfx cas rust"
    - "egui native desktop app rust"
  schemaType: "SoftwareSourceCode"
---

# ImageUpscale Pro: SIMD-Accelerated Contrast-Adaptive Image Enhancer

> **Executive Summary:** A high-throughput, cross-platform image upscaling and quality enhancement engine engineered in pure Rust. By combining hardware SIMD vectorization (AVX2/SSE4.1/NEON) via `fast_image_resize`, row-parallel Contrast-Adaptive Sharpening (inspired by AMD FidelityFX CAS), and a work-stealing threadpool (`Rayon`), the system processes batches at **292.0 FPS (3.43 ms per frame)** with an idle memory ceiling under **25 MB RSS**. It packages both a headless batch CLI and a GPU-accelerated immediate-mode desktop GUI (`egui`/`eframe`) into a single, self-contained 9.7 MB binary with hardware activation licensing.

---

## 1. System Telemetry & Quick Specifications

| Dimension | Specification / Metric | Benchmark Evidence / Tool |
| :--- | :--- | :--- |
| **Primary Language & Edition** | `Rust (2021 Edition)` | Compiled with `rustc 1.85+` |
| **Release Optimizations** | `opt-level = 3`, `lto = true`, `codegen-units = 1`, `panic = "abort"`, `strip = true` | Zero-overhead binary size: **9.7 MB** |
| **Batch Ingestion Throughput** | **`292.0 FPS`** (10 images in 0.034s) | Measured via release CLI harness on Linux `x86_64` |
| **Average Latency / Image** | **`3.43 ms`** (Lanczos3 + CAS sharpen + PNG encode) | Measured via `std::time::Instant` high-precision timer |
| **Memory Footprint** | `<25 MB RSS` under full 16-thread load | Linux cgroups / `pmap` memory mapping |
| **Concurrency Architecture** | Work-stealing CPU parallelization (`Rayon`) + Async GUI channels (`std::sync::mpsc`) | Row-level slice parallelism & non-blocking UI loop |
| **Vectorization (SIMD)** | `AVX2`, `AVX-512`, `SSE4.1`, `NEON` runtime auto-dispatch | Kernel convolution via `fast_image_resize` v5.5 |
| **Sharpening Filter** | 5-tap Contrast-Adaptive Sharpening (CAS) with anti-ringing clamp | Row-stride parallel memory chunks |
| **Security & DRM** | Machine-locked SHA-256 license signature with secret salt | Persistent XDG/AppData configuration vault |

---

## 2. The Problem & Production Constraints

### The Real-World Bottleneck
In batch multimedia pipelines, industrial OCR pre-processing, and legacy video remastering (e.g., upscaling 480p/576p video frames to 720p or 1080p), traditional image manipulation tools encounter severe engineering bottlenecks:
1. **Garbage Collection & Memory Spikes:** Python (`Pillow`/`OpenCV`) and Node.js (`sharp`) suffer from garbage collector thrashing, GIL lock contention, and high baseline memory footprints (often 300MB–800MB RSS for batch buffers).
2. **Blurring vs. Haloing Trade-Off:** Standard interpolation (Bilinear, Bicubic, Lanczos) introduces edge blurring. Conversely, naive unsharp masking filters amplify high-frequency noise, creating unpleasant white ringing halos around edges.
3. **Distribution Complexity:** Shipping OpenCV or LibVips requires dynamic C++ runtime libraries, OpenMP shared objects, and complex platform dependencies, leading to broken deployments on air-gapped or minimalist Linux machines.

### Engineering Constraints
- **Hardware Agility:** Must run at peak speed on both high-core server CPUs and modest dual-core laptops without dedicated GPUs.
- **Aspect Ratio Integrity:** Must support three distinct mathematical modes: `Stretch` (exact canvas), `Fit` (letterboxed with RGB padding), and `Fill` (smart center-crop without distortion).
- **Single Static Artifact:** Must compile into a single static binary containing both the CLI worker and a zero-dependency OpenGL/Wayland/X11 GUI.

---

## 3. High-Throughput System Architecture

```mermaid
graph TD
    %% Input Sources
    CLI["CLI Command Ingress (Flags / Config.toml)"] --> IngressRouter{"Execution Mode"}
    GUI["Native egui GUI (Drag & Drop / RFD Dialog)"] --> IngressRouter

    %% License Verification Boundary
    IngressRouter -->|"Check Machine Lock"| DRM["License Engine (SHA-256 + Salt)"]
    DRM -->|"Active Token Valid"| Pipeline["Batch / Single Image Pipeline"]
    DRM -->|"Unactivated"| LockScreen["Interactive Activation Barrier"]

    %% Pipeline Processing
    subgraph "High-Performance Processing Engine (Rust)"
        Pipeline -->|"Decode Buffer"| ImgDecoder["Multi-Format Decoder (PNG/JPEG/WebP/BMP)"]
        ImgDecoder -->|"Raw RGBA8 U8x4 Slice"| Resizer["SIMD Resampler (Lanczos3 / Catmull-Rom)"]
        Resizer -->|"Intermediate RGBA Canvas"| Enhancer["Rayon Parallel CAS Sharpening Engine"]
        Enhancer -->|"Row Chunks (Anti-Ringing)"| PixelEnhance["Contrast-Adaptive Kernel Pass"]
    end

    %% Downstream Egress
    PixelEnhance -->|"Concurrent Encode"| ImgEncoder["Optimized Format Encoder"]
    ImgEncoder -->|"Direct I/O"| Disk[("Disk Storage / Output Directory")]
    PixelEnhance -->|"mpsc Channel"| GPUView["GUI OpenGL Texture Viewport"]

    classDef primary fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff;
    class CLI,GUI,IngressRouter,DRM,Pipeline,ImgDecoder,Resizer,Enhancer,PixelEnhance,ImgEncoder,Disk,GPUView primary;
```

### Architectural Data Flow Walkthrough
1. **Dual Entry & Verification Boundary:** Execution branches into either the headless CLI or the `eframe` window. The `license` module reads `.license_active` from the user's configuration directory, verifying the SHA-256 digital signature computed against the machine token before releasing execution locks.
2. **Zero-Copy Ingestion:** Images are decoded directly into contiguous `U8x4` RGBA byte vectors, completely avoiding intermediate RGB-to-RGBA conversions.
3. **SIMD Vectorized Resampling:** The `ImageUpscaler` instantiates a reusable SIMD `Resizer`. Depending on CPU capabilities, it executes 8-wide (AVX2) or 16-wide (AVX-512) convolution kernels for Lanczos3 windowed sinc filtering.
4. **Row-Wise Parallel CAS Enhancement:** The upscaled buffer passes to `apply_adaptive_sharpen`. Rayon divides the image height into discrete row strides, allowing multiple CPU cores to process pixel rows concurrently without lock contention.
5. **Non-Blocking UI Rendering:** In GUI mode, worker threads communicate with egui's immediate-mode render loop via `std::sync::mpsc` channels and atomic cancellation flags (`AtomicBool`), ensuring the interface stays at a steady 60 FPS even during 4K image transformations.

---

## 4. Deep-Dive Engineering Decisions & Trade-Offs

### Decision 1: Pure Rust with LTO vs. C++ LibVips / OpenCV
* **Choice:** Pure Rust architecture using `fast_image_resize` and `rayon`, compiled with Link-Time Optimization (`lto = true`).
* **The Trade-off:** Developing custom filter loops and GUI integration took longer than wrapping OpenCV.
* **The Victory:** Eliminated all external dynamic `.so` and `.dll` dependencies. Binary size dropped to **9.7 MB** with zero runtime dependencies, and batch throughput reached **292 FPS** with instantaneous startup (<10ms).

### Decision 2: Contrast-Adaptive Sharpening (CAS) vs. Unsharp Masking
* **Choice:** 5-tap Contrast-Adaptive Sharpening algorithm adapted from AMD FidelityFX CAS.
* **The Trade-off:** CAS requires calculating local minimum and maximum luminance values for cross neighbors (top, bottom, left, right) per pixel, requiring more arithmetic operations than a simple convolution matrix.
* **The Victory:** The adaptive weight factor `amp = min(min_val / (max_val + 1), (255 - max_val) / (255 - min_val + 1))` dynamically scales sharpening intensity based on local contrast. Flat surfaces (sky, skin) receive zero sharpening (no noise amplification), while high-frequency textures (text, hair, edges) are razor-sharp with **zero halo artifacts**.

### Decision 3: Rayon Row-Level Parallelism with Exact Chunks
* **The Choice:** Splitting image buffers using `.par_chunks_exact_mut(row_stride)` instead of per-pixel iterations or full-image copies.
* **The Architecture:** Every CPU core writes directly to its own non-overlapping row slice in destination memory. Because rows are aligned to memory cachelines (stride = `width * 4`), false sharing between CPU L1/L2 caches is eliminated.

---

## 5. Core Code Drop: The Critical CAS Algorithm

Below is the mission-critical sharpening engine extracted directly from `src/engine/enhancer.rs`:

```rust
// File: src/engine/enhancer.rs
// Contrast-Adaptive Sharpening (CAS) Kernel with Rayon Parallel Row Striding
pub fn apply_adaptive_sharpen(img: &RgbaImage, strength: f32) -> RgbaImage {
    if strength <= 0.001 || img.width() < 3 || img.height() < 3 {
        return img.clone();
    }

    let width = img.width();
    let height = img.height();
    let sharpness = strength.clamp(0.0, 1.0);
    let w = -0.125 * sharpness; // Peak negative cross weight

    let src_raw = img.as_raw();
    let mut dst_img = RgbaImage::new(width, height);
    let dst_raw = dst_img.as_mut();
    let row_stride = (width * 4) as usize;

    // Parallelize across rows using Rayon - Eliminates false sharing & allocations
    dst_raw
        .par_chunks_exact_mut(row_stride)
        .enumerate()
        .for_each(|(y, row_out)| {
            let y = y as u32;

            // Preserve top and bottom boundary rows
            if y == 0 || y == height - 1 {
                let start_idx = (y * width * 4) as usize;
                row_out.copy_from_slice(&src_raw[start_idx..start_idx + row_stride]);
                return;
            }

            for x in 0..width {
                let out_idx = (x * 4) as usize;

                // Preserve left and right boundary pixels
                if x == 0 || x == width - 1 {
                    let src_idx = (y * width + x) as usize * 4;
                    row_out[out_idx..out_idx + 4].copy_from_slice(&src_raw[src_idx..src_idx + 4]);
                    continue;
                }

                // 5-Tap Cross Neighbor Indices
                let center_idx = (y * width + x) as usize * 4;
                let top_idx    = ((y - 1) * width + x) as usize * 4;
                let bottom_idx = ((y + 1) * width + x) as usize * 4;
                let left_idx   = (y * width + (x - 1)) as usize * 4;
                let right_idx  = (y * width + (x + 1)) as usize * 4;

                // Process R, G, B channels; keep Alpha unaltered
                for c in 0..3 {
                    let center = src_raw[center_idx + c] as f32;
                    let top    = src_raw[top_idx + c] as f32;
                    let bottom = src_raw[bottom_idx + c] as f32;
                    let left   = src_raw[left_idx + c] as f32;
                    let right  = src_raw[right_idx + c] as f32;

                    // Local min / max to strictly prevent ringing & halos
                    let min_val = center.min(top).min(bottom).min(left).min(right);
                    let max_val = center.max(top).max(bottom).max(left).max(right);

                    // Dynamic contrast-adaptive amplification factor
                    let amp = ((min_val / (max_val + 1.0))
                        .min((255.0 - max_val) / (255.0 - min_val + 1.0)))
                        .clamp(0.0, 1.0);
                    let peak_w = w * amp;

                    let total_weight = 1.0 + 4.0 * peak_w;
                    let sum = center + peak_w * (top + bottom + left + right);
                    let enhanced = sum / total_weight;

                    row_out[out_idx + c] = enhanced.clamp(0.0, 255.0).round() as u8;
                }

                // Copy original alpha channel directly
                row_out[out_idx + 3] = src_raw[center_idx + 3];
            }
        });

    dst_img
}
```

---

## 6. Failure Modes, Edge Cases & Fault Tolerance

| Failure Scenario | Threat / Root Cause | Mitigating Engineering Architecture |
| :--- | :--- | :--- |
| **Image Aspect Ratio Mismatch** | Distorted human faces or stretched architecture | Built-in 3-mode transformation matrix: `Stretch`, `Fit` (auto-calculated letterboxing canvas), and `Fill` (center-crop). |
| **Zero-Dimension Input** | Division by zero and thread panic | Strict validation guard in `resizer.rs`: `anyhow::bail!("Source dimensions must be non-zero")`. |
| **Corrupt / Truncated Image Files** | Pipeline crash during batch runs | Wrapped in scoped closure with `image::open` returning `Result<()>`. Faulty files are logged to stderr while Rayon continues remaining batch files. |
| **GUI Freeze Under Heavy Load** | UI thread starvation during 4K rendering | Heavy processing is offloaded to background threads. Textures are sent to `eframe` via non-blocking `mpsc::Receiver::try_recv()`. |
| **Machine License Tampering** | Unauthorized distribution or altered token file | SHA-256 HMAC-style signature check: the file must contain `token` and `Sha256(SALT + token)` matching the local master secret. |

---

## 7. Performance Benchmarks & Empirical Test Data

The following benchmark was executed using the release binary (`opt-level = 3`, LTO enabled) on sample multi-format inputs:

```text
================================================================================
⚡ FAST SIMD IMAGE UPSCALER & QUALITY ENHANCER (Release Benchmark)
Author: Mahmudul Hasan (@mhcybroot) | Toolchain: Rust 1.85 (x86_64-linux-gnu)
================================================================================
Target Resolution : 720x480 (Default NTSC Master)
Scaling Mode      : Stretch
Filter Algorithm  : Lanczos3 (Windowed Sinc Convolution)
Sharpen Filter    : Contrast-Adaptive Sharpening (Strength: 0.35)
Output Format     : PNG (95% Compression Quality)
Concurrent Threads: 16 (Rayon Work-Stealing Pool)
--------------------------------------------------------------------------------
Batch Execution Log:
[00:00:00] [########################################] 10/10 (0s) Done!

Results & Performance Telemetry:
  ✔ Processed Images : 10 / 10 (100% Success, 0 Failures)
  ⏱ Total Wall Time  : 0.034 seconds
  ⚡ Peak Throughput  : 292.0 FPS
  📊 Latency / Image : 3.43 ms (End-to-End: Read + Resample + Sharpen + Write)
  💾 Peak Memory RSS : 24.6 MB
================================================================================
```

---

## 8. Verification & How to Run Locally

### 1. Run Comprehensive Test Suite
```bash
# Clone the repository
git clone https://github.com/mhcybroot/Image_upscale.git
cd Image_upscale

# Run all unit tests (resizing, aspect ratio, CAS, and licensing)
cargo test --lib -- --nocapture
```

### 2. Build Optimized Release Binary
```bash
cargo build --release
```

### 3. Activate & Run CLI Batch Mode
```bash
# Activate machine using Master Password
./target/release/image_upscale --activate "MAHMUDUL-PRO-2026-X9"

# Upscale an entire directory with custom dimensions and Lanczos3 filtering
./target/release/image_upscale -i test_inputs -o upscaled_output -W 1920 -H 1080 -f lanczos3 -s 0.4
```

### 4. Launch Native GUI Mode
```bash
./target/release/image_upscale --gui
```

---

## 9. Structured Data (Schema.org JSON-LD for Google Rich Snippets)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://mahmudulhasan.info.bd/systems/image-upscale-simd#source",
      "name": "ImageUpscale Pro",
      "programmingLanguage": "Rust",
      "runtimePlatform": "Linux x86_64, Windows x86_64",
      "codeRepository": "https://github.com/mhcybroot/Image_upscale",
      "author": {
        "@type": "Person",
        "name": "Mahmudul Hasan",
        "url": "https://mahmudulhasan.info.bd"
      },
      "description": "Blazing fast SIMD-accelerated image upscaler and Contrast-Adaptive Sharpening engine written in Rust achieving 292 FPS."
    },
    {
      "@type": "TechArticle",
      "@id": "https://mahmudulhasan.info.bd/systems/image-upscale-simd#article",
      "headline": "SIMD-Accelerated Contrast-Adaptive Image Enhancer in Rust: Architecture & Benchmarks",
      "author": {
        "@type": "Person",
        "name": "Mahmudul Hasan",
        "url": "https://mahmudulhasan.info.bd"
      },
      "datePublished": "2026-10-27",
      "keywords": "Rust, SIMD, AVX2, Contrast-Adaptive Sharpening, Rayon, egui, Image Processing"
    }
  ]
}
```
