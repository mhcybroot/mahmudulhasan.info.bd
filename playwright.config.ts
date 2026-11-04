import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';

const chromiumCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_BIN,
  '/usr/bin/chromium',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
].filter(Boolean) as string[];

const executablePath = chromiumCandidates.find((c) => fs.existsSync(c));

export default defineConfig({
  testDir: './tests/visual',
  snapshotDir: './tests/visual/__snapshots__',
  timeout: 30000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
  },
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    launchOptions: {
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
  },
  projects: [
    {
      name: 'mobile',
      use: {
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'tablet',
      use: {
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'laptop-sm',
      use: {
        viewport: { width: 1024, height: 800 },
      },
    },
    {
      name: 'laptop-md',
      use: {
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'desktop',
      use: {
        viewport: { width: 1536, height: 900 },
      },
    },
  ],
  webServer: {
    command: 'npm run preview -- --port 4321',
    port: 4321,
    reuseExistingServer: true,
    timeout: 10000,
  },
});
