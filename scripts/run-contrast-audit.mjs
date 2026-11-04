#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distSitemap = path.join(rootDir, 'dist', 'sitemap-0.xml');
const baseConfigPath = path.join(rootDir, 'config', 'pa11yci.json');
const tempConfigPath = path.join(rootDir, '.pa11yci.tmp.json');

const args = process.argv.slice(2);
let singlePath = null;
const singleIdx = args.indexOf('--single');
if (singleIdx !== -1 && args[singleIdx + 1]) {
  singlePath = args[singleIdx + 1];
}

// 1. Gather paths
let targetPaths = [];
if (singlePath) {
  targetPaths.push(singlePath.startsWith('/') ? singlePath : `/${singlePath}`);
} else if (fs.existsSync(distSitemap)) {
  const sitemapXml = fs.readFileSync(distSitemap, 'utf-8');
  const locRegex = /<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(sitemapXml)) !== null) {
    targetPaths.push(match[1] || '/');
  }
} else {
  targetPaths = ['/'];
}

// 2. Generate Dual-Theme URLs
const PORT = process.env.PORT || 4321;
const baseUrl = `http://localhost:${PORT}`;
const urls = [];

for (const p of targetPaths) {
  const cleanPath = p.replace(/\/$/, '') + '/';
  urls.push(`${baseUrl}${cleanPath}?theme=swiss`);
  urls.push(`${baseUrl}${cleanPath}?theme=obsidian`);
}

async function isServerUp(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return res.status < 500;
  } catch {
    return false;
  }
}

async function run() {
  let serverProcess = null;
  if (!(await isServerUp(baseUrl))) {
    console.log(`[Contrast Audit] Server not detected on ${baseUrl}. Spawning preview server...`);
    serverProcess = spawn('npm', ['run', 'preview', '--', '--port', String(PORT)], {
      cwd: rootDir,
      stdio: 'ignore',
    });
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 500));
      if (await isServerUp(baseUrl)) break;
    }
  }

  console.log(`[Contrast Audit] Running Pa11y-CI with Axe runner across ${urls.length} target checks (${targetPaths.length} pages x 2 themes)...`);

  // 3. Load base config and resolve browser executable
  const baseConfig = fs.existsSync(baseConfigPath)
    ? JSON.parse(fs.readFileSync(baseConfigPath, 'utf-8'))
    : { defaults: { runners: ['axe'], standard: 'WCAG2AA' } };

  const chromiumCandidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_BIN,
    '/usr/bin/chromium',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);

  const foundChrome = chromiumCandidates.find((c) => fs.existsSync(c));

  const testConfig = {
    ...baseConfig,
    urls,
  };

  if (foundChrome) {
    testConfig.defaults = testConfig.defaults || {};
    testConfig.defaults.chromeLaunchConfig = testConfig.defaults.chromeLaunchConfig || {};
    testConfig.defaults.chromeLaunchConfig.executablePath = foundChrome;
  }

  fs.writeFileSync(tempConfigPath, JSON.stringify(testConfig, null, 2));

  // 4. Spawn pa11y-ci
  const pa11yProcess = spawn('npx', ['pa11y-ci', '--config', tempConfigPath], {
    stdio: 'inherit',
    cwd: rootDir,
  });

  pa11yProcess.on('close', (code) => {
    try {
      if (fs.existsSync(tempConfigPath)) {
        fs.unlinkSync(tempConfigPath);
      }
    } catch (_) {}

    if (serverProcess) {
      serverProcess.kill();
    }

    if (code === 0) {
      console.log(`\n\x1b[32m✔ [Contrast Audit Passed] All ${urls.length} checks meet WCAG 2.1 AA color contrast standards.\x1b[0m\n`);
    } else {
      console.error(`\n\x1b[31m✘ [Contrast Audit Failed] Color contrast violations detected above.\x1b[0m\n`);
    }
    process.exit(code);
  });
}

run();
