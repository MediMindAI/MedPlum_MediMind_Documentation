კა# Screenshot Plan: Transfer System (Admin Transfer)

**Generated:** 2026-02-06T20:00:00Z
**Source:** sections/en/admin-transfer.html
**Total Files:** 21 (7 screenshots x 3 languages)

## Screenshots Overview

### Static Screenshots (7)

| ID | Filename Pattern | Description | EMR Route |
|----|------------------|-------------|-----------|
| admin-transfer-create | admin-transfer-create-{lang}.png | TransferCreatePage with action buttons and recent transfers table | /emr/dashboard/administration/transfers |
| admin-transfer-waybill | admin-transfer-waybill-{lang}.png | TransferWaybillModal with header fields, item entry, and line items table | /emr/dashboard/administration/transfers (modal) |
| admin-transfer-book | admin-transfer-book-{lang}.png | TransferBookModal dual-panel interface with available and selected items | /emr/dashboard/administration/transfers (modal) |
| admin-transfer-confirmation | admin-transfer-confirmation-{lang}.png | TransferConfirmationPage with pending transfers approval queue | /emr/dashboard/administration/transfer-confirmation |
| admin-transfer-confirm-modal | admin-transfer-confirm-modal-{lang}.png | Confirmation modal with editable department fields and confirm/reject buttons | /emr/dashboard/administration/transfer-confirmation (modal) |
| admin-transfer-list | admin-transfer-list-{lang}.png | TransferPage with completed transfers list, filters, and edit/delete options | /emr/dashboard/administration/transfer |
| admin-transfer-group | admin-transfer-group-{lang}.png | TransferGroupPage with aggregated transfer data and CSV export | /emr/dashboard/administration/transfer-group |

### Multi-Step Flows (0)

None.

### State-Based (0)

None.

## Execution Checklist

- [ ] EMR running on localhost:3000-3005
- [ ] Playwright server started
- [ ] Login completed
- [ ] Test data exists (transfers in various statuses: in-progress, completed, abandoned)
- [ ] English screenshots captured (7)
- [ ] Georgian screenshots captured (7)
- [ ] Russian screenshots captured (7)
- [ ] All files verified (21 total)

## Capture Strategy

The admin-transfer screenshots cover the complete transfer lifecycle across 4 EMR pages plus 3 modal dialogs.

### Page Screenshots (4)

1. **admin-transfer-create**: Navigate to `/transfers` route (TransferCreatePage). Shows the two action buttons for opening waybill and book modals, plus the recent transfers table with status-colored rows.
2. **admin-transfer-confirmation**: Navigate to `/transfer-confirmation` route (TransferConfirmationPage). Shows the pending transfers approval queue with filter fields.
3. **admin-transfer-list**: Navigate to `/transfer` route (TransferPage). Shows the completed transfers list with all six filter fields (dateFrom, dateTo, fromDept, toDept, goodsSearch, generalSearch).
4. **admin-transfer-group**: Navigate to `/transfer-group` route (TransferGroupPage). Shows the aggregated view grouped by department pairs and date, with CSV export button.

### Modal Screenshots (3)

5. **admin-transfer-waybill**: From TransferCreatePage, click the first action button to open TransferWaybillModal. Shows header fields (Date, Doc Number, From/To Department), item search, line items table, Direct Write-Off checkbox, and Department Password field.
6. **admin-transfer-book**: From TransferCreatePage, click the second action button to open TransferBookModal. Shows the dual-panel interface with available items on left and selected items on right with yellow-highlighted quantity fields.
7. **admin-transfer-confirm-modal**: From TransferConfirmationPage, click the first table row to open the confirmation modal. Shows editable department fields with confirm/reject actions.

### Known Limitations

- All 7 screenshots require test data (transfers in the system) to display meaningful content in tables and modals
- The confirm-modal screenshot requires at least one transfer with `status=in-progress` to appear in the confirmation queue
- Modal button selectors use `nth=0` and `nth=1` which may need adjustment based on actual DOM structure during capture

## Prerequisites

- EMR application running on localhost
- Admin credentials: admin@medimind.ge / MediMind2024
- Administration module accessible at /emr/dashboard/administration/*
- Test data: transfers created in various statuses (in-progress for confirmation queue, completed for transfer list)

## Route Reference

| Route | Page Component | Purpose |
|-------|---------------|---------|
| /emr/dashboard/administration/transfer | TransferPage | Completed transfers list with edit/delete |
| /emr/dashboard/administration/transfers | TransferCreatePage | Create new transfers (waybill or book modal) |
| /emr/dashboard/administration/transfer-confirmation | TransferConfirmationPage | Pending transfers approval queue |
| /emr/dashboard/administration/transfer-group | TransferGroupPage | Aggregated transfer data with CSV export |
