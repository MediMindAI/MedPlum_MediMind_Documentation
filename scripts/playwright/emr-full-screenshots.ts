import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3005';
const SCREENSHOT_DIR = path.join(__dirname, '../../images');
const CREDENTIALS = {
  email: 'admin@medimind.ge',
  password: 'MediMind2024'
};

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function login(page: Page): Promise<void> {
  console.log('Logging in...');
  await page.goto(`${BASE_URL}/signin`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const emailInput = page.locator('input[placeholder*="@"], input[type="email"], input[name="email"]').first();
  await emailInput.fill(CREDENTIALS.email);
  await page.waitForTimeout(500);

  const nextBtn = page.locator('button:has-text("Next"), button:has-text("Continue"), button[type="submit"]').first();
  await nextBtn.click();
  await page.waitForTimeout(2000);

  const passwordInput = page.locator('input[type="password"]').first();
  await passwordInput.fill(CREDENTIALS.password);
  await page.waitForTimeout(500);

  const signInBtn = page.locator('button:has-text("Sign in"), button:has-text("Login"), button[type="submit"]').first();
  await signInBtn.click();
  await page.waitForTimeout(3000);

  console.log('Login complete. Current URL:', page.url());
}

async function setLanguage(page: Page, lang: string): Promise<void> {
  console.log(`Setting language to: ${lang}`);
  await page.evaluate((l) => {
    localStorage.setItem('language', l);
    localStorage.setItem('i18nextLng', l);
  }, lang);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
}

async function saveScreenshot(page: Page, name: string, lang: string): Promise<void> {
  const filename = `${name}-${lang}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: filepath });
  console.log(`✓ ${filename}`);
}

async function saveElementScreenshot(page: Page, selector: string, name: string, lang: string): Promise<boolean> {
  const filename = `${name}-${lang}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);

  try {
    const element = page.locator(selector).first();
    if (await element.isVisible({ timeout: 3000 })) {
      await element.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await element.screenshot({ path: filepath });
      console.log(`✓ ${filename} (element: ${selector})`);
      return true;
    }
  } catch {}

  // Fallback to viewport screenshot
  await page.screenshot({ path: filepath });
  console.log(`✓ ${filename} (viewport fallback)`);
  return false;
}

const languages = ['en', 'ru', 'ka'];

async function captureAllScreenshots(): Promise<void> {
  console.log('Starting comprehensive EMR screenshot capture...\n');

  const browser: Browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: 50,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const page: Page = await context.newPage();

  try {
    await login(page);

    for (const lang of languages) {
      console.log(`\n=== Capturing screenshots for ${lang.toUpperCase()} ===`);

      // Navigate to registration page
      await page.goto(`${BASE_URL}/emr/registration/registration`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await setLanguage(page, lang);

      // 1. Main screenshot
      await saveScreenshot(page, 'screenshot', lang);

      // 2. Hero search - look for search input at top
      await saveElementScreenshot(page, 'input[type="search"], input[placeholder*="search" i], [class*="search-input"]', 'hero-search', lang);

      // 3. Try to open advanced filters if there's a button
      try {
        const advBtn = page.locator('button:has-text("Advanced"), button:has-text("Filter"), [class*="filter"]').first();
        if (await advBtn.isVisible({ timeout: 2000 })) {
          await advBtn.click();
          await page.waitForTimeout(1000);
        }
      } catch {}
      await saveScreenshot(page, 'advanced-filters', lang);

      // 4. Patient lookup section
      await saveElementScreenshot(page, '[class*="lookup"], input[placeholder*="ID" i], [class*="personal-id"]', 'patient-lookup', lang);

      // 5. Unified form - full page view
      const formFilename = `unified-form-${lang}.png`;
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, formFilename), fullPage: true });
      console.log(`✓ ${formFilename} (fullpage)`);

      // 6. Desktop sidebar
      await saveElementScreenshot(page, 'aside, [class*="sidebar"], [class*="Sidebar"]', 'desktop-sidebar', lang);

      // 7. Scroll to find form sections
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(500);

      // 8. Registration section
      await saveElementScreenshot(page, '[class*="registration"], [class*="visit-type"], [class*="Registration"]', 'registration-section', lang);

      // 9. Scroll more to find insurance
      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForTimeout(500);

      // 10. Insurance section
      await saveElementScreenshot(page, '[class*="insurance"], [class*="Insurance"], [class*="coverage"]', 'insurance-section', lang);

      // 11. Document upload / Guarantee section
      await page.evaluate(() => window.scrollTo(0, 1500));
      await page.waitForTimeout(500);
      await saveElementScreenshot(page, '[class*="upload"], [class*="document"], [class*="guarantee"], [class*="Guarantee"]', 'document-upload', lang);

      // 12. Demographics section
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);
      await saveElementScreenshot(page, '[class*="demographics"], [class*="Demographics"]', 'demographics-section', lang);

      // 13. Look for draft indicator
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      await saveElementScreenshot(page, '[class*="draft"], [class*="Draft"], [class*="autosave"]', 'draft-indicator', lang);

      // 14. Try to trigger active visit warning (if possible)
      // This usually requires selecting a patient with an active visit
      await saveScreenshot(page, 'active-visit-warning', lang);

      // 15. Mobile wizard - resize viewport
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(1000);
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await saveScreenshot(page, 'mobile-wizard', lang);

      // Reset viewport for next language
      await page.setViewportSize({ width: 1440, height: 900 });
    }

    console.log('\n✓ All screenshots captured!');
    console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

captureAllScreenshots().catch(console.error);
