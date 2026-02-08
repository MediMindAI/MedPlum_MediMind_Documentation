# i18n Verification Report

**Generated:** 2026-02-09
**Verification type:** Full key-by-key comparison across all 3 languages

## Summary
- Total modular keys checked: 55
- Missing in Georgian (ka): 0
- Missing in Russian (ru): 0
- Legacy sync issues: 23 stale toc keys in legacy, 3 new modular toc keys missing from legacy, 4 value mismatches across all languages

## Modular Files Check

### toc.json (30 keys)

| # | Key | EN | KA | RU | Status |
|---|-----|----|----|----|----|
| 1 | toc.title | Table of Contents | სარჩევი | Содержание | PASS |
| 2 | toc.technicalOverview | Platform Overview | პლატფორმის მიმოხილვა | Обзор платформы | PASS |
| 3 | toc.introduction | Introduction | შესავალი | Введение | PASS |
| 4 | toc.whyFhir | Why FHIR? | რატომ FHIR? | Почему FHIR? | PASS |
| 5 | toc.medplumPlatform | Medplum Platform | Medplum პლატფორმა | Платформа Medplum | PASS |
| 6 | toc.techStack | Tech Stack | Tech Stack | Tech Stack | PASS |
| 7 | toc.patientRegistration | Patient Registration | პაციენტის რეგისტრაცია | Регистрация пациента | PASS |
| 8 | toc.overview | Overview | მიმოხილვა | Обзор | PASS |
| 9 | toc.statistics | Statistics | სტატისტიკა | Статистика | PASS |
| 10 | toc.zones | Interface Zones | ინტერფეისის ზონები | Зоны интерфейса | PASS |
| 11 | toc.keyFeatures | Key Features | ძირითადი ფუნქციები | Ключевые функции | PASS |
| 12 | toc.registration | Patient Search & Form | პაციენტის ძიება და ფორმა | Поиск пациента и форма | PASS |
| 13 | toc.search | Patient Search | პაციენტის ძიება | Поиск пациента | PASS |
| 14 | toc.formSections | Form Sections | ფორმის სექციები | Разделы формы | PASS |
| 15 | toc.additionalDetails | Additional Details | დამატებითი დეტალები | Дополнительные данные | PASS |
| 16 | toc.desktopSidebar | Desktop Sidebar | გვერდითი პანელი | Боковая панель | PASS |
| 17 | toc.mobileWizard | Mobile Wizard | მობილური ოსტატი | Мобильный мастер | PASS |
| 18 | toc.visitManagement | Visit Management | ვიზიტის მართვა | Управление визитами | PASS |
| 19 | toc.registrationSection | Registration Section | რეგისტრაციის სექცია | Раздел регистрации | PASS |
| 20 | toc.insurance | Insurance | დაზღვევა | Страхование | PASS |
| 21 | toc.activeVisitWarning | Active Visit Warning | აქტიური ვიზიტის გაფრთხილება | Предупреждение об активном визите | PASS |
| 22 | toc.demographics | Demographics | დემოგრაფია | Демография | PASS |
| 23 | toc.architecture | Architecture | არქიტექტურა | Архитектура | PASS |
| 24 | toc.architectureOverview | Architecture Overview | არქიტექტურის მიმოხილვა | Обзор архитектуры | PASS |
| 25 | toc.fhirFlow | FHIR Workflow | FHIR სამუშაო პროცესი | Рабочий процесс FHIR | PASS |
| 26 | toc.fhirResources | FHIR Resources | FHIR რესურსები | Ресурсы FHIR | PASS |
| 27 | toc.dataFlow | Data Flow | მონაცემთა ნაკადი | Поток данных | PASS |
| 28 | toc.troubleshooting | Troubleshooting | პრობლემების მოგვარება | Устранение неполадок | PASS |
| 29 | toc.commonIssues | Common Issues | ხშირი პრობლემები | Частые проблемы | PASS |
| 30 | toc.errorCodes | Error Codes | შეცდომის კოდები | Коды ошибок | PASS |

**Result: 30/30 keys present in all 3 languages. PASS**

### core.json (19 keys across 7 groups)

| # | Key | EN | KA | RU | Status |
|---|-----|----|----|----|----|
| 1 | header.brandTitle | MediMind | MediMind | MediMind | PASS |
| 2 | header.brandSubtitle | EMR SYSTEM | EMR SYSTEM | EMR SYSTEM | PASS |
| 3 | header.searchBtn | Ctrl+K | Ctrl+K | Ctrl+K | PASS |
| 4 | header.pdfBtn | PDF | PDF | PDF | PASS |
| 5 | search.placeholder | Search documentation... | ძებნა დოკუმენტაციაში... | Поиск по документации... | PASS |
| 6 | search.noResults | No results found | შედეგი ვერ მოიძებნა | Результаты не найдены | PASS |
| 7 | search.startTyping | Start typing to search | დაიწყეთ აკრეფა ძებნისთვის | Начните вводить для поиска | PASS |
| 8 | search.escHint | ESC | ESC | ESC | PASS |
| 9 | loading.sections | Loading sections... | სექციები იტვირთება... | Загрузка разделов... | PASS |
| 10 | loading.loading | Loading... | იტვირთება... | Загрузка... | PASS |
| 11 | loading.error | Error loading sections | შეცდომა სექციების ჩატვირთვისას | Ошибка загрузки разделов | PASS |
| 12 | zoom.zoomIn | Zoom in | გადიდება | Увеличить | PASS |
| 13 | zoom.zoomOut | Zoom out | შემცირება | Уменьшить | PASS |
| 14 | buttons.viewOnInterface | View on interface | ნახე ინტერფეისზე | Посмотреть интерфейс | PASS |
| 15 | buttons.back | Go back | უკან დაბრუნება | Назад | PASS |
| 16 | aria.menuOpen | Open menu | მენიუს გახსნა | Открыть меню | PASS |
| 17 | aria.backToTop | Back to top | ზემოთ დაბრუნება | Наверх | PASS |
| 18 | aria.search | Search | ძებნა | Поиск | PASS |
| 19 | footer.copyright | (c) 2026 MediMind EMR. Version 2.0 ... | (c) 2026 MediMind EMR. ვერსია 2.0 ... | (c) 2026 MediMind EMR. Версия 2.0 ... | PASS |

**Result: 19/19 keys present in all 3 languages. PASS**

### meta.json (6 keys across 2 groups)

| # | Key | EN | KA | RU | Status |
|---|-----|----|----|----|----|
| 1 | meta.lang | en | ka | ru | PASS |
| 2 | meta.langName | English | ქართული | Русский | PASS |
| 3 | meta.htmlLang | en | ka | ru | PASS |
| 4 | hero.title | MediMind EMR System | MediMind EMR სისტემა | Система MediMind EMR | PASS |
| 5 | hero.subtitle | Production Documentation for IT Specialists | საწარმოო დოკუმენტაცია IT სპეციალისტებისთვის | Производственная документация для IT-специалистов | PASS |
| 6 | hero.version | v2.0 | v2.0 | v2.0 | PASS |

**Result: 6/6 keys present in all 3 languages. PASS**

---

## Legacy Fallback Check

Legacy files: `i18n/en.json`, `i18n/ka.json`, `i18n/ru.json`

### Keys in Legacy but NOT in Modular (Stale -- 23 toc keys)

These keys exist in legacy `{lang}.json` but were removed from modular `toc.json` during documentation consolidation. They are harmless (unused by the current manifest) but represent stale data.

| # | Stale Legacy Key | EN Legacy Value | In KA Legacy | In RU Legacy |
|---|------------------|-----------------|--------------|--------------|
| 1 | toc.searchSystem | Patient Search System | Yes | Yes |
| 2 | toc.documentUpload | Document Upload | Yes | Yes |
| 3 | toc.interfaceZones | Interface Zones | Yes | Yes |
| 4 | toc.architecturePreview | Component Architecture | Yes | Yes |
| 5 | toc.aiMedicalAssistant | AI Medical Assistant | Yes | Yes |
| 6 | toc.aiChatbotOverview | User Guide | Yes | Yes |
| 7 | toc.aiChatbotIntegration | IT Integration | Yes | Yes |
| 8 | toc.aiIntroduction | Introduction | Yes | Yes |
| 9 | toc.aiFeatures | User Features | Yes | Yes |
| 10 | toc.aiFhir | FHIR Integration | Yes | Yes |
| 11 | toc.aiBackend | Backend Services | Yes | Yes |
| 12 | toc.technicalReference | Technical Reference | Yes | Yes |
| 13 | toc.technicalOverviewDetail | Technical Overview | Yes | Yes |
| 14 | toc.uiComponents | UI Components | Yes | Yes |
| 15 | toc.validationSystem | Validation System | Yes | Yes |
| 16 | toc.services | Services | Yes | Yes |
| 17 | toc.authentication | Authentication | Yes | Yes |
| 18 | toc.unknownPatient | Unknown Patient | Yes | Yes |
| 19 | toc.componentHierarchy | Component Hierarchy | Yes | Yes |
| 20 | toc.hooksReference | Hooks | Yes | Yes |
| 21 | toc.servicesReference | Services | Yes | Yes |
| 22 | toc.additional | Additional | Yes | Yes |
| 23 | toc.support | Support | Yes | Yes |

All 23 stale keys are consistently present across all 3 legacy language files (no partial stale keys).

### Keys in Modular but NOT in Legacy (3 new toc keys)

These keys were added in the modular files but not backported to legacy fallback files.

| # | New Modular Key | EN Modular Value | In Legacy EN | In Legacy KA | In Legacy RU |
|---|-----------------|------------------|--------------|--------------|--------------|
| 1 | toc.search | Patient Search | NO | NO | NO |
| 2 | toc.zones | Interface Zones | NO | NO | NO |
| 3 | toc.additionalDetails | Additional Details | NO | NO | NO |

**Impact:** If modular loading fails and the site falls back to legacy files, these 3 TOC entries will have missing translations. This is a **low-severity** issue since modular loading is the primary path.

### Value Mismatches Between Modular and Legacy (Shared Keys)

These keys exist in both modular and legacy but have different values. The modular values are the current/correct versions after documentation consolidation.

**English (EN) mismatches:**

| Key | Modular EN | Legacy EN |
|-----|-----------|-----------|
| toc.patientRegistration | Patient Registration | Patient Registration & Visits |
| toc.registration | Patient Search & Form | Patient Registration |
| toc.formSections | Form Sections | Registration Form Sections |
| toc.insurance | Insurance | Insurance Management |
| toc.statistics | Statistics | Quick Statistics |

**Georgian (KA) mismatches:**

| Key | Modular KA | Legacy KA |
|-----|-----------|-----------|
| toc.patientRegistration | პაციენტის რეგისტრაცია | პაციენტის რეგისტრაცია და ვიზიტები |
| toc.registration | პაციენტის ძიება და ფორმა | პაციენტის რეგისტრაცია |
| toc.formSections | ფორმის სექციები | რეგისტრაციის ფორმის სექციები |
| toc.insurance | დაზღვევა | დაზღვევის მართვა |

**Russian (RU) mismatches:**

| Key | Modular RU | Legacy RU |
|-----|-----------|-----------|
| toc.patientRegistration | Регистрация пациента | Регистрация пациентов и визиты |
| toc.registration | Поиск пациента и форма | Регистрация пациента |
| toc.formSections | Разделы формы | Разделы формы регистрации |
| toc.insurance | Страхование | Управление страховкой |

### Legacy `searchItems` Array

All 3 legacy files contain a `searchItems` array with 9 hardcoded search items each. This is no longer used since the site auto-generates search items from section HTML via `SearchIndexer`. This data is stale but harmless.

---

## Overall Assessment

### Modular Files (Primary System)
- **toc.json:** 30/30 keys -- ALL PRESENT in EN, KA, RU
- **core.json:** 19/19 keys -- ALL PRESENT in EN, KA, RU
- **meta.json:** 6/6 keys -- ALL PRESENT in EN, KA, RU
- **Total: 55/55 keys complete across all 3 languages**

### Legacy Fallback Files
- 23 stale TOC keys across all 3 languages (removed sections, consistently stale, harmless)
- 3 new modular keys missing from all 3 legacy files (low impact -- fallback-only)
- 4-5 value mismatches per language (legacy outdated, modular is authoritative)
- Stale `searchItems` arrays in all 3 files (auto-generated now, harmless)

### Corrections from Previous Report (2026-02-08)
- toc.json key count corrected: 30 (was incorrectly reported as 32)
- core.json key count corrected: 19 (was incorrectly reported as 18; footer.copyright was listed in table but not counted)
- Total modular keys corrected: 55 (was incorrectly reported as 56)
- toc.commonIssues removed from EN value mismatch list (values are identical in both modular and legacy)
- Added per-language mismatch tables for KA and RU (previously only EN was shown)

## Verdict: PASS

All 55 modular translation keys are complete across English, Georgian, and Russian. No missing translations were found in any language. The documentation site will render correctly in all 3 languages. Legacy fallback files have minor sync issues (3 missing keys, 23 stale keys) but these are low-severity since modular loading is the primary path.
