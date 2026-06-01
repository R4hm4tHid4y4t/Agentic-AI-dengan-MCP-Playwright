/**
 * Playwright Configuration untuk SelempangKu
 * =============================================
 * Docs: https://playwright.dev/docs/test-configuration
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Direktori test
  testDir: './tests',

  // Timeout global per test
  timeout: 30 * 1000,  // 30 detik

  // Timeout untuk assertion
  expect: {
    timeout: 10000  // 10 detik
  },

  // Jalankan tests secara parallel
  fullyParallel: false,

  // Gagalkan jika ada test.only di CI
  forbidOnly: !!process.env.CI,

  // Retry di CI
  retries: process.env.CI ? 2 : 0,

  // Workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['line'],
  ],

  // Shared settings untuk semua tests
  use: {
    // Base URL website SelempangKu
    baseURL: process.env.BASE_URL || 'https://r4hid2307.alwaysdata.net',

    // Timeout untuk setiap aksi
    actionTimeout: 15000,

    // Timeout navigasi (website free hosting bisa lambat)
    navigationTimeout: 30000,

    // Ambil screenshot saat test gagal
    screenshot: 'only-on-failure',

    // Simpan trace saat test gagal (untuk debugging)
    trace: 'retain-on-failure',

    // Viewport default
    viewport: { width: 1280, height: 720 },

    // Accept semua language
    locale: 'id-ID',

    // Timezone Indonesia
    timezoneId: 'Asia/Jakarta',
  },

  // Konfigurasi browser
  projects: [
    // Desktop Chrome (Primary)
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chromium',
      },
    },

    // Mobile Chrome
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },

    // Mobile Safari (iPhone)
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 13'],
      },
    },
  ],

  // Folder untuk output
  outputDir: 'tests/screenshots',
});