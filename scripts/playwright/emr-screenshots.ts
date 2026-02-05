import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3005';
const SCREENSHOT_DIR = path.join(__dirname, '../../images');
const CREDENTIALS = {
  email: 'admin@medimind.ge',
  password: 'MediMind2024'
};

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function login(page: Page): Promise<void> {
  console.log('Logging in...');
  await page.goto(`${BASE_URL}/signin`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Fill email
  const emailInput = page.locator('input[placeholder*="@"], input[type="email"], input[name="email"]').first();
  await emailInput.fill(CREDENTIALS.email);
  await page.waitForTimeout(500);

  // Click next/continue button
  const nextBtn = page.locator('button:has-text("Next"), button:has-text("Continue"), button[type="submit"]').first();
  await nextBtn.click();
  await page.waitForTimeout(2000);

  // Fill password
  const passwordInput = page.locator('input[type="password"]').first();
  await passwordInput.fill(CREDENTIALS.password);
  await page.waitForTimeout(500);

  // Click sign in button
  const signInBtn = page.locator('button:has-text("Sign in"), button:has-text("Login"), button[type="submit"]').first();
  await signInBtn.click();
  await page.waitForTimeout(3000);

  console.log('Login complete. Current URL:', page.url());
}

async function setLanguage(page: Page, lang: string): Promise<void> {
  console.log(`Setting language to: ${lang}`);

  // Try different language switcher patterns
  try {
    // Look for language dropdown or buttons
    const langBtn = page.locator(`button[data-lang="${lang}"], [data-language="${lang}"], button:has-text("${lang.toUpperCase()}")`).first();
    if (await langBtn.isVisible({ timeout: 2000 })) {
      await langBtn.click();
      await page.waitForTimeout(1500);
      return;
    }
  } catch {}

  // Try localStorage approach
  await page.evaluate((l) => {
    localStorage.setItem('language', l);
    localStorage.setItem('i18nextLng', l);
  }, lang);

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
}

interface ScreenshotConfig {
  name: string;
  description: string;
  setup?: (page: Page) => Promise<void>;
  selector?: string;
  fullPage?: boolean;
}

const screenshots: ScreenshotConfig[] = [
  {
    name: 'hero-search',
    description: 'Patient search hero section',
    selector: '[class*="search"], [class*="Search"], input[placeholder*="search" i]',
  },
  {
    name: 'patient-lookup',
    description: 'Patient lookup by ID section',
    selector: '[class*="lookup"], [class*="Lookup"], input[placeholder*="ID" i]',
  },
  {
    name: 'unified-form',
    description: 'Complete registration form view',
    fullPage: true,
  },
  {
    name: 'desktop-sidebar',
    description: 'Today\'s visits and recent patients sidebar',
    selector: '[class*="sidebar"], [class*="Sidebar"], aside',
  },
  {
    name: 'registration-section',
    description: 'Registration/visit section of form',
    selector: '[class*="registration"], [class*="Registration"], [class*="visit" i]',
  },
  {
    name: 'insurance-section',
    description: 'Insurance coverage section',
    selector: '[class*="insurance"], [class*="Insurance"], [class*="coverage" i]',
  },
  {
    name: 'document-upload',
    description: 'Document upload/guarantee section',
    selector: '[class*="upload"], [class*="Upload"], [class*="document" i], [class*="guarantee" i]',
  },
];

const languages = ['en', 'ru', 'ka'];

async function captureScreenshots(): Promise<void> {
  console.log('Starting EMR screenshot capture...\n');

  const browser: Browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: 100,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const page: Page = await context.newPage();

  try {
    // Login first
    await login(page);

    // Navigate to registration page
    console.log('\nNavigating to registration page...');
    await page.goto(`${BASE_URL}/emr/registration/registration`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('Current URL:', page.url());

    // Take a debug screenshot first
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'debug-registration-page.png'),
      fullPage: true
    });
    console.log('Debug screenshot saved');

    for (const lang of languages) {
      console.log(`\n=== Capturing screenshots for ${lang.toUpperCase()} ===`);

      await setLanguage(page, lang);
      await page.waitForTimeout(2000);

      // Main page screenshot
      const mainFilename = `screenshot-${lang}.png`;
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, mainFilename),
        fullPage: false
      });
      console.log(`✓ ${mainFilename}`);

      // Full page screenshot
      const fullFilename = `full-page-${lang}.png`;
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, fullFilename),
        fullPage: true
      });
      console.log(`✓ ${fullFilename}`);

      // Try to capture specific sections
      for (const config of screenshots) {
        const filename = `${config.name}-${lang}.png`;
        const filepath = path.join(SCREENSHOT_DIR, filename);

        try {
          if (config.selector) {
            const element = page.locator(config.selector).first();
            if (await element.isVisible({ timeout: 3000 })) {
              await element.scrollIntoViewIfNeeded();
              await page.waitForTimeout(500);
              await element.screenshot({ path: filepath });
              console.log(`✓ ${filename} (element)`);
            } else {
              // Take viewport screenshot instead
              await page.screenshot({ path: filepath });
              console.log(`✓ ${filename} (viewport - element not found)`);
            }
          } else if (config.fullPage) {
            await page.screenshot({ path: filepath, fullPage: true });
            console.log(`✓ ${filename} (fullpage)`);
          } else {
            await page.screenshot({ path: filepath });
            console.log(`✓ ${filename}`);
          }
        } catch (err) {
          console.log(`✗ ${filename} - ${err}`);
        }
      }
    }

    console.log('\n✓ Screenshot capture complete!');
    console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);

  } catch (err) {
    console.error('Error during capture:', err);
    // Take error screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'error-screenshot.png'),
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
