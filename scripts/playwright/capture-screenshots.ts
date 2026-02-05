import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:8080';
const SCREENSHOT_DIR = path.join(__dirname, '../../images');

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

interface ScreenshotConfig {
  name: string;
  route: string;
  selector?: string;
  waitFor?: string;
  fullPage?: boolean;
}

const screenshots: ScreenshotConfig[] = [
  // Main screenshot
  { name: 'screenshot', route: '#/patient-registration/overview', fullPage: false },

  // Hero search
  { name: 'hero-search', route: '#/patient-registration/registration', waitFor: '#search', fullPage: false },

  // Advanced filters (same page, different section)
  { name: 'advanced-filters', route: '#/patient-registration/registration', waitFor: '#advanced-filters', fullPage: false },

  // Patient lookup
  { name: 'patient-lookup', route: '#/patient-registration/registration', waitFor: '#patient-lookup', fullPage: false },

  // Unified form
  { name: 'unified-form', route: '#/patient-registration/registration', waitFor: '#form-sections', fullPage: false },

  // Draft indicator
  { name: 'draft-indicator', route: '#/patient-registration/registration', waitFor: '#draft-autosave', fullPage: false },

  // Document upload
  { name: 'document-upload', route: '#/patient-registration/registration', waitFor: '#document-upload', fullPage: false },

  // Desktop sidebar
  { name: 'desktop-sidebar', route: '#/patient-registration/registration', waitFor: '#desktop-sidebar', fullPage: false },

  // Mobile wizard
  { name: 'mobile-wizard', route: '#/patient-registration/registration', waitFor: '#mobile-wizard', fullPage: false },

  // Registration section
  { name: 'registration-section', route: '#/patient-registration/registration', waitFor: '#registration-section', fullPage: false },

  // Insurance section
  { name: 'insurance-section', route: '#/patient-registration/registration', waitFor: '#insurance', fullPage: false },

  // Active visit warning
  { name: 'active-visit-warning', route: '#/patient-registration/registration', waitFor: '#active-visit-warning', fullPage: false },

  // Demographics section
  { name: 'demographics-section', route: '#/patient-registration/registration', waitFor: '#demographics', fullPage: false },
];

const languages = ['en', 'ru', 'ka'];

async function setLanguage(page: Page, lang: string): Promise<void> {
  // Click the language button
  const langButton = await page.$(`button[data-lang="${lang}"], [onclick*="setLanguage('${lang}')"], .lang-btn[data-lang="${lang}"]`);
  if (langButton) {
    await langButton.click();
    await page.waitForTimeout(1000); // Wait for language to change
  } else {
    // Try clicking by text content
    const buttons = await page.$$('button, .lang-btn');
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text?.toUpperCase().includes(lang.toUpperCase())) {
        await btn.click();
        await page.waitForTimeout(1000);
        break;
      }
    }
  }
}

async function captureScreenshots(): Promise<void> {
  console.log('Starting screenshot capture...');

  const browser: Browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // Retina display
  });

  const page: Page = await context.newPage();

  try {
    // Navigate to the site first
    console.log(`Navigating to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    for (const lang of languages) {
      console.log(`\nCapturing screenshots for language: ${lang.toUpperCase()}`);

      // Set language
      await setLanguage(page, lang);
      await page.waitForTimeout(1500);

      for (const config of screenshots) {
        const filename = `${config.name}-${lang}.png`;
        const filepath = path.join(SCREENSHOT_DIR, filename);

        try {
          // Navigate to the route
          const url = `${BASE_URL}/${config.route}`;
          console.log(`  Capturing: ${filename}`);

          await page.goto(url, { waitUntil: 'networkidle' });
          await page.waitForTimeout(1000);

          // Set language again after navigation
          await setLanguage(page, lang);
          await page.waitForTimeout(500);

          // Wait for specific element if specified
          if (config.waitFor) {
            try {
              await page.waitForSelector(config.waitFor, { timeout: 5000 });
              // Scroll to the element
              await page.evaluate((selector) => {
                const el = document.querySelector(selector);
                if (el) {
                  el.scrollIntoView({ behavior: 'instant', block: 'center' });
                }
              }, config.waitFor);
              await page.waitForTimeout(500);
            } catch (e) {
              console.log(`    Warning: Element ${config.waitFor} not found, taking screenshot anyway`);
            }
          }

          // Take screenshot
          await page.screenshot({
            path: filepath,
            fullPage: config.fullPage ?? false,
          });

          console.log(`    ✓ Saved: ${filename}`);
        } catch (error) {
          console.error(`    ✗ Failed: ${filename} - ${error}`);
        }
      }
    }

    console.log('\n✓ Screenshot capture complete!');
    console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);

  } finally {
    await browser.close();
  }
}

// Run the script
captureScreenshots().catch(console.error);
