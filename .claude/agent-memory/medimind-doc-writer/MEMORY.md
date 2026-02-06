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
