/**
 * Manifest Loader
 * Loads and provides access to the section manifest
 */

const ManifestLoader = {
  // State
  manifest: null,
  loaded: false,
  loading: false,
  loadPromise: null,

  /**
   * Load the manifest file
   */
  load: async function(path = 'config/manifest.json') {
    // Return cached manifest if already loaded
    if (this.loaded && this.manifest) {
      return this.manifest;
    }

    // Return existing promise if loading
    if (this.loading && this.loadPromise) {
      return this.loadPromise;
    }

    this.loading = true;
    this.loadPromise = this._fetchManifest(path);

    try {
      this.manifest = await this.loadPromise;
      this.loaded = true;
      return this.manifest;
    } catch (error) {
      console.error('Failed to load manifest:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  },

  /**
   * Fetch manifest from server
   */
  _fetchManifest: async function(path) {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load manifest: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Get manifest (must be loaded first)
   */
  get: function() {
    return this.manifest;
  },

  /**
   * Get all categories
   */
  getCategories: function() {
    return this.manifest?.categories || [];
  },

  /**
   * Get category by ID
   */
  getCategory: function(categoryId) {
    return this.manifest?.categories?.find(c => c.id === categoryId);
  },

  /**
   * Get all sections flat list
   */
  getAllSections: function() {
    const sections = [];

    const extractSections = (items, category) => {
      for (const item of items) {
        sections.push({
          ...item,
          categoryId: category.id,
          categoryTitleKey: category.titleKey
        });

        if (item.children) {
          extractSections(item.children, category);
        }
      }
    };

    for (const category of this.getCategories()) {
      extractSections(category.sections, category);
    }

    return sections;
  },

  /**
   * Get section by ID
   */
  getSection: function(sectionId) {
    return this.getAllSections().find(s => s.id === sectionId);
  },

  /**
   * Get unique files to load
   */
  getUniqueFiles: function() {
    const files = new Set();

    const extractFiles = (sections) => {
      for (const section of sections) {
        if (section.file) {
          files.add(section.file);
        }
        if (section.subSections) {
          for (const sub of section.subSections) {
            if (sub.file) {
              files.add(sub.file);
            }
          }
        }
        if (section.children) {
          extractFiles(section.children);
        }
      }
    };

    for (const category of this.getCategories()) {
      extractFiles(category.sections);
    }

    return Array.from(files);
  },

  /**
   * Get sections by priority
   */
  getSectionsByPriority: function(priority) {
    return this.getAllSections().filter(s => s.priority === priority);
  },

  /**
   * Get high priority sections (for initial load)
   */
  getHighPrioritySections: function() {
    return this.getSectionsByPriority('high');
  },

  /**
   * Get default section
   */
  getDefaultSection: function() {
    if (!this.manifest) return null;

    const defaultId = this.manifest.defaultSection;
    if (defaultId) {
      return this.getSection(defaultId);
    }

    // Fallback to first section
    const categories = this.getCategories();
    if (categories.length > 0 && categories[0].sections.length > 0) {
      return categories[0].sections[0];
    }

    return null;
  },

  /**
   * Find section's category
   */
  findCategoryForSection: function(sectionId) {
    for (const category of this.getCategories()) {
      const found = this._findInSections(category.sections, sectionId);
      if (found) {
        return category;
      }
    }
    return null;
  },

  /**
   * Helper to search sections recursively
   */
  _findInSections: function(sections, sectionId) {
    for (const section of sections) {
      if (section.id === sectionId) {
        return section;
      }
      if (section.children) {
        const found = this._findInSections(section.children, sectionId);
        if (found) return found;
      }
    }
    return null;
  }
};

// Export for global use
window.ManifestLoader = ManifestLoader;
