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
    if (this.useManifest) {
      await this._loadInitialSections();
    } else {
      await this.loadAllSections();
    }
  },

  /**
   * Load initial high-priority sections
   */
  _loadInitialSections: async function() {
    const container = document.getElementById('sectionsContainer');
    if (!container) return;

    // Show loading skeleton
    container.innerHTML = this._createSkeletonHTML();

    try {
      // Get high priority sections or first few sections
      const highPriority = this.useManifest
        ? ManifestLoader.getHighPrioritySections()
        : this.sections.slice(0, 3);

      // Get unique files to load
      const filesToLoad = new Set();
      highPriority.forEach(section => {
        const file = section.file || section;
        filesToLoad.add(file);
      });

      // Load in parallel
      const loadPromises = Array.from(filesToLoad).map(file => this.fetchSection(file));
      const results = await Promise.all(loadPromises);

      // Build content
      container.innerHTML = '';
      results.forEach((html, index) => {
        if (html) {
          const wrapper = document.createElement('div');
          wrapper.className = 'section-fade-in';
          wrapper.innerHTML = html;
          container.appendChild(wrapper.firstElementChild || wrapper);
        }
      });

      // Track loaded sections
      filesToLoad.forEach(file => this.loadedSections.add(file));

      // Initialize interactive features
      this.initializeInteractiveFeatures();

      // Load sub-sections
      await this.loadSubSections();

      // Preload remaining sections in background
      this._preloadRemainingSections(Array.from(filesToLoad));

    } catch (error) {
      console.error('Error loading initial sections:', error);
      container.innerHTML = this._createErrorHTML();
    }
  },

  /**
   * Handle route change
   */
  _handleRouteChange: async function(route) {
    if (!this.useManifest || !route.section) return;

    // Find section info
    const sectionInfo = Router.findSection(route);
    if (!sectionInfo || !sectionInfo.section) return;

    const file = sectionInfo.section.file;
    if (!file || this.loadedSections.has(file)) {
      // Section already loaded, just scroll to anchor
      if (route.anchor) {
        this._scrollToAnchor(route.anchor);
      }
      return;
    }

    // Load the section
    await this._loadSectionFile(file);

    // Scroll to anchor if present
    if (route.anchor) {
      setTimeout(() => this._scrollToAnchor(route.anchor), 300);
    }
  },

  /**
   * Load a specific section file and append to container
   */
  _loadSectionFile: async function(fileName) {
    const container = document.getElementById('sectionsContainer');
    if (!container) return;

    const html = await this.fetchSection(fileName);
    if (html) {
      const wrapper = document.createElement('div');
      wrapper.className = 'section-fade-in';
      wrapper.innerHTML = html;
      container.appendChild(wrapper.firstElementChild || wrapper);
      this.loadedSections.add(fileName);
      this.initializeInteractiveFeatures();

      // Load any sub-sections (e.g., architecture-technical into architecture)
      await this.loadSubSections();
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
          wrapper.className = 'section-fade-in';
          wrapper.innerHTML = html;
          container.appendChild(wrapper.firstElementChild || wrapper);
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
   */
  _setupIntersectionObserver: function() {
    if (!('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section-id');
            if (sectionId && !this.loadedSections.has(sectionId)) {
              this._loadSectionFile(sectionId);
            }
          }
        });
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.1
      }
    );
  },

  /**
   * Preload remaining sections in background
   */
  _preloadRemainingSections: function(loadedFiles) {
    const remainingFiles = this.sections.filter(f => !loadedFiles.includes(f));

    // Preload with delay to not block main thread
    remainingFiles.forEach((file, index) => {
      setTimeout(() => {
        if (!this.loadedSections.has(file)) {
          this.fetchSection(file); // Just cache it
        }
      }, 1000 + (index * 500));
    });
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

    // Re-bind zoom handlers
    document.querySelectorAll('.mermaid-zoomable').forEach(diagram => {
      if (!diagram.hasAttribute('data-zoom-bound')) {
        diagram.setAttribute('data-zoom-bound', 'true');
        diagram.addEventListener('click', function() {
          this.classList.toggle('zoomed');
          const container = this.closest('.mermaid-container');
          const button = container?.querySelector('.mermaid-zoom-btn');
          if (button && typeof I18n !== 'undefined') {
            const isZoomed = this.classList.contains('zoomed');
            const zoomText = isZoomed ? I18n.t('zoom.zoomOut') : I18n.t('zoom.zoomIn');
            button.innerHTML = isZoomed
              ? `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"/></svg>${zoomText}`
              : `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>${zoomText}`;
          }
        });
      }
    });

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
