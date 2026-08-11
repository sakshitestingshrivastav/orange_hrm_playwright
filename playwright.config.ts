import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
    testDir: './tests',
    reporter : 'html',    // view the report with npx playwright show-report
    retries: 1,             // retries once more before reporting failure
    timeout: 60_000,   //One test can run max 60 seconds (60,000 ms). After that → fail
    projects: [             // list set of browser you want to use the test execution on multiple browser
        {
          name: 'chromium',     //if you want to run on only one browser npx playwright test --project=chromium
          use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
          }
      ],
    use : {
        baseURL: process.env.BASE_URL,
        screenshot : "only-on-failure",
        video: 'retain-on-failure',
        trace: 'on-first-retry',
    }
})