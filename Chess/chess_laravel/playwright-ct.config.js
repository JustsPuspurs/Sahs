// playwright-ct.config.js
import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: 'tests',
  timeout: 60000,
  expect: { timeout: 10000 },
  ctTemplate: './playwright/index.html',
  ctViteConfig: './vite.ct.config.js',
  projects: [
    {
      name: 'ct-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
