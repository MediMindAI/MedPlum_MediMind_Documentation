/**
 * Hash-Based Router
 * Handles URL routing for bookmarkable sections
 * Format: #/category/section/anchor
 */

const Router = {
  // Configuration
  config: {
    defaultRoute: '/platform/technical-overview',
    scrollOffset: 80 // Account for fixed header
  },

  // State
  currentRoute: null,
  listeners: [],
  manifest: null,

  /**
   * Initialize router
   */
  init: function(manifest) {
    this.manifest = manifest;

    // Listen for hash changes
    window.addEventListener('hashchange', () => this._handleHashChange());

    // Handle initial route
    this._handleHashChange();

    return this;
  },

  /**
   * Navigate to a route
   */
  navigate: function(route, options = {}) {
    const { replace = false, scroll = true } = options;

    // Ensure route starts with /
    if (!route.startsWith('/')) {
      route = '/' + route;
    }

    // Update hash
    if (replace) {
      const url = window.location.href.split('#')[0] + '#' + route;
      window.history.replaceState(null, '', url);
    } else {
      window.location.hash = route;
    }

    // Scroll handling is done in _handleHashChange
    if (!scroll) {
      this._skipNextScroll = true;
    }
  },

  /**
   * Parse current route
   */
  parseRoute: function(hash = window.location.hash) {
    // Remove leading #
    let route = hash.replace(/^#\/?/, '');

    if (!route) {
      return {
        category: null,
        section: null,
        anchor: null,
        raw: ''
      };
    }

    const parts = route.split('/').filter(Boolean);

    return {
      category: parts[0] || null,
      section: parts[1] || null,
      anchor: parts[2] || null,
      raw: route
    };
  },

  /**
   * Build route string
   */
  buildRoute: function(category, section, anchor) {
    let route = '';
    if (category) route += '/' + category;
    if (section) route += '/' + section;
    if (anchor) route += '/' + anchor;
    return route || '/';
  },

  /**
   * Get current route
   */
  getCurrentRoute: function() {
    return this.currentRoute || this.parseRoute();
  },

  /**
   * Subscribe to route changes
   */
  onRouteChange: function(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  },

  /**
   * Find section info from manifest by route
   */
  findSection: function(route) {
    if (!this.manifest || !route.category) {
      return null;
    }

    const category = this.manifest.categories.find(c => c.id === route.category);
    if (!category) {
      return null;
    }

    if (!route.section) {
      // Return first section of category
      return {
        category: category,
        section: category.sections[0] || null,
        anchor: null
      };
    }

    // Search sections
    const section = this._findSectionRecursive(category.sections, route.section);

    return {
      category: category,
      section: section,
      anchor: route.anchor
    };
  },

  /**
   * Recursively find section by ID
   */
  _findSectionRecursive: function(sections, sectionId) {
    for (const section of sections) {
      if (section.id === sectionId) {
        return section;
      }
      if (section.children) {
        const found = this._findSectionRecursive(section.children, sectionId);
        if (found) return found;
      }
    }
    return null;
  },

  /**
   * Handle hash change event
   */
  _handleHashChange: function() {
    const route = this.parseRoute();

    // Handle legacy anchors (e.g., #overview instead of #/category/overview)
    if (!route.category && route.raw && !route.raw.includes('/')) {
      const legacyId = route.raw;
      const resolved = this._resolveLegacyAnchor(legacyId);
      if (resolved) {
        this.navigate(resolved, { replace: true });
        return;
      }
    }

    // Handle empty route
    if (!route.category) {
      this.navigate(this.config.defaultRoute, { replace: true });
      return;
    }

    const previousRoute = this.currentRoute;
    this.currentRoute = route;

    // Notify listeners
    this.listeners.forEach(callback => {
      try {
        callback(route, previousRoute);
      } catch (e) {
        console.error('Router listener error:', e);
      }
    });

    // Scroll to anchor if present and not skipping
    if (!this._skipNextScroll && route.anchor) {
      this._scrollToAnchor(route.anchor);
    }
    this._skipNextScroll = false;
  },

  /**
   * Resolve legacy anchor (e.g., #overview) to new route format
   */
  _resolveLegacyAnchor: function(anchorId) {
    if (!this.manifest) return null;

    for (const category of this.manifest.categories) {
      for (const section of category.sections) {
        if (section.id === anchorId) {
          return this.buildRoute(category.id, section.id);
        }

        // Check children
        if (section.children) {
          for (const child of section.children) {
            if (child.id === anchorId || child.anchor === anchorId) {
              return this.buildRoute(category.id, section.id, child.anchor || child.id);
            }
          }
        }

        // Check anchors array
        if (section.anchors && section.anchors.includes(anchorId)) {
          return this.buildRoute(category.id, section.id, anchorId);
        }
      }
    }

    return null;
  },

  /**
   * Scroll to anchor element
   */
  _scrollToAnchor: function(anchorId) {
    // Wait for content to load
    setTimeout(() => {
      const element = document.getElementById(anchorId);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - this.config.scrollOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  },

  /**
   * Generate URL for a section
   */
  getSectionUrl: function(categoryId, sectionId, anchor) {
    return '#' + this.buildRoute(categoryId, sectionId, anchor);
  }
};

// Export for global use
window.Router = Router;
