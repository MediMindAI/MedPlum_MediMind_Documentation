# Documentation Pipeline - Complete Guide

> **Purpose:** This document explains how the `/doc-pipeline` skill works and how to use it to create documentation for MediMind EMR features.

---

## Table of Contents

1. [What Is The Doc-Pipeline?](#what-is-the-doc-pipeline)
2. [Prerequisites](#prerequisites)
3. [How To Use It](#how-to-use-it)
4. [The 6-Phase Workflow](#the-6-phase-workflow)
5. [Architecture Deep Dive](#architecture-deep-dive)
6. [Troubleshooting](#troubleshooting)
7. [File Reference](#file-reference)

---

## What Is The Doc-Pipeline?

The doc-pipeline is an **automated documentation system** built into Claude Code. It takes a simple natural language request and produces complete, multi-language documentation with screenshots.

### The Problem It Solves

Creating documentation manually for an EMR feature requires:

| Task | Manual Effort |
|------|---------------|
| Write HTML documentation | ~30-60 min per section |
| Translate to Georgian | ~20-30 min |
| Translate to Russian | ~20-30 min |
| Take screenshots (3 languages × N features) | ~2-5 min each |
| Verify all images load correctly | ~10 min |
| Fix broken image paths | Variable |
| **Total for one section** | **2-4 hours** |

The pipeline automates ALL of this into a single command that runs in ~15-30 minutes.

### What You Get

**Input:**
```
/doc-pipeline Document the patient search and registration features
```

**Output:**
- `sections/en/features.html` - English documentation
- `sections/ka/features.html` - Georgian documentation
- `sections/ru/features.html` - Russian documentation
- `images/hero-search-en.png`, `images/hero-search-ka.png`, `images/hero-search-ru.png`
- `images/patient-lookup-en.png`, `images/patient-lookup-ka.png`, `images/patient-lookup-ru.png`
- ... (all screenshots in all 3 languages)
- Updated `config/manifest.json` with section entries
- Updated `i18n/*/toc.json` with navigation labels
- Verification reports confirming everything works

---

## Prerequisites

Before running the pipeline, ensure:

### 1. EMR Application Is Running

The pipeline takes screenshots from the live EMR app.

```bash
# Start the EMR (typically from the EMR project directory)
npm run dev
```

The EMR usually runs on `http://localhost:3000` or `http://localhost:3005`. The pipeline auto-detects which port is active.

### 2. Documentation Site Server

The pipeline verifies the final docs at the end.

```bash
# From the documentation project root
cd /Users/toko/Desktop/MedPlum_MediMind_Documentation-main
python3 -m http.server 8000
```

### 3. Valid Login Credentials

The pipeline logs into the EMR to take screenshots. Default credentials:
- **Email:** `admin@medimind.ge`
- **Password:** `MediMind2024`

### 4. Playwright Dependencies

The pipeline uses Playwright for browser automation. It should work out of the box, but if you see errors:

```bash
npx playwright install chromium
```

---

## How To Use It

### Basic Usage

In Claude Code, simply type:

```
/doc-pipeline <what you want to document>
```

### Examples

```bash
# Document specific features
/doc-pipeline Document the patient search feature

# Document multiple sections
/doc-pipeline Create documentation for overview and features sections

# Document an entire category
/doc-pipeline Document all patient registration sections

# Resume an interrupted run
/doc-pipeline Resume — check screenshot-plans/_index.json and continue
```

### What Happens Next

1. Claude will show you which sections it resolved from your request
2. It will ask for confirmation before proceeding
3. The pipeline runs through 6 phases automatically
4. You'll see progress updates as each phase completes
5. At the end, you get a completion report

### Typical Runtime

| Scope | Approximate Time |
|-------|------------------|
| Single section (5-8 screenshots) | 10-15 minutes |
| Multiple sections (15-20 screenshots) | 20-30 minutes |
| All sections (30+ screenshots) | 40-60 minutes |

---

## The 6-Phase Workflow

The pipeline is organized into 6 sequential phases. Each phase has specific inputs, outputs, and verification steps.

```
┌──────────────────────────────────────────────────────────────────┐
│                         PHASE 1: RESOLVE                         │
│                                                                  │
│  INPUT:  "Document the patient search feature"                   │
│  ACTION: Parse natural language, map to section IDs              │
│  OUTPUT: List of sections to document                            │
│                                                                  │
│  Example mapping:                                                │
│    "patient search" → section ID "search"                        │
│                     → parent section "registration"              │
│                     → file "features.html"                       │
└──────────────────────────────────────────────────────────────────┘
                                 ↓
┌──────────────────────────────────────────────────────────────────┐
│                          PHASE 2: PLAN                           │
│                                                                  │
│  INPUT:  List of sections from Phase 1                           │
│  ACTION: Analyze HTML files, identify all screenshots needed     │
│  OUTPUT: screenshot-plans/{section}.json files                   │
│                                                                  │
│  Each plan contains:                                             │
│    - Screenshot basenames (e.g., "hero-search")                  │
│    - Capture steps (click here, scroll there, etc.)              │
│    - Language switching selectors                                │
│    - Verification criteria                                       │
└──────────────────────────────────────────────────────────────────┘
                                 ↓
┌──────────────────────────────────────────────────────────────────┐
│                        PHASE 3: DOCUMENT                         │
│                                                                  │
│  INPUT:  Screenshot plans from Phase 2                           │
│  ACTION: Create/update HTML files in all 3 languages             │
│  OUTPUT: sections/{en,ka,ru}/*.html files                        │
│                                                                  │
│  What gets created:                                              │
│    - Section HTML with proper structure                          │
│    - <img data-i18n-img="basename"> tags for screenshots         │
│    - Translated content in Georgian and Russian                  │
│    - Manifest and i18n file updates                              │
└──────────────────────────────────────────────────────────────────┘
                                 ↓
┌──────────────────────────────────────────────────────────────────┐
│                        PHASE 4: CAPTURE                          │
│                                                                  │
│  INPUT:  Screenshot plans + HTML files                           │
│  ACTION: Use Playwright to capture all screenshots               │
│  OUTPUT: images/{basename}-{lang}.png files                      │
│                                                                  │
│  Process:                                                        │
│    1. Start Playwright browser                                   │
│    2. Login to EMR                                               │
│    3. ENGLISH PASS: Switch to English, capture all screenshots   │
│    4. GEORGIAN PASS: Switch to Georgian, capture all screenshots │
│    5. RUSSIAN PASS: Switch to Russian, capture all screenshots   │
│    6. Update status tracking files                               │
└──────────────────────────────────────────────────────────────────┘
                                 ↓
┌──────────────────────────────────────────────────────────────────┐
│                         PHASE 5: VERIFY                          │
│                                                                  │
│  INPUT:  All generated files from Phases 3-4                     │
│  ACTION: Run 3 parallel verification agents                      │
│  OUTPUT: Verification reports                                    │
│                                                                  │
│  Agent A (HTML Verification):                                    │
│    - Check all img tags have data-i18n-img attributes            │
│    - Verify image files exist for each attribute                 │
│                                                                  │
│  Agent B (i18n Verification):                                    │
│    - Check all translation keys exist in all 3 languages         │
│    - Flag any missing translations                               │
│                                                                  │
│  Agent C (Image Validation):                                     │
│    - Read EVERY image file                                       │
│    - Verify correct language (Georgian text in -ka.png, etc.)    │
│    - Check for duplicates                                        │
│    - Promote status from "captured" to "completed"               │
└──────────────────────────────────────────────────────────────────┘
                                 ↓
┌──────────────────────────────────────────────────────────────────┐
│                          PHASE 6: FINAL                          │
│                                                                  │
│  INPUT:  Verified documentation                                  │
│  ACTION: End-to-end test of the docs site                        │
│  OUTPUT: Completion report                                       │
│                                                                  │
│  Tests performed:                                                │
│    - Navigate to localhost:8000                                  │
│    - Load each documented section                                │
│    - Verify all images display correctly                         │
│    - Test language switching (EN → KA → RU)                      │
│    - Confirm images swap when language changes                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Architecture Deep Dive

### Why 6 Phases?

Each phase has a specific purpose and can be **resumed independently** if interrupted.

| Phase | Purpose | Can Run in Parallel? |
|-------|---------|---------------------|
| 1. RESOLVE | Map user request to section IDs | No (single agent) |
| 2. PLAN | Generate capture instructions | Yes (one agent per section) |
| 3. DOCUMENT | Write/translate HTML files | Yes (one agent per FILE) |
| 4. CAPTURE | Take screenshots | **No** (Playwright is singleton) |
| 5. VERIFY | Validate everything | Yes (3 specialized agents) |
| 6. FINAL | End-to-end test | **No** (Playwright is singleton) |

### The Playwright Singleton Problem

Playwright (the browser automation tool) runs as a **single server** on port 9222. There is ONE browser instance with ONE page. This means:

- Only ONE agent can use Playwright at a time
- Phases 4 and 6 must run sequentially, never in parallel
- If two agents try to use Playwright simultaneously, they'll corrupt each other's state

**Solution:** The pipeline enforces exclusive Playwright access via phase sequencing.

### File Conflict Prevention

Multiple sections can share the same HTML file. For example:
- Section ID `registration` → file `features.html`
- Section ID `visit-management` → file `features.html`

If we launched one agent per section ID, they'd both try to write to `features.html` simultaneously.

**Solution:** Phase 1 deduplicates by FILE, not by section ID. One agent per unique file.

### The Status Tracking System

Screenshots go through a lifecycle:

```
pending → captured → completed
              ↓
        needs-recapture
```

| Status | Meaning |
|--------|---------|
| `pending` | Not yet captured |
| `captured` | File exists on disk, awaiting validation |
| `completed` | File exists AND passed all validation checks |
| `needs-recapture` | File exists but failed validation (wrong language, etc.) |
| `failed` | Capture was attempted but failed |

**Why this matters:**
- Phase 4 sets status to `captured` (not `completed`)
- Only Phase 5 Agent C can promote to `completed` after visual validation
- This prevents false "100% complete" reports when images are broken

### Language Gate System

The EMR app can reset its language when you navigate between pages (React state quirk). The pipeline implements a **hard gate**:

```
For EVERY screenshot:
  1. Click language button (e.g., text=ENG)
  2. Wait 2 seconds
  3. Detect actual language on page
  4. If detected ≠ expected → retry (up to 3 times)
  5. If still wrong after 3 retries → mark as "failed", skip
  6. Only capture if language is confirmed correct
```

This prevents the embarrassing situation where `hero-search-en.png` contains Georgian text.

---

## Troubleshooting

### Common Issues

#### "EMR not running — start it first"

**Cause:** The pipeline couldn't connect to localhost:3000 or localhost:3005.

**Fix:** Start the EMR application:
```bash
cd /path/to/emr-project
npm run dev
```

#### "Playwright server crashed" or "Connection refused"

**Cause:** The Playwright browser server died mid-capture.

**Fix:** The pipeline should auto-recover, but if not:
```bash
# Kill stale processes
pkill -f "playwright/server.ts"
pkill -f "Chromium"

# Resume the pipeline
/doc-pipeline Resume
```

#### Screenshots show wrong language

**Cause:** Language gate failed or was bypassed.

**Fix:**
1. Check `screenshot-plans/_image-validation.md` for which images failed
2. Delete the bad images
3. Resume: `/doc-pipeline Resume`

#### "needs-recapture" status won't clear

**Cause:** Phase 5 validation keeps failing for some images.

**Fix:**
1. Read the `_image-validation.md` report to see WHY validation failed
2. Common reasons:
   - Image shows login page (session expired during capture)
   - Image shows wrong section (scroll/click didn't work)
   - Image is duplicate of another screenshot
3. Delete the problematic images and resume

#### Pipeline stuck at 95%

**Cause:** Usually one or two screenshots with `knownLimitation` flags.

**Known limitations:**
- `draft-indicator`: React synthetic events can't trigger the auto-save badge
- `active-visit-warning`: Requires specific test patient with active encounter

**Fix:** These are expected. Check if the completion report marks them as "blocked" rather than "failed". Blocked screenshots don't count against completion percentage.

### How to Resume

The pipeline tracks its progress in `screenshot-plans/_index.json`. To resume:

```
/doc-pipeline Resume — check screenshot-plans/_index.json and continue
```

The pipeline will:
1. Read the index file
2. Determine which phase to resume from
3. Skip already-completed work
4. Continue from where it left off

---

## File Reference

### Directory Structure

```
project-root/
├── config/
│   └── manifest.json          # Section definitions, hierarchy
├── i18n/
│   ├── en/
│   │   ├── core.json          # UI strings (buttons, labels)
│   │   ├── toc.json           # Navigation labels
│   │   └── meta.json          # Metadata, hero section
│   ├── ka/                    # Georgian translations
│   └── ru/                    # Russian translations
├── sections/
│   ├── en/
│   │   ├── features.html      # English documentation
│   │   ├── overview.html
│   │   └── ...
│   ├── ka/                    # Georgian documentation
│   └── ru/                    # Russian documentation
├── images/
│   ├── hero-search-en.png     # English screenshots
│   ├── hero-search-ka.png     # Georgian screenshots
│   ├── hero-search-ru.png     # Russian screenshots
│   └── ...
├── screenshot-plans/
│   ├── _index.json            # Overall progress tracking
│   ├── features.json          # Capture plan for features section
│   ├── overview.json          # Capture plan for overview section
│   ├── _html-verification.md  # Phase 5 Agent A report
│   ├── _i18n-verification.md  # Phase 5 Agent B report
│   ├── _image-validation.md   # Phase 5 Agent C report
│   ├── _capture-report.md     # Phase 4 summary
│   └── _completion-report.md  # Phase 6 final report
└── scripts/
    └── playwright/
        ├── server.ts          # Playwright browser server
        └── cmd.ts             # Command interface for Playwright
```

### Key Files Explained

#### `config/manifest.json`

Defines all sections, their hierarchy, and which HTML files they use.

```json
{
  "version": "2.0.0",
  "categories": [
    {
      "id": "patient-registration",
      "titleKey": "toc.patientRegistration",
      "sections": [
        {
          "id": "registration",
          "titleKey": "toc.registration",
          "file": "features",        // ← HTML filename (without .html)
          "priority": "high",
          "children": [
            {
              "id": "search",
              "titleKey": "toc.search",
              "anchor": "search"     // ← #anchor within parent file
            }
          ]
        }
      ]
    }
  ]
}
```

#### `screenshot-plans/_index.json`

Tracks overall progress across all sections.

```json
{
  "pipelineVersion": "3.2.0",
  "sections": [
    {
      "id": "features",
      "file": "features",
      "status": {
        "completed": 45,
        "pending": 0,
        "failed": 3
      },
      "screenshots": ["hero-search", "patient-lookup", "..."]
    }
  ],
  "overallStatus": {
    "completed": 45,
    "pending": 0,
    "failed": 3,
    "completionPercentage": 93.75
  }
}
```

#### `screenshot-plans/{section}.json`

Detailed capture instructions for one section.

```json
{
  "sectionId": "features",
  "file": "features",
  "screenshots": [
    {
      "name": "hero-search",
      "description": "Search bar at top of registration page",
      "status": {
        "en": "completed",
        "ka": "completed",
        "ru": "completed"
      },
      "captureSteps": [
        { "action": "navigate", "url": "{emrUrl}/emr/registration/registration" },
        { "action": "wait", "ms": 2000 },
        { "action": "screenshot", "name": "hero-search-{lang}" }
      ],
      "verificationCriteria": {
        "mustShow": ["search input", "filter buttons"],
        "mustNotShow": ["error message", "loading spinner"]
      }
    }
  ],
  "languageSwitching": {
    "selectors": {
      "en": "text=ENG",
      "ka": "text=ქარ",
      "ru": "text=РУС"
    }
  }
}
```

---

## Summary Checklist

Before running `/doc-pipeline`:

- [ ] EMR is running on localhost:3000 or 3005
- [ ] Docs server is running on localhost:8000
- [ ] You know what section(s) you want to document

During the pipeline:

- [ ] Watch for the "Resolved sections" confirmation
- [ ] Let each phase complete before the next starts
- [ ] Check progress updates in the conversation

After completion:

- [ ] Read `screenshot-plans/_completion-report.md`
- [ ] Verify docs site at http://localhost:8000
- [ ] Test language switching manually
- [ ] Commit the new files to git

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                    DOC-PIPELINE CHEATSHEET                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  START NEW:     /doc-pipeline Document the [feature]        │
│  RESUME:        /doc-pipeline Resume                        │
│                                                             │
│  PORTS:         EMR = 3000 or 3005                          │
│                 Docs = 8000                                 │
│                 Playwright = 9222                           │
│                                                             │
│  PHASES:        1.RESOLVE → 2.PLAN → 3.DOCUMENT             │
│                 → 4.CAPTURE → 5.VERIFY → 6.FINAL            │
│                                                             │
│  STATUS FILES:  screenshot-plans/_index.json (progress)     │
│                 screenshot-plans/_completion-report.md      │
│                                                             │
│  KILL STUCK:    pkill -f "playwright/server.ts"             │
│                 pkill -f "Chromium"                         │
│                                                             │
│  LANGUAGES:     en = English                                │
│                 ka = Georgian (ქართული)                      │
│                 ru = Russian (Русский)                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

*Last updated: February 2026*
*Pipeline version: 3.2.0*
