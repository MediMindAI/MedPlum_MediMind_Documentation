/**
 * Patient Registration Documentation - JavaScript
 * Version: 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
  initMobileNav();
  initFaqAccordion();
  initSmoothScroll();
  initActiveNavLink();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
  const toggle = document.querySelector('.doc-nav-mobile-toggle');
  const navLinks = document.querySelector('.doc-nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', function() {
    navLinks.classList.toggle('open');

    // Update aria-expanded
    const isOpen = navLinks.classList.contains('open');
    toggle.setAttribute('aria-expanded', isOpen);

    // Update icon
    const icon = toggle.querySelector('svg');
    if (icon) {
      if (isOpen) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
      } else {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
      }
    }
  });

  // Close nav when clicking outside
  document.addEventListener('click', function(event) {
    if (!toggle.contains(event.target) && !navLinks.contains(event.target)) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close nav on window resize to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.doc-faq-item');

  faqItems.forEach(function(item) {
    const question = item.querySelector('.doc-faq-question');

    if (!question) return;

    question.addEventListener('click', function() {
      // Toggle current item
      item.classList.toggle('open');

      // Update aria-expanded
      const isOpen = item.classList.contains('open');
      question.setAttribute('aria-expanded', isOpen);

      // Optionally close other items (uncomment for single-open behavior)
      // faqItems.forEach(function(otherItem) {
      //   if (otherItem !== item) {
      //     otherItem.classList.remove('open');
      //     otherItem.querySelector('.doc-faq-question')?.setAttribute('aria-expanded', 'false');
      //   }
      // });
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

/**
 * Smooth Scroll for Anchor Links
 * Note: When Router is available, page.js handles anchor navigation via event delegation.
 * This function is kept for backward compatibility but only applies to non-TOC links.
 */
function initSmoothScroll() {
  // Skip if Router is being used (page.js handles this)
  if (typeof Router !== 'undefined') {
    return;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(event) {
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();

        const navHeight = document.querySelector('.doc-nav')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without scrolling
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Active Navigation Link
 */
function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.doc-nav-links a');

  navLinks.forEach(function(link) {
    const linkPage = link.getAttribute('href');

    if (linkPage === currentPage ||
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * Helper: Create Screenshot Placeholder
 * Usage: createScreenshotPlaceholder('container-id', 'Description text')
 */
function createScreenshotPlaceholder(containerId, description) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="doc-screenshot">
      <svg class="doc-screenshot-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <p class="doc-screenshot-text">Screenshot Placeholder</p>
      <p class="doc-screenshot-label">${description}</p>
    </div>
  `;
}

/**
 * Helper: Toggle Section Visibility
 */
function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  section.classList.toggle('collapsed');
}

/**
 * Helper: Print Page
 */
function printPage() {
  window.print();
}

/**
 * Helper: Copy Text to Clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showNotification('კოპირებულია!', 'success');
  } catch (err) {
    console.error('Failed to copy:', err);
    showNotification('კოპირება ვერ მოხერხდა', 'error');
  }
}

/**
 * Helper: Show Notification
 */
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `doc-notification doc-notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#2b6cb0'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(function() {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(function() {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

/**
 * Screenshot Navigation
 */
var savedScrollPosition = null;
var mainScrolling = false;

function goToScreenshot() {
  var screenshot = document.getElementById('main-screenshot');
  var backBtn = document.getElementById('back-to-table-btn');

  if (!screenshot) return;

  mainScrolling = true;
  savedScrollPosition = window.scrollY;

  var rect = screenshot.getBoundingClientRect();
  var offsetTop = window.scrollY + rect.top - 80;
  window.scrollTo({ top: offsetTop, behavior: 'smooth' });

  if (backBtn) {
    backBtn.style.display = 'inline-flex';
  }

  setTimeout(function() {
    mainScrolling = false;
  }, 1000);
}

function goBackToTable() {
  var backBtn = document.getElementById('back-to-table-btn');

  if (backBtn) {
    backBtn.style.display = 'none';
  }

  if (savedScrollPosition !== null) {
    window.scrollTo({ top: savedScrollPosition, behavior: 'smooth' });
    savedScrollPosition = null;
  }
}

/**
 * Wizard Screenshot Navigation
 */
var savedWizardScrollPosition = null;
var wizardScrolling = false;

function goToWizardScreenshot() {
  var screenshot = document.getElementById('wizard-screenshot');
  var backBtn = document.getElementById('back-from-wizard-btn');

  if (!screenshot) return;

  wizardScrolling = true;
  savedWizardScrollPosition = window.scrollY;

  var rect = screenshot.getBoundingClientRect();
  var offsetTop = window.scrollY + rect.top - 80;
  window.scrollTo({ top: offsetTop, behavior: 'smooth' });

  if (backBtn) {
    backBtn.style.display = 'inline-flex';
  }

  setTimeout(function() {
    wizardScrolling = false;
  }, 1000);
}

function goBackFromWizard() {
  var backBtn = document.getElementById('back-from-wizard-btn');

  if (backBtn) {
    backBtn.style.display = 'none';
  }

  if (savedWizardScrollPosition !== null) {
    window.scrollTo({ top: savedWizardScrollPosition, behavior: 'smooth' });
    savedWizardScrollPosition = null;
  }
}

/**
 * Auto-hide back buttons when scrolling past screenshots
 */
window.addEventListener('scroll', function() {
  // Hide main screenshot back button
  if (!mainScrolling) {
    var backBtn1 = document.getElementById('back-to-table-btn');
    var screenshot1 = document.getElementById('main-screenshot');
    if (backBtn1 && screenshot1 && backBtn1.style.display !== 'none') {
      var rect1 = screenshot1.getBoundingClientRect();
      if (rect1.bottom < 0 || rect1.top > window.innerHeight) {
        backBtn1.style.display = 'none';
        savedScrollPosition = null;
      }
    }
  }

  // Hide wizard screenshot back button
  if (!wizardScrolling) {
    var backBtn2 = document.getElementById('back-from-wizard-btn');
    var screenshot2 = document.getElementById('wizard-screenshot');
    if (backBtn2 && screenshot2 && backBtn2.style.display !== 'none') {
      var rect2 = screenshot2.getBoundingClientRect();
      if (rect2.bottom < 0 || rect2.top > window.innerHeight) {
        backBtn2.style.display = 'none';
        savedWizardScrollPosition = null;
      }
    }
  }
});

