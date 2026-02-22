/**
 * Section Loader - Dynamically loads HTML sections with manifest support
 * Supports lazy loading, caching, and intersection observer preloading
 */

const SectionLoader = {
  // Configuration
  config: {
    sectionsBasePath: 'sections/',
    currentLang: 'ka',
    loadingClass: 'section-loading',
    loadedClass: 'section-loaded',
    errorClass: 'section-error',
    preloadAhead: 2 // Number of sections to preload ahead
  },

  // State
  manifest: null,
  activeCategory: null,
  loadedSections: new Set(),
  loadingPromises: new Map(),
  observer: null,
  useManifest: false,

  // Legacy sections list (fallback if no manifest)
  sections: [
    'technical-overview',
    'overview',
    'features',
    'architecture',
    'contact'
  ],

  /**
   * Get the current sections path based on language
   */
  getSectionsPath: function() {
    return `${this.config.sectionsBasePath}${this.config.currentLang}/`;
  },

  /**
   * Initialize the section loader
   */
  init: async function() {
    // Sync language with I18n
    if (typeof I18n !== 'undefined' && I18n.currentLang) {
      this.config.currentLang = I18n.currentLang;
    }

    // Try to use manifest
    if (typeof ManifestLoader !== 'undefined') {
      try {
        this.manifest = await ManifestLoader.load();
        this.useManifest = true;
        this.sections = ManifestLoader.getUniqueFiles();
      } catch (e) {
        console.warn('Manifest not available, using legacy mode:', e);
        this.useManifest = false;
      }
    }

    // Initialize cache if available
    if (typeof LRUCache !== 'undefined') {
      LRUCache.init({
        maxItems: 25,
        maxSizeBytes: 50 * 1024 * 1024,
        defaultTTL: 30 * 60 * 1000
      });
    }

    // Setup intersection observer for lazy loading
    this._setupIntersectionObserver();

    // Load sections based on mode
    if (this.useManifest && typeof Router !== 'undefined') {
      // Route-based loading
      Router.onRouteChange((route) => this._handleRouteChange(route));
      await this._loadInitialSections();
    } else {
      // Legacy: load all sections
      await this.loadAllSections();
    }
  },

  /**
   * Set the current language and reload sections
   */
  setLanguage: async function(lang) {
    if (this.config.currentLang === lang) {
      return;
    }

    this.config.currentLang = lang;
    this.loadedSections.clear();
    this.loadingPromises.clear();

    // Clear search index for new language
    if (typeof SearchIndexer !== 'undefined') {
      SearchIndexer.clear();
    }

    // Reload sections
    if (this.useManifest && this.activeCategory) {
      await this.loadCategory(this.activeCategory);
    } else if (this.useManifest) {
      await this._loadInitialSections();
    } else {
      await this.loadAllSections();
    }
  },

  /**
   * Load initial sections based on current route's category
   */
  _loadInitialSections: async function() {
    const route = (typeof Router !== 'undefined') ? Router.getCurrentRoute() : null;
    const categoryId = (route && route.category) || 'platform';
    await this.loadCategory(categoryId);
  },

  /**
   * Load a specific category's sections exclusively
   */
  loadCategory: async function(categoryId) {
    const container = document.getElementById('sectionsContainer');
    if (!container || !this.manifest) return;

    // Find category in manifest
    const category = this.manifest.categories.find(c => c.id === categoryId);
    if (!category) {
      console.warn('Category not found:', categoryId);
      return;
    }

    this.activeCategory = categoryId;

    // Collect unique file names for this category
    const filesToLoad = new Set();
    for (const section of category.sections) {
      if (section.file) filesToLoad.add(section.file);
    }

    // Show loading skeleton
    container.innerHTML = this._createSkeletonHTML();

    try {
      // Fetch all files in parallel
      const fileList = Array.from(filesToLoad);
      const results = await Promise.all(fileList.map(f => this.fetchSection(f)));

      // Replace container content with category title (only for multi-section categories) + sections
      container.innerHTML = '';
      if (fileList.length > 1) {
        const title = (typeof I18n !== 'undefined' && I18n.initialized)
          ? I18n.t(category.titleKey)
          : category.titleKey.split('.').pop();
        const h1 = document.createElement('h1');
        h1.className = 'chapter-title';
        h1.setAttribute('data-i18n', category.titleKey);
        h1.textContent = title;
        container.appendChild(h1);
      }

      results.forEach(html => {
        if (html) {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = html;
          while (wrapper.firstElementChild) {
            wrapper.firstElementChild.classList.add('section-fade-in');
            container.appendChild(wrapper.firstElementChild);
          }
        }
      });

      // Reset loaded sections to only current files
      this.loadedSections.clear();
      fileList.forEach(f => this.loadedSections.add(f));

      // Initialize interactive features and sub-sections
      this.initializeInteractiveFeatures();
      await this.loadSubSections();

    } catch (error) {
      console.error('Error loading category:', categoryId, error);
      container.innerHTML = this._createErrorHTML();
    }
  },

  /**
   * Handle route change — swap category if needed, else scroll
   */
  _handleRouteChange: async function(route) {
    if (!this.useManifest) return;

    const categoryId = route.category;
    if (!categoryId) return;

    if (categoryId !== this.activeCategory) {
      // Different category — load it
      await this.loadCategory(categoryId);

      // Scroll to anchor after new content loads
      if (route.anchor) {
        setTimeout(() => this._scrollToAnchor(route.anchor), 300);
      }
    } else if (route.anchor) {
      // Same category — just scroll to anchor
      this._scrollToAnchor(route.anchor);
    }
  },

  /**
   * Load all sections (legacy mode)
   */
  loadAllSections: async function() {
    const container = document.getElementById('sectionsContainer');
    if (!container) {
      console.error('Sections container not found');
      return;
    }

    // Show loading skeleton
    container.innerHTML = this._createSkeletonHTML();

    try {
      // Load all sections in parallel
      const loadPromises = this.sections.map(section => this.fetchSection(section));
      const results = await Promise.all(loadPromises);

      // Clear loading state and append all sections
      container.innerHTML = '';
      results.forEach((html, index) => {
        if (html) {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = html;
          while (wrapper.firstElementChild) {
            wrapper.firstElementChild.classList.add('section-fade-in');
            container.appendChild(wrapper.firstElementChild);
          }
        }
      });

      // Re-initialize interactive features
      this.initializeInteractiveFeatures();

      // Initialize collapsible sections
      if (typeof window.initCollapsibleSections === 'function') {
        window.initCollapsibleSections();
      }

      // Load sub-sections
      await this.loadSubSections();

    } catch (error) {
      console.error('Error loading sections:', error);
      container.innerHTML = this._createErrorHTML();
    }
  },

  /**
   * Fetch a single section
   */
  fetchSection: async function(sectionName) {
    const cacheKey = LRUCache ? LRUCache.key(this.config.currentLang, sectionName) : `${this.config.currentLang}-${sectionName}`;

    // Check LRU cache first
    if (typeof LRUCache !== 'undefined' && LRUCache.has(cacheKey)) {
      return LRUCache.get(cacheKey);
    }

    // Check if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    // Create loading promise
    const loadPromise = this._doFetch(sectionName, cacheKey);
    this.loadingPromises.set(cacheKey, loadPromise);

    try {
      const result = await loadPromise;
      return result;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  },

  /**
   * Actually fetch the section
   */
  _doFetch: async function(sectionName, cacheKey) {
    try {
      const path = `${this.getSectionsPath()}${sectionName}.html`;
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();

      // Cache the result
      if (typeof LRUCache !== 'undefined') {
        LRUCache.set(cacheKey, html);
      }

      return html;
    } catch (error) {
      console.error(`Error loading section ${sectionName}:`, error);
      return null;
    }
  },

  /**
   * Load sub-sections into their containers
   */
  loadSubSections: async function() {
    // Define sub-sections
    const subSections = this.useManifest
      ? this._getSubSectionsFromManifest()
      : { 'architecture-technical-container': 'architecture-technical' };

    for (const [containerId, fileName] of Object.entries(subSections)) {
      const container = document.getElementById(containerId);
      if (container) {
        try {
          const html = await this.fetchSection(fileName);
          if (html) {
            container.innerHTML = html;
            this.loadedSections.add(fileName);
          }
        } catch (error) {
          console.error(`Error loading sub-section ${fileName}:`, error);
        }
      }
    }
  },

  /**
   * Get sub-sections from manifest
   */
  _getSubSectionsFromManifest: function() {
    const subSections = {};

    if (!this.manifest) return subSections;

    for (const category of this.manifest.categories) {
      for (const section of category.sections) {
        if (section.subSections) {
          for (const sub of section.subSections) {
            if (sub.containerId && sub.file) {
              subSections[sub.containerId] = sub.file;
            }
          }
        }
      }
    }

    return subSections;
  },

  /**
   * Setup intersection observer for lazy loading
   * Note: Currently sections are preloaded eagerly. Observer kept for future use.
   */
  _setupIntersectionObserver: function() {
    // IntersectionObserver available for future lazy-loading implementation
    // Currently sections are loaded on init and preloaded in background
  },

  /**
   * Scroll to anchor
   */
  _scrollToAnchor: function(anchorId) {
    const element = document.getElementById(anchorId);
    if (element) {
      const offset = 80; // Header height
      const y = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  },

  /**
   * Create skeleton loading HTML
   */
  _createSkeletonHTML: function() {
    const loadingText = (typeof I18n !== 'undefined')
      ? I18n.t('loading.loading')
      : 'Loading...';

    return `
      <div class="section-loading-state">
        <div class="section-loading-spinner"></div>
        <span>${loadingText}</span>
      </div>
      <div class="section-skeleton">
        <div class="section-skeleton-header skeleton"></div>
        <div class="section-skeleton-text skeleton"></div>
        <div class="section-skeleton-text skeleton"></div>
        <div class="section-skeleton-text skeleton"></div>
        <div class="section-skeleton-text skeleton"></div>
      </div>
    `;
  },

  /**
   * Create error HTML
   */
  _createErrorHTML: function() {
    const errorText = (typeof I18n !== 'undefined')
      ? I18n.t('loading.error')
      : 'Error loading sections';

    return `
      <div class="section-error-state">
        <svg class="section-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div class="section-error-message">${errorText}</div>
        <button class="section-error-retry" onclick="SectionLoader.loadAllSections()">
          Retry
        </button>
      </div>
    `;
  },

  /**
   * Re-initialize interactive features after content is loaded
   */
  initializeInteractiveFeatures: function() {
    // Re-initialize Mermaid diagrams
    if (typeof mermaid !== 'undefined') {
      mermaid.init(undefined, document.querySelectorAll('.mermaid:not([data-processed])'));
    }

    // Re-initialize lightbox
    if (typeof window.initLightbox === 'function') {
      window.initLightbox();
    }

    // Re-initialize FAQ accordion
    this.initFaqAccordion();

    // Initialize diagram viewer (zoom/pan/nav toolbar)
    if (typeof DiagramViewer !== 'undefined') {
      setTimeout(() => DiagramViewer.initAll(), 500);
    }

    // Update section references for scroll spy
    const sections = document.querySelectorAll('section[id], h3[id], h4[id]');
    window.documentSections = sections;

    // Apply translations to newly loaded content
    if (typeof I18n !== 'undefined' && I18n.initialized) {
      I18n.applyTranslations();
      I18n.updateLanguageImages();
    }

    // Rebuild search index after content is loaded
    if (typeof SearchIndexer !== 'undefined') {
      SearchIndexer.build();
    }
  },

  /**
   * Initialize FAQ accordion for dynamically loaded content
   */
  initFaqAccordion: function() {
    const faqItems = document.querySelectorAll('.doc-faq-item:not([data-accordion-bound])');

    faqItems.forEach(function(item) {
      const question = item.querySelector('.doc-faq-question');
      if (!question) return;

      item.setAttribute('data-accordion-bound', 'true');

      question.addEventListener('click', function() {
        item.classList.toggle('open');
        const isOpen = item.classList.contains('open');
        question.setAttribute('aria-expanded', isOpen);
      });

      question.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          question.click();
        }
      });
    });
  },

  /**
   * Preload specific sections
   */
  preloadSections: function(sectionNames) {
    sectionNames.forEach(name => {
      if (!this.loadedSections.has(name)) {
        this.fetchSection(name);
      }
    });
  },

  /**
   * Clear cache
   */
  clearCache: function() {
    if (typeof LRUCache !== 'undefined') {
      LRUCache.clear();
    }
    this.loadedSections.clear();
  },

  /**
   * Get cache statistics
   */
  getCacheStats: function() {
    if (typeof LRUCache !== 'undefined') {
      return LRUCache.stats();
    }
    return { items: 0, maxItems: 0, sizeBytes: 0, maxSizeBytes: 0 };
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Wait for I18n to initialize first
  setTimeout(() => {
    SectionLoader.init();
  }, 100);
});

// Export for global use
window.SectionLoader = SectionLoader;
