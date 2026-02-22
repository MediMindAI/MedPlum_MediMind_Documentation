# Screenshot Plan: Warehouse Analytics

**Generated:** 2026-02-22
**Source:** sections/en/warehouse-analytics.html
**Total Files:** 36 (12 screenshots x 3 languages)

## CRITICAL: Data Loading Sequence

Before capturing ANY screenshots:
1. Navigate to `/emr/dashboard/warehouse/analytics`
2. Click the **"This Year"** preset pill button
3. Click **Search** button
4. Wait 3 seconds for data to load
5. Data persists across ALL tab switches

## Screenshots Overview

| # | ID | Tab Value | Type | Description |
|---|-----|-----------|------|-------------|
| 1 | wh-analytics-filters | (filter bar) | interactive | Global filter bar with presets and selectors |
| 2 | wh-analytics-balance | balance | interactive | Balance Movement table |
| 3 | wh-analytics-insights | insights | interactive | Top items, movement summary, comparisons |
| 4 | wh-analytics-dead-stock | deadstock | interactive | Zero-movement items |
| 5 | wh-analytics-low-stock | lowstock | interactive | Low supply items with color indicators |
| 6 | wh-analytics-abc-xyz | abcxyz | interactive | 3x3 classification matrix |
| 7 | wh-analytics-expiration | expiration | interactive | Expiry risk time buckets |
| 8 | wh-analytics-suppliers | suppliers | interactive | Supplier scorecard (scroll needed) |
| 9 | wh-analytics-clinical-diagnosis | clinical (sub-tab 1) | interactive | ICD-10 diagnosis cost analysis |
| 10 | wh-analytics-clinical-recall | clinical (sub-tab 2) | state-based | Lot recall search and results |
| 11 | wh-analytics-budget | planning (sub-tab 1) | interactive | Budget vs Actual variance |
| 12 | wh-analytics-forecast | planning (sub-tab 2) | state-based | Demand forecast with sparklines |

## Capture Notes

- **Route:** `/emr/dashboard/warehouse/analytics`
- **Tab container:** `data-testid="analytics-tabs"` with `[role='tab'][value='...']`
- **9 main tabs,** 2 with sub-tabs (clinical: diagnosis + recall, planning: budget + forecast)
- **Data persists** across all tab switches after initial Search

## Checklist

- [ ] wh-analytics-filters — EN / KA / RU
- [ ] wh-analytics-balance — EN / KA / RU
- [ ] wh-analytics-insights — EN / KA / RU
- [ ] wh-analytics-dead-stock — EN / KA / RU
- [ ] wh-analytics-low-stock — EN / KA / RU
- [ ] wh-analytics-abc-xyz — EN / KA / RU
- [ ] wh-analytics-expiration — EN / KA / RU
- [ ] wh-analytics-suppliers — EN / KA / RU
- [ ] wh-analytics-clinical-diagnosis — EN / KA / RU
- [ ] wh-analytics-clinical-recall — EN / KA / RU
- [ ] wh-analytics-budget — EN / KA / RU
- [ ] wh-analytics-forecast — EN / KA / RU
