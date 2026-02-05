/**
 * Internationalization (i18n) Module for MediMind Documentation
 * Handles language switching between Georgian, English, and Russian
 */

const I18n = {
  // Configuration
  config: {
    defaultLang: 'ka',
    supportedLangs: ['ka', 'en', 'ru'],
    storageKey: 'docLang',
    i18nPath: 'i18n/'
  },

  // Current language
  currentLang: 'ka',

  // Translation cache
  translations: {},

  // Loaded flag
  initialized: false,

  /**
   * Initialize the i18n system
   */
  init: async function() {
    // Get saved language or detect from browser
    const savedLang = localStorage.getItem(this.config.storageKey);
    const browserLang = navigator.language?.split('-')[0];

    // Determine language to use
    let lang = this.config.defaultLang;
    if (savedLang && this.config.supportedLangs.includes(savedLang)) {
      lang = savedLang;
    } else if (browserLang && this.config.supportedLangs.includes(browserLang)) {
      lang = browserLang;
    }

    // Load initial language
    await this.loadLanguage(lang);
    this.currentLang = lang;
    this.initialized = true;

    // Update UI
    this.applyTranslations();
    this.updateLanguageSwitcher();
    this.updateHtmlLang();
    this.updateLanguageImages();

    // Update search items
    this.updateSearchItems();

    // Dispatch initialization event
    window.dispatchEvent(new CustomEvent('i18n:initialized', { detail: { lang } }));

    console.log(`I18n initialized with language: ${lang}`);
    return lang;
  },

  /**
   * Load a language using modular files with legacy fallback
   */
  loadLanguage: async function(lang) {
    if (this.translations[lang]) {
      return this.translations[lang];
    }

    try {
      // Try modular loading first
      const modules = ['core', 'toc', 'meta'];
      const responses = await Promise.all(
        modules.map(mod =>
          fetch(`${this.config.i18nPath}${lang}/${mod}.json`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        )
      );

      // Check if any module loaded successfully
      const hasModules = responses.some(r => r !== null);

      if (hasModules) {
        // Merge all modules into single object
        const merged = {};
        responses.forEach(data => {
          if (data) {
            Object.assign(merged, data);
          }
        });
        this.translations[lang] = merged;
        console.log(`Loaded modular i18n for: ${lang}`);
        return merged;
      }

      // Fallback to legacy single file
      return this._loadLegacyLanguage(lang);
    } catch (error) {
      console.error(`Error loading language ${lang}:`, error);
      // Fallback to legacy single file
      return this._loadLegacyLanguage(lang);
    }
  },

  /**
   * Load legacy single-file language (fallback)
   */
  _loadLegacyLanguage: async function(lang) {
    try {
      const response = await fetch(`${this.config.i18nPath}${lang}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.translations[lang] = data;
      console.log(`Loaded legacy i18n for: ${lang}`);
      return data;
    } catch (error) {
      console.error(`Error loading legacy language ${lang}:`, error);
      // Fallback to default language if not already trying it
      if (lang !== this.config.defaultLang) {
        return this.loadLanguage(this.config.defaultLang);
      }
      return null;
    }
  },

  /**
   * Switch to a new language
   */
  switchLanguage: async function(lang) {
    if (!this.config.supportedLangs.includes(lang)) {
      console.error(`Unsupported language: ${lang}`);
      return;
    }

    if (lang === this.currentLang) {
      return;
    }

    // Load new language
    await this.loadLanguage(lang);
    this.currentLang = lang;

    // Save preference
    localStorage.setItem(this.config.storageKey, lang);

    // Update UI
    this.applyTranslations();
    this.updateLanguageSwitcher();
    this.updateHtmlLang();
    this.updateLanguageImages();

    // Update section loader path and reload sections
    if (typeof SectionLoader !== 'undefined') {
      SectionLoader.setLanguage(lang);
    }

    // Update search items
    this.updateSearchItems();

    console.log(`Language switched to: ${lang}`);
  },

  /**
   * Get a translation by key path (e.g., 'toc.title')
   */
  t: function(keyPath) {
    const keys = keyPath.split('.');
    let value = this.translations[this.currentLang];

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Return the key path if translation not found
        console.warn(`Translation not found: ${keyPath}`);
        return keyPath;
      }
    }

    return value;
  },

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  applyTranslations: function() {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const attr = element.getAttribute('data-i18n-attr');
      const translation = this.t(key);

      if (translation && translation !== key) {
        if (attr) {
          // Set as attribute (e.g., placeholder, aria-label)
          element.setAttribute(attr, translation);
        } else {
          // Set as text content
          element.textContent = translation;
        }
      }
    });
  },

  /**
   * Update the language switcher UI
   */
  updateLanguageSwitcher: function() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === this.currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },

  /**
   * Update the HTML lang attribute
   */
  updateHtmlLang: function() {
    const langData = this.translations[this.currentLang];
    if (langData && langData.meta && langData.meta.htmlLang) {
      document.documentElement.lang = langData.meta.htmlLang;
    }
  },

  /**
   * Update search items with current language
   */
  updateSearchItems: function() {
    const langData = this.translations[this.currentLang];
    if (langData && langData.searchItems && typeof window.updateSearchItems === 'function') {
      window.updateSearchItems(langData.searchItems);
    }
  },

  /**
   * Update images with data-i18n-img attribute based on current language
   * Images should have data-i18n-img="basename" attribute
   * Will look for images/basename-{lang}.png
   */
  updateLanguageImages: function() {
    const images = document.querySelectorAll('[data-i18n-img]');
    images.forEach(img => {
      const basename = img.getAttribute('data-i18n-img');
      if (basename) {
        img.src = `images/${basename}-${this.currentLang}.png`;
      }
    });
  },

  /**
   * Get current language code
   */
  getCurrentLang: function() {
    return this.currentLang;
  },

  /**
   * Get all supported languages
   */
  getSupportedLangs: function() {
    return this.config.supportedLangs;
  }
};

// Export for global use
window.I18n = I18n;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  I18n.init();
});
