/**
 * Section Loader - Dynamically loads HTML sections
 * This module handles lazy loading of documentation sections with i18n support
 */

const SectionLoader = {
  // Configuration
  config: {
    sectionsBasePath: 'sections/',
    currentLang: 'ka',
    loadingClass: 'section-loading',
    loadedClass: 'section-loaded',
    errorClass: 'section-error'
  },

  // List of sections to load
  sections: [
    'technical-overview',
    'overview',
    'features',
    'architecture',
    'troubleshooting',
    'contact'
  ],

  // Cache loaded sections (keyed by lang-section)
  cache: new Map(),

  /**
   * Get the current sections path based on language
   */
  getSectionsPath: function() {
    return `${this.config.sectionsBasePath}${this.config.currentLang}/`;
  },

  /**
   * Set the current language and reload sections
   */
  setLanguage: async function(lang) {
    if (this.config.currentLang === lang) {
      return;
    }

    this.config.currentLang = lang;

    // Reload all sections with new language
    await this.loadAllSections();
  },

  /**
   * Initialize the section loader
   */
  init: function() {
    // Check if I18n has set a language
    if (typeof I18n !== 'undefined' && I18n.currentLang) {
      this.config.currentLang = I18n.currentLang;
    }

    // Load all sections on page load
    this.loadAllSections();
  },

  /**
   * Load all sections
   */
  loadAllSections: async function() {
    const container = document.getElementById('sectionsContainer');
    if (!container) {
      console.error('Sections container not found');
      return;
    }

    // Get loading text from I18n or use default
    const loadingText = (typeof I18n !== 'undefined')
      ? I18n.t('loading.loading')
      : 'Loading...';

    // Show loading state
    container.innerHTML = `<div class="section-loading">${loadingText}</div>`;

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
          container.appendChild(wrapper.firstElementChild || wrapper);
        }
      });

      // Re-initialize interactive features after loading
      this.initializeInteractiveFeatures();

      // Initialize collapsible sections as collapsed
      if (typeof window.initCollapsibleSections === 'function') {
        window.initCollapsibleSections();
      }

      // Load sub-sections (like architecture-technical)
      await this.loadSubSections();

    } catch (error) {
      console.error('Error loading sections:', error);
      const errorText = (typeof I18n !== 'undefined')
        ? I18n.t('loading.error')
        : 'Error loading sections';
      container.innerHTML = `<div class="section-error">${errorText}</div>`;
    }
  },

  /**
   * Fetch a single section
   */
  fetchSection: async function(sectionName) {
    const cacheKey = `${this.config.currentLang}-${sectionName}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const path = `${this.getSectionsPath()}${sectionName}.html`;
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();

      // Cache the result
      this.cache.set(cacheKey, html);

      return html;
    } catch (error) {
      console.error(`Error loading section ${sectionName}:`, error);
      return null;
    }
  },

  /**
   * Load a specific section by name
   */
  loadSection: async function(sectionName, targetElement) {
    if (!targetElement) {
      targetElement = document.getElementById(`section-${sectionName}`);
    }

    if (!targetElement) {
      console.error(`Target element for section ${sectionName} not found`);
      return;
    }

    const loadingText = (typeof I18n !== 'undefined')
      ? I18n.t('loading.loading')
      : 'Loading...';

    // Show loading state
    targetElement.innerHTML = `<div class="section-loading">${loadingText}</div>`;

    const html = await this.fetchSection(sectionName);

    if (html) {
      targetElement.innerHTML = html;
      targetElement.classList.add(this.config.loadedClass);
      this.initializeInteractiveFeatures();
    } else {
      const errorText = (typeof I18n !== 'undefined')
        ? I18n.t('loading.error')
        : 'Error loading';
      targetElement.innerHTML = `<div class="section-error">${errorText}</div>`;
      targetElement.classList.add(this.config.errorClass);
    }
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

    // Re-initialize FAQ accordion for dynamically loaded content
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
  },

  /**
   * Load sub-sections into their containers
   */
  loadSubSections: async function() {
    // Define sub-sections to load: { containerId: 'filename' }
    const subSections = {
      'architecture-technical-container': 'architecture-technical'
    };

    for (const [containerId, fileName] of Object.entries(subSections)) {
      const container = document.getElementById(containerId);
      if (container) {
        try {
          const path = `${this.getSectionsPath()}${fileName}.html`;
          const response = await fetch(path);
          if (response.ok) {
            const html = await response.text();
            container.innerHTML = html;
          }
        } catch (error) {
          console.error(`Error loading sub-section ${fileName}:`, error);
        }
      }
    }
  },

  /**
   * Preload sections in background
   */
  preloadSections: function(sectionNames) {
    sectionNames.forEach(name => {
      const cacheKey = `${this.config.currentLang}-${name}`;
      if (!this.cache.has(cacheKey)) {
        this.fetchSection(name);
      }
    });
  },

  /**
   * Clear the cache (useful when switching languages)
   */
  clearCache: function() {
    this.cache.clear();
  },

  /**
   * Initialize FAQ accordion for dynamically loaded content
   */
  initFaqAccordion: function() {
    const faqItems = document.querySelectorAll('.doc-faq-item:not([data-accordion-bound])');

    faqItems.forEach(function(item) {
      const question = item.querySelector('.doc-faq-question');

      if (!question) return;

      // Mark as bound to prevent duplicate handlers
      item.setAttribute('data-accordion-bound', 'true');

      question.addEventListener('click', function() {
        // Toggle current item
        item.classList.toggle('open');

        // Update aria-expanded
        const isOpen = item.classList.contains('open');
        question.setAttribute('aria-expanded', isOpen);
      });

      // Keyboard accessibility
      question.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          question.click();
        }
      });
    });
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for I18n to initialize first
  setTimeout(() => {
    SectionLoader.init();
  }, 100);
});

// Export for global use
window.SectionLoader = SectionLoader;
