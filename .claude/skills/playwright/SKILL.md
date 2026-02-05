---
name: playwright-automation
description: Browser automation via server.ts + cmd.ts. Use for screenshots, web scraping, form filling, navigation. Token-efficient alternative to MCP.
version: 3.0.0
---

# Playwright Browser Automation

This skill provides browser automation through a persistent server architecture.

## CRITICAL: Use Server + cmd.ts ONLY

**NEVER use standalone scripts** - they were removed because each launched a new browser causing SingletonLock conflicts!

**ALWAYS use:**
- `server.ts` - Keeps ONE browser alive in background
- `cmd.ts` - Sends commands to that browser

## Quick Start

```bash
# 1. Start server (runs in background)
npx tsx scripts/playwright/server.ts &
sleep 3

# 2. Send commands via cmd.ts
npx tsx scripts/playwright/cmd.ts navigate "https://example.com"
npx tsx scripts/playwright/cmd.ts fill "#username" "user"
npx tsx scripts/playwright/cmd.ts click "button"
npx tsx scripts/playwright/cmd.ts screenshot "page-name"
npx tsx scripts/playwright/cmd.ts wait 1000

# 3. Stop when done
npx tsx scripts/playwright/cmd.ts stop
```

## Available Commands

| Command | Usage | Description |
|---------|-------|-------------|
| navigate | `cmd.ts navigate "url"` | Go to URL (waits for networkidle) |
| fill | `cmd.ts fill "selector" "value"` | Fill input field (**single selector only**) |
| click | `cmd.ts click "selector"` | Click element (supports CSS and `text=` selectors) |
| click --double | `cmd.ts click "selector" --double` | Double-click |
| screenshot | `cmd.ts screenshot "name"` | Save to `images/name.png` (auto-appends .png) |
| screenshot --fullpage | `cmd.ts screenshot "name" --fullpage` | Full page screenshot |
| wait | `cmd.ts wait 2000` | Wait milliseconds |
| waitfor | `cmd.ts waitfor "selector"` | Wait for element (supports `text=` selectors) |
| text | `cmd.ts text "selector"` | Get text content |
| url | `cmd.ts url` | Get current URL |
| evaluate | `cmd.ts evaluate "script"` | Run JavaScript in browser context |
| scroll | `cmd.ts scroll "css-selector"` | Scroll element into view (**CSS selectors only**) |
| viewport | `cmd.ts viewport 1440 900` | Set viewport width and height |
| stop | `cmd.ts stop` | Stop server |

## Common Workflows

### Login to a Website
```bash
npx tsx scripts/playwright/server.ts &
sleep 3
npx tsx scripts/playwright/cmd.ts navigate "https://app.example.com/login"
npx tsx scripts/playwright/cmd.ts fill "#username" "myuser"
npx tsx scripts/playwright/cmd.ts fill "#password" "mypass"
npx tsx scripts/playwright/cmd.ts click "button[type=submit]"
npx tsx scripts/playwright/cmd.ts wait 2000
npx tsx scripts/playwright/cmd.ts screenshot "logged-in"
```

### Extract DOM Data
```bash
# Get all form inputs
npx tsx scripts/playwright/cmd.ts evaluate "JSON.stringify(Array.from(document.querySelectorAll('input,select')).map(e=>({id:e.id,name:e.name,type:e.type})))"

# Get dropdown options
npx tsx scripts/playwright/cmd.ts evaluate "JSON.stringify(Array.from(document.querySelectorAll('select')).map(s=>({id:s.id,options:Array.from(s.options).map(o=>({v:o.value,t:o.text}))})))"

# Get all buttons
npx tsx scripts/playwright/cmd.ts evaluate "JSON.stringify(Array.from(document.querySelectorAll('button,[onclick]')).map(b=>({id:b.id,text:b.textContent?.trim(),onclick:b.getAttribute('onclick')})))"
```

### Take Full Page Screenshot
```bash
npx tsx scripts/playwright/cmd.ts navigate "https://example.com"
npx tsx scripts/playwright/cmd.ts wait 1000
npx tsx scripts/playwright/cmd.ts screenshot "full-page" --fullpage
```

## Output Format

All commands output JSON:

```json
{
  "url": "https://example.com",
  "title": "Page Title"
}
```

## State Management

- Browser state persists while server runs
- Screenshots saved to: `images/` in project root (hardcoded in server.ts)
- Server PID: `/tmp/playwright-server.pid`
- Default viewport: 1440x900 with deviceScaleFactor: 2

## Troubleshooting

**Server not running:**
```bash
npx tsx scripts/playwright/server.ts &
sleep 3
```

**Stale PID file:**
```bash
rm /tmp/playwright-server.pid
npx tsx scripts/playwright/server.ts &
```

**Kill all instances (nuclear option):**
```bash
pkill -9 -f Chromium; pkill -9 -f playwright
rm -rf /var/folders/*/T/playwright-user-data
rm -f /tmp/playwright-*.json /tmp/playwright-*.pid
```

## Token Efficiency

| Approach | Initial Cost | Per-Operation |
|----------|-------------|---------------|
| MCP      | ~10,000 tokens | Output only |
| Scripts  | ~100 tokens (this skill) | Output only |

**Savings: ~99% reduction in baseline token consumption**

## Known Limitations (Verified via Testing)

| # | Limitation | Workaround |
|---|-----------|------------|
| 1 | `fill` does NOT support comma-separated selectors | Use a SINGLE selector per `fill` call |
| 2 | `scroll` only supports CSS selectors, NOT `text=` | Use `evaluate` + `el.scrollIntoView()` for text-based scroll targets |
| 3 | `screenshot` auto-appends `.png` | Never include `.png` in the name argument |
| 4 | `--fullpage` does NOT capture scroll container content | The EMR form is inside a scrollable `div`, not the page body. Use `evaluate` to set container `scrollTop` + regular screenshots instead |
| 5 | `evaluate` shell quoting | Use **single quotes** outside, **double quotes** inside. Backticks and `\u` escapes get mangled by bash |
| 6 | React `.click()` via evaluate may not trigger handlers | Some elements need Playwright native `click` command; form section headers specifically need `.emr-form-section-header-left` clicked |

### evaluate Shell Quoting Rules

```bash
# CORRECT — single quotes outside, double quotes inside:
npx tsx scripts/playwright/cmd.ts evaluate 'document.querySelector("div").textContent'

# CORRECT — escaped double quotes inside double-quoted shell string:
npx tsx scripts/playwright/cmd.ts evaluate "document.querySelector('div').textContent"

# WRONG — backtick template literals break in shell:
npx tsx scripts/playwright/cmd.ts evaluate "(() => { ... })()"  # Broken if contains backticks

# WRONG — \u unicode escapes get eaten by shell:
npx tsx scripts/playwright/cmd.ts evaluate "/[\u10A0-\u10FF]/.test('x')"  # Fails
```

## MediMind EMR Patterns

### Login Flow (Verified)
```bash
# Port: try 3000 first, fallback to 3005
npx tsx scripts/playwright/cmd.ts navigate "http://localhost:3000"
# If "Error: net::ERR_CONNECTION_REFUSED" → try 3005

# Step 1: Email (input has no name attr — use placeholder)
npx tsx scripts/playwright/cmd.ts fill "input[placeholder='name@domain.com']" "admin@medimind.ge"
npx tsx scripts/playwright/cmd.ts click "button[type='submit']"
npx tsx scripts/playwright/cmd.ts wait 2000

# Step 2: Password
npx tsx scripts/playwright/cmd.ts fill "input[type='password']" "MediMind2024"
npx tsx scripts/playwright/cmd.ts click "button[type='submit']"
npx tsx scripts/playwright/cmd.ts wait 3000

# Navigate to registration
npx tsx scripts/playwright/cmd.ts navigate "http://localhost:3000/emr/registration/registration"
```

### Language Switching (use `text=` selectors, NOT `button:has-text`)
```bash
npx tsx scripts/playwright/cmd.ts click "text=ENG"    # English
npx tsx scripts/playwright/cmd.ts click "text=ქარ"    # Georgian
npx tsx scripts/playwright/cmd.ts click "text=РУС"    # Russian
npx tsx scripts/playwright/cmd.ts wait 2000            # Always wait after switch
```

### EMR Form Section Expansion (use evaluate, NOT click command)

The registration form has 8 collapsible sections. Click target is `.emr-form-section-header-left` (NOT the outer `.emr-form-section-header`).

```bash
# List all 8 section headers with indices:
npx tsx scripts/playwright/cmd.ts evaluate 'JSON.stringify(Array.from(document.querySelectorAll(".emr-form-section-header")).map(function(e,i){return {i:i, text:e.textContent.trim().substring(0,25)}}))'

# Expand a section by index (e.g., index 5 = Insurance):
npx tsx scripts/playwright/cmd.ts evaluate 'document.querySelectorAll(".emr-form-section-header-left")[5].click()'
npx tsx scripts/playwright/cmd.ts wait 1000

# Verify it expanded:
npx tsx scripts/playwright/cmd.ts evaluate 'var s = document.querySelectorAll(".emr-form-section")[5]; s.classList.contains("open") + " h=" + s.querySelector(".emr-form-section-content").offsetHeight'
```

**Section Index (as of 2026-02-05):**

| Index | English Name | Georgian Name | Default State |
|-------|-------------|---------------|---------------|
| 0 | Personal Information | Personal Information | Open (282px) |
| 1 | Contact Information | Contact Information | Closed |
| 2 | Additional Details | Additional Details | Closed |
| 3 | Guardian/Representative | Guardian/Representative | Closed |
| 4 | Registration | რეგისტრაცია | Open (198px) |
| 5 | Insurance | დაზღვევა | Open but empty (32px, needs enable toggle) |
| 6 | Guarantee | საგარანტიო | Closed |
| 7 | Demographics | დემოგრაფია | Open (255px) |

**Important:** Sections 4-7 have Georgian labels even when UI is switched to English. This is the EMR app's incomplete i18n, not a capture bug.

### Scrolling Inside the Form Container

The form is inside a scrollable `div[class*="transitionContainer"]`. Page-level scroll and `--fullpage` do NOT reach form sections.

```bash
# Find the scroll container:
npx tsx scripts/playwright/cmd.ts evaluate 'var c = document.querySelector("div[class*=transitionContainer]"); JSON.stringify({sh: c.scrollHeight, ch: c.clientHeight})'

# Scroll to a position:
npx tsx scripts/playwright/cmd.ts evaluate 'var c = document.querySelector("div[class*=transitionContainer]"); c.scrollTop = 800; "scrolled to " + c.scrollTop'

# Scroll a specific section into view:
npx tsx scripts/playwright/cmd.ts evaluate 'document.querySelectorAll(".emr-form-section-header")[4].scrollIntoView({behavior:"instant",block:"start"})'
```

### Screenshot Verification Workflow
1. Take screenshot
2. Read the image with Read tool
3. Verify content, language, aspect ratio
4. If wrong, diagnose and retake
