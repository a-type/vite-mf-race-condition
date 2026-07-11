import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: 0,
  timeout: 20000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'pnpm --filter remote preview',
      port: 4174,
      reuseExistingServer: true,
      cwd: '.',
      timeout: 120000,
    },
    {
      command: 'pnpm --filter host preview',
      port: 4173,
      reuseExistingServer: true,
      cwd: '.',
      timeout: 120000,
    },
  ],
});
