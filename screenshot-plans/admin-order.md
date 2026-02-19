# Screenshot Plan: Admin Order System

**Generated:** 2026-02-06T18:00:00Z
**Source:** sections/en/admin-order.html
**Total Files:** 24 (8 screenshots x 3 languages)

## Screenshots Overview

### Static Screenshots (8)

| ID | Filename Pattern | Description | EMR Route |
|----|------------------|-------------|-----------|
| admin-order-page | admin-order-page-{lang}.png | OrderPage with creation buttons and existing orders table | /emr/dashboard/administration/order |
| admin-order-book | admin-order-book-{lang}.png | OrderBookModal dual-panel with available and selected items | /emr/dashboard/administration/order |
| admin-order-waybill | admin-order-waybill-{lang}.png | WaybillCreationModal with header fields and item entry | /emr/dashboard/administration/order |
| admin-order-confirmation | admin-order-confirmation-{lang}.png | OrderConfirmationPage with 3-section layout | /emr/dashboard/administration/order-confirmation |
| admin-order-item-entry | admin-order-item-entry-{lang}.png | OrderConfirmationItemForm for adding items to active orders | /emr/dashboard/administration/order-confirmation |
| admin-order-details | admin-order-details-{lang}.png | Inline order details with line items and editable quantities | /emr/dashboard/administration/order-confirmation |
| admin-orders-list | admin-orders-list-{lang}.png | OrdersPage flat line item view with prices and delivery status | /emr/dashboard/administration/orders |
| admin-order-group | admin-order-group-{lang}.png | OrderGroupPage with aggregated data grouped by document number | /emr/dashboard/administration/order-group |

### Multi-Step Flows (0)

None.

### State-Based (0)

None.

## Execution Checklist

- [ ] EMR running on localhost:3000-3005
- [ ] Playwright server started
- [ ] Login completed
- [ ] English screenshots captured (8)
- [ ] Georgian screenshots captured (8)
- [ ] Russian screenshots captured (8)
- [ ] All files verified (24 total)

## Capture Strategy

The admin-order screenshots cover four distinct EMR routes across the Order System module. Two screenshots require opening modals from the OrderPage, and two require interacting with table rows on the OrderConfirmationPage.

### Route 1: /emr/dashboard/administration/order (3 screenshots)

1. **admin-order-page**: Navigate to order page, capture full page showing creation buttons and orders table
2. **admin-order-book**: Click the first creation button to open OrderBookModal, capture the dual-panel interface
3. **admin-order-waybill**: Close the book modal, click the second creation button to open WaybillCreationModal, capture the waybill form

### Route 2: /emr/dashboard/administration/order-confirmation (3 screenshots)

4. **admin-order-confirmation**: Navigate to order-confirmation page, capture the full 3-section layout
5. **admin-order-item-entry**: Click the first order row (must be active status) to reveal the item entry form, capture
6. **admin-order-details**: With the order row expanded, scroll to show inline details with line items and editable quantities

### Route 3: /emr/dashboard/administration/orders (1 screenshot)

7. **admin-orders-list**: Navigate to orders page, capture the flat line item view with price and delivery columns

### Route 4: /emr/dashboard/administration/order-group (1 screenshot)

8. **admin-order-group**: Navigate to order-group page, capture the aggregated grouped view

## Known Limitations

| Screenshot | Limitation |
|------------|------------|
| admin-order-book | Requires clicking a creation button; available items depend on receiver department inventory |
| admin-order-waybill | Requires clicking a creation button; item search depends on catalog data |
| admin-order-item-entry | Item entry form only visible for orders with status "active" |
| admin-order-details | Requires clicking an order row to expand; order must have line items |
| admin-orders-list | Prices looked up at display time from warehouse balances; may show empty |
| admin-order-group | Detail modal requires clicking a group row; grouping needs matching document numbers |

## Section-to-Anchor Mapping

| Screenshot | HTML Anchor | Doc Section |
|------------|-------------|-------------|
| admin-order-page | order-page | 12.3 OrderPage |
| admin-order-book | order-book | 12.4 OrderBookModal |
| admin-order-waybill | order-waybill | 12.5 WaybillCreationModal |
| admin-order-confirmation | order-confirmation | 12.6 OrderConfirmationPage |
| admin-order-item-entry | order-confirm-entry | 12.6 Section 1: Item Entry Form |
| admin-order-details | order-confirm-details | 12.6 Section 3: Order Details |
| admin-orders-list | orders-list | 12.7 OrdersPage |
| admin-order-group | order-group | 12.8 OrderGroupPage |

## Prerequisites

- EMR application running on localhost
- Admin credentials: admin@medimind.ge / MediMind2024
- Administration module accessible at /emr/dashboard/administration/*
- Existing order data required for confirmation, details, list, and group pages
- At least one order with "active" status needed for item entry form visibility
