# Screenshot Plan: Inventory Balances (admin-balances)

**Generated:** 2026-02-06T18:00:00Z
**Source:** sections/en/admin-balances.html
**Total Files:** 18 (6 screenshots x 3 languages)

## Screenshots Overview

### Static Screenshots (6)

| ID | Filename Pattern | Description | EMR Route |
|----|------------------|-------------|-----------|
| admin-balances-page | admin-balances-page-{lang}.png | Full desktop view of the Balances page showing filters and 9-column data table | /emr/dashboard/administration/balances |
| admin-balances-filters | admin-balances-filters-{lang}.png | Top filter bar with date, department, item group, quantity checkboxes, and grouped toggle | /emr/dashboard/administration/balances |
| admin-balances-table | admin-balances-table-{lang}.png | 9-column data table with gradient header, in-table filter row, and striped data rows | /emr/dashboard/administration/balances |
| admin-balances-negative | admin-balances-negative-{lang}.png | Negative quantity values displayed in red bold text in Quantity and Total columns | /emr/dashboard/administration/balances |
| admin-balances-mobile | admin-balances-mobile-{lang}.png | Mobile card view at 375px viewport with type badges and stacked card layout | /emr/dashboard/administration/balances |
| admin-balances-export | admin-balances-export-{lang}.png | Excel export button in the in-table filter row alongside refresh and search inputs | /emr/dashboard/administration/balances |

### Multi-Step Flows (0)

None.

### State-Based (0)

None.

## Known Limitations

| Screenshot | Limitation | Details |
|------------|-----------|---------|
| admin-balances-negative | requires-test-data | Negative balances require specific inventory state where outbound transfers exceed receipts. The Show Negative checkbox must be enabled and matching data must exist in the system. |

## Execution Checklist

- [ ] EMR running on localhost:3000-3005
- [ ] Playwright server started
- [ ] Login completed
- [ ] English screenshots captured (6)
- [ ] Georgian screenshots captured (6)
- [ ] Russian screenshots captured (6)
- [ ] All files verified (18 total)

## Capture Strategy

All 6 screenshots target the same EMR route (`/emr/dashboard/administration/balances`). The strategy is:

1. **admin-balances-page**: Navigate to balances page at 1440x900, wait for data load, capture the full page showing both filter bar and data table in a single view.

2. **admin-balances-filters**: Scroll to the top of the page to ensure the filter bar (date, department, item group dropdowns and quantity checkboxes) is fully visible. Capture focuses on the top portion of the page.

3. **admin-balances-table**: Scroll the data table into view below the filter bar. The table has a gradient header row, an in-table filter row with search inputs and action buttons, followed by striped data rows showing all 9 columns.

4. **admin-balances-negative**: Enable the "Show Negative" checkbox to include items with negative balances. Locate red bold text cells in the Quantity/Total columns and scroll them into view. **Requires test data** -- the system must have items where outbound transfers exceed receipts.

5. **admin-balances-mobile**: Set viewport to 375x812 (iPhone-sized), wait for the responsive layout to transform the table into card-based view. Capture the mobile cards, then reset viewport to 1440x900.

6. **admin-balances-export**: Locate the Excel export button in the in-table filter row (second header row of the table). Scroll the button area into view and capture showing the export and refresh buttons alongside the column-level search inputs.

## Section-to-Screenshot Mapping

| Doc Section | Anchor ID | Screenshot |
|-------------|-----------|------------|
| 13.3 BalancesPage Layout | balances-layout | admin-balances-page |
| 13.4 Filter System | balances-filters | admin-balances-filters |
| 13.5 Data Table | balances-data-table | admin-balances-table |
| 13.5 Negative Quantity Highlighting | negative-highlighting | admin-balances-negative |
| 13.6 Mobile Card View | balances-mobile | admin-balances-mobile |
| 13.7 Export | balances-export | admin-balances-export |

## Data Table Columns (9)

For reference when verifying the admin-balances-table screenshot:

| # | Column | Width | Content |
|---|--------|-------|---------|
| 1 | Code | 7% | Item identification code |
| 2 | Goods | 20% | Item name / description |
| 3 | Type | 10% | Item category (from 11 types) |
| 4 | Quantity | 9% | Current balance amount |
| 5 | Price | 8% | Unit price |
| 6 | Total | 9% | Quantity x Price |
| 7 | Unit | 7% | Unit of measure |
| 8 | Expiration | 11% | Expiry date (YYYY-MM-DD) |
| 9 | Series | 12% | Batch/lot number |

## Prerequisites

- EMR application running on localhost
- Admin credentials: admin@medimind.ge / MediMind2024
- Balances page accessible at /emr/dashboard/administration/balances
- For admin-balances-negative: inventory data with negative balances must exist (outbound transfers > receipts for at least one department/item)
