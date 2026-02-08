# Screenshot Plan: Patient Search & Registration Form

**Generated:** 2026-02-08
**Source:** sections/en/features.html
**Total Files:** 45 (15 screenshots x 3 languages)

## Screenshots Overview

### Static Screenshots (5)
| # | ID | Filename Pattern | Description |
|---|-----|------------------|-------------|
| 1 | hero-search | hero-search-{lang}.png | Search bar at top of registration page |
| 4 | patient-lookup | patient-lookup-{lang}.png | Personal ID input field in form body |
| 6 | unified-form | unified-form-{lang}.png | Multiple collapsible form sections |
| 9 | desktop-sidebar | desktop-sidebar-{lang}.png | Right sidebar with Today's Visits and Recent Patients |
| 7 | draft-indicator | draft-indicator-{lang}.png | Draft auto-save badge (knownLimitation: react-synthetic-events) |

### Interactive Screenshots (8)
| # | ID | Filename Pattern | Description |
|---|-----|------------------|-------------|
| 2 | advanced-filters | advanced-filters-{lang}.png | Expanded advanced filter panel |
| 3 | search-results | search-results-{lang}.png | Search dropdown with patient results |
| 5 | patient-found | patient-found-{lang}.png | Patient card after lookup |
| 8 | additional-details | additional-details-{lang}.png | Additional Details section (Marital Status, Citizenship, Workplace) |
| 11 | registration-section | registration-section-{lang}.png | Visit type, department, date fields |
| 12 | encounter-creation | encounter-creation-{lang}.png | Encounter form with populated fields |
| 13 | insurance-section | insurance-section-{lang}.png | Insurance toggle and company fields |
| 15 | demographics-section | demographics-section-{lang}.png | Region, district, social fields |

### State-Based Screenshots (1)
| # | ID | Filename Pattern | Description | Known Limitation |
|---|-----|------------------|-------------|------------------|
| 14 | active-visit-warning | active-visit-warning-{lang}.png | Warning modal for existing visit | requires-test-data |

### Responsive Screenshots (1)
| # | ID | Filename Pattern | Description |
|---|-----|------------------|-------------|
| 10 | mobile-wizard | mobile-wizard-{lang}.png | Mobile step wizard view (375x812) |

## Execution Checklist
- [ ] EMR running on localhost:3005 (or 3000)
- [ ] Playwright server started
- [ ] Login completed
- [ ] English screenshots captured (15 files)
- [ ] Georgian screenshots captured (15 files)
- [ ] Russian screenshots captured (15 files)
- [ ] All files verified

## Prerequisites
- Test patient with active visit (ID: 01011055555) for active-visit-warning screenshot

## Capture Notes
- Form sections use smart toggle: check `.classList.contains('open')` before clicking
- Scroll container: `div[class*="transitionContainer"]`
- Sections 4-7 always show Georgian labels regardless of language
- Mobile screenshots: switch language BEFORE resizing viewport to 375x812
- Draft indicator badge cannot be triggered via Playwright (React synthetic events)
- Insurance section: must click Enable checkbox to reveal company fields
- Per-screenshot language loop: capture EN/KA/RU for each screenshot before moving to next
