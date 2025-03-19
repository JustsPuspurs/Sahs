// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: 60000,
  expect: { timeout: 10000 },
  projects: [
    {
      name: 'e2e-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
