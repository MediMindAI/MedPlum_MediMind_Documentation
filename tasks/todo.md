# Fix Broken EMR Screenshots

## Problem
11 out of 16 screenshots are broken × 3 languages = 33 files to re-capture.

## Plan

### Step 1: Update features.json capture plans
- [x] Read current screenshot-plans/features.json
- [x] Fix captureSteps (done directly via Playwright instead of updating JSON first)

### Step 2: Re-capture screenshots (EN → KA → RU)
For each language:
- [x] EN: 11 screenshots
- [x] KA: 11 screenshots
- [x] RU: 11 screenshots

### Step 3: Verify
- [x] Read each captured image to confirm content
- [x] All 33 files verified present with reasonable sizes (560KB-890KB each)
- [x] Update completion report

## Review

### Summary of Changes
Re-captured 33 screenshots (11 broken screenshots × 3 languages) using Playwright.

**Screenshots fixed:**
1. **patient-lookup** - Scroll to top, show Find Patient section with Personal ID field
2. **unified-form** - Collapse all sections, scroll to show 7 collapsed headers at once
3. **registration-section** - Expand section 4 via header index click (Georgian label always)
4. **insurance-section** - Expand section 5, enable insurance checkbox to show fields
5. **document-upload** - Expand section 6 (Guarantee) showing upload area
6. **demographics-section** - Expand section 7 showing address fields
7. **search-results** - Fill hero search with "01011055555", show dropdown with patient result
8. **patient-found** - Click patient, expand Personal Information to show populated fields
9. **encounter-creation** - Show Registration section (section 4) with encounter date/time fields
10. **draft-indicator** - Scroll to top showing "Draft saved" badge near Form Progress
11. **active-visit-warning** - Click "New Visit" in dropdown, capture modal overlay

**Root cause fixes applied:**
- Sections 4-7: Used `headers[index].click()` via evaluate (not `text=` selectors which fail for Georgian labels)
- patient-lookup vs unified-form: Different scroll positions (top vs 600px) and section states
- Empty plans (search-results, patient-found, encounter-creation): Implemented full interaction flows
- draft-indicator: Triggered by loading patient data (draft auto-saves), captured badge visible at top
- active-visit-warning: Successfully triggered via dropdown "New Visit" button click

**Session notes:**
- Got logged out during KA captures, re-authenticated successfully
- Insurance checkbox needed explicit enabling to show fields
- Section expansion required careful toggle tracking (some sections auto-expand on page load)
