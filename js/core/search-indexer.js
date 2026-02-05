/**
 * Search Indexer - Automatically extracts searchable items from section HTML
 * Eliminates the need for hardcoded searchItems in i18n files
 */

const SearchIndexer = {
  // Search index cache
  index: [],

  // Category mappings for localization
  categoryMaps: {
    en: {
      'technical-overview': 'Platform',
      'overview': 'Getting Started',
      'features': 'Features',
      'architecture': 'Technical Reference',
      'troubleshooting': 'Support',
      'contact': 'Support'
    },
    ka: {
      'technical-overview': 'პლატფორმა',
      'overview': 'დაწყება',
      'features': 'ფუნქციები',
      'architecture': 'ტექნიკური რეფერენსი',
      'troubleshooting': 'მხარდაჭერა',
      'contact': 'მხარდაჭერა'
    },
    ru: {
      'technical-overview': 'Платформа',
      'overview': 'Начало работы',
      'features': 'Функции',
      'architecture': 'Техническая справка',
      'troubleshooting': 'Поддержка',
      'contact': 'Поддержка'
    }
  },

  /**
   * Build search index from loaded sections
   */
  build: function() {
    this.index = [];
    const lang = this._getCurrentLang();

    // Get all sections from DOM
    document.querySelectorAll('section[id]').forEach(section => {
      const sectionId = section.id;
      const h2 = section.querySelector('h2');

      // Get section title (remove leading numbers if present)
      let sectionTitle = h2 ? h2.textContent.replace(/^\d+\.?\s*/, '').trim() : sectionId;

      // Add main section
      this.index.push({
        title: sectionTitle,
        href: `#${sectionId}`,
        section: this._getCategoryName(sectionId, lang)
      });

      // Add subsections (h3, h4 with ids)
      section.querySelectorAll('h3[id], h4[id]').forEach(heading => {
        const headingTitle = heading.textContent.replace(/^\d+\.?\s*/, '').trim();
        this.index.push({
          title: headingTitle,
          href: `#${heading.id}`,
          section: sectionTitle
        });
      });
    });

    console.log(`SearchIndexer: Built index with ${this.index.length} items`);
    return this.index;
  },

  /**
   * Get search items (builds if empty)
   */
  getItems: function() {
    if (this.index.length === 0) {
      this.build();
    }
    return this.index;
  },

  /**
   * Clear the index (call before language switch)
   */
  clear: function() {
    this.index = [];
  },

  /**
   * Get category name for a section ID
   */
  _getCategoryName: function(sectionId, lang) {
    const map = this.categoryMaps[lang] || this.categoryMaps['en'];

    // Try exact match first
    if (map[sectionId]) {
      return map[sectionId];
    }

    // Try prefix matching for nested sections
    for (const [prefix, category] of Object.entries(map)) {
      if (sectionId.startsWith(prefix)) {
        return category;
      }
    }

    // Default fallback
    const fallbacks = {
      en: 'Documentation',
      ka: 'დოკუმენტაცია',
      ru: 'Документация'
    };
    return fallbacks[lang] || fallbacks['en'];
  },

  /**
   * Get current language
   */
  _getCurrentLang: function() {
    if (typeof I18n !== 'undefined' && I18n.currentLang) {
      return I18n.currentLang;
    }
    return 'ka';
  }
};

// Export for global use
window.SearchIndexer = SearchIndexer;
