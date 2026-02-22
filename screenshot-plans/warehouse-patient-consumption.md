# Screenshot Plan: Ward Supply / Patient Consumption

**Generated:** 2026-02-22
**Source:** sections/en/warehouse-patient-consumption.html
**Total Files:** 21 (7 screenshots x 3 languages)

## Screenshots Overview

| # | ID | Filename Pattern | Type | Description |
|---|-----|------------------|------|-------------|
| 1 | wh-consumption-overview | wh-consumption-overview-{lang}.png | interactive | Full page 5-region layout |
| 2 | wh-consumption-filters | wh-consumption-filters-{lang}.png | static | Left sidebar (department, calendar, time) |
| 3 | wh-consumption-patient-list | wh-consumption-patient-list-{lang}.png | interactive | Center column patient table |
| 4 | wh-consumption-stock | wh-consumption-stock-{lang}.png | interactive | Right column stock items table |
| 5 | wh-consumption-expenditure | wh-consumption-expenditure-{lang}.png | scroll | Bottom zone expenditure entry |
| 6 | wh-consumption-template | wh-consumption-template-{lang}.png | state-based | Template confirmation modal |
| 7 | wh-consumption-calculation | wh-consumption-calculation-{lang}.png | state-based | Internal calculation modal |

## Capture Notes

- **Route:** `/emr/dashboard/warehouse/patient-consumption`
- **Data loading:** Must select department in left sidebar filter first
- **5-region layout:** Top has 3 columns (filters, patients, stock), bottom has 2 columns (expenditure)
- **Modals:** Template and Calculation open via action buttons in stock column
- **Scrolling:** Needed for expenditure zone (bottom of page)

## Checklist

- [ ] wh-consumption-overview — EN / KA / RU
- [ ] wh-consumption-filters — EN / KA / RU
- [ ] wh-consumption-patient-list — EN / KA / RU
- [ ] wh-consumption-stock — EN / KA / RU
- [ ] wh-consumption-expenditure — EN / KA / RU
- [ ] wh-consumption-template — EN / KA / RU
- [ ] wh-consumption-calculation — EN / KA / RU
