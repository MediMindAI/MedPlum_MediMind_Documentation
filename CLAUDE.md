# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **MediMind EMR Patient Registration Documentation** site - a static multi-language documentation website for the MediMind Electronic Medical Records system. It documents the patient registration module built on FHIR/Medplum.

## Development Commands

```bash
# Start local development server (required for fetch API)
python3 -m http.server 8080

# View site
open http://localhost:8080
```

**Note:** Opening `index.html` directly via `file://` will not work due to CORS restrictions on the fetch API used for dynamic section loading.

## Architecture

### Multi-language System (i18n)

The site supports three languages: Georgian (ka), English (en), and Russian (ru).

- **Translation files**: `i18n/{ka,en,ru}.json` - UI strings, search items, metadata
- **Section content**: `sections/{ka,en,ru}/*.html` - Actual documentation content
- **Language-specific images**: `images/*-{ka,en,ru}.png` - Screenshots per language

The `I18n` module (`js/i18n.js`) handles:
- Language detection (localStorage → browser → default 'ka')
- Translation application via `data-i18n` attributes
- Image switching via `data-i18n-img` attributes

### Content Loading

Sections are dynamically loaded by `SectionLoader` (`js/section-loader.js`):
1. Loads from `sections/{currentLang}/` directory
2. Sections: `technical-overview`, `overview`, `features`, `architecture`, `troubleshooting`, `contact`
3. Sub-sections loaded into containers (e.g., `architecture-technical`)
4. Caches loaded sections per language

### JavaScript Modules

| File | Purpose |
|------|---------|
| `js/i18n.js` | Language switching, translation system |
| `js/section-loader.js` | Dynamic HTML section loading with caching |
| `js/docs.js` | Navigation, FAQ accordion, smooth scroll |
| `js/page.js` | Mermaid diagrams, search modal, sidebar, lightbox |

### CSS Structure

Modular CSS in `css/parts/`:
- `01-variables.css` - Design tokens (colors, gradients, animations)
- `02-header.css` through `12-responsive.css` - Component-specific styles

## Key Patterns

### Adding Translations
1. Add keys to all three `i18n/*.json` files
2. Use `data-i18n="key.path"` on elements for text content
3. Use `data-i18n-attr="placeholder"` to translate attributes
4. For images: `data-i18n-img="basename"` → loads `images/basename-{lang}.png`

### Adding New Sections
1. Create `sections/{ka,en,ru}/section-name.html`
2. Add section name to `SectionLoader.sections` array in `section-loader.js`
3. Add navigation entries in `index.html` TOC with `data-i18n` attributes
4. Add translation keys to all `i18n/*.json` files

### Mermaid Diagrams
Diagrams use Mermaid.js with a custom dark theme configured in `js/page.js`. Zoomable diagrams use class `mermaid-zoomable` inside `mermaid-container`.
