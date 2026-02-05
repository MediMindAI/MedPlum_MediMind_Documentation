import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as http from 'http';

const PID_FILE = '/tmp/playwright-server.pid';
const STATE_FILE = '/tmp/playwright-state.json';
const PORT = 9222;

let browser: Browser | null = null;
let page: Page | null = null;

async function initBrowser() {
  browser = await chromium.launch({
    headless: false, // visible for debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  page = await context.newPage();
  console.log('Browser initialized');
}

async function handleCommand(cmd: string, args: string[]): Promise<any> {
  if (!page) throw new Error('Page not initialized');

  switch (cmd) {
    case 'navigate':
      await page.goto(args[0], { waitUntil: 'networkidle', timeout: 30000 });
      return { url: page.url(), title: await page.title() };

    case 'fill':
      await page.fill(args[0], args[1]);
      return { filled: args[0] };

    case 'click':
      if (args[1] === '--double') {
        await page.dblclick(args[0]);
      } else {
        await page.click(args[0]);
      }
      return { clicked: args[0] };

    case 'screenshot':
      const name = args[0];
      const fullPage = args[1] === '--fullpage';
      const dir = '/Users/toko/Desktop/MedPlum_MediMind_Documentation-main/images';
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const path = `${dir}/${name}.png`;
      await page.screenshot({ path, fullPage });
      return { saved: path };

    case 'wait':
      await page.waitForTimeout(parseInt(args[0]));
      return { waited: args[0] };

    case 'waitfor':
      await page.waitForSelector(args[0], { timeout: 10000 });
      return { found: args[0] };

    case 'text':
      const text = await page.textContent(args[0]);
      return { text };

    case 'url':
      return { url: page.url() };

    case 'evaluate':
      const result = await page.evaluate(args[0]);
      return { result };

    case 'scroll':
      await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      }, args[0]);
      return { scrolled: args[0] };

    case 'viewport':
      const width = parseInt(args[0]);
      const height = parseInt(args[1]);
      await page.setViewportSize({ width, height });
      return { viewport: `${width}x${height}` };

    case 'stop':
      if (browser) await browser.close();
      process.exit(0);

    default:
      throw new Error(`Unknown command: ${cmd}`);
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { cmd, args } = JSON.parse(body);
        const result = await handleCommand(cmd, args || []);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(200);
    res.end('Playwright server running');
  }
});

async function main() {
  await initBrowser();
  fs.writeFileSync(PID_FILE, process.pid.toString());
  server.listen(PORT, () => {
    console.log(`Playwright server listening on port ${PORT}`);
  });
}

main().catch(console.error);
