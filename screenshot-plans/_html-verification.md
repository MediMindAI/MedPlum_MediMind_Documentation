# HTML-to-Image Verification Report

**Generated:** 2026-02-09
**Scope:** All `sections/{en,ka,ru}/*.html` files verified against `images/*.png` and `screenshot-plans/*.json`

---

## Summary

| Metric | Value |
|--------|-------|
| Total unique basenames in HTML | 16 |
| Total PNG files expected (16 x 3 langs) | 48 |
| Total PNG files found on disk | 48 |
| Missing image files | 0 |
| Orphaned image files (not in HTML) | 0 |
| HTML files with screenshots | 2 (features.html, overview.html) |
| HTML files without screenshots | 3 (architecture.html, troubleshooting.html, technical-overview.html) |
| Cross-language consistency errors | 0 |
| Plan-to-HTML count mismatches | 0 |
| **Overall verdict** | **PASS** |

---

## 1. English Section Analysis (sections/en/)

### sections/en/features.html -- 15 screenshots

| # | data-i18n-img | src attribute | Has data-i18n-img | src uses -en.png | en file exists | ka file exists | ru file exists | Status |
|---|---------------|---------------|-------------------|-----------------|---------------|---------------|---------------|--------|
| 1 | hero-search | images/hero-search-en.png | YES | YES | YES | YES | YES | PASS |
| 2 | advanced-filters | images/advanced-filters-en.png | YES | YES | YES | YES | YES | PASS |
| 3 | search-results | images/search-results-en.png | YES | YES | YES | YES | YES | PASS |
| 4 | patient-lookup | images/patient-lookup-en.png | YES | YES | YES | YES | YES | PASS |
| 5 | patient-found | images/patient-found-en.png | YES | YES | YES | YES | YES | PASS |
| 6 | unified-form | images/unified-form-en.png | YES | YES | YES | YES | YES | PASS |
| 7 | draft-indicator | images/draft-indicator-en.png | YES | YES | YES | YES | YES | PASS |
| 8 | additional-details | images/additional-details-en.png | YES | YES | YES | YES | YES | PASS |
| 9 | desktop-sidebar | images/desktop-sidebar-en.png | YES | YES | YES | YES | YES | PASS |
| 10 | mobile-wizard | images/mobile-wizard-en.png | YES | YES | YES | YES | YES | PASS |
| 11 | registration-section | images/registration-section-en.png | YES | YES | YES | YES | YES | PASS |
| 12 | encounter-creation | images/encounter-creation-en.png | YES | YES | YES | YES | YES | PASS |
| 13 | insurance-section | images/insurance-section-en.png | YES | YES | YES | YES | YES | PASS |
| 14 | active-visit-warning | images/active-visit-warning-en.png | YES | YES | YES | YES | YES | PASS |
| 15 | demographics-section | images/demographics-section-en.png | YES | YES | YES | YES | YES | PASS |

### sections/en/overview.html -- 1 screenshot

| # | data-i18n-img | src attribute | Has data-i18n-img | src uses -en.png | en file exists | ka file exists | ru file exists | Status |
|---|---------------|---------------|-------------------|-----------------|---------------|---------------|---------------|--------|
| 1 | screenshot | images/screenshot-en.png | YES | YES | YES | YES | YES | PASS |

### sections/en/architecture.html -- 0 screenshots

No `<img class="doc-screenshot-image">` tags found. Uses only Mermaid diagrams and tables. Correct.

### sections/en/troubleshooting.html -- 0 screenshots

No `<img class="doc-screenshot-image">` tags found. Text-only troubleshooting content. Correct.

### sections/en/technical-overview.html -- 0 screenshots

No `<img class="doc-screenshot-image">` tags found. Text-only platform overview content. Correct.

---

## 2. Georgian Cross-Language Check (sections/ka/)

### sections/ka/features.html -- 15 screenshots

| # | data-i18n-img | src attribute | src uses -ka.png | Matches EN basename |
|---|---------------|---------------|-----------------|---------------------|
| 1 | hero-search | images/hero-search-ka.png | YES | YES |
| 2 | advanced-filters | images/advanced-filters-ka.png | YES | YES |
| 3 | search-results | images/search-results-ka.png | YES | YES |
| 4 | patient-lookup | images/patient-lookup-ka.png | YES | YES |
| 5 | patient-found | images/patient-found-ka.png | YES | YES |
| 6 | unified-form | images/unified-form-ka.png | YES | YES |
| 7 | draft-indicator | images/draft-indicator-ka.png | YES | YES |
| 8 | additional-details | images/additional-details-ka.png | YES | YES |
| 9 | desktop-sidebar | images/desktop-sidebar-ka.png | YES | YES |
| 10 | mobile-wizard | images/mobile-wizard-ka.png | YES | YES |
| 11 | registration-section | images/registration-section-ka.png | YES | YES |
| 12 | encounter-creation | images/encounter-creation-ka.png | YES | YES |
| 13 | insurance-section | images/insurance-section-ka.png | YES | YES |
| 14 | active-visit-warning | images/active-visit-warning-ka.png | YES | YES |
| 15 | demographics-section | images/demographics-section-ka.png | YES | YES |

**Result:** All 15 basenames match EN. All src attributes use `-ka.png` suffix. PASS.

### sections/ka/overview.html -- 1 screenshot

| # | data-i18n-img | src attribute | src uses -ka.png | Matches EN basename |
|---|---------------|---------------|-----------------|---------------------|
| 1 | screenshot | images/screenshot-ka.png | YES | YES |

**Result:** PASS.

### sections/ka/architecture.html -- 0 screenshots (matches EN)
### sections/ka/troubleshooting.html -- 0 screenshots (matches EN)
### sections/ka/technical-overview.html -- 0 screenshots (matches EN)

---

## 3. Russian Cross-Language Check (sections/ru/)

### sections/ru/features.html -- 15 screenshots

| # | data-i18n-img | src attribute | src uses -ru.png | Matches EN basename |
|---|---------------|---------------|-----------------|---------------------|
| 1 | hero-search | images/hero-search-ru.png | YES | YES |
| 2 | advanced-filters | images/advanced-filters-ru.png | YES | YES |
| 3 | search-results | images/search-results-ru.png | YES | YES |
| 4 | patient-lookup | images/patient-lookup-ru.png | YES | YES |
| 5 | patient-found | images/patient-found-ru.png | YES | YES |
| 6 | unified-form | images/unified-form-ru.png | YES | YES |
| 7 | draft-indicator | images/draft-indicator-ru.png | YES | YES |
| 8 | additional-details | images/additional-details-ru.png | YES | YES |
| 9 | desktop-sidebar | images/desktop-sidebar-ru.png | YES | YES |
| 10 | mobile-wizard | images/mobile-wizard-ru.png | YES | YES |
| 11 | registration-section | images/registration-section-ru.png | YES | YES |
| 12 | encounter-creation | images/encounter-creation-ru.png | YES | YES |
| 13 | insurance-section | images/insurance-section-ru.png | YES | YES |
| 14 | active-visit-warning | images/active-visit-warning-ru.png | YES | YES |
| 15 | demographics-section | images/demographics-section-ru.png | YES | YES |

**Result:** All 15 basenames match EN. All src attributes use `-ru.png` suffix. PASS.

### sections/ru/overview.html -- 1 screenshot

| # | data-i18n-img | src attribute | src uses -ru.png | Matches EN basename |
|---|---------------|---------------|-----------------|---------------------|
| 1 | screenshot | images/screenshot-ru.png | YES | YES |

**Result:** PASS.

### sections/ru/architecture.html -- 0 screenshots (matches EN)
### sections/ru/troubleshooting.html -- 0 screenshots (matches EN)
### sections/ru/technical-overview.html -- 0 screenshots (matches EN)

---

## 4. Screenshot Plan Cross-Reference

### features.json

| Metric | Value |
|--------|-------|
| Screenshots defined in plan | 15 |
| data-i18n-img basenames in features.html | 15 |
| **Match** | **YES** |

Plan screenshot IDs vs HTML basenames:

| Plan # | Plan ID | HTML data-i18n-img | Match |
|--------|---------|-------------------|-------|
| 1 | hero-search | hero-search | YES |
| 2 | advanced-filters | advanced-filters | YES |
| 3 | search-results | search-results | YES |
| 4 | patient-lookup | patient-lookup | YES |
| 5 | patient-found | patient-found | YES |
| 6 | unified-form | unified-form | YES |
| 7 | draft-indicator | draft-indicator | YES |
| 8 | additional-details | additional-details | YES |
| 9 | desktop-sidebar | desktop-sidebar | YES |
| 10 | mobile-wizard | mobile-wizard | YES |
| 11 | registration-section | registration-section | YES |
| 12 | encounter-creation | encounter-creation | YES |
| 13 | insurance-section | insurance-section | YES |
| 14 | active-visit-warning | active-visit-warning | YES |
| 15 | demographics-section | demographics-section | YES |

### overview.json

| Metric | Value |
|--------|-------|
| Screenshots defined in plan | 1 |
| data-i18n-img basenames in overview.html | 1 |
| **Match** | **YES** |

| Plan # | Plan ID | HTML data-i18n-img | Match |
|--------|---------|-------------------|-------|
| 1 | screenshot | screenshot | YES |

---

## 5. Image File Inventory

### All 48 PNG files on disk (16 basenames x 3 languages)

```
images/active-visit-warning-{en,ka,ru}.png
images/additional-details-{en,ka,ru}.png
images/advanced-filters-{en,ka,ru}.png
images/demographics-section-{en,ka,ru}.png
images/desktop-sidebar-{en,ka,ru}.png
images/draft-indicator-{en,ka,ru}.png
images/encounter-creation-{en,ka,ru}.png
images/hero-search-{en,ka,ru}.png
images/insurance-section-{en,ka,ru}.png
images/mobile-wizard-{en,ka,ru}.png
images/patient-found-{en,ka,ru}.png
images/patient-lookup-{en,ka,ru}.png
images/registration-section-{en,ka,ru}.png
images/screenshot-{en,ka,ru}.png
images/search-results-{en,ka,ru}.png
images/unified-form-{en,ka,ru}.png
```

- Missing files: **0**
- Orphaned files (on disk but not in any HTML): **0**

### Note: Stray nested directory

There is a stray `images/images/hero-search-en.png` file inside a nested `images/images/` directory. This file is NOT referenced by any HTML and appears to be an accidental duplicate. It is not counted in the verification above as it is not used by the documentation site.

---

## 6. Capture Quality Notes (from plan JSON status fields)

The following screenshots have plan-level quality notes that are informational only (the image files exist and HTML references are correct):

| Basename | Note |
|----------|------|
| search-results | KA/RU marked `needs-recapture` in plan -- "No search results dropdown visible" |
| demographics-section | KA/RU marked `needs-recapture` in plan -- "Byte-identical to EN file" |
| screenshot (overview) | EN marked `needs-recapture` in plan -- "Shows modal dialog overlay" |
| active-visit-warning | All 3 languages note: "Shows sidebar nav instead of warning modal" |

These are capture quality issues (the screenshot content may not match the desired state), but the HTML-to-file mapping is correct in all cases. The files exist and are properly referenced.

---

## Verdict: PASS

All 16 unique screenshot basenames across all 3 languages (EN, KA, RU) are correctly configured:

1. Every `<img class="doc-screenshot-image">` tag has a `data-i18n-img` attribute
2. Every `data-i18n-img` basename has matching files: `images/{basename}-en.png`, `images/{basename}-ka.png`, `images/{basename}-ru.png`
3. EN HTML files use `-en.png` suffix in `src`, KA files use `-ka.png`, RU files use `-ru.png`
4. The same basenames and `data-i18n-img` attributes exist consistently across all 3 language versions
5. HTML screenshot counts match screenshot plan counts exactly (15 in features, 1 in overview)
6. All 48 PNG files exist on disk with no missing or orphaned files
