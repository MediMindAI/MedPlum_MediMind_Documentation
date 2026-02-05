/**
 * TOC Generator
 * Dynamically generates table of contents from manifest
 */

const TocGenerator = {
  // Configuration
  config: {
    containerId: 'toc-tree',
    activeClass: 'active',
    openClass: 'open'
  },

  // State
  manifest: null,
  container: null,
  currentRoute: null,

  /**
   * Initialize TOC generator
   */
  init: function(manifest, containerId = 'toc-tree') {
    this.manifest = manifest;
    this.config.containerId = containerId;
    this.container = document.getElementById(containerId);

    if (!this.container) {
      console.error('TOC container not found:', containerId);
      return this;
    }

    // Generate initial TOC
    this.render();

    // Subscribe to route changes
    if (typeof Router !== 'undefined') {
      Router.onRouteChange((route) => {
        this.currentRoute = route;
        this.updateActiveState();
      });
    }

    return this;
  },

  /**
   * Render the TOC
   */
  render: function() {
    if (!this.container || !this.manifest) return;

    this.container.innerHTML = '';

    for (const category of this.manifest.categories) {
      const categoryEl = this._createCategoryElement(category);
      this.container.appendChild(categoryEl);
    }

    // Apply translations
    if (typeof I18n !== 'undefined' && I18n.initialized) {
      I18n.applyTranslations();
    }
  },

  /**
   * Create category element
   */
  _createCategoryElement: function(category) {
    const div = document.createElement('div');
    div.className = 'toc-item';
    div.setAttribute('data-category', category.id);

    // Check if category has multiple sections
    const hasMultipleSections = category.sections.length > 1 ||
      (category.sections[0] && category.sections[0].children);

    if (hasMultipleSections) {
      // Collapsible category with children
      const button = document.createElement('button');
      button.className = 'toc-toggle';
      button.onclick = () => this._toggleItem(button);
      button.innerHTML = `
        <svg class="toc-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
        <span data-i18n="${category.titleKey}">${this._translate(category.titleKey)}</span>
      `;
      div.appendChild(button);

      // Children container
      const childrenDiv = document.createElement('div');
      childrenDiv.className = 'toc-children';

      // Single section with children → flatten (no nested toggle)
      if (category.sections.length === 1 && category.sections[0].children) {
        const section = category.sections[0];
        // Children as plain links (skip the section itself)
        for (const child of section.children) {
          const childEl = this._createChildElement(child, category.id, section);
          childrenDiv.appendChild(childEl);
        }
      } else {
        for (const section of category.sections) {
          const sectionEl = this._createSectionElement(section, category.id);
          childrenDiv.appendChild(sectionEl);
        }
      }

      div.appendChild(childrenDiv);
    } else if (category.sections.length === 1) {
      // Single section category - link directly
      const section = category.sections[0];
      const link = this._createLink(section, category.id);
      link.setAttribute('data-i18n', category.titleKey);
      div.appendChild(link);
    }

    return div;
  },

  /**
   * Create section element (recursive for nested sections)
   */
  _createSectionElement: function(section, categoryId, depth = 0) {
    const div = document.createElement('div');
    div.className = 'toc-item';
    div.setAttribute('data-section', section.id);

    const hasChildren = section.children && section.children.length > 0;

    if (hasChildren) {
      // Section with children
      const button = document.createElement('button');
      button.className = 'toc-toggle';
      button.onclick = () => this._toggleItem(button);

      button.innerHTML = `
        <svg class="toc-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
        <span data-i18n="${section.titleKey}">${this._translate(section.titleKey)}</span>
      `;

      // If section has its own file, make it clickable
      if (section.file) {
        const link = this._createLink(section, categoryId);
        link.innerHTML = `<span data-i18n="${section.titleKey}">${this._translate(section.titleKey)}</span>`;
        button.innerHTML = `
          <svg class="toc-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        `;
        button.appendChild(link);
      }

      div.appendChild(button);

      // Children container
      const childrenDiv = document.createElement('div');
      childrenDiv.className = 'toc-children';

      for (const child of section.children) {
        const childEl = this._createChildElement(child, categoryId, section);
        childrenDiv.appendChild(childEl);
      }

      div.appendChild(childrenDiv);
    } else {
      // Leaf section - just a link
      const link = this._createLink(section, categoryId);
      div.appendChild(link);
    }

    return div;
  },

  /**
   * Create child element (for anchors within a section)
   */
  _createChildElement: function(child, categoryId, parentSection) {
    const div = document.createElement('div');
    div.className = 'toc-item';
    div.setAttribute('data-section', child.id);

    const link = document.createElement('a');
    link.className = 'toc-link';

    // Child anchors link to parent section's anchor
    const anchor = child.anchor || child.id;
    link.href = Router.getSectionUrl(categoryId, parentSection.id, anchor);
    link.setAttribute('data-i18n', child.titleKey);
    link.textContent = this._translate(child.titleKey);

    link.onclick = (e) => {
      e.preventDefault();
      Router.navigate(Router.buildRoute(categoryId, parentSection.id, anchor));
    };

    div.appendChild(link);
    return div;
  },

  /**
   * Create link element
   */
  _createLink: function(section, categoryId) {
    const link = document.createElement('a');
    link.className = 'toc-link';
    link.href = Router.getSectionUrl(categoryId, section.id);
    link.setAttribute('data-i18n', section.titleKey);
    link.textContent = this._translate(section.titleKey);

    link.onclick = (e) => {
      e.preventDefault();
      Router.navigate(Router.buildRoute(categoryId, section.id));
    };

    return link;
  },

  /**
   * Toggle TOC item
   */
  _toggleItem: function(button) {
    const tocItem = button.closest('.toc-item');
    tocItem.classList.toggle(this.config.openClass);
  },

  /**
   * Update active state based on current route
   */
  updateActiveState: function() {
    if (!this.container || !this.currentRoute) return;

    // Remove all active states
    this.container.querySelectorAll('.toc-link.active').forEach(link => {
      link.classList.remove('active');
    });

    this.container.querySelectorAll('.toc-item.active').forEach(item => {
      item.classList.remove('active');
    });

    // Find and activate current section
    const { category, section, anchor } = this.currentRoute;

    if (category) {
      const categoryEl = this.container.querySelector(`[data-category="${category}"]`);
      if (categoryEl) {
        categoryEl.classList.add(this.config.openClass);
      }
    }

    if (section) {
      const sectionEl = this.container.querySelector(`[data-section="${section}"]`);
      if (sectionEl) {
        sectionEl.classList.add('active');

        // Open parent items
        let parent = sectionEl.parentElement;
        while (parent && parent !== this.container) {
          if (parent.classList.contains('toc-item')) {
            parent.classList.add(this.config.openClass);
          }
          parent = parent.parentElement;
        }

        // Highlight link
        const link = sectionEl.querySelector('.toc-link');
        if (link) {
          link.classList.add('active');
        }
      }
    }

    // Handle anchor
    if (anchor) {
      const anchorEl = this.container.querySelector(`[data-section="${anchor}"]`);
      if (anchorEl) {
        anchorEl.classList.add('active');
        const link = anchorEl.querySelector('.toc-link');
        if (link) {
          link.classList.add('active');
        }
      }
    }
  },

  /**
   * Expand to section
   */
  expandToSection: function(sectionId) {
    const sectionEl = this.container?.querySelector(`[data-section="${sectionId}"]`);
    if (!sectionEl) return;

    let parent = sectionEl.parentElement;
    while (parent && parent !== this.container) {
      if (parent.classList.contains('toc-item')) {
        parent.classList.add(this.config.openClass);
      }
      parent = parent.parentElement;
    }
  },

  /**
   * Collapse all
   */
  collapseAll: function() {
    this.container?.querySelectorAll('.toc-item.open').forEach(item => {
      item.classList.remove(this.config.openClass);
    });
  },

  /**
   * Get translation (with fallback)
   */
  _translate: function(key) {
    if (typeof I18n !== 'undefined' && I18n.initialized) {
      const translated = I18n.t(key);
      return translated !== key ? translated : key.split('.').pop();
    }
    return key.split('.').pop();
  }
};

// Export for global use
window.TocGenerator = TocGenerator;
