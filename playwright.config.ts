import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  expect: {
    timeout: 10 * 1000, // 10 seconds
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: process.env.CI ? 1 : undefined,
//  reporter: 'html',
  reporter: [['junit', { outputFile: 'results.xml' }]],
  use: {
    trace: 'on-first-retry',
    timeout: 60 * 1000,

  },

  /* Configure projects for major browsers */
  projects: [

    {
      name: 'chromium',
      use: { 
          baseURL: 'http://localhost:5173',
        ...devices['Desktop Chrome'],
        //viewport: null
      }
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 180 * 1000,
  },


});