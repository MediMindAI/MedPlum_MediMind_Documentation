# Warehouse Module — Section Plan

**Feature:** Warehouse Management System
**Category:** `warehouse` (new)
**Routes:** `/emr/dashboard/warehouse/*` + `/emr/dashboard/nomenclature/warehouse`

## Proposed Section Structure

6 documentation files organized by functional area:

### 1. warehouse-overview (file: `warehouse-overview`)
**Dashboard + Analytics overview page**
- Dashboard KPI cards (6 metrics: pending transfers, stock-outs, low stock, expiring, receipts today, transfers today)
- Critical alerts banner
- Quick action cards (new receipt, new transfer, order confirmation, view balances)
- Notifications feed
- Pending approvals + expiry countdown
- Recent activity timeline

**Screenshots (4):**
| # | Basename | Description |
|---|----------|-------------|
| 1 | wh-dashboard-overview | Full dashboard page with KPI cards and quick actions |
| 2 | wh-dashboard-alerts | Critical alerts banner and notifications section |
| 3 | wh-dashboard-activity | Recent activity timeline and pending approvals |
| 4 | wh-dashboard-analytics | Analytics overview with charts |

### 2. warehouse-nomenclature (file: `warehouse-nomenclature`)
**5-tier product catalog and hierarchy**
- Categories (Tier 1) — 12 predefined tags
- Product Groups (Tier 2) — 310 groups
- Sub-categories (Tier 3)
- Medical Items
- Warehouse Products (Tier 5) — 36,513 items
- Hierarchy navigation with cross-filtering
- Add/edit item forms with extended fields

**Screenshots (5):**
| # | Basename | Description |
|---|----------|-------------|
| 5 | wh-nomenclature-categories | Categories tab with list and add form |
| 6 | wh-nomenclature-groups | Product groups tab with hierarchy |
| 7 | wh-nomenclature-items | Warehouse items table with search |
| 8 | wh-nomenclature-hierarchy | 5-tier tab navigation showing hierarchy flow |
| 9 | wh-item-edit | Item edit modal with Main + Attributes tabs |

### 3. warehouse-operations (file: `warehouse-operations`)
**Core supply chain: Receiving, Transfers, Orders**
- Receiving: history tab (grouped invoices) + analytics tab
- Transfers: all transfers + grouped + approval workflow
- Orders: all orders + grouped + confirmation workflow
- Shared patterns: EMRPageHeader + tab cards + modals for creation

**Screenshots (5):**
| # | Basename | Description |
|---|----------|-------------|
| 10 | wh-receiving-list | Receiving history with grouped invoice table |
| 11 | wh-transfer-list | Transfers page with all/grouped/approval tabs |
| 12 | wh-transfer-approval | Transfer approval/confirmation workflow |
| 13 | wh-orders-list | Orders page with order table |
| 14 | wh-order-create | New order creation modal |

### 4. warehouse-inventory (file: `warehouse-inventory`)
**Stock management: Balances, Picking, Write-offs, Patient consumption**
- Stock levels: real-time balances by department
- Picking queue: FEFO-based pick lists with zone grouping
- Write-offs: disposal, expiry, damage tracking with approval
- Patient consumption: ward-level supply tracking

**Screenshots (4):**
| # | Basename | Description |
|---|----------|-------------|
| 15 | wh-inventory-balances | Stock balance table with department breakdown |
| 16 | wh-inventory-picking | Picking queue with FEFO highlighting and zones |
| 17 | wh-writeoffs-list | Write-offs history with approval status |
| 18 | wh-writeoffs-create | New write-off creation form |

### 5. warehouse-procurement (file: `warehouse-procurement`)
**Procurement, Selling, Returns**
- Procurement requests with approval workflow
- Selling: retail/external sales management
- Returns: return processing for purchased items
- All follow same 3-tab pattern (history + analytics + approval)

**Screenshots (3):**
| # | Basename | Description |
|---|----------|-------------|
| 19 | wh-procurement-list | Procurement requests list with status badges |
| 20 | wh-procurement-create | New procurement request form |
| 21 | wh-procurement-approval | Procurement approval workflow |

### 6. warehouse-data-model (file: `warehouse-data-model`)
**FHIR architecture, permissions, business rules (TEXT ONLY — no screenshots)**
- SupplyDelivery: core inventory items and transaction records
- DeviceDefinition: extended item attributes (VAT, pharma details, stock params)
- List: nomenclature hierarchy organization
- Communication: event notifications
- 5 permission codes with dependencies
- Business rules: FEFO, soft delete, auto-generated codes

**Screenshots: 0** (diagrams via Mermaid.js)

---

## Summary

| Metric | Count |
|--------|-------|
| Total sections | 6 |
| Sections with screenshots | 5 |
| Total screenshot basenames | 21 |
| Total PNG files (21 x 3 langs) | 63 |
| Text-only sections | 1 |

## FHIR Resources
- SupplyDelivery — items + transactions (36,513 records)
- DeviceDefinition — extended attributes
- List — nomenclature hierarchy
- Communication — notifications
- SupplyRequest — orders + procurement

## i18n Key Suggestions

| English | Georgian | Russian |
|---------|----------|---------|
| Warehouse | საწყობი | Склад |
| Warehouse Overview | საწყობის მიმოხილვა | Обзор склада |
| Nomenclature | ნომენკლატურა | Номенклатура |
| Operations | ოპერაციები | Операции |
| Inventory | მარაგები | Запасы |
| Procurement | შესყიდვები | Закупки |
| Data Model | მონაცემთა მოდელი | Модель данных |
| Receiving | მიღება | Приемка |
| Transfers | გადაწერები | Переводы |
| Orders | შეკვეთები | Заказы |
| Write-offs | ჩამოწერები | Списания |
| Stock Levels | მარაგის ბალანსი | Остатки |
| Picking | კომპლექტაცია | Комплектация |
| Analytics | ანალიტიკა | Аналитика |
