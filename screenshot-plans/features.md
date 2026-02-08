# Screenshot Plan: Patient Registration Features

**Generated:** 2026-02-07
**Source:** sections/en/features.html
**Total Files:** 45 (15 screenshots x 3 languages)

## Screenshots Overview

### Static Screenshots (13)
| ID | Filename Pattern | Description |
|----|------------------|-------------|
| hero-search | hero-search-{lang}.png | Search bar at top of page |
| advanced-filters | advanced-filters-{lang}.png | Expanded filter panel with 4 fields |
| search-results | search-results-{lang}.png | Search dropdown with dual action buttons |
| patient-lookup | patient-lookup-{lang}.png | Personal ID input in form body |
| patient-found | patient-found-{lang}.png | Patient card after successful lookup |
| unified-form | unified-form-{lang}.png | Form overview with collapsible sections |
| draft-indicator | draft-indicator-{lang}.png | Draft auto-save badge |
| encounter-creation | encounter-creation-{lang}.png | Form with patient + visit fields |
| registration-section | registration-section-{lang}.png | Visit Type, Date, Department fields |
| insurance-section | insurance-section-{lang}.png | Insurance company, policy fields |
| document-upload | document-upload-{lang}.png | Guarantee with file upload zone |
| demographics-section | demographics-section-{lang}.png | Region, complaint, referral fields |
| desktop-sidebar | desktop-sidebar-{lang}.png | Today's Visits + Recent Patients |
| mobile-wizard | mobile-wizard-{lang}.png | Mobile 5-step wizard view |

### State-Based Screenshots (2)
- **patient-found** - Requires test patient data (01011055555)
- **active-visit-warning** - Requires patient with active encounter

## Execution Checklist
- [ ] EMR running on localhost:3000 or 3005
- [ ] Playwright server started
- [ ] Login completed
- [ ] English screenshots captured (15)
- [ ] Georgian screenshots captured (15)
- [ ] Russian screenshots captured (15)
- [ ] All files verified

## Prerequisites
- Test patient with personal ID 01011055555
- That patient should have an active Encounter for active-visit-warning screenshot
- Desktop viewport (>1024px) for sidebar screenshots
- Switch language BEFORE resizing to mobile (language buttons hidden on mobile)

## Known Limitations
- **draft-indicator**: Cannot trigger React auto-save badge via Playwright fill
- **active-visit-warning**: Requires specific test data in database
- **patient-found**: Requires existing patient record
- **Sections 4-7**: Always show Georgian labels regardless of language setting (EMR incomplete i18n)
