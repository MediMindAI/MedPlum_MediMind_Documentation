---
name: screenshot-planner
description: >
  Analyzes documentation sections ONE BY ONE and generates detailed screenshot plans
  for the medimind-doc-writer agent. Use when: (1) Planning screenshots for new or
  updated documentation, (2) Auditing existing docs for missing screenshots,
  (3) Creating multi-step UI flow capture plans. Outputs structured JSON plans to
  screenshot-plans/ folder that medimind-doc-writer can consume.
version: 1.0.0
---

# Screenshot Planner Skill

Generates detailed screenshot capture plans by analyzing documentation sections.

## When to Use

- Before documenting a new EMR feature
- When updating existing documentation with new UI
- To audit documentation for missing/outdated screenshots
- When planning multi-step user flow captures

## Invocation

```
/screenshot-planner <section-name>
```

**Examples:**
```
/screenshot-planner features
/screenshot-planner overview
/screenshot-planner architecture
/screenshot-planner "Patient Registration"
```

## Resolution Logic

The skill resolves input to a file path:
1. Check if input matches section `id` in `config/manifest.json` → use that file
2. If not, search `titleKey` in i18n files → find matching section
3. Resolve to: `sections/en/{file}.html`

## Workflow Phases

### Phase 1: INGEST

Read the section file and extract:
- Section HTML content
- Existing `data-i18n-img` image references
- Anchor IDs and headings
- Manifest metadata (priority, category)

```bash
# Read the section
Read sections/en/features.html

# Read manifest for metadata
Read config/manifest.json
```

### Phase 2: ANALYZE

Extract from the HTML:

**UI Components** (detected via keywords/patterns):
| Pattern | Component Type |
|---------|---------------|
| `search`, `lookup`, `find` | Search interfaces |
| `form`, `input`, `field` | Form elements |
| `modal`, `dialog`, `popup` | Overlays |
| `sidebar`, `panel` | Side panels |
| `table`, `list`, `grid` | Data displays |
| `button`, `toggle`, `switch` | Controls |
| `wizard`, `step`, `progress` | Multi-step flows |

**User Flows** (detected via action verbs):
| Verb | Action Type |
|------|-------------|
| click, press, tap | Click action |
| type, enter, input | Fill action |
| select, choose, pick | Dropdown/select |
| submit, save, confirm | Form submission |
| navigate, go to, open | Navigation |
| scroll, expand, collapse | UI state change |

**Screenshot Types**:
| Type | When to Use |
|------|-------------|
| `static` | Single UI state (hero-search, insurance-section) |
| `multi-step-flow` | Sequence of states with user actions between them |
| `state-based` | Requires specific data condition (active visit warning) |

### Phase 3: PLAN

Generate specifications for each screenshot:

**Static Screenshot:**
```json
{
  "id": "insurance-section",
  "name": "insurance-section",
  "description": "Insurance coverage form section",
  "type": "static",
  "anchorId": "insurance",
  "docReference": "Section 2.6 - Insurance",
  "sectionHeaderText": "Insurance",
  "expectedDOMElements": ["select", "[class*='insurance' i]"],
  "knownLimitation": null,
  "selector": "[class*='insurance' i]",
  "languages": ["en", "ka", "ru"],
  "captureSteps": [
    { "action": "scroll", "selector": "[class*='insurance' i]" },
    { "action": "wait", "ms": 500 },
    { "action": "screenshot", "name": "insurance-section" }
  ],
  "verification": {
    "mustContain": ["insurance form visible", "coverage fields"],
    "languageCheck": true
  }
}
```

**Multi-Step Flow Screenshot:**
```json
{
  "id": "patient-lookup-flow",
  "name": "patient-lookup",
  "description": "Patient lookup by personal ID with result states",
  "type": "multi-step-flow",
  "anchorId": "patient-lookup",
  "docReference": "Section 2.1 - Patient Lookup",
  "languages": ["en", "ka", "ru"],
  "flowSteps": [
    {
      "stepId": "1",
      "stepName": "patient-lookup-step1-empty",
      "description": "Empty lookup field ready for input",
      "captureSteps": [
        { "action": "scroll", "selector": "[class*='patient-lookup' i]" },
        { "action": "wait", "ms": 500 },
        { "action": "screenshot", "name": "patient-lookup-step1-empty" }
      ]
    },
    {
      "stepId": "2",
      "stepName": "patient-lookup-step2-typing",
      "description": "User typing personal ID",
      "captureSteps": [
        { "action": "fill", "selector": "input[name*='personalId' i]", "value": "01234567891" },
        { "action": "wait", "ms": 500 },
        { "action": "screenshot", "name": "patient-lookup-step2-typing" }
      ]
    },
    {
      "stepId": "3",
      "stepName": "patient-lookup-step3-found",
      "description": "Patient found - card displayed",
      "captureSteps": [
        { "action": "waitfor", "selector": "[class*='patient-card' i]", "timeout": 5000 },
        { "action": "wait", "ms": 500 },
        { "action": "screenshot", "name": "patient-lookup-step3-found" }
      ]
    }
  ],
  "galleryOutput": {
    "enabled": true,
    "htmlTemplate": "doc-screenshot-gallery"
  },
  "verification": {
    "flowCompletes": true,
    "statesCount": 3
  }
}
```

**State-Based Screenshot:**
```json
{
  "id": "active-visit-warning",
  "name": "active-visit-warning",
  "description": "Warning modal when patient has existing visit",
  "type": "state-based",
  "anchorId": "active-visit-warning",
  "triggerCondition": "Patient has Encounter with status='in-progress'",
  "prerequisites": ["Test patient with active visit must exist in system"],
  "languages": ["en", "ka", "ru"],
  "captureSteps": [
    { "action": "comment", "text": "Use test patient: 01011055555 (has active visit)" },
    { "action": "fill", "selector": "input[name*='personalId' i]", "value": "01011055555" },
    { "action": "waitfor", "selector": "[class*='patient-card' i]" },
    { "action": "click", "selector": "button[type='submit']" },
    { "action": "waitfor", "selector": "[role='dialog']" },
    { "action": "wait", "ms": 500 },
    { "action": "screenshot", "name": "active-visit-warning" }
  ]
}
```

### Phase 4: OUTPUT

Write to `screenshot-plans/` folder:

1. **`{section-id}.json`** - Machine-readable plan with status tracking
2. **`{section-id}.md`** - Human-readable summary with checkboxes
3. **`_index.json`** - Master index tracking ALL sections (create or update)

#### Master Index (_index.json)

Create or update the master index to track all planned sections:

```json
{
  "indexVersion": "1.0",
  "lastUpdated": "2026-02-05T10:30:00Z",
  "sections": [
    {
      "id": "features",
      "planFile": "features.json",
      "checklistFile": "features.md",
      "status": "pending",
      "totalScreenshots": 15,
      "completedScreenshots": 0,
      "progress": 0,
      "addedAt": "2026-02-05T10:30:00Z",
      "completedAt": null
    },
    {
      "id": "overview",
      "planFile": "overview.json",
      "checklistFile": "overview.md",
      "status": "in_progress",
      "totalScreenshots": 8,
      "completedScreenshots": 5,
      "progress": 62.5,
      "addedAt": "2026-02-05T11:00:00Z",
      "completedAt": null
    }
  ],
  "summary": {
    "totalSections": 2,
    "pendingSections": 1,
    "inProgressSections": 1,
    "completedSections": 0,
    "totalScreenshots": 23,
    "completedScreenshots": 5,
    "overallProgress": 21.7
  }
}
```

**Status values:** `pending` | `in_progress` | `completed`

#### Screenshot Status Tracking

**IMPORTANT: Always set initial status to `"pending"` regardless of whether image files already exist.**
Existing files may be outdated, generic, or contextually wrong. The doc-writer must recapture and verify every screenshot.

Each screenshot in the JSON plan includes a `status` field:

```json
{
  "id": "hero-search",
  "name": "hero-search",
  "status": {
    "en": "pending",
    "ka": "pending",
    "ru": "pending"
  },
  "completedAt": {
    "en": null,
    "ka": null,
    "ru": null
  },
  // ... rest of spec
}
```

**JSON Plan Structure:**
```json
{
  "planVersion": "1.0",
  "generatedAt": "2026-02-05T10:30:00Z",
  "sourceSection": {
    "id": "features",
    "file": "sections/en/features.html",
    "titleKey": "toc.registration"
  },
  "emrConfig": {
    "baseUrl": "http://localhost:3005",
    "loginCredentials": {
      "email": "admin@medimind.ge",
      "password": "MediMind2024"
    },
    "targetPage": "/emr/registration/registration"
  },
  "screenshots": [ /* array of screenshot specs */ ],
  "languageSwitching": {
    "selectors": {
      "en": "text=ENG",
      "ru": "text=РУС",
      "ka": "text=ქარ"
    },
    "waitAfterSwitch": 2000
  },
  "summary": {
    "totalScreenshots": 15,
    "totalFiles": 45,
    "staticScreenshots": 8,
    "multiStepFlows": 5,
    "stateBased": 2
  }
}
```

**Markdown Summary Structure:**
```markdown
# Screenshot Plan: {Section Title}

**Generated:** {date}
**Source:** sections/en/{file}.html
**Total Files:** {count} (screenshots × 3 languages)

## Screenshots Overview

### Static Screenshots ({count})
| ID | Filename Pattern | Description |
|----|------------------|-------------|
| hero-search | hero-search-{lang}.png | Search bar component |

### Multi-Step Flows ({count})
1. **patient-lookup-flow** (3 steps)
   - Step 1: Empty field → patient-lookup-step1-empty-{lang}.png
   - Step 2: Typing ID → patient-lookup-step2-typing-{lang}.png
   - Step 3: Found → patient-lookup-step3-found-{lang}.png

### State-Based ({count})
- **active-visit-warning** - Requires active visit condition

## Execution Checklist
- [ ] EMR running on localhost:3005
- [ ] Playwright server started
- [ ] Login completed
- [ ] English screenshots captured
- [ ] Russian screenshots captured
- [ ] Georgian screenshots captured
- [ ] All files verified

## Prerequisites
- Test patient with active visit (ID: 01011055555)
```

## Gallery HTML Output

For multi-step flows, generate gallery HTML that doc-writer can insert:

```html
<div class="doc-screenshot-gallery" data-steps="3" data-flow="patient-lookup">
  <div class="gallery-images">
    <img src="images/patient-lookup-step1-empty-en.png"
         data-i18n-img="patient-lookup-step1-empty"
         alt="Step 1: Empty lookup field"
         class="gallery-image active" />
    <img src="images/patient-lookup-step2-typing-en.png"
         data-i18n-img="patient-lookup-step2-typing"
         alt="Step 2: Typing personal ID"
         class="gallery-image" />
    <img src="images/patient-lookup-step3-found-en.png"
         data-i18n-img="patient-lookup-step3-found"
         alt="Step 3: Patient found"
         class="gallery-image" />
  </div>
  <div class="gallery-nav">
    <button class="gallery-prev" aria-label="Previous step">
      <svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <div class="gallery-dots">
      <span class="dot active" data-step="1"></span>
      <span class="dot" data-step="2"></span>
      <span class="dot" data-step="3"></span>
    </div>
    <button class="gallery-next" aria-label="Next step">
      <svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  </div>
  <div class="gallery-caption">
    <span class="step-label">Step 1/3:</span>
    <span class="step-description">Empty lookup field ready for input</span>
  </div>
</div>
```

## Capture Step Actions Reference

| Action | Parameters | Example |
|--------|------------|---------|
| `navigate` | url | `{ "action": "navigate", "url": "/emr/registration" }` |
| `fill` | selector, value | `{ "action": "fill", "selector": "#id", "value": "123" }` |
| `click` | selector | `{ "action": "click", "selector": "button" }` |
| `wait` | ms | `{ "action": "wait", "ms": 2000 }` |
| `waitfor` | selector, timeout? | `{ "action": "waitfor", "selector": ".card" }` |
| `scroll` | selector | `{ "action": "scroll", "selector": "#section" }` **(CSS selectors only, NOT text=)** |
| `screenshot` | name | `{ "action": "screenshot", "name": "feature" }` (auto-appends .png) |
| `evaluate` | script | `{ "action": "evaluate", "script": "..." }` |
| `viewport` | width, height | `{ "action": "viewport", "width": 375, "height": 812 }` |
| `comment` | text | `{ "action": "comment", "text": "Note for human" }` |

### Selector Rules for captureSteps

1. **Use language-NEUTRAL selectors.** The capture agent switches language before running captureSteps.
   Good: `input[type='text']`, `[role='dialog']`, `button[type='submit']`, `form >> input >> nth=2`
   Bad: `button:has-text('New Visit')` (English-only), `input[placeholder*='Personal ID']` (English-only)

2. **NEVER use `or` in selectors.** The `or` keyword does not exist in CSS.

3. **NEVER use comma-separated selectors with `fill`.** cmd.ts `fill` requires exactly ONE matching element.

4. **NEVER use CSS module hashed class names** like `._transitionContainer_awd5y_7`. These change between builds.
   Use stable alternatives: semantic HTML, ARIA attributes, data attributes, or Playwright text selectors.

5. **NEVER generate `clip` parameters** in screenshot steps. cmd.ts does not support clip/region capture.
   Use only `"name"` (and optionally `"fullPage": true`) in screenshot steps.

### New Schema Fields (Required on Every Screenshot Entry)

Every screenshot entry MUST include these 3 fields:

| Field | Type | Description |
|-------|------|-------------|
| `sectionHeaderText` | `string \| null` | English text of the section header for scroll targeting. `null` if no scroll needed. |
| `expectedDOMElements` | `string[]` | 1-3 CSS selectors that MUST be visible on screen for a correct capture. Used by capture agent to verify content before screenshot. |
| `knownLimitation` | `null \| "react-synthetic-events" \| "requires-test-data"` | `null` for normal captures. Set when the screenshot has a known automation limitation. |

### Selector Quality Rules

Before outputting any plan JSON, validate ALL selectors against these rules:

1. **No CSS module hashes** — reject any selector matching pattern `._[a-zA-Z]+_[a-z0-9]+_[0-9]+` (e.g., `._transitionContainer_awd5y_7`). Use `div[class*="transitionContainer"]` instead.
2. **No `or` keyword** — `or` is not valid CSS. Use sequential fallback selectors instead.
3. **No `clip` params** — cmd.ts does not support clip/region. Use viewport+scroll.
4. **No comma-separated `fill` selectors** — `fill` requires exactly ONE matching element.
5. **No language-specific text** — selectors must work across all 3 languages. Use structural selectors (`input[type='text']`, `[role='dialog']`) not text-based ones (`button:has-text('Submit')`).

If any generated selector violates these rules, fix it before writing the plan file.

### EMR Form DOM Reference (for generating accurate captureSteps)

The registration page form has 8 collapsible sections inside a scroll container:

| Index | Section | Class | Click Target | Default |
|-------|---------|-------|-------------|---------|
| 0 | Personal Information | `.emr-form-section` | `.emr-form-section-header-left` | Open |
| 1 | Contact Information | `.emr-form-section` | `.emr-form-section-header-left` | Closed |
| 2 | Additional Details | `.emr-form-section` | `.emr-form-section-header-left` | Closed |
| 3 | Guardian/Representative | `.emr-form-section` | `.emr-form-section-header-left` | Closed |
| 4 | Registration (რეგისტრაცია) | `.emr-form-section` | `.emr-form-section-header-left` | Open |
| 5 | Insurance (დაზღვევა) | `.emr-form-section` | `.emr-form-section-header-left` | Open (empty) |
| 6 | Guarantee (საგარანტიო) | `.emr-form-section` | `.emr-form-section-header-left` | Closed |
| 7 | Demographics (დემოგრაფია) | `.emr-form-section` | `.emr-form-section-header-left` | Open |

**Key facts for plan generation:**
- Scroll container: `div[class*="transitionContainer"]` (scrollHeight ~2377px, viewportHeight ~764px)
- `--fullpage` does NOT capture scroll container content — use `evaluate` to set `scrollTop` instead
- `scroll` command only accepts CSS selectors, NOT `text=` selectors — use `evaluate` + `scrollIntoView`
- Sections 4-7 ALWAYS show Georgian labels regardless of language setting (EMR incomplete i18n)
- To expand a section: click `.emr-form-section-header-left[INDEX]` (NOT the outer `.emr-form-section-header`)
- `text=Insurance` clicks the WIZARD STEP at top, NOT the form accordion. Always use evaluate + index.

When generating captureSteps for form section screenshots, use this pattern:
```json
{
  "action": "evaluate",
  "params": "document.querySelectorAll('.emr-form-section-header-left')[INDEX].click()"
},
{
  "action": "wait",
  "params": 1000
},
{
  "action": "evaluate",
  "params": "document.querySelectorAll('.emr-form-section-header')[INDEX].scrollIntoView({behavior:'instant',block:'start'})"
}
```

## Integration with medimind-doc-writer

The medimind-doc-writer agent consumes plans:

1. Check for plan: `screenshot-plans/{section-id}.json`
2. Read plan and iterate `screenshots[]` array
3. For each screenshot:
   - For each language in `languages[]`:
     - Click language button from `languageSwitching.selectors`
     - Wait `languageSwitching.waitAfterSwitch` ms
     - Execute `captureSteps` array
     - Verify with Read tool
4. For multi-step flows:
   - Execute each `flowSteps[].captureSteps`
   - Generate separate file per step
5. Mark completed in `{section-id}.md` checklist

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Static | `{name}-{lang}.png` | `hero-search-en.png` |
| Multi-step | `{name}-step{N}-{state}-{lang}.png` | `patient-lookup-step2-typing-en.png` |
| State-based | `{name}-{lang}.png` | `active-visit-warning-ka.png` |

## Verification Checklist

After running this skill:
- [ ] JSON plan is valid (can be parsed)
- [ ] All `data-i18n-img` from source have corresponding screenshots
- [ ] Multi-step flows have logical step progression
- [ ] Prerequisites documented for state-based screenshots
- [ ] Markdown checklist is comprehensive
