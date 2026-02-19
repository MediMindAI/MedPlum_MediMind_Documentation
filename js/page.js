// Page-specific JavaScript for Registration Documentation
console.log('page.js loaded');

// Utility: Throttle function to limit execution rate
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Utility: Debounce function to delay execution
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Event listener tracking for cleanup
const trackedListeners = [];
function addTrackedListener(target, event, handler, options) {
  target.addEventListener(event, handler, options);
  trackedListeners.push({ target, event, handler, options });
}

// Cleanup function for page unload
function cleanupListeners() {
  trackedListeners.forEach(({ target, event, handler, options }) => {
    target.removeEventListener(event, handler, options);
  });
  trackedListeners.length = 0;
}
window.addEventListener('beforeunload', cleanupListeners);

// Initialize Mermaid with Premium Dark Theme
mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  themeVariables: {
    // Background
    background: '#1a365d',

    // Primary - Gradient Blue tones
    primaryColor: '#1a365d',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#63b3ed',

    // Secondary - Theme blue accent
    secondaryColor: '#2b6cb0',
    secondaryTextColor: '#ffffff',
    secondaryBorderColor: '#63b3ed',

    // Tertiary - Theme blue accent
    tertiaryColor: '#3182ce',
    tertiaryTextColor: '#ffffff',
    tertiaryBorderColor: '#63b3ed',

    // Note - Yellow/Amber for decisions
    noteBkgColor: '#fbbf24',
    noteTextColor: '#1a365d',
    noteBorderColor: '#f59e0b',

    // Lines and edges
    lineColor: '#63b3ed',
    textColor: '#e5e7eb',

    // Main background and font
    mainBkg: '#1a365d',
    fontFamily: '"Noto Sans Georgian", sans-serif',
    fontSize: '14px',

    // Flowchart specific
    nodeBorder: '#63b3ed',
    clusterBkg: 'rgba(26, 54, 93, 0.2)',
    clusterBorder: '#2b6cb0',
    defaultLinkColor: '#63b3ed',
    titleColor: '#ffffff',
    edgeLabelBackground: '#1a365d',

    // State diagram
    labelColor: '#ffffff',
    altBackground: '#1a365d',

    // ER Diagram
    attributeBackgroundColorOdd: '#1a365d',
    attributeBackgroundColorEven: '#1a365d'
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 15,
    nodeSpacing: 50,
    rankSpacing: 60
  },
  stateDiagram: {
    htmlLabels: true
  },
  er: {
    useMaxWidth: true
  }
});

// DiagramViewer — Production-ready zoom/pan/navigation for Mermaid diagrams
const DiagramViewer = {
  _states: new WeakMap(),
  MIN_SCALE: 0.5,
  MAX_SCALE: 3.0,
  STEP: 0.25,

  _getState: function(container) {
    if (!this._states.has(container)) {
      this._states.set(container, { scale: 1, tx: 0, ty: 0, dragging: false });
    }
    return this._states.get(container);
  },

  _applyTransform: function(diagram, state) {
    diagram.style.transform = 'translate(' + state.tx + 'px, ' + state.ty + 'px) scale(' + state.scale + ')';
  },

  _updateLevel: function(container, state) {
    var el = container.querySelector('.mermaid-zoom-level');
    if (el) el.textContent = Math.round(state.scale * 100) + '%';
  },

  _t: function(key, fallback) {
    return (typeof I18n !== 'undefined') ? I18n.t(key) : fallback;
  },

  _buildToolbar: function(container) {
    // Remove any old zoom-buttons markup
    var old = container.querySelector('.mermaid-zoom-buttons');
    if (old) old.remove();
    // Skip if already has toolbar
    if (container.querySelector('.mermaid-toolbar')) return;

    var toolbar = document.createElement('div');
    toolbar.className = 'mermaid-toolbar';

    // Zoom group
    var zoomGrp = document.createElement('div');
    zoomGrp.className = 'mermaid-toolbar-group';

    var minusBtn = document.createElement('button');
    minusBtn.className = 'mermaid-tb-btn';
    minusBtn.textContent = '\u2212';
    minusBtn.title = this._t('zoom.zoomOut', 'Zoom out');
    minusBtn.setAttribute('data-action', 'zoom-out');

    var level = document.createElement('span');
    level.className = 'mermaid-zoom-level';
    level.textContent = '100%';

    var plusBtn = document.createElement('button');
    plusBtn.className = 'mermaid-tb-btn';
    plusBtn.textContent = '+';
    plusBtn.title = this._t('zoom.zoomIn', 'Zoom in');
    plusBtn.setAttribute('data-action', 'zoom-in');

    zoomGrp.appendChild(minusBtn);
    zoomGrp.appendChild(level);
    zoomGrp.appendChild(plusBtn);

    // Action group
    var actGrp = document.createElement('div');
    actGrp.className = 'mermaid-toolbar-group';

    var resetBtn = document.createElement('button');
    resetBtn.className = 'mermaid-tb-btn';
    resetBtn.textContent = '\u27F2';
    resetBtn.title = this._t('zoom.reset', 'Reset');
    resetBtn.setAttribute('data-action', 'reset');

    var fsBtn = document.createElement('button');
    fsBtn.className = 'mermaid-tb-btn';
    fsBtn.textContent = '\u26F6';
    fsBtn.title = this._t('zoom.fullscreen', 'Fullscreen');
    fsBtn.setAttribute('data-action', 'fullscreen');

    actGrp.appendChild(resetBtn);
    actGrp.appendChild(fsBtn);

    toolbar.appendChild(zoomGrp);
    toolbar.appendChild(actGrp);

    container.insertBefore(toolbar, container.firstChild);
  },

  _bindContainer: function(container) {
    if (container.hasAttribute('data-dv-bound')) return;
    container.setAttribute('data-dv-bound', 'true');
    container.setAttribute('tabindex', '0');

    var self = this;
    var diagram = container.querySelector('.mermaid-zoomable');
    if (!diagram) return;

    var state = this._getState(container);

    // Toolbar button clicks
    container.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (action === 'zoom-in') self.zoomTo(container, state.scale + self.STEP);
      else if (action === 'zoom-out') self.zoomTo(container, state.scale - self.STEP);
      else if (action === 'reset') { state.scale = 1; state.tx = 0; state.ty = 0; self._applyTransform(diagram, state); self._updateLevel(container, state); }
      else if (action === 'fullscreen') {
        if (document.fullscreenElement === container) document.exitFullscreen();
        else container.requestFullscreen().catch(function() {});
      }
    });

    // Ctrl+scroll zoom
    container.addEventListener('wheel', function(e) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      var delta = e.deltaY > 0 ? -self.STEP : self.STEP;
      self.zoomTo(container, state.scale + delta);
    }, { passive: false });

    // Drag/pan
    var startX, startY, startTx, startTy;
    diagram.addEventListener('pointerdown', function(e) {
      if (state.scale <= 1) return;
      state.dragging = true;
      diagram.classList.add('dragging');
      diagram.setPointerCapture(e.pointerId);
      startX = e.clientX; startY = e.clientY;
      startTx = state.tx; startTy = state.ty;
    });
    diagram.addEventListener('pointermove', function(e) {
      if (!state.dragging) return;
      state.tx = startTx + (e.clientX - startX);
      state.ty = startTy + (e.clientY - startY);
      self._applyTransform(diagram, state);
    });
    diagram.addEventListener('pointerup', function() {
      state.dragging = false;
      diagram.classList.remove('dragging');
    });

    // Keyboard shortcuts when focused
    container.addEventListener('keydown', function(e) {
      if (e.key === '+' || e.key === '=') { e.preventDefault(); self.zoomTo(container, state.scale + self.STEP); }
      else if (e.key === '-') { e.preventDefault(); self.zoomTo(container, state.scale - self.STEP); }
      else if (e.key === '0') { e.preventDefault(); state.scale = 1; state.tx = 0; state.ty = 0; self._applyTransform(diagram, state); self._updateLevel(container, state); }
      else if (e.key === 'f') { e.preventDefault(); if (document.fullscreenElement === container) document.exitFullscreen(); else container.requestFullscreen().catch(function() {}); }
    });

    // Touch pinch-zoom
    var lastDist = 0;
    container.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
        lastDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      }
    }, { passive: true });
    container.addEventListener('touchmove', function(e) {
      if (e.touches.length === 2) {
        var dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        if (lastDist > 0) {
          var factor = dist / lastDist;
          self.zoomTo(container, state.scale * factor);
        }
        lastDist = dist;
      }
    }, { passive: true });
  },

  zoomTo: function(container, newScale) {
    var state = this._getState(container);
    state.scale = Math.max(this.MIN_SCALE, Math.min(this.MAX_SCALE, newScale));
    var diagram = container.querySelector('.mermaid-zoomable');
    if (diagram) {
      this._applyTransform(diagram, state);
      diagram.style.cursor = state.scale > 1 ? 'grab' : 'default';
    }
    this._updateLevel(container, state);
  },

  _buildNav: function() {
    var containers = document.querySelectorAll('.mermaid-container');
    if (containers.length < 2) return;
    // Remove existing nav
    document.querySelectorAll('.mermaid-diagram-nav').forEach(function(n) { n.remove(); });

    var nav = document.createElement('div');
    nav.className = 'mermaid-diagram-nav';

    var self = this;
    containers.forEach(function(c, i) {
      var h3 = null;
      var el = c;
      while (el = el.previousElementSibling) { if (el.tagName === 'H3') { h3 = el; break; } }
      var label = h3 ? h3.textContent.trim() : 'Diagram ' + (i + 1);
      var pill = document.createElement('button');
      pill.className = 'mermaid-nav-pill' + (i === 0 ? ' active' : '');
      pill.textContent = (i + 1) + '/' + containers.length + ' ' + label;
      pill.addEventListener('click', function() {
        c.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nav.querySelectorAll('.mermaid-nav-pill').forEach(function(p) { p.classList.remove('active'); });
        pill.classList.add('active');
      });
      nav.appendChild(pill);
    });

    // Insert before first container
    containers[0].parentNode.insertBefore(nav, containers[0]);

    // Update active pill on scroll
    var updatePills = throttle(function() {
      var pills = nav.querySelectorAll('.mermaid-nav-pill');
      containers.forEach(function(c, i) {
        var rect = c.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
          pills.forEach(function(p) { p.classList.remove('active'); });
          pills[i].classList.add('active');
        }
      });
    }, 200);
    window.addEventListener('scroll', updatePills, { passive: true });
  },

  initAll: function() {
    var self = this;
    var containers = document.querySelectorAll('.mermaid-container');
    containers.forEach(function(c) {
      self._buildToolbar(c);
      self._bindContainer(c);
    });
    if (containers.length > 1) this._buildNav();
  }
};
window.DiagramViewer = DiagramViewer;

// Search functionality
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Default search items - will be populated by SearchIndexer
let searchItems = [];

// Function to get search items from SearchIndexer or fallback
function getSearchItems() {
  if (typeof SearchIndexer !== 'undefined') {
    const items = SearchIndexer.getItems();
    if (items && items.length > 0) {
      return items;
    }
  }
  return searchItems;
}

// Function to update search items (called by I18n or SearchIndexer)
function updateSearchItems(items) {
  if (Array.isArray(items) && items.length > 0) {
    searchItems = items;
  }
}
window.updateSearchItems = updateSearchItems;

function openSearch() {
  searchModal.classList.add('open');
  searchInput.focus();
}

function closeSearch() {
  searchModal.classList.remove('open');
  searchInput.value = '';
  renderSearchResults('');
}

function renderSearchResults(query) {
  const noResultsText = (typeof I18n !== 'undefined')
    ? I18n.t('search.noResults')
    : 'No results found';
  const startTypingText = (typeof I18n !== 'undefined')
    ? I18n.t('search.startTyping')
    : 'Start typing to search';

  if (!query) {
    searchResults.innerHTML = `<div class="search-no-results">${startTypingText}</div>`;
    return;
  }

  // Get items from SearchIndexer or fallback
  const items = getSearchItems();
  const filtered = items.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.section.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    searchResults.innerHTML = `<div class="search-no-results">${noResultsText}</div>`;
    return;
  }

  searchResults.innerHTML = filtered.map(item => `
    <a href="${item.href}" class="search-result-item" onclick="event.preventDefault(); navigateToSearchResult('${item.href}')">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <div>
        <div style="font-weight: 500;">${item.title}</div>
        <div style="font-size: 12px; opacity: 0.6;">${item.section}</div>
      </div>
    </a>
  `).join('');
}

searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));

// Update search results to use router navigation
function navigateToSearchResult(href) {
  closeSearch();

  // Check if router is available
  if (typeof Router !== 'undefined' && Router.manifest) {
    // Extract anchor from href (e.g., #overview -> overview)
    const anchor = href.replace('#', '');

    // Try to find in manifest and navigate via router
    const resolved = Router._resolveLegacyAnchor(anchor);
    if (resolved) {
      Router.navigate(resolved);
      return;
    }
  }

  // Fallback: direct anchor navigation
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
window.navigateToSearchResult = navigateToSearchResult;

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
  if (e.key === 'Escape') {
    // Close lightbox first
    const lbModal = document.getElementById('lightboxModal');
    if (lbModal && lbModal.style.display === 'flex') {
      lbModal.style.display = 'none';
      e.preventDefault();
      return;
    }
    // Close search
    closeSearch();
  }
});

searchModal.addEventListener('click', (e) => {
  if (e.target === searchModal) closeSearch();
});

// Consolidated scroll handler (throttled for performance)
function updateProgressBar() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById('progressBar');
  if (progressBar) progressBar.style.width = scrolled + '%';
}

function updateBackToTopVisibility() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

// Track previous category to detect section changes
let previousCategory = null;

// Scroll spy suppression: after TOC click, ignore scroll events briefly
let scrollSpySuppressed = false;
function suppressScrollSpy(ms) {
  scrollSpySuppressed = true;
  setTimeout(() => { scrollSpySuppressed = false; }, ms || 800);
}
window.suppressScrollSpy = suppressScrollSpy;

function updateActiveNavLink() {
  if (scrollSpySuppressed) return;

  const sections = window.documentSections || document.querySelectorAll('section[id], h3[id], h4[id]');
  let current = '';

  // Use getBoundingClientRect for accurate position with dynamic content
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120) {
      current = section.getAttribute('id');
    }
  });

  // Remove all active states and aria-current
  document.querySelectorAll('.toc-item.active, .toc-link.active').forEach(el => {
    el.classList.remove('active');
    if (el.classList.contains('toc-link')) {
      el.removeAttribute('aria-current');
    }
  });

  if (!current) return;

  // Find TOC item by data-section attribute
  const tocItem = document.querySelector(`.toc-item[data-section="${current}"]`);
  if (!tocItem) return;

  // Find the top-level category for this item
  const category = tocItem.closest('.toc-item[data-category]');
  const categoryId = category?.getAttribute('data-category');

  // Track category change (don't close other top-level categories)
  if (categoryId && categoryId !== previousCategory) {
    previousCategory = categoryId;
  }

  // Add active state
  tocItem.classList.add('active');
  const link = tocItem.querySelector('.toc-link');
  if (link) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'true');
  }

  // Open parent items (path to active item)
  let parent = tocItem.parentElement;
  while (parent) {
    if (parent.classList.contains('toc-item')) {
      parent.classList.add('open');
    }
    parent = parent.parentElement;
  }

  // Auto-scroll sidebar to keep active item visible
  const sidebar = document.querySelector('.toc-tree');
  if (sidebar && link) {
    link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Single consolidated scroll handler
const handleScroll = throttle(function() {
  updateProgressBar();
  updateBackToTopVisibility();
  updateActiveNavLink();
}, 100);

addTrackedListener(window, 'scroll', handleScroll, { passive: true });

// Sidebar toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

console.log('Sidebar elements:', sidebarToggle, sidebar);

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('open');
    sidebarToggle.classList.toggle('active');
    document.body.classList.toggle('sidebar-open');
    console.log('Sidebar toggled, body classes:', document.body.className);
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', function() {
    sidebar.classList.remove('open');
    sidebarToggle.classList.remove('active');
    document.body.classList.remove('sidebar-open');
  });
}

// Back to top click handler
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// TOC Toggle Function
function toggleTocItem(button) {
  const tocItem = button.closest('.toc-item');
  tocItem.classList.toggle('open');
}
// Make it globally available
window.toggleTocItem = toggleTocItem;
window.openSearch = openSearch;
window.closeSearch = closeSearch;

// Active nav link - sections cached for scroll spy (updated by section-loader)

// Smooth scroll - delegate to router when available
function handleAnchorClick(e) {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  // Skip if it's a TOC link (TOC generator handles these)
  if (anchor.closest('.toc-tree')) return;

  e.preventDefault();
  const href = anchor.getAttribute('href');
  const anchorId = href.replace('#', '');

  // Close sidebar on mobile
  sidebar.classList.remove('open');
  sidebarToggle.classList.remove('active');
  document.body.classList.remove('sidebar-open');

  // Use router if available
  if (typeof Router !== 'undefined' && Router.manifest) {
    const resolved = Router._resolveLegacyAnchor(anchorId);
    if (resolved) {
      Router.navigate(resolved);
      return;
    }
  }

  // Fallback: direct scroll
  const target = document.getElementById(anchorId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Use event delegation for anchor clicks
document.addEventListener('click', handleAnchorClick);

// Lightbox for images
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.querySelector('.lightbox-close');

function initLightbox() {
  document.querySelectorAll('.doc-screenshot-image, .doc-form-section-card img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      lightboxModal.style.display = 'flex';
      lightboxImg.src = this.src;
    });
  });
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', function() {
    lightboxModal.style.display = 'none';
  });
}

if (lightboxModal) {
  lightboxModal.addEventListener('click', function(e) {
    if (e.target === lightboxModal) {
      lightboxModal.style.display = 'none';
    }
  });
}

// Initialize lightbox on page load
initLightbox();

// Re-initialize after sections are loaded
window.initLightbox = initLightbox;

// Collapsible section toggle function
function toggleSection(header) {
  const section = header.closest('.doc-section-collapsible');
  if (section) {
    section.classList.toggle('collapsed');
    const content = section.querySelector('.doc-section-content');
    if (content) {
      if (section.classList.contains('collapsed')) {
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
      }
    }
  }
}
window.toggleSection = toggleSection;

// Initialize collapsible sections as collapsed
function initCollapsibleSections() {
  document.querySelectorAll('.doc-section-collapsible').forEach(section => {
    section.classList.add('collapsed');
  });
}
window.initCollapsibleSections = initCollapsibleSections;
