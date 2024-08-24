import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Global timeout for each test
  timeout: 30000,

  // Test directory
  testDir: './tests',

  // Use the default test options
  use: {
    baseURL: 'http://localhost:5173', // Base URL for all tests
    browserName: 'chromium', // Browser to use
  },

  // Projects to test on different browsers
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'],
      baseURL: 'http://localhost:5173', // Base URL for all tests 
      headless: false,
      viewport: { width: 1280, height: 720 },
      trace: 'on',
      },
    
    }
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Reporters for test results
  reporter: [
    ['list'], // Output in the terminal
    ['html', { outputFolder: 'test-results/html-report' }], // Generate an HTML report
  ],

  // Add additional configurations here as needed
});
