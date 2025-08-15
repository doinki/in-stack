import { defineConfig, devices } from '@playwright/test';

const isCi = !!process.env.CI;

const url = new URL('http://localhost:3000');
if (!isCi) {
  url.protocol = 'https:';
}

export default defineConfig({
  forbidOnly: isCi,
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  reporter: 'html',
  retries: isCi ? 2 : 0,
  testDir: './tests',
  use: {
    baseURL: url.href,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
  webServer: {
    command: isCi ? 'pnpm run build && pnpm run start' : 'pnpm run dev',
    ignoreHTTPSErrors: true,
    reuseExistingServer: !isCi,
    url: url.href,
  },
  workers: isCi ? 1 : undefined,
});
