// Page-specific JavaScript for Registration Documentation
console.log('page.js loaded');

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

// Diagram Zoom Toggle Function
function toggleZoom(button) {
  const container = button.closest('.mermaid-container');
  const diagram = container.querySelector('.mermaid-zoomable');

  if (diagram) {
    diagram.classList.toggle('zoomed');

    // Update button text using i18n
    const isZoomed = diagram.classList.contains('zoomed');
    const zoomText = (typeof I18n !== 'undefined')
      ? (isZoomed ? I18n.t('zoom.zoomOut') : I18n.t('zoom.zoomIn'))
      : (isZoomed ? 'Zoom out' : 'Zoom in');

    button.innerHTML = isZoomed
      ? `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"/></svg>${zoomText}`
      : `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>${zoomText}`;
  }
}

// Click on diagram to toggle zoom
document.querySelectorAll('.mermaid-zoomable').forEach(diagram => {
  diagram.addEventListener('click', function() {
    this.classList.toggle('zoomed');
    const container = this.closest('.mermaid-container');
    const button = container.querySelector('.mermaid-zoom-btn');
    if (button) {
      const isZoomed = this.classList.contains('zoomed');
      const zoomText = (typeof I18n !== 'undefined')
        ? (isZoomed ? I18n.t('zoom.zoomOut') : I18n.t('zoom.zoomIn'))
        : (isZoomed ? 'Zoom out' : 'Zoom in');

      button.innerHTML = isZoomed
        ? `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"/></svg>${zoomText}`
        : `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>${zoomText}`;
    }
  });
});

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

// Progress bar
window.addEventListener('scroll', function() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('progressBar').style.width = scrolled + '%';
});

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

// Back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', function() {
  if (window.scrollY > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// TOC Toggle Function
function toggleTocItem(button) {
  const tocItem = button.closest('.toc-item');
  tocItem.classList.toggle('open');
}
// Make it globally available
window.toggleTocItem = toggleTocItem;
window.openSearch = openSearch;
window.closeSearch = closeSearch;
window.toggleZoom = toggleZoom;

// Active nav link
const sections = document.querySelectorAll('section[id], h3[id], h4[id]');
const navLinks = document.querySelectorAll('.toc-link');

window.addEventListener('scroll', function() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

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
