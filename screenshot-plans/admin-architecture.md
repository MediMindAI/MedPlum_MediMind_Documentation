# Screenshot Plan: Administration Architecture (Data Flow & FHIR Architecture)

**Generated:** 2026-02-06T18:00:00Z
**Source:** sections/en/admin-architecture.html
**Total Files:** 6 (2 screenshots x 3 languages)

## Screenshots Overview

### Static Screenshots (2)

| ID | Filename Pattern | Description | EMR Route | Known Limitation |
|----|------------------|-------------|-----------|------------------|
| admin-fhir-supply-delivery | admin-fhir-supply-delivery-{lang}.png | SupplyDelivery resource structure showing receipt and transfer fields | /emr/dashboard/administration/reception (detail view) | requires-test-data |
| admin-fhir-supply-request | admin-fhir-supply-request-{lang}.png | SupplyRequest resource structure showing order fields and line items extension | /emr/dashboard/administration/order-confirmation (detail view) | requires-test-data |

### Multi-Step Flows (0)

None.

### State-Based (0)

None.

## Execution Checklist

- [ ] EMR running on localhost:3000-3005
- [ ] Playwright server started
- [ ] Login completed
- [ ] Test data present (at least 1 SupplyDelivery receipt, 1 SupplyRequest order)
- [ ] English screenshots captured (2)
- [ ] Georgian screenshots captured (2)
- [ ] Russian screenshots captured (2)
- [ ] All files verified (6 total)

## Capture Strategy

Both screenshots in this section are architectural/reference images showing FHIR resource structures. They require existing test data on the Medplum server. Three approaches are listed in priority order:

### Primary Approach: EMR Resource Detail View

1. **admin-fhir-supply-delivery**: Navigate to the Reception page, click on an existing receipt to open its detail/edit view, capture the page showing SupplyDelivery resource fields (receipt number, invoice number, status, supplier, destination department, line items with code/name/type/quantity/price/unit/expiration/series)
2. **admin-fhir-supply-request**: Navigate to the Order Confirmation page, click on an existing order to open its detail/edit view, capture the page showing SupplyRequest resource fields (order document number, status, requester department, receiver department, ORDER_LINE_ITEMS extension)

### Alternative Approach 1: EMR Table Row Click

If resource detail links are not present, try clicking on the first table row directly to open the resource detail panel or modal.

### Alternative Approach 2: Documentation Site Code Blocks

If no test data exists in the EMR, capture the FHIR resource reference tables directly from the documentation site itself:
- Navigate to `http://localhost:8000/#/admin-architecture/arch-fhir-resources`
- Scroll to the SupplyDelivery (Receipts) section for the first screenshot
- Scroll to the SupplyRequest (Orders) section for the second screenshot

This fallback produces language-neutral screenshots since the documentation tables use English technical terms, but the surrounding doc site UI will reflect the selected language.

## HTML Anchor Mapping

| Screenshot ID | Section Anchor | Nearest Heading |
|---------------|---------------|-----------------|
| admin-fhir-supply-delivery | arch-fhir-resources | 14.4 FHIR Resource Reference |
| admin-fhir-supply-request | arch-fhir-resources | 14.4 FHIR Resource Reference |

Both images appear in the HTML after the "Key Differences: Receipt vs Transfer vs Order" table (anchor `resource-comparison`) and before section 14.5 "Extension Reference" (anchor `arch-extensions`).

## FHIR Resource Fields to Verify

### SupplyDelivery (admin-fhir-supply-delivery)
The captured screenshot should show evidence of these fields:
- `resourceType: SupplyDelivery`
- `identifier` with system `receipt-number` or `transfer-document-number`
- `status` (in-progress, completed, or abandoned)
- `supplier` reference (for receipts)
- Extensions: `document-type`, `source-department`, `destination-department`
- Item extensions: `item-code`, `item-name`, `item-type`, `item-quantity`, `item-price`, `item-total`, `item-unit`, `item-expiration`, `item-series`

### SupplyRequest (admin-fhir-supply-request)
The captured screenshot should show evidence of these fields:
- `resourceType: SupplyRequest`
- `identifier` with system `order-document-number`
- `status` (active, completed, or cancelled)
- Extensions: `requester-department`, `receiver-department`
- `ORDER_LINE_ITEMS` extension (JSON-encoded array of line items)
- Common extensions: `document-date`, `document-number`, `created-by`, `notes`

## Prerequisites

- EMR application running on localhost
- Admin credentials: admin@medimind.ge / MediMind2024
- Administration module accessible at /emr/dashboard/administration/*
- At least one SupplyDelivery resource (receipt) with status completed or in-progress
- At least one SupplyRequest resource (order) with status active or completed
- If no test data available, documentation site running on localhost:8000 as fallback
