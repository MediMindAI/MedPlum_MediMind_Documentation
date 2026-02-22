# MediMind Doc Writer - Agent Memory

## EMR Application Details
- **Confirmed port**: 3000 (not 3005 as documentation suggests; check both)
- **Login**: email=`admin@medimind.ge`, password=`MediMind2024`
- **Email input**: `input[placeholder='name@domain.com']`
- **Registration page**: `/emr/registration/registration`

## Language Switching
- Desktop buttons: `text=ENG`, `text=РУС`, `text=ქარ`
- **Mobile has NO language buttons** - they are not rendered at all in viewport < 768px
- **Workaround**: Switch language on desktop viewport first, then resize to mobile
- Wait 2000ms after language switch for UI to update

## Playwright Server (port 9222)
- Server file: `scripts/playwright/server.ts`
- Commands: navigate, fill, click, screenshot, wait, waitfor, text, url, evaluate, scroll, viewport, stop
- **viewport command**: Added 2026-02-05 to support mobile screenshots (`viewport "375" "812"`)
- Screenshots save to: `/Users/toko/Desktop/MedPlum_MediMind_Documentation-main/images/`
- `--fullpage` flag for full page screenshots

## Form Structure
- 8 form sections accessed via `.emr-form-section-header` (querySelectorAll by index 0-7)
- Section order: Patient (0), Personal Information (1), Contact (2), Additional Details (3), Registration (4), Insurance (5), Guarantee (6), Demographics (7)
- Sections 4-7 (Registration through Demographics) keep Georgian labels regardless of language switch
- Form uses wizard steps visible in progress bar (Patient, Personal Info, Contact Info, Registration, Insurance)
- **Collapsible sections**: Click `.emr-form-section-header` to expand/collapse

## Known Limitations
- **Draft auto-save badge**: Cannot be triggered via Playwright - React form state requires actual user interaction through React synthetic events, not JS value setting
- **Active visit warning**: Requires a patient with `Encounter.status='in-progress'`; test patient 01011055555 has 0 visits
- **React form inputs**: `nativeInputValueSetter` approach works for triggering search but NOT for form validation/draft save
- **Sidebar intercepts clicks**: When search results overlap sidebar, use `evaluate "btn.click()"` instead of Playwright click

## Screenshot Patterns
- Hero search: `.registration-search-hero-section`
- Sidebar: `.registration-sidebar-section`
- Form area: `.registration-form-section`
- Search results: `[class*=_resultItem]` with `[class*=_newVisitButton]` action buttons
- Advanced filters toggle: `button:has-text('Advanced')` or `[class*=advancedToggle]`

## File Naming
- Pattern: `{feature-name}-{lang}.png` (e.g., `hero-search-en.png`)
- Languages: `en`, `ka`, `ru`

## Documentation HTML Patterns (Updated 2026-02-06)

### CSS Classes for Sections
- `.doc-section` - Main section container with fadeInUp animation
- `.doc-section-header` - Header with icon + h2
- `.doc-section-icon` - 48x48 gradient icon box
- `.doc-section-number` - Circular numbered badge
- `.doc-table-container` + `.doc-table` - Responsive tables
- `.doc-code-block` - Code blocks with dark background (#1a365d)
- `.doc-info-box` + `.doc-info-icon` + `.doc-info-content` - Blue info callouts
- `.doc-warning-box` - Orange warning callouts
- `.doc-list` - Styled bullet lists with gradient dots
- `.doc-collapsible` - Collapsible details/summary sections (added 2026-02-06)
- `.doc-status-badges` - Status indicator badges

### Collapsible Sections Pattern
```html
<details class="doc-collapsible">
  <summary class="doc-collapsible-header">
    <span class="doc-collapsible-icon"><svg>...</svg></span>
    <strong>Title</strong>
  </summary>
  <div class="doc-collapsible-content">Content here</div>
</details>
```

### Mermaid Diagrams
- Wrap in `.mermaid-container` > `.mermaid.mermaid-zoomable`
- Include zoom button controls
- Dark theme configured in page.js

### Code Highlighting
- No Prism.js - uses `.doc-code-block` with `language-typescript` class
- Code appears in light text (#e5e7eb) on dark blue (#1a365d)

### Section Files Location
- English: `sections/en/{section}.html`
- Georgian: `sections/ka/{section}.html`
- Russian: `sections/ru/{section}.html`

### Source File Conversion
- AI chatbot components source: `/Users/toko/Desktop/medplum_medimind/explanations/features/ai-chatbot-emr/`
- Contains: components.md, state-management.md, hooks.md

## Warehouse Module Source Paths (Verified 2026-02-16)
- View: `views/nomenclature/WarehouseNomenclatureView.tsx` (462 lines)
- Tabs: `components/warehouse/tabs/{CategoriesTab,ItemGroupsTab,SubCategoryTab,MedicalItemsTab,WarehouseItemsTab}.tsx`
- Edit form: `components/warehouse/forms/WarehouseEditForm.tsx` (831 lines, 2-tab: Main + Attributes)
- Info panel: `components/warehouse/WarehouseInfoPanel.tsx` (collapsible 5-level hierarchy explainer)
- Types: `types/warehouse.ts` (918 lines - complete FHIR extension mappings)
- Tab type: `WarehouseNomenclatureTabType = 'categories' | 'groups' | 'subCategories' | 'items' | 'warehouse'`
- FHIR resources: List (4 codes for levels 1-4), SupplyDelivery (level 5), DeviceDefinition (edit modal)
- Cross-filter: clicking group -> filters items; clicking item -> filters warehouse
- Product catalog: 13-column EMRTable, server-side pagination (50/page), debounced search (300ms)
- Edit modal: Step-up auth required, section-by-section save, conditional pharma fields

## Visual Hierarchy Diagrams
- For 5-tier or multi-level systems, use inline HTML/CSS diagrams (not Mermaid)
- Pattern: decreasing width cards (100%, 92%, 84%, 76%, 68%) with dashed connectors
- Color-code each level using `var(--emr-primary)` gradient for top, then border-left colors for each tier
- Use level number circles with matching background opacity

## Warehouse Operations Source Paths (Verified 2026-02-16)
- Receiving: `views/settings/tabs/administration/UnifiedReceivingPage.tsx` (2 tabs: List, Grouped)
- Transfers: `views/settings/tabs/administration/UnifiedTransfersPage.tsx` (3 tabs: All, Grouped, Approval)
- Orders: `views/settings/tabs/administration/UnifiedOrdersPage.tsx` (3 tabs: All, Grouped, Confirmation)
- Inventory: `views/settings/tabs/administration/UnifiedInventoryPage.tsx` (2 tabs: Stock Levels, Picking)
- Receipt modal: `components/reception/ReceiptFormModal.tsx` (header + line items, bidirectional product search)
- Transfer Book: `components/transfer/TransferBookModal.tsx` (dual-panel BookModal, step-up auth, direct write-off)
- Transfer Confirmation: `views/settings/tabs/administration/TransferConfirmationPage.tsx` (dept access, edit quantities)
- Order Book: `components/order/OrderBookModal.tsx` (dual-panel BookModal, requester/receiver)
- Balances table: `components/balances/BalancesTable.tsx` (EMRTable, 50/page, expiry badges, Excel export)
- Balances filters: `components/balances/BalancesFilters.tsx` (dept, group, stock status, zone, cross-location)
- Picking: `views/settings/tabs/administration/PickingPage.tsx` (FEFO sorting, StockQuant queries, override reasons)
- FHIR: Receipt=SupplyDelivery(receipt), Transfer=SupplyDelivery(transfer), Order=SupplyRequest, Inventory=Basic(StockQuant)
- Shared BookModal: `components/shared/BookModal.tsx` (used by both TransferBookModal and OrderBookModal)

## Warehouse Data Architecture (Verified 2026-02-16)
- StockQuant composite key: `{itemCode}|{locationId}|{lotNumber}|{qualityStatus}` (NONE for untracked lots)
- StockQuant FHIR: Basic resource with `stock-quant` code, extensions prefixed `sq-`
- Optimistic locking: 5 retries, exponential backoff with jitter, If-Match ETag
- FEFO: filter expired/quarantine -> sort expiryDate ASC (nulls last) -> pick first with sufficient qty
- Transfer statuses: draft->requested->approved->in-progress->received/partial->completed (+ rejected/cancelled terminals)
- Order statuses: draft->active->confirmed->complete (+ cancelled terminal; dispatched/delivered are legacy)
- Weighted avg cost: (oldQty*oldCost + newQty*newCost)/(oldQty+newQty); donated items (cost=0) preserve existing cost
- Stock moves: receipt, transfer, adjustment-plus/minus, consumption, scrap, recall
- Adjustment reasons: physical-count, damage-spoilage, expired-disposal, theft-loss, system-correction, reconciliation
- FHIR base URL: `http://medimind.ge/fhir` (NEVER `https`), currency: GEL
- Balance cache: 30s TTL, BroadcastChannel for cross-tab invalidation
- Three-tier nomenclature: ItemGroup (~310) -> MedicalItem (~503) -> WarehouseItem (~35900)
- 11 warehouse groups: consumables, medications, household, non-inventory, fixed-assets, inventory, reagent, solution, medical-instrument, narcotics, food

## Ward Supplies (Stationary) Source Paths (Verified 2026-02-21)
- Codebase name: "stationary" (not "ward-supplies")
- View: `views/stationary/StationaryView.tsx` (1297 lines, 3-reducer architecture)
- CSS: `views/stationary/StationaryView.module.css` (736 lines)
- Components: `components/stationary/` (index.ts exports all)
  - StationaryLeftSidebar.tsx, StationaryPatientList.tsx, StationaryStockPanel.tsx, StationaryBottomPanel.tsx
  - CalculationModal.tsx (3 tabs: Internal, Departments, Intraoperative)
  - DailyBalanceModal.tsx (3 print buttons: today/total/combined)
  - DeptHistoryModal.tsx ("H" button - patients by dept)
  - NurseSupplyModal.tsx ("O" button - supplies delivered to dept)
  - TreatmentModal.tsx (yin-yang icon, 2 tabs: supplies/research)
- Types: `types/stationary.ts` (161 lines)
- Hooks: `hooks/stationary/` (useStationaryPatients, usePatientTransfers, useDepartmentStock, etc.)
- Services: `services/stationary.ts` (getDepartmentHistory, getNurseSupplies, searchNomenclatureProcedures, createProcedureExpenditure)
- FHIR: ChargeItem (expenditures), Basic/StockQuant (stock), Encounter (visit context), Location (wards), ActivityDefinition (procedures)
- Dual dept ID: Location (patient ward) vs Organization (stock tracking), mapped by name
- Default dept: auto-selects "Emergency" via keyword match in 3 languages
- Stock cached at module level (_cachedStockDepts)
- ExpenditureMode: 'expenditure' | 'procedure'
- Optimistic UI: prependExpenditure + adjustItemQuantity for instant feedback
- Two-phase commit: decrement stock -> create ChargeItem
- Procedure sub-items: ChargeItem with parentChargeItemId linking to parent procedure ChargeItem

## Warehouse Dashboard & Analytics Source Paths (Verified 2026-02-21)
- Dashboard view: `views/settings/tabs/administration/WarehouseDashboardPage.tsx` (wrapper with auto-refresh)
- Dashboard component: `components/warehouse/dashboard/WarehouseDashboard.tsx` (6 KPI cards, critical alerts banner, quick actions, intelligence grid, daily volume charts, top moved items, recent activity timeline)
- Analytics page: `components/warehouse/analytics/WarehouseAnalyticsPage.tsx` (9-tab analytics system)
- Analytics types: `types/warehouse-analytics.ts` (918 lines - complete type definitions for all analytics features)
- Analytics hook: `hooks/useWarehouseAnalytics.ts` (main data orchestration)
- Clinical analytics hook: `hooks/warehouse/useClinicalAnalytics.ts` (diagnosis costs, encounter costs, lot recall)
- Planning analytics hook: `hooks/warehouse/usePlanningAnalytics.ts` (budget variance, reorder points, demand forecasts)
- Auto-refresh: 60-second interval on dashboard
- FHIR integration: Basic(StockQuant) for balances, SupplyDelivery for movements, SupplyRequest for orders, DeviceDefinition for item master, Encounter for clinical context
- Performance: Indexed searches on extensions, 30s cache TTL, BroadcastChannel invalidation

## Analytics Tab Architecture (9 tabs)
1. **Balance & Movement** — 22-column ledger (opening, inflows, outflows, closing, days of supply)
2. **Insights** — Top items by value, department activity, period comparison
3. **Dead Stock** — Zero movement items with last movement date/days since
4. **Low Stock** — Items below safety thresholds with deficit/days of supply
5. **ABC/XYZ Classification** — 3×3 matrix (value × variability) with management strategies
6. **Expiration Risk** — Time-bucketed (7d/14d/30d/60d/90d/safe) with value-at-risk
7. **Suppliers** — Scorecards, stock-out log, dept cost ranking, write-off analysis
8. **Clinical Analytics** — Diagnosis costs, encounter costs, lot recall drill
9. **Planning** — Budget vs actual, reorder point calculator, demand forecast

## Documentation Writing Patterns (Updated 2026-02-21)
- **User-first approach:** Describe UI behavior, not implementation (no React component names, no hook details)
- **FHIR for integration team:** Include resource names and field mappings in tables
- **Proportional depth:** Simple UI = brief explanation; complex features = detailed tables/workflows
- **Stats rows:** Use `.doc-stats-row` with `.doc-stat-inline` for metric summaries
- **Callout boxes:** `.doc-callout.doc-callout-info.doc-callout-simple` for tips/notes
- **Warning boxes:** `.doc-callout.doc-callout-warning.doc-callout-simple` for important notices
- **Tables:** Use `.doc-table` for structured data (FHIR mappings, feature lists, column descriptions)
- **Screenshot containers:** `.doc-screenshot-full` for full-width screenshots
- **Icons:** Use inline SVG in `.doc-section-icon` (24x24 viewBox)
- **Section numbering:** Sequential starting from 1 within each category

## Technical Documentation Patterns (Data Model Sections)
- For text-only sections (no screenshots), use Mermaid diagrams extensively for visual structure
- ER diagrams: Use `erDiagram` for FHIR resource relationships
- State diagrams: Use `stateDiagram-v2` for status lifecycles (transfer, order, procurement)
- Flow diagrams: Use `flowchart TD/LR` for process flows (FEFO picking, transaction flow)
- Wrap status lifecycle diagrams in `<details class="doc-collapsible">` to keep page compact
- Mermaid style colors: match theme (`#1a365d`, `#2b6cb0`, `#63b3ed`, `#bee3f8`)
- Permission dependencies: tree diagram showing base permission -> dependent permissions
- Extension tables: Extension name (without base URL) | Value Type | Purpose
- Warehouse data model section number: 9 (9th section in warehouse category)
