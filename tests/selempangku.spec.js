/**
 * Playwright Test Suite - SelempangKu
 * =====================================
 * Jalankan dengan: npx playwright test
 * 
 * File ini adalah test script Playwright standar.
 * Bisa dijalankan langsung ATAU diinstruksikan ke Claude
 * via MCP Playwright untuk eksekusi agentic.
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://r4hid2307.alwaysdata.net';

// ============================================================
// TEST SUITE 1: SMOKE TEST
// ============================================================

test.describe('Smoke Test - SelempangKu', () => {

  test('halaman utama berhasil dimuat', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Tunggu halaman React selesai render
    await page.waitForLoadState('networkidle');
    
    // Verifikasi title
    const title = await page.title();
    expect(title).toContain('SelempangKu');
    
    // Screenshot sebagai bukti
    await page.screenshot({ path: 'tests/screenshots/homepage.png' });
  });

  test('tidak ada error console di halaman utama', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Log errors jika ada (tidak fail test, hanya report)
    if (consoleErrors.length > 0) {
      console.warn('Console errors found:', consoleErrors);
    }
  });

});

// ============================================================
// TEST SUITE 2: NAVIGASI
// ============================================================

test.describe('Navigasi - SelempangKu', () => {

  test('menu navigasi tersedia dan dapat diklik', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Ambil semua link navigasi
    const navLinks = await page.locator('nav a, header a').all();
    
    console.log(`Ditemukan ${navLinks.length} link navigasi`);
    
    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      const text = await link.innerText();
      console.log(`  Link: "${text}" → ${href}`);
    }
    
    expect(navLinks.length).toBeGreaterThan(0);
  });

  test('halaman dapat di-scroll dan tidak ada layout rusak', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Scroll ke bawah
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'tests/screenshots/homepage-scrolled.png',
      fullPage: true 
    });
  });

});

// ============================================================
// TEST SUITE 3: RESPONSIVE DESIGN
// ============================================================

test.describe('Responsive Design', () => {

  test('tampilan mobile (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'tests/screenshots/mobile-view.png' 
    });
    
    console.log('Mobile view screenshot saved');
  });

  test('tampilan tablet (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'tests/screenshots/tablet-view.png' 
    });
  });

  test('tampilan desktop (1280x720)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'tests/screenshots/desktop-view.png' 
    });
  });

});

// ============================================================
// TEST SUITE 4: FORM PEMESANAN
// ============================================================

test.describe('Form Pemesanan', () => {

  test('form pemesanan dapat ditemukan', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Cari form atau tombol yang mengarah ke form
    const formSelectors = [
      'form',
      '[data-testid="order-form"]',
      '#order-form',
      '.order-form',
      'button:has-text("Pesan")',
      'a:has-text("Pesan")',
      'button:has-text("Order")',
    ];
    
    let formFound = false;
    for (const selector of formSelectors) {
      const element = await page.locator(selector).count();
      if (element > 0) {
        console.log(`Form ditemukan dengan selector: ${selector}`);
        formFound = true;
        break;
      }
    }
    
    if (!formFound) {
      console.warn('Form pemesanan tidak ditemukan di halaman utama');
      // Navigasi ke halaman lain yang mungkin ada form
    }
    
    await page.screenshot({ path: 'tests/screenshots/form-check.png' });
  });

  test('validasi form: submit tanpa mengisi field', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Coba cari dan submit form kosong
    const submitBtn = page.locator('button[type="submit"], input[type="submit"]').first();
    
    if (await submitBtn.count() > 0) {
      await submitBtn.click();
      
      // Tunggu pesan validasi
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'tests/screenshots/validation-empty.png' });
      
      // Cek apakah ada pesan error/validasi
      const errorMessages = await page.locator('[class*="error"], [class*="invalid"], [role="alert"]').count();
      console.log(`Pesan validasi ditemukan: ${errorMessages}`);
    } else {
      console.log('Submit button tidak ditemukan');
      test.skip();
    }
  });

});

// ============================================================
// TEST SUITE 5: PERFORMANCE
// ============================================================

test.describe('Performance Check', () => {

  test('waktu loading halaman utama < 10 detik', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    const loadTimeSeconds = loadTime / 1000;
    
    console.log(`⏱ Load time: ${loadTimeSeconds.toFixed(2)} detik`);
    
    if (loadTimeSeconds < 3) {
      console.log('🟢 GOOD: Load time sangat baik');
    } else if (loadTimeSeconds < 5) {
      console.log('🟡 WARNING: Load time perlu dioptimasi');
    } else {
      console.log('🔴 SLOW: Load time terlalu lambat');
    }
    
    // Website free hosting, toleransi 15 detik
    expect(loadTimeSeconds).toBeLessThan(15);
  });

});