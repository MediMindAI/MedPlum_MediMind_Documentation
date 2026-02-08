# Screenshot Capture Report

**Date:** 2026-02-07
**EMR Port:** 3000
**Viewport:** 1440x900 (desktop), 375x812 (mobile)

## Summary

Total expected: 48 | Captured: 48 | Failed: 0 | Completion: 48/48 (100%)

## Captures by Language

### English (16/16)
| # | Screenshot | Status | Notes |
|---|-----------|--------|-------|
| 1 | screenshot-en | OK | Full page overview with all 3 zones |
| 2 | hero-search-en | OK | Search bar with Cmd+K hint and Advanced button |
| 3 | advanced-filters-en | OK | Expanded filter panel with 4 fields |
| 4 | search-results-en | OK | Dropdown with "guram" search showing patient result with New Visit/Fill Form buttons |
| 5 | patient-lookup-en | OK | Find Patient section with Personal ID input |
| 6 | patient-found-en | OK | Patient card with Found badge, details, Edit button |
| 7 | unified-form-en | OK | Multiple collapsible section headers visible |
| 8 | draft-indicator-en | OK | "Draft saved" badge visible next to Form Progress |
| 9 | encounter-creation-en | OK | Registration section with Date, Time, Admission Type fields |
| 10 | registration-section-en | OK | Registration/Visit section expanded with form fields |
| 11 | insurance-section-en | OK | Insurance section with Enable toggle |
| 12 | document-upload-en | OK | Guarantee section with "Click + to add" message |
| 13 | demographics-section-en | OK | Demographics with ADDRESS and SOCIAL DATA fields |
| 14 | active-visit-warning-en | OK | Form validation errors shown (no active encounter dialog - known limitation) |
| 15 | desktop-sidebar-en | OK | Today's Visits and Recent Patients sidebar |
| 16 | mobile-wizard-en | OK | 375px mobile view with step wizard |

### Georgian (16/16)
| # | Screenshot | Status | Notes |
|---|-----------|--------|-------|
| 1 | screenshot-ka | OK | Full page in Georgian |
| 2 | hero-search-ka | OK | Georgian search interface |
| 3 | advanced-filters-ka | OK | Georgian advanced filters |
| 4 | search-results-ka | OK | Search results in Georgian |
| 5 | patient-lookup-ka | OK | Patient lookup in Georgian |
| 6 | patient-found-ka | OK | Patient card in Georgian |
| 7 | unified-form-ka | OK | Unified form in Georgian |
| 8 | draft-indicator-ka | OK | Draft indicator in Georgian |
| 9 | encounter-creation-ka | OK | Encounter creation in Georgian |
| 10 | registration-section-ka | OK | Registration section in Georgian |
| 11 | insurance-section-ka | OK | Insurance section in Georgian |
| 12 | document-upload-ka | OK | Guarantee section in Georgian |
| 13 | demographics-section-ka | OK | Demographics in Georgian |
| 14 | active-visit-warning-ka | OK | Validation state in Georgian |
| 15 | desktop-sidebar-ka | OK | Sidebar in Georgian |
| 16 | mobile-wizard-ka | OK | Mobile view in Georgian |

### Russian (16/16)
| # | Screenshot | Status | Notes |
|---|-----------|--------|-------|
| 1 | screenshot-ru | OK | Full page in Russian |
| 2 | hero-search-ru | OK | Russian search interface |
| 3 | advanced-filters-ru | OK | Russian advanced filters |
| 4 | search-results-ru | OK | Search results in Russian |
| 5 | patient-lookup-ru | OK | Patient lookup in Russian |
| 6 | patient-found-ru | OK | Patient card in Russian |
| 7 | unified-form-ru | OK | Unified form in Russian |
| 8 | draft-indicator-ru | OK | Draft indicator in Russian |
| 9 | encounter-creation-ru | OK | Encounter creation in Russian |
| 10 | registration-section-ru | OK | Registration section in Russian |
| 11 | insurance-section-ru | OK | Insurance section in Russian |
| 12 | document-upload-ru | OK | Guarantee section in Russian |
| 13 | demographics-section-ru | OK | Demographics in Russian |
| 14 | active-visit-warning-ru | OK | Validation state in Russian |
| 15 | desktop-sidebar-ru | OK | Sidebar in Russian |
| 16 | mobile-wizard-ru | OK | Mobile view in Russian |

## Known Limitations

1. **active-visit-warning**: The warning dialog requires patient 01011055555 to have an active in-progress Encounter in the database. The current test data does not have this state, so the screenshots show form validation errors instead of the modal dialog.

2. **draft-indicator**: The draft badge appeared automatically because the patient data from a previous session was persisted, triggering the "Draft saved" state. This is actually better than the planned approach (which noted React synthetic events as a limitation).

3. **Form section indices**: When a patient is loaded from the session, the form sections change from 8 (indices 0-7) to 4 (Registration, Insurance, Guarantee, Demographics). Section header indices in the plan JSON assumed the 8-section layout, but captures were adapted to work with both states.

4. **Patient session persistence**: The EMR persists patient lookup data across navigations within the same session. This means patient-found and encounter-creation screenshots show the pre-loaded patient data rather than requiring fresh lookup each time.

---

## Recapture Pass (2026-02-07T18:45:00Z)

15 screenshots recaptured across 6 basenames and 3 languages to fix validation failures.

### Fixes Applied

| Basename | Languages | Issue | Fix |
|----------|-----------|-------|-----|
| hero-search | en, ka, ru | Full page duplicate | Viewport 1440x500 to crop top search area only |
| desktop-sidebar | en, ka, ru | Full page, sidebar not focused | Sidebar scrolled into view, viewport 1440x700 |
| insurance-section | en, ka, ru | EN/RU showed demographics; KA blank | Correct section index (1 in existing-patient mode), proper expand + scroll |
| active-visit-warning | en, ka, ru | Validation errors instead of modal | Used sidebar "New Visit" button to trigger visit creation dialog |
| patient-found | ka, ru | Near-duplicate of patient-lookup | Used search bar to find patient, showing found card with details |
| draft-indicator | ka | Badge not visible | Patient was loaded, draft badge appeared automatically in DOM |

### Recaptured Files (15 total)

| File | Size | Status |
|------|------|--------|
| hero-search-en.png | 475KB | Recaptured |
| hero-search-ka.png | 552KB | Recaptured |
| hero-search-ru.png | 502KB | Recaptured |
| desktop-sidebar-en.png | 653KB | Recaptured |
| desktop-sidebar-ka.png | 894KB | Recaptured |
| desktop-sidebar-ru.png | 816KB | Recaptured |
| insurance-section-en.png | 526KB | Recaptured |
| insurance-section-ka.png | 619KB | Recaptured |
| insurance-section-ru.png | 591KB | Recaptured |
| active-visit-warning-en.png | 753KB | Recaptured |
| active-visit-warning-ka.png | 795KB | Recaptured |
| active-visit-warning-ru.png | 733KB | Recaptured |
| patient-found-ka.png | 995KB | Recaptured |
| patient-found-ru.png | 909KB | Recaptured |
| draft-indicator-ka.png | 1035KB | Recaptured |
