import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const requiredEnv = ['BASE_URL', 'ADMIN_USERNAME', 'ADMIN_PASSWORD'] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    // Auto AI-ready failure notes (optional live AI if OPENAI_API_KEY is set)
    ['./src/reporters/ai-failure-reporter.ts'],
  ],
  retries: 1, // retries once more before reporting failure
  timeout: 60_000, //One test can run max 60 seconds (60,000 ms). After that → fail
  fullyParallel: true, // run tests in parallel
  workers: process.env.CI ? 2 : 1, // number of workers to use for parallel execution
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // list set of browser you want to use the test execution on multiple browser
    {
      name: 'chromium', //if you want to run on only one browser npx playwright test --project=chromium
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.ts/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.ts/,
    },
  ],
  use: {
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
});
