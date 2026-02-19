# Screenshot Plan: Administration Overview

**Generated:** 2026-02-06T18:00:00Z
**Source:** sections/en/admin-overview.html
**Total Files:** 18 (6 screenshots x 3 languages)

## Screenshots Overview

### Static Screenshots (6)

| ID | Filename Pattern | Description | EMR Route |
|----|------------------|-------------|-----------|
| admin-dashboard | admin-dashboard-{lang}.png | Main admin landing page with reception table and action buttons | /emr/dashboard/administration/reception |
| admin-navigation | admin-navigation-{lang}.png | Full administration sidebar navigation menu expanded | /emr/dashboard/administration/reception |
| admin-reception-menu | admin-reception-menu-{lang}.png | Reception sub-menu items highlighted in sidebar | /emr/dashboard/administration/reception |
| admin-transfer-menu | admin-transfer-menu-{lang}.png | Transfer sub-menu items highlighted in sidebar | /emr/dashboard/administration/transfer-confirmation |
| admin-order-menu | admin-order-menu-{lang}.png | Order sub-menu items highlighted in sidebar | /emr/dashboard/administration/order-confirmation |
| admin-balances-menu | admin-balances-menu-{lang}.png | Balances menu item highlighted in sidebar | /emr/dashboard/administration/balances |

### Multi-Step Flows (0)

None.

### State-Based (0)

None.

## Execution Checklist

- [ ] EMR running on localhost:3000-3005
- [ ] Playwright server started
- [ ] Login completed
- [ ] English screenshots captured (6)
- [ ] Georgian screenshots captured (6)
- [ ] Russian screenshots captured (6)
- [ ] All files verified (18 total)

## Capture Strategy

The admin-overview screenshots primarily show the sidebar navigation with different sections highlighted. The strategy is:

1. **admin-dashboard**: Navigate to reception page, capture full page showing the main dashboard
2. **admin-navigation**: Same page, ensure full sidebar is visible with all admin sections
3. **admin-reception-menu**: Navigate to reception route, sidebar shows reception items active
4. **admin-transfer-menu**: Navigate to transfer-confirmation route, sidebar shows transfer items active
5. **admin-order-menu**: Navigate to order-confirmation route, sidebar shows order items active
6. **admin-balances-menu**: Navigate to balances route, sidebar shows balances item active

Each screenshot is captured on a different route to show the corresponding sidebar menu section highlighted/active.

## Prerequisites

- EMR application running on localhost
- Admin credentials: admin@medimind.ge / MediMind2024
- Administration module accessible at /emr/dashboard/administration/*
