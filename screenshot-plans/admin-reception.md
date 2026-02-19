# Screenshot Plan: Administration Reception

**Generated:** 2026-02-06T18:00:00Z
**Source:** sections/en/admin-reception.html
**Total Files:** 21 (7 screenshots x 3 languages)

## Screenshots Overview

### Static Screenshots (7)

| ID | Filename Pattern | Description | EMR Route |
|----|------------------|-------------|-----------|
| admin-reception-page | admin-reception-page-{lang}.png | ReceptionPage quick entry with last 20 receipts table | /emr/dashboard/administration/reception |
| admin-reception-create | admin-reception-create-{lang}.png | Receipt creation form modal (header + line items) | /emr/dashboard/administration/reception |
| admin-receptions-list | admin-receptions-list-{lang}.png | Full receivings list with 11-column table | /emr/dashboard/administration/receptions |
| admin-receptions-filters | admin-receptions-filters-{lang}.png | 11-field filter panel on ReceptionsPage | /emr/dashboard/administration/receptions |
| admin-reception-export | admin-reception-export-{lang}.png | Excel/PDF export buttons on ReceptionsPage | /emr/dashboard/administration/receptions |
| admin-reception-group | admin-reception-group-{lang}.png | Receipts grouped by invoice number (8-column table) | /emr/dashboard/administration/reception-group |
| admin-reception-edit | admin-reception-edit-{lang}.png | ReceivingEditModal with 13 editable fields | /emr/dashboard/administration/receptions |

### Multi-Step Flows (0)

None.

### State-Based (0)

None.

## Modal Screenshots

Two screenshots require opening a modal dialog:

1. **admin-reception-create** - Click the "Create Receipt" button on ReceptionPage to open ReceiptFormModal
2. **admin-reception-edit** - Click the edit button on the first table row in ReceptionsPage to open ReceivingEditModal

## Data Dependencies

The following screenshots require existing receipt data in the system to display meaningful content:

| Screenshot | Requirement |
|------------|-------------|
| admin-reception-page | At least a few receipts must exist to populate the last-20 table |
| admin-receptions-list | Receipt data needed for the full list table |
| admin-reception-group | Receipts with invoice numbers needed for grouping |
| admin-reception-edit | At least one receipt row must exist to click edit on |

## Execution Checklist

- [ ] EMR running on localhost:3000-3005
- [ ] Playwright server started
- [ ] Login completed
- [ ] Verify receipt data exists in the system (at least a few SupplyDelivery resources)

### English (7 screenshots)

- [ ] admin-reception-page-en.png - ReceptionPage with recent receipts table
- [ ] admin-reception-create-en.png - ReceiptFormModal (open via Create Receipt button)
- [ ] admin-receptions-list-en.png - Full receptions list (11 columns)
- [ ] admin-receptions-filters-en.png - 11-field filter panel
- [ ] admin-reception-export-en.png - Export buttons (Excel/PDF)
- [ ] admin-reception-group-en.png - Grouped by invoice number
- [ ] admin-reception-edit-en.png - ReceivingEditModal (open via row edit button)

### Georgian (7 screenshots)

- [ ] admin-reception-page-ka.png
- [ ] admin-reception-create-ka.png
- [ ] admin-receptions-list-ka.png
- [ ] admin-receptions-filters-ka.png
- [ ] admin-reception-export-ka.png
- [ ] admin-reception-group-ka.png
- [ ] admin-reception-edit-ka.png

### Russian (7 screenshots)

- [ ] admin-reception-page-ru.png
- [ ] admin-reception-create-ru.png
- [ ] admin-receptions-list-ru.png
- [ ] admin-receptions-filters-ru.png
- [ ] admin-reception-export-ru.png
- [ ] admin-reception-group-ru.png
- [ ] admin-reception-edit-ru.png

### Verification

- [ ] All 21 files exist in images/ directory
- [ ] Each image shows correct language text
- [ ] Modal screenshots show the dialog overlay
- [ ] Table screenshots show column headers
- [ ] Filter panel screenshot shows all 11 fields
- [ ] Export screenshot shows Excel/PDF options
- [ ] Group page shows aggregated rows by invoice number

## Capture Strategy

The admin-reception section covers 3 EMR routes and 2 modal dialogs:

1. **admin-reception-page**: Navigate to `/reception`, capture the full page with recent receipts table and action buttons
2. **admin-reception-create**: On the same page, click the Create Receipt button to open the ReceiptFormModal, then capture the modal showing header fields and line item fields
3. **admin-receptions-list**: Navigate to `/receptions`, capture the full 11-column table with receipt data
4. **admin-receptions-filters**: On the same page, ensure the filter panel is visible/scrolled into view, capture showing all 11 filter fields
5. **admin-reception-export**: On the same page, capture the area showing Excel and PDF export buttons
6. **admin-reception-group**: Navigate to `/reception-group`, capture the grouped table with 8 columns
7. **admin-reception-edit**: Navigate to `/receptions`, click the edit button on the first table row to open ReceivingEditModal, capture the modal with all 13 editable fields

For each screenshot, repeat in all 3 languages by clicking the language switcher buttons (ENG / RUS / ქარ).

## Prerequisites

- EMR application running on localhost
- Admin credentials: admin@medimind.ge / MediMind2024
- Administration module accessible at /emr/dashboard/administration/*
- Existing receipt data (SupplyDelivery resources) for table and edit modal screenshots
