---
name: doc-pipeline
description: >
  End-to-end documentation pipeline. Takes natural language input describing what
  to document, then automatically orchestrates the full workflow: resolves sections,
  plans screenshots, writes/updates HTML documentation, captures screenshots via
  Playwright, verifies everything to 100%. Use when documenting new EMR features,
  updating existing docs, or batch-processing multiple sections.
version: 3.2.0
---

# Documentation Pipeline Orchestrator

Automates the full documentation lifecycle for MediMind EMR sections.

**Input:** Natural language description of what to document
**Output:** Complete documentation with screenshots in all 3 languages (en, ka, ru)
**Pipeline:** RESOLVE → PLAN → DOCUMENT → CAPTURE → VERIFY → FINAL

## When to Use

- Documenting a new EMR feature end-to-end
- Adding screenshots to existing documentation sections
- Batch-documenting multiple sections at once
- Creating full documentation for a new module

## Invocation

```
/doc-pipeline <natural language description>
```

**Examples:**
```
/doc-pipeline Document the patient search and registration features
/doc-pipeline Create documentation for overview and features sections
/doc-pipeline Add docs for the insurance wizard
/doc-pipeline Document all patient registration sections
/doc-pipeline Resume — check screenshot-plans/_index.json and continue
```

---

## Phase 1: RESOLVE

**Who:** Main agent (you), no sub-agents needed.

Parse the user's natural language input and map it to concrete section IDs.

### Resume Check (do this FIRST)

If the user said "Resume" or the pipeline was previously started:
1. Read `screenshot-plans/_index.json`
2. Read `images/` directory to see what files exist
3. Determine which phase to resume from:
   - If no plan JSONs exist → resume from Phase 2
   - If plan JSONs exist but no images → resume from Phase 4
   - If some images exist → resume Phase 4 (skip already-captured, check plan status fields)
   - If all images exist → resume from Phase 5
4. Skip to the appropriate phase below

### Concurrent Run Guard

Check for an active pipeline before proceeding:
```
If screenshot-plans/.pipeline.lock exists:
  Read the file (contains PID and timestamp)
  If the process is still running → ABORT: "Another pipeline is already running"
  If the process is dead → delete stale lockfile and continue
Create screenshot-plans/.pipeline.lock with current PID and timestamp
```
**Remember to delete this lockfile at the end of Phase 6.**

### Cleanup Stale Reports

Delete old verification/report files from previous runs so they don't interfere:
```
rm -f screenshot-plans/_html-verification.md
rm -f screenshot-plans/_i18n-verification.md
rm -f screenshot-plans/_image-validation.md
rm -f screenshot-plans/_capture-report.md
rm -f screenshot-plans/_completion-report.md
rm -f screenshot-plans/_doc-report-*.md
```

### Steps (for fresh runs)

1. **Read the manifest:**
   ```
   Read config/manifest.json
   ```

2. **Read the TOC translations for fuzzy matching:**
   ```
   Read i18n/en/toc.json
   ```

3. **Map input to sections.** Match user's words against:
   - Section `id` fields in manifest (e.g., "overview", "registration", "architecture")
   - `titleKey` values via toc.json (e.g., "Patient Search System" → `search` → parent file `features`)
   - Category names (e.g., "patient registration" → all sections in that category)
   - **If a matched section is a child** (has `anchor` property but no `file`), resolve to its **parent section's file**
   - **If a matched section is a sub-section** (found inside `subSections[]` array), it has its OWN file — treat it independently

4. **Build a section list.** For each resolved section, determine:

   | Field | Description |
   |-------|-------------|
   | `sectionId` | The manifest section ID |
   | `file` | The HTML filename (without extension) |
   | `exists` | Whether `sections/en/{file}.html` already exists |
   | `hasScreenshots` | Whether `data-i18n-img` attributes exist in the HTML |

   **DEDUPLICATE by file:** If multiple sectionIds resolve to the same file (e.g., `registration` and `visit-management` both → `features`), keep only ONE entry per unique file.

5. **Handle "all" keyword.** If user says "all" or "everything", include all sections from the manifest that have `file` values, plus all sub-sections.

6. **Report the resolved list** to the conversation before proceeding:
   ```
   Resolved sections:
   - features (exists, has data-i18n-img attributes)
   - overview (exists, has data-i18n-img attributes)
   ```

### Section-to-File Mapping Reference

**Top-level sections (have `file` property — these are what get planned and captured):**

| Section ID | File | Category | Notes |
|------------|------|----------|-------|
| technical-overview | technical-overview | platform | Has children: why-fhir, medplum-platform, tech-stack |
| overview | overview | patient-registration | Has children: statistics, zones, key-features, architecture-preview |
| registration | features | patient-registration | SHARES file with visit-management |
| visit-management | features | patient-registration | SHARES file with registration |
| architecture | architecture | technical-reference | Has 13 children + 1 sub-section |
| troubleshooting | troubleshooting | troubleshooting | Has children: common-issues, error-codes |
| contact | contact | additional | No children |

**Sub-sections (have their OWN file — loaded into a container in parent):**

| Sub-section ID | File | Parent | Container ID |
|----------------|------|--------|-------------|
| architecture-technical | architecture-technical | architecture | architecture-technical |

**Child sections (have `anchor` only — resolve to parent's file):**

| Child ID | Parent Section | Resolves to File |
|----------|---------------|-----------------|
| search | registration | features |
| form-sections | registration | features |
| document-upload | registration | features |
| desktop-sidebar | registration | features |
| mobile-wizard | registration | features |
| registration-section | visit-management | features |
| insurance | visit-management | features |
| active-visit-warning | visit-management | features |
| demographics | visit-management | features |
| statistics | overview | overview |
| zones | overview | overview |
| key-features | overview | overview |
| architecture-preview | overview | overview |
| why-fhir | technical-overview | technical-overview |
| medplum-platform | technical-overview | technical-overview |
| tech-stack | technical-overview | technical-overview |
| architecture-overview | architecture | architecture |
| component-hierarchy | architecture | architecture |
| hooks-reference | architecture | architecture |
| services-reference | architecture | architecture |
| fhir-flow | architecture | architecture |
| technical-overview-detail | architecture | architecture |
| ui-components-detail | architecture | architecture |
| validation-system | architecture | architecture |
| data-flow | architecture | architecture |
| fhir-resources | architecture | architecture |
| services-functionality | architecture | architecture |
| authentication | architecture | architecture |
| unknown-patient | architecture | architecture |
| common-issues | troubleshooting | troubleshooting |
| error-codes | troubleshooting | troubleshooting |

When user mentions a child section name, resolve to the parent's file. Example: "patient search" → child `search` → parent `registration` → file `features`.

When user mentions a category like "technical-reference", expand to ALL sections in that category (architecture + architecture-technical).

---

## Phase 2: PLAN

**Who:** `screenshot-planner` agents — one per unique HTML file.

### Steps

1. **Separate sections by existence:**
   - **Existing sections** (HTML files exist) → plan now
   - **New sections** (no HTML files) → defer to after Phase 3

2. **Launch screenshot-planner for existing sections.** Use the Skill tool:

   ```
   Skill: "screenshot-planner", args: "features"
   Skill: "screenshot-planner", args: "overview"
   ```

   Launch multiple in parallel if there are multiple sections.

   **Important:** Since Phase 1 already deduplicated by file, each entry here maps to a unique HTML file. No risk of duplicate planning.

3. **Wait for all planners to complete.** Verify outputs:
   ```
   Glob screenshot-plans/*.json
   ```
   Expect: one `{section}.json` per planned section + `_index.json`
   Each JSON must be parseable and have a populated `screenshots[]` array.

4. **Verify plan quality.** Read each JSON plan and run ALL checks:

   **Structural checks:**
   - `screenshots[]` array is populated (at least 1 entry)
   - Each screenshot has `captureSteps` array
   - `languageSwitching.selectors` has all 3 languages (en, ka, ru)
   - `emrConfig` has URL and credentials

   **Selector quality checks (fix violations before proceeding):**
   - NO selector contains ` or ` (space-or-space) — invalid CSS
   - NO selector contains CSS module hashes (pattern: `._[a-zA-Z]+_[a-z0-9]+_[0-9]+`)
   - NO `fill` selector uses commas (comma-separated selectors match multiple elements)
   - Screenshot steps should NOT have `clip` parameters (cmd.ts doesn't support them)

   **If ANY check fails:** Fix the plan JSON directly before proceeding to Phase 3.

### Failure Handling

If a planner fails or produces invalid JSON:
- Read the section HTML manually
- Extract all `data-i18n-img` attribute values
- Create a minimal plan JSON with those basenames

---

## Phase 3: DOCUMENT

**Who:** Agents launched via Task tool (`subagent_type: "general-purpose"`) — one per UNIQUE FILE.

This phase handles ALL non-browser work: HTML creation/updates, i18n keys, manifest entries.

### CRITICAL: Group by File, Not by Section ID

Multiple section IDs can share one HTML file (e.g., `registration` + `visit-management` → `features.html`). Phase 1 already deduplicated by file. Launch ONE agent per unique file, NOT per section ID. This prevents parallel agents from overwriting each other's work on the same file.

### Steps

1. **Launch doc-writer agents in parallel** via Task tool. Each agent gets a specific scope:

   For each unique file, launch a Task:
   ```
   Task(subagent_type: "general-purpose", prompt: "...")
   ```

   The prompt for each agent:
   ```
   You are working on the "{file}.html" documentation file.
   DO NOT use Playwright or capture screenshots — that happens in a later phase.

   Your tasks:
   1. Read sections/en/{file}.html — if it exists, review and update
   2. If it doesn't exist, create sections/en/{file}.html with proper structure:
      - Wrap in <section class="doc-section" id="{sectionId}">
      - Start with doc-section-header (icon SVG + numbered <h2>)
      - Use <h3 id="{anchor}"> for subsections matching manifest children
      - Use classes: doc-table-container, doc-list, doc-info-box, doc-code-block
      - Match complexity to your section's needs:
        * Complex section with tables/screenshots: see sections/en/features.html
        * Medium section: see sections/en/overview.html
        * Simple section: see sections/en/contact.html
   3. Ensure all UI features described have data-i18n-img attributes:
      <div class="doc-screenshot-full">
        <img src="images/basename-en.png" alt="Description"
             class="doc-screenshot-image" data-i18n-img="basename">
      </div>
   4. Create/update sections/ka/{file}.html:
      - Copy SAME HTML structure as the English file
      - Translate ALL visible text content to Georgian (headings, paragraphs, table cells,
        list items, alt text). Do NOT translate CSS classes, IDs, data-* attributes, or code.
      - Keep identical data-i18n-img attribute values (same basenames across all languages)
      - Image src paths: Optionally change -en.png to -ka.png for consistency.
        (Note: JavaScript dynamically rewrites src at runtime via data-i18n-img, so this
        is cosmetic — the docs site works correctly either way.)
      - Translate directly in your response. If Georgian quality is uncertain,
        mark those strings with <!-- NEEDS-REVIEW --> for manual verification.
   5. Create/update sections/ru/{file}.html:
      - Same process as Georgian but translate to Russian
      - Optionally change image src paths to -ru.png suffix
   6. DO NOT modify config/manifest.json or i18n/*/toc.json directly.
      Instead, write needed changes to: screenshot-plans/_doc-report-{file}.md
      Use this EXACT format:

      ## Manifest Changes Needed
      ```json
      {
        "action": "add",
        "category": "patient-registration",
        "section": {
          "id": "new-section",
          "titleKey": "toc.newSection",
          "file": "new-section",
          "priority": "medium"
        }
      }
      ```
      (Or "none" if no manifest changes needed)

      ## i18n Keys Needed
      ```json
      {
        "en": { "toc.newSection": "New Section" },
        "ka": { "toc.newSection": "ახალი განყოფილება" },
        "ru": { "toc.newSection": "Новый раздел" }
      }
      ```
      (Or "none" if no i18n changes needed)

      ## Files Created/Updated
      - sections/en/{file}.html
      - sections/ka/{file}.html
      - sections/ru/{file}.html

   Follow the HTML patterns from existing sections. Use EMR theme colors from THEME_COLORS.md.
   ```

2. **After ALL doc-writer agents complete, the main orchestrator:**
   - Reads all `screenshot-plans/_doc-report-*.md` files
   - Parses the JSON blocks (validate before merging — skip malformed entries)
   - Collects all manifest and i18n changes
   - Deduplicates (same key from multiple reports → keep first)
   - Updates `config/manifest.json` once
   - Updates `i18n/{en,ka,ru}/toc.json` once
   - Deletes the report files

3. **Post-Phase 3 planning:** If any sections were NEW (didn't exist before), their HTML now exists. Launch screenshot-planners for these new sections:
   ```
   Skill: "screenshot-planner", args: "{newSectionId}"
   ```
   **WAIT for all new planners to complete** before proceeding. Verify their plan JSONs and _index.json updates exist before moving to Phase 4.

4. **Verify Phase 3 outputs:**
   - All `sections/{en,ka,ru}/{file}.html` files exist
   - Each file with screenshots has appropriate `data-i18n-img` attributes
   - Sections without screenshots are valid (text-only sections are OK)
   - Translation keys exist in `i18n/{lang}/toc.json`
   - Manifest has entries for all sections

---

## Phase 4: CAPTURE

**Who:** ONE agent launched via `Task(subagent_type: "general-purpose")` with exclusive Playwright access.

**CRITICAL: Only ONE agent uses Playwright.** The server is a singleton — one browser, one page.

### Steps

1. **Launch a single Task agent** with this prompt:

   ```
   You are the screenshot capture agent. You have EXCLUSIVE access to Playwright.

   Read screenshot-plans/_index.json to find ALL sections with pending screenshots.
   For each section, read its plan JSON (e.g., screenshot-plans/features.json).

   SETUP — Clean up any stale Playwright processes first:
   Run: pkill -f "playwright/server.ts" 2>/dev/null; pkill -f "Chromium" 2>/dev/null; sleep 2

   1. Start Playwright server:
      npx tsx scripts/playwright/server.ts &
      sleep 3

   ERROR DETECTION — how to know when a cmd.ts command fails:
   When cmd.ts fails, its output contains "Error: <message>".
   Common errors you will see:
   - "Error: net::ERR_CONNECTION_REFUSED" → port not accepting connections
   - "Error: Timeout" → page not responding
   - "Error: waiting for locator" → selector not found on page
   Always check Bash output for "Error:" to detect failures before proceeding.

   2. Detect EMR port and login:
      - Try port 3000:
        npx tsx scripts/playwright/cmd.ts navigate "http://localhost:3000"
      - Check output: if it contains "Error:" → port 3000 failed. Try port 3005:
        npx tsx scripts/playwright/cmd.ts navigate "http://localhost:3005"
      - If BOTH outputs contain "Error:": stop and report "EMR not running — start it first"
      - Remember which port worked (3000 or 3005). Use that in ALL subsequent navigate commands.
        Example: if 3005 worked, always use "http://localhost:3005/..." below.
      - Complete login (two-step flow — verified selectors):
        Step 1 — Email (input has NO name attribute, use placeholder):
        npx tsx scripts/playwright/cmd.ts fill "input[placeholder='name@domain.com']" "admin@medimind.ge"
        npx tsx scripts/playwright/cmd.ts click "button[type='submit']"
        npx tsx scripts/playwright/cmd.ts wait 2000
        Step 2 — Password:
        npx tsx scripts/playwright/cmd.ts fill "input[type='password']" "MediMind2024"
        npx tsx scripts/playwright/cmd.ts click "button[type='submit']"
        npx tsx scripts/playwright/cmd.ts wait 3000
      - Navigate to registration (substitute actual port):
        npx tsx scripts/playwright/cmd.ts navigate "http://localhost:{PORT}/emr/registration/registration"

   IMPORTANT NOTES ON PLAN JSON captureSteps:
   - The plan JSON may contain "clip" parameters in screenshot steps.
     server.ts does NOT support clip — IGNORE clip params.
     Instead: use viewport sizing + scroll positioning to frame the content,
     then capture with: npx tsx scripts/playwright/cmd.ts screenshot "name-lang"
     Or use --fullpage: npx tsx scripts/playwright/cmd.ts screenshot "name-lang" --fullpage
   - Replace any {url} placeholder in captureSteps with the actual EMR URL (e.g., http://localhost:3005)
   - Plan JSON selectors using "or" keyword are INVALID CSS.
     Use only one selector per command. Try alternatives sequentially if first fails.

   PLAN JSON OVERRIDE RULES — captureSteps are SUGGESTIONS, not commands:

   The plan JSON `captureSteps` may contain stale or broken selectors from a previous build.
   Treat them as hints. The `description` field is the TRUE guide for what to capture.

   Rules:
   1. If a captureStep selector fails, DO NOT retry it. Use your DOM exploration results instead.
   2. If a captureStep uses a CSS module hash (pattern: `._something_xxxx_N`), IGNORE it entirely.
      Use the resilient selector you found during DOM exploration.
   3. If a captureStep has a `clip` parameter, IGNORE it. Use viewport+scroll instead.
   4. Always compare the `description` field against what you see on screen.
      The screenshot must match the DESCRIPTION, not the captureSteps.
   5. Use `sectionHeaderText` (if present) to scroll to the correct section via scrollIntoView.
   6. Use `expectedDOMElements` (if present) to verify the right content is visible before capturing.
   7. If `knownLimitation` is set:
      - "react-synthetic-events" → capture best-effort, mark as "captured" with limitation note
      - "requires-test-data" → check if precondition is met; if not, mark as "blocked" and skip

   MANDATORY DOM EXPLORATION — Do this ONCE after login, BEFORE any captures:

   After navigating to the registration page, explore the DOM to find correct selectors:

   A. Find the scrollable container (DO NOT assume class names — they are build-dependent):
      npx tsx scripts/playwright/cmd.ts evaluate "(() => { const els = document.querySelectorAll('div[class*=transition], div[class*=container], main, [role=main]'); for (const el of els) { if (el.scrollHeight > el.clientHeight + 100) return { tag: el.tagName, class: el.className.substring(0,80), scrollH: el.scrollHeight, clientH: el.clientHeight }; } return 'no scrollable container found'; })()"
      Save the className. Build a resilient partial-class selector from it:
        Example: if className is "_transitionContainer_x1y2z_7", use: div[class*="transitionContainer"]

   B. Find all collapsible form section headers (these are DIVs, not buttons):
      npx tsx scripts/playwright/cmd.ts evaluate 'JSON.stringify(Array.from(document.querySelectorAll(".emr-form-section-header")).map(function(e,i){return {i:i, text:e.textContent.trim().substring(0,25)}}))'
      This returns all 8 form sections with their indices. Sections 4-7 will have Georgian text even in English mode.

   C. Test scrolling works before beginning captures:
      npx tsx scripts/playwright/cmd.ts evaluate "(() => { const c = document.querySelector('div[class*=\"transitionContainer\"]') || document.querySelector('main') || document.scrollingElement; if (!c) return 'ERROR: no scrollable element found'; c.scrollTop = 500; const result = c.scrollTop; c.scrollTop = 0; return 'scrollTop test: set 500, got ' + result; })()"
      If result shows "got 0" or "ERROR", try alternative selectors.

   D. MANDATORY LANGUAGE GATE (hard gate — NEVER skip):
      After EVERY language switch AND after EVERY navigation, run this detection:
      npx tsx scripts/playwright/cmd.ts evaluate "(() => { const t = document.body.innerText.substring(0,500); const hasGeo = /[\u10A0-\u10FF]/.test(t); const hasCyr = /[\u0400-\u04FF]/.test(t); return { detected: hasGeo ? 'ka' : hasCyr ? 'ru' : 'en', sample: t.substring(0,100) }; })()"

      HARD GATE RULES:
      1. Parse the result. If result.detected !== expected language → FAIL.
      2. On FAIL: re-click the language button, wait 2000ms, re-run detection.
      3. Retry up to 3 times total.
      4. If after 3 retries result.detected STILL !== expected → mark screenshot as "failed"
         with reason "language-gate-failed" and SKIP to next screenshot.
      5. NEVER proceed to capture if result.detected !== expected language.
         This is not a suggestion — it is a blocking gate.

   CAPTURE ORDER — Group by language to minimize switches:

   3. ENGLISH PASS — Capture ALL screenshots across ALL sections:
      - Switch language (use text= selectors on EMR, NOT button:has-text):
        npx tsx scripts/playwright/cmd.ts click "text=ENG"
      - npx tsx scripts/playwright/cmd.ts wait 2000
      - For each section's screenshots (capture DESKTOP screenshots first, MOBILE last):
        - Navigate to registration page:
          npx tsx scripts/playwright/cmd.ts navigate "{emrUrl}/emr/registration/registration"
        - Wait for page load: npx tsx scripts/playwright/cmd.ts wait 1500
        - VERIFY LANGUAGE after EVERY navigation (React may reset language on route change):
          npx tsx scripts/playwright/cmd.ts evaluate "document.body.innerText.substring(0, 200)"
          If the page is NOT in the expected language (e.g., you see Georgian/Russian text during English pass):
            Re-click the language button: npx tsx scripts/playwright/cmd.ts click "text=ENG"
            npx tsx scripts/playwright/cmd.ts wait 2000
            Verify again before proceeding.
          DO NOT proceed to capture until you have confirmed the correct language is active.
        - For scroll-based screenshots, NEVER use hardcoded CSS-module class names (they change every build).
          Instead, use scrollIntoView on the TARGET ELEMENT you want to capture:

          PREFERRED — scroll a form section into view by its INDEX:
          npx tsx scripts/playwright/cmd.ts evaluate 'document.querySelectorAll(".emr-form-section-header")[INDEX].scrollIntoView({behavior:"instant",block:"start"})'
          (Replace INDEX with 0-7 per the section index table above.)

          ALTERNATIVE — scroll the container to an absolute position:
          npx tsx scripts/playwright/cmd.ts evaluate 'var c = document.querySelector("div[class*=transitionContainer]"); c.scrollTop = 800; "scrolled to " + c.scrollTop'

          ALWAYS check the return value. If scrollTop is 0, the container selector failed.

          --fullpage WARNING: The EMR form is inside a scroll container div, NOT the page body.
          `screenshot --fullpage` only captures the body height, NOT the container's scrollable content.
          For unified-form/full-form screenshots, you MUST scroll the container and take multiple shots
          OR set container scrollTop and take regular viewport screenshots.

          `scroll` COMMAND WARNING: `cmd.ts scroll` only accepts CSS selectors, NOT `text=` selectors.
          For text-based targets, always use `evaluate` + `scrollIntoView` instead.
        - For section-expand screenshots, click `.emr-form-section-header-left` by INDEX via evaluate:
          The form has 8 sections. Click target is `.emr-form-section-header-left` (NOT the outer header div).
          Using `text=` selectors will click the WIZARD STEP instead of the form accordion.

          EMR FORM SECTION INDEX (verified):
          | Index | Section | Georgian Label (always shown) |
          |-------|---------|------------------------------|
          | 0 | Personal Information | Personal Information |
          | 1 | Contact Information | Contact Information |
          | 2 | Additional Details | Additional Details |
          | 3 | Guardian/Representative | Guardian/Representative |
          | 4 | Registration | რეგისტრაცია |
          | 5 | Insurance | დაზღვევა |
          | 6 | Guarantee | საგარანტიო |
          | 7 | Demographics | დემოგრაფია |

          MIXED i18n NOTE: Sections 0-3 show English labels in English mode.
          Sections 4-7 ALWAYS show Georgian labels regardless of language setting.
          This is the EMR app's incomplete i18n — NOT a capture bug. Screenshots should show the actual state.

          EXPAND a section (e.g., index 6 = Guarantee):
          npx tsx scripts/playwright/cmd.ts evaluate 'document.querySelectorAll(".emr-form-section-header-left")[6].click()'
          npx tsx scripts/playwright/cmd.ts wait 1000

          VERIFY expansion:
          npx tsx scripts/playwright/cmd.ts evaluate 'var s = document.querySelectorAll(".emr-form-section")[6]; JSON.stringify({open: s.classList.contains("open"), h: s.querySelector(".emr-form-section-content").offsetHeight})'
          If open=false or h=0, the click failed. Retry once. If still fails, try clicking the child title-text span.

          SCROLL the section into view after expanding:
          npx tsx scripts/playwright/cmd.ts evaluate 'document.querySelectorAll(".emr-form-section-header")[6].scrollIntoView({behavior:"instant",block:"start"})'
          npx tsx scripts/playwright/cmd.ts wait 500

          DO NOT use:
          - Playwright click "text=Insurance" → clicks wizard step, not form section
          - evaluate ".emr-form-section-header[6].click()" → outer header click doesn't trigger React handlers
          - cmd.ts scroll "text=..." → scroll command only accepts CSS selectors

        PRE-CAPTURE VIEWPORT VERIFICATION (mandatory after every scroll/expand):
        Before taking the screenshot, verify the viewport shows the expected content:
          npx tsx scripts/playwright/cmd.ts evaluate "(() => { const el = document.elementFromPoint(window.innerWidth/2, window.innerHeight/2); return { tag: el?.tagName, class: el?.className?.substring(0,60), text: el?.textContent?.substring(0,40) }; })()"
        Compare the result against the plan's `description` and `sectionHeaderText`:
        - If the center element relates to the target content → proceed to capture
        - If the center element shows unrelated content (e.g., header, footer, wrong section)
          → scroll/expand FAILED. Re-attempt the scroll with adjusted offset or scrollIntoView.
        - Retry up to 2 times. If viewport still wrong after retries, try different scrollTop value.
          NOTE: --fullpage does NOT work as fallback for scroll container content (see warning above).

        If the plan has `expectedDOMElements`, verify at least ONE is visible:
          npx tsx scripts/playwright/cmd.ts evaluate "document.querySelector('SELECTOR') !== null"
        If none are visible, the scroll/expand did not reach the target section.

        - Screenshot name MUST include language suffix: "hero-search-en" (not just "hero-search")
        - cmd.ts auto-appends .png — do NOT include .png in the name
      - MOBILE SCREENSHOTS (e.g., mobile-wizard) — capture LAST within this language pass:
        a. Resize: npx tsx scripts/playwright/cmd.ts viewport 375 812
        b. Navigate to registration page (full reload for responsive layout)
        c. Wait 2000ms for render
        d. Capture: npx tsx scripts/playwright/cmd.ts screenshot "mobile-wizard-en"
        e. Resize back: npx tsx scripts/playwright/cmd.ts viewport 1440 900
        f. Navigate to registration page again to restore desktop layout
      - After each screenshot, Read the image file to verify content
      NOTE: Mobile viewport (<768px) does NOT render language buttons.
      You MUST capture mobile screenshots while still in the current language pass.

   4. GEORGIAN PASS — Switch and verify for each navigation:
      - npx tsx scripts/playwright/cmd.ts click "text=ქარ"
      - npx tsx scripts/playwright/cmd.ts wait 2000
      - Same screenshots, same order (desktop first, mobile last)
      - Use -ka suffix in all screenshot names
      - After EVERY navigate command, verify language is still Georgian:
        npx tsx scripts/playwright/cmd.ts evaluate "document.body.innerText.substring(0, 200)"
        If you see English or Russian text, re-click: npx tsx scripts/playwright/cmd.ts click "text=ქარ"
        Wait 2000ms and verify again before capturing.

   5. RUSSIAN PASS — Switch and verify for each navigation:
      - npx tsx scripts/playwright/cmd.ts click "text=РУС"
      - npx tsx scripts/playwright/cmd.ts wait 2000
      - Same screenshots, same order (desktop first, mobile last)
      - Use -ru suffix in all screenshot names
      - After EVERY navigate command, verify language is still Russian:
        npx tsx scripts/playwright/cmd.ts evaluate "document.body.innerText.substring(0, 200)"
        If you see English or Georgian text, re-click: npx tsx scripts/playwright/cmd.ts click "text=РУС"
        Wait 2000ms and verify again before capturing.

   SESSION HEALTH CHECK — after every 5 screenshots:
     npx tsx scripts/playwright/cmd.ts evaluate "window.location.href"
   - If URL contains "/login", "/auth", or "/signin" → session expired, re-login
   - If evaluate itself ERRORS (connection refused) → Playwright server crashed:
     pkill -f "playwright/server.ts" 2>/dev/null; sleep 2
     npx tsx scripts/playwright/server.ts &
     sleep 3
     Then re-login and re-navigate to registration page

   6. Stop server:
      npx tsx scripts/playwright/cmd.ts stop

   STATUS TRACKING (MANDATORY — update after EACH LANGUAGE PASS, not every screenshot):

   After completing all screenshots for a language (e.g., all English captures done):

   A. Update the PLAN JSON (e.g., screenshot-plans/features.json):
      For each successfully captured screenshot, find it in "screenshots" array by "name".
      Change its status for the completed language to "captured" (NOT "completed"):
        BEFORE: "status": { "en": "pending", "ka": "pending", "ru": "pending" }
        AFTER:  "status": { "en": "captured", "ka": "pending", "ru": "pending" }
      NOTE: Only Phase 5 Agent C can promote "captured" to "completed" after visual validation.
      Phase 4 must NEVER set status to "completed" — always use "captured".

   B. Update _index.json — recalculate counts from the plan JSON:
      - Loop through ALL screenshots in the plan JSON
      - Count each status.{lang} value: "completed", "pending", or "failed"
      - Set sections[i].status.completed = total completed count
      - Set sections[i].status.pending = total pending count
      - Also update capturedScreenshots[] array: add basename if all 3 langs complete
      - Also update pendingScreenshots[] array: remove basename when all 3 langs complete
      - Set overallStatus.completed = sum across all sections
      - Set overallStatus.pending = sum across all sections
      - Set overallStatus.completionPercentage = (completed / (completed + pending + failed)) * 100

   C. If you captured a screenshot NOT in the original plan:
      - ADD it to the plan JSON "screenshots" array with status and empty captureSteps
      - ADD its basename to _index.json sections[].screenshots array
      - Update totalScreenshots and totalFiles counts in both files
      - Add to capturedScreenshots[] or pendingScreenshots[] as appropriate

   DO NOT SKIP STATUS TRACKING. The tracking files enable resumability.

   VERIFICATION — Run IMMEDIATELY after EACH screenshot (not in batch at the end):

   After every npx tsx scripts/playwright/cmd.ts screenshot command:
   A. Visual quality — Read the image file, confirm it's not blank/broken/error page
   B. Quick content check — Does the image look different from the previous screenshot?
      If 2+ consecutive screenshots look identical (same default page state),
      this means scrolling or section expansion FAILED. STOP and debug before continuing.
   C. Quick language check — Glance at visible text. If obviously wrong language,
      re-click the language button, wait, and recapture.

   NOTE: This is a PRELIMINARY check. Full content-vs-description validation and
   cross-image uniqueness checks happen in Phase 5 Agent C. Phase 4 marks status
   as "captured" (NOT "completed") — only Phase 5 can promote to "completed".

   CRITICAL: If 2+ consecutive screenshots look identical, STOP capturing and
   re-run the DOM exploration step to find working selectors. Do not continue
   capturing the same broken state for all remaining screenshots.

   FAILURE HANDLING:
   - If a verification check fails, retry up to 3 times per screenshot
   - If still failing, mark status.{lang} as "failed" in the plan JSON
   - Continue to next screenshot (don't block the pipeline)
   - Sidebar overlay click interception: You should ALREADY be using evaluate .click()
     as the primary method (see section expansion instructions above). If you somehow
     used Playwright click and it was intercepted, switch to evaluate:
     npx tsx scripts/playwright/cmd.ts evaluate "document.querySelector('selector').click()"
   - If scrollIntoView does not work (returns ERROR), try these fallbacks in order:
     1. Find the scrollable container via DOM exploration (see MANDATORY DOM EXPLORATION above)
     2. Use Tab key presses to move focus to the target element
     3. Use --fullpage screenshot and accept the wider capture

   KNOWN LIMITATIONS — Check the plan JSON `knownLimitation` field for each screenshot:

   Before capturing, read the screenshot's `knownLimitation` field from the plan JSON.
   Handle each value as follows:

   - `null` → No limitation. Capture normally.
   - `"react-synthetic-events"` → The target UI state cannot be triggered via Playwright.
     Capture the best available state. Mark status as "captured" and add a note:
     "limitation: react-synthetic-events — badge not triggerable via automation"
   - `"requires-test-data"` → The screenshot requires specific test data in the database.
     Check if the precondition is met (e.g., try the fill+submit flow).
     If precondition IS met → capture normally.
     If precondition is NOT met → mark status as "blocked" with reason, skip to next screenshot.
     Do NOT mark as "failed" — "blocked" means it can succeed with correct test data.

   General limitations (always apply):
   - Draft indicator: Cannot trigger React auto-save badge via Playwright fill.
   - Active visit warning: Requires test patient (01011055555) with active Encounter.
   - Mobile viewport (<768px) hides language buttons — switch language BEFORE resizing.

   FINAL REPORT — Write to screenshot-plans/_capture-report.md:
   Total expected: X | Captured: Y | Failed: Z | Completion: Y/X (%)
   List any failed/blocked screenshots with reasons.
   ```

2. **Wait for capture agent to complete.**

3. **Verify captures:**
   ```
   Glob images/*.png
   ```
   Count should match: (total unique screenshots) x 3 languages.
   Read `screenshot-plans/_index.json` and confirm progress.

---

## Phase 5: VERIFY

**Who:** 3 agents launched in parallel via `Task(subagent_type: "general-purpose")`. No Playwright needed.

**IMPORTANT:** Only Agent C writes to `_index.json` and plan JSONs. Agents A and B write only to their own report files.

### Agent A: HTML Verification

```
Verify documentation HTML matches actual image files.

For each section HTML in sections/en/:
1. Find ALL <img> tags with class="doc-screenshot-image"
2. For each img tag, check:
   a. It HAS a data-i18n-img attribute (if missing → ERROR: language switching won't work)
   b. The data-i18n-img="X" basename has matching files:
      - images/X-en.png
      - images/X-ka.png
      - images/X-ru.png
   c. The img src= defaults to images/X-en.png
3. Check the same basenames and data-i18n-img attributes exist in sections/ka/ and sections/ru/
4. Verify ka files use -ka.png suffix in src, ru files use -ru.png suffix
5. Cross-reference with screenshot-plans/{section}.json:
   - Count of data-i18n-img attributes should match count of screenshots in the plan
   - For each screenshot in the plan, check its status.{lang} field:
     * If status = "failed" → do NOT count its missing PNG as an error (it was intentionally skipped)
     * If status = "completed" → its PNG MUST exist
     * If status = "pending" → its PNG may or may not exist
6. Report any mismatches, missing files, or img tags without data-i18n-img
   Distinguish between: ERRORS (completed but missing) vs WARNINGS (failed/blocked)

Write findings to screenshot-plans/_html-verification.md
```

### Agent B: i18n Verification

```
Verify all translation keys are complete across all 3 languages.

MODULAR FILES (primary):
1. Read i18n/en/toc.json, i18n/ka/toc.json, i18n/ru/toc.json
2. Read i18n/en/core.json, i18n/ka/core.json, i18n/ru/core.json
3. Read i18n/en/meta.json, i18n/ka/meta.json, i18n/ru/meta.json
4. Collect all keys from English (reference language)
5. For each key in English, verify it exists in Georgian and Russian
6. Report any missing translations

LEGACY FALLBACK FILES (secondary check):
7. Read i18n/en.json, i18n/ka.json, i18n/ru.json
8. These are fallback files used when modular loading fails (see js/i18n.js _loadLegacyLanguage)
9. Check that all keys in modular files also exist in legacy files
10. Flag any keys present in legacy but missing from modular (stale translations)

Write findings to screenshot-plans/_i18n-verification.md
```

### Agent C: Image Validation + Index Sync

```
Read and validate every screenshot image in the images/ directory.

STEP 1 — INDEX SYNC (do this FIRST, before visual validation):
1. List all PNG files in images/ directory
2. Read screenshot-plans/_index.json AND each plan JSON file (features.json, overview.json, etc.)
   If _index.json is malformed or unreadable, reconstruct it from plan JSONs.
   If a plan JSON is malformed, report the error and skip that section's sync.
3. For each PNG file on disk (e.g., hero-search-en.png):
   - Extract basename (hero-search) and language (en)
   - Find the screenshot in a PLAN JSON by name field
   - If NOT found in any plan JSON:
     FLAG: "hero-search exists on disk but has no plan entry — orphaned image"
   - If found and status is "pending" but file exists on disk:
     SET status.{lang} to "captured" (NOT "completed" — visual validation hasn't run yet)
   - If status is "completed" but file is MISSING from disk:
     FIX: update plan JSON status.{lang} to "pending"
4. DO NOT recalculate final counts yet — wait until after STEP 2 and STEP 3 validation.

IMPORTANT — STATUS MODEL (Agent C is the SOLE AUTHORITY on completion):
  - "pending"          → file does not exist on disk
  - "captured"         → file exists but NOT validated yet
  - "completed"        → file exists AND passed all validation checks
  - "needs-recapture"  → file exists but FAILED validation (wrong language, content, or duplicate)
  - "failed"           → capture was attempted but failed (set by Phase 4)
Phase 4 sets "captured". Agent C promotes to "completed" or downgrades to "needs-recapture".

STEP 2 — EXHAUSTIVE VISUAL VALIDATION (NO SAMPLING — read EVERY image):
You MUST Read() every single PNG file. No sampling. No skipping.
Process images in basename groups (all 3 language variants together).

CHUNKING STRATEGY — process 4 basenames per chunk to avoid running out of turns:
1. Collect all basenames from plan JSONs (e.g., 16 basenames = 4 chunks of 4).
2. For each chunk of 4 basenames:
   a. Read all 12 images (4 basenames x 3 languages)
   b. Run checks A-D below for each
   c. Write INTERIM findings to screenshot-plans/_image-validation.md (append mode)
      Include the per-image table rows for this chunk.
3. After ALL chunks complete, write the FINAL summary at the top of the file.

COMPLETION GATE: Count validated_count after each chunk.
If validated_count < total basenames after the last chunk → task is NOT complete.
Report exactly which basenames were NOT validated and why.

For each basename (e.g., "hero-search"):
A. Read all 3 files: hero-search-en.png, hero-search-ka.png, hero-search-ru.png
B. For EACH file check:
   1. NOT blank, NOT an error page, NOT a loading spinner
   2. Shows actual MediMind EMR content (navigation header, form elements)
   3. Reasonable file size (>50KB)

C. LANGUAGE VERIFICATION — check these indicators:
   - English: Latin text in headers ("Add Patient", "Registration", "Insurance")
   - Georgian: Georgian script ("პაციენტის დამატება", "რეგისტრაცია", "დაზღვევა")
   - Russian: Cyrillic text ("Добавить пациента", "Регистрация", "Страхование")
   - If *-en.png shows Georgian/Russian text → FAIL: language mismatch

D. CONTENT vs DESCRIPTION — Read the plan JSON's "description" AND "expectedDOMElements"
   fields for this basename. Use the PER-BASENAME CHECKLIST below to verify content:

   | Basename | Required Visual Elements |
   |----------|------------------------|
   | hero-search | Search bar/input visible at top of page |
   | advanced-filters | Multiple filter input fields (Personal ID, Name, etc.) |
   | patient-lookup | 11-digit personal ID input field within the form body |
   | unified-form | Multiple collapsible section headers visible |
   | draft-indicator | Top area of form (badge may not appear — see knownLimitation) |
   | document-upload | File upload/drag-drop zone, document metadata fields |
   | desktop-sidebar | Right-side panel with "Today's Visits" or "Recent Patients" |
   | registration-section | Visit Type dropdown, Visit Date, Department fields |
   | insurance-section | Insurance company selector, policy number field |
   | active-visit-warning | Warning modal/dialog overlay (see knownLimitation) |
   | demographics-section | Region dropdown, Chief Complaint, Referral Source fields |
   | mobile-wizard | Narrow viewport, step wizard/progress indicator |
   | search-results | Search dropdown with patient result and action buttons |
   | patient-found | Patient card with name, ID, DOB, phone, Edit button |
   | encounter-creation | Form with encounter/visit fields populated |
   | screenshot | Full page overview with search + form + sidebar all visible |

   If the image does NOT show the required visual elements → FAIL: content mismatch.
   If `knownLimitation` is set and the limitation explains the gap → WARN, not FAIL.

STEP 3 — CROSS-BASENAME UNIQUENESS CHECK:
Compare DIFFERENT basenames within the same language.
Each basename should show a DISTINCT feature or page state.
If two basenames show the same content → FAIL: duplicate content.
List ALL duplicate groups found.

STEP 4 — FINAL INDEX RECALCULATION:
1. For each screenshot: if all checks passed → set status to "completed"
   If any check failed → set status to "needs-recapture"
2. Write updated plan JSONs
3. Recalculate _index.json counts from final statuses
4. "needs-recapture" counts as non-complete for percentage

Write findings to screenshot-plans/_image-validation.md with a per-image table:
| File | EMR Content | Language OK | Content Matches Desc | Unique | Verdict |
```

### After all 3 agents complete

Read the three verification reports. Check _index.json for recalculated completion percentage.

**If completionPercentage = 100 and all reports show PASS:** proceed to Phase 6.

**If any issues found, handle by category:**
- **Missing images** (status = "pending") → note for user, may need Phase 4 re-run
- **Missing translations** → fix i18n files directly
- **Wrong HTML attributes** → fix section files directly
- **Orphaned images** → either add to plan or delete
- **Language mismatches** (status = "needs-recapture") → must recapture these screenshots
- **Content mismatches** (status = "needs-recapture") → image shows wrong feature, needs recapture
- **Duplicate basenames** → capture agent failed to differentiate, needs re-run with corrected steps

**CRITICAL:** Do NOT proceed to Phase 6 if _index.json shows any "needs-recapture" statuses.
Report the actual completion percentage and list all failing screenshots to the user.

---

## Phase 6: FINAL

**Who:** ONE agent launched via `Task(subagent_type: "general-purpose")` with Playwright access.

End-to-end test of the documentation site itself.

**IMPORTANT:** Phase 6 uses the DOCS SITE (localhost:8000), NOT the EMR. The docs site has a DIFFERENT language switcher than the EMR.

### Steps

1. **Launch a single Task agent** with this prompt:

   ```
   Final verification: test the documentation site end-to-end.

   SETUP:
   - Kill any stale Playwright: pkill -f "playwright/server.ts" 2>/dev/null; sleep 2

   1. Verify docs server is running and serving the correct project:
      Run: curl -s http://localhost:8000/config/manifest.json | head -5
      - If it returns JSON with "version" field → correct server running
      - If connection refused → start it:
        cd /Users/toko/Desktop/MedPlum_MediMind_Documentation-main && python3 -m http.server 8000 &
        sleep 2
        Verify again with curl
      - If it returns unexpected content → wrong directory. Kill process on port 8000:
        lsof -ti:8000 | xargs kill 2>/dev/null; sleep 1
        Then start in correct directory as above

   2. Start Playwright:
      npx tsx scripts/playwright/server.ts &
      sleep 3

   3. Navigate to docs site:
      npx tsx scripts/playwright/cmd.ts navigate "http://localhost:8000"
      npx tsx scripts/playwright/cmd.ts wait 3000

   4. SECTION ROUTE MAP — use these hash routes (category/sectionId → file):
      | Hash Route | HTML File ID |
      | #/platform/technical-overview | technical-overview |
      | #/patient-registration/overview | overview |
      | #/patient-registration/registration | features |
      | #/technical-reference/architecture | architecture |
      | #/troubleshooting/troubleshooting | troubleshooting |
      | #/additional/contact | contact |

      For each documented section:
      - Navigate using hash routing (use correct category/section from table above):
        npx tsx scripts/playwright/cmd.ts navigate "http://localhost:8000#/patient-registration/registration"
      - WAIT for the SPECIFIC section file to load (not just any .doc-section):
        npx tsx scripts/playwright/cmd.ts wait 3000
        npx tsx scripts/playwright/cmd.ts waitfor "section#features"
        (Use the HTML File ID from the table above, e.g., "section#features" for registration)
      - Wait for all images to finish loading:
        npx tsx scripts/playwright/cmd.ts evaluate "Promise.all(Array.from(document.querySelectorAll('img.doc-screenshot-image')).map(img=>img.complete?Promise.resolve():new Promise(r=>{img.onload=r;img.onerror=r}))).then(()=>'loaded')"
        npx tsx scripts/playwright/cmd.ts wait 1000
      - Count images and check for broken ones:
        npx tsx scripts/playwright/cmd.ts evaluate "document.querySelectorAll('img.doc-screenshot-image').length"
        npx tsx scripts/playwright/cmd.ts evaluate "Array.from(document.querySelectorAll('img.doc-screenshot-image')).filter(i=>i.naturalWidth===0).map(i=>i.getAttribute('data-i18n-img')).join(',')"
      - If broken images found, report which basenames are broken
      - Take verification screenshot: npx tsx scripts/playwright/cmd.ts screenshot "doc-verify-{section}-en"

   5. Test language switching on the DOCS SITE:
      The docs site language buttons use data-lang attributes in the header:
        <button class="lang-btn" data-lang="ka">...</button>

      Switch to Georgian using the CORRECT selector for docs site:
        npx tsx scripts/playwright/cmd.ts click "button[data-lang='ka']"
        npx tsx scripts/playwright/cmd.ts wait 3000
      If button click fails, REPORT IT as a UI bug (don't silently use localStorage fallback).

      After switching to Georgian:
      - Verify images swapped: check img src contains "-ka.png"
        npx tsx scripts/playwright/cmd.ts evaluate "Array.from(document.querySelectorAll('[data-i18n-img]')).map(i=>i.src.split('/').pop()).join(',')"
      - Take screenshot: npx tsx scripts/playwright/cmd.ts screenshot "doc-verify-lang-ka"

      Switch to Russian:
        npx tsx scripts/playwright/cmd.ts click "button[data-lang='ru']"
        npx tsx scripts/playwright/cmd.ts wait 3000
      - Verify images use -ru.png suffix
      - Take screenshot: npx tsx scripts/playwright/cmd.ts screenshot "doc-verify-lang-ru"

      Switch back to English:
        npx tsx scripts/playwright/cmd.ts click "button[data-lang='en']"

   6. Generate completion report to screenshot-plans/_completion-report.md:

      # Documentation Pipeline - Completion Report

      **Date:** {current date}
      **Sections documented:** {list}
      **Total screenshots:** {captured} / {planned}
      **Failed screenshots:** {count} (list if any)

      ## Verification Results
      - HTML attributes: {pass/fail} — see _html-verification.md
      - i18n completeness: {pass/fail} — see _i18n-verification.md
      - Image quality: {pass/fail} — see _image-validation.md
      - Docs site loading: {pass/fail}
      - Language switching: {pass/fail}

      ## Overall Status: {COMPLETE / INCOMPLETE}

   7. Stop Playwright:
      npx tsx scripts/playwright/cmd.ts stop

   8. Delete the pipeline lockfile:
      rm -f screenshot-plans/.pipeline.lock
   ```

2. **Read the completion report** and present summary to user.

---

## Coordination Rules

### File Ownership by Phase

| File/Directory | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Phase 6 |
|----------------|---------|---------|---------|---------|---------|
| `screenshot-plans/*.json` | WRITE | READ | READ+WRITE | Agent C only | READ |
| `screenshot-plans/_doc-report-*.md` | -- | WRITE | -- | -- | -- |
| `screenshot-plans/_*-verification.md` | -- | -- | -- | WRITE (A,B,C) | READ |
| `sections/{lang}/*.html` | READ | WRITE | -- | READ | -- |
| `i18n/{lang}/*.json` | READ | Orchestrator only | -- | READ | -- |
| `config/manifest.json` | READ | Orchestrator only | -- | READ | -- |
| `images/*.png` | -- | -- | WRITE | READ | READ |
| Playwright (port 9222) | -- | -- | EXCLUSIVE | -- | EXCLUSIVE |

### Rules

1. **Never run two Playwright agents simultaneously.** Phases 4 and 6 are always sequential.
2. **Phase 3 agents are grouped by FILE, not by section ID.** One agent per unique HTML file prevents write conflicts.
3. **Shared files** (`manifest.json`, `i18n/*/toc.json`) are updated ONLY by the main orchestrator after parallel agents complete, using their `_doc-report-*.md` files.
4. **`_index.json`** is updated by the capture agent (Phase 4) and Agent C (Phase 5) only.
5. **Always clean up stale Playwright** before starting Phases 4 or 6.
6. **Always clean up stale reports** at the start of a fresh pipeline run (see Phase 1 cleanup step).
7. **Lockfile** (`screenshot-plans/.pipeline.lock`) prevents concurrent runs. Created in Phase 1, deleted in Phase 6.

### Between-Phase Gates

Do NOT proceed to the next phase until the current phase is verified:

| Gate | Check |
|------|-------|
| Phase 1 → 2 | Section list resolved, files identified, deduplicated by file |
| Phase 2 → 3 | All `screenshot-plans/{section}.json` exist and are valid JSON |
| Phase 3 → 4 | All `sections/{lang}/{file}.html` exist; files with screenshots have `data-i18n-img` |
| Phase 4 → 5 | `_capture-report.md` exists; all screenshots have "captured" or "failed" status; no "pending" remains |
| Phase 5 → 6 | All 3 verification reports generated; zero screenshots with "needs-recapture" status; _image-validation.md shows all verdicts passing |

---

## Completion Criteria

The pipeline is 100% complete when ALL of these are true:

- [ ] Every resolved section has HTML files in all 3 languages
- [ ] Every `data-i18n-img` basename has 3 corresponding PNG files (en, ka, ru)
- [ ] All translation keys referenced in HTML exist in all 3 language JSON files
- [ ] `screenshot-plans/_index.json` shows 100% completion — calculated from Phase 5
      Agent C validated "completed" statuses (NOT Phase 4 "captured" statuses)
- [ ] Zero screenshots have status "needs-recapture" in any plan JSON
- [ ] `_image-validation.md` shows per-image table with all verdicts passing
- [ ] Documentation site loads all images correctly at `localhost:8000`
- [ ] Language switching on the docs site swaps all images correctly
- [ ] `screenshot-plans/_completion-report.md` shows status: COMPLETE

---

## Resumability

If the pipeline is interrupted at any phase, it can be resumed:

1. **Read `screenshot-plans/_index.json`** to see overall progress
2. **Read plan JSONs** to check per-screenshot per-language status
3. **Check `images/` directory** to see which files exist on disk
4. **Determine current phase:**
   - No plan JSONs → start from Phase 2
   - Plan JSONs exist but no/few images → start from Phase 4
   - Images exist but no verification reports → start from Phase 5
   - Verification reports exist but no completion report → start from Phase 6
5. **Phase 4 is idempotent** — recapturing an existing screenshot just overwrites the file
6. **Phase 4 skip logic:**
   - status = "completed" AND file exists → skip (already verified by Phase 5)
   - status = "captured" AND file exists → skip (awaiting Phase 5 verification)
   - status = "needs-recapture" → DO NOT SKIP, re-capture this screenshot
   - status = "pending" or "failed" → capture as normal
7. **Phase 5 never skips** — Agent C always re-validates ALL images on disk

To resume:
```
/doc-pipeline Resume — check screenshot-plans/_index.json and continue from where we left off
```
