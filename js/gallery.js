/**
 * Gallery Component for Multi-Step Screenshots
 * Provides navigation and interaction for screenshot galleries
 */

class ScreenshotGallery {
  constructor(element) {
    this.element = element;
    this.images = element.querySelectorAll('.gallery-image');
    this.dots = element.querySelectorAll('.gallery-dots .dot');
    this.prevBtn = element.querySelector('.gallery-prev');
    this.nextBtn = element.querySelector('.gallery-next');
    this.caption = element.querySelector('.gallery-caption');
    this.stepLabel = element.querySelector('.step-label');
    this.stepDescription = element.querySelector('.step-description');
    this.stepCounter = element.querySelector('.gallery-step-counter');
    this.progressBar = element.querySelector('.gallery-progress');
    this.thumbnails = element.querySelectorAll('.gallery-thumb');

    this.currentIndex = 0;
    this.totalSteps = this.images.length;
    this.autoPlayInterval = null;
    this.autoPlayDelay = parseInt(element.dataset.autoplay) || 0;

    this.init();
  }

  init() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goTo(index));
    });

    // Thumbnail navigation
    this.thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => this.goTo(index));
    });

    // Keyboard navigation
    this.element.setAttribute('tabindex', '0');
    this.element.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Touch/swipe support
    this.initSwipe();

    // Lightbox integration
    this.images.forEach((img) => {
      img.addEventListener('click', () => this.openLightbox(img));
    });

    // Auto-play if configured
    if (this.autoPlayDelay > 0) {
      this.startAutoPlay();
      this.element.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.element.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    // Initial state
    this.updateUI();
    this.updateButtonStates();
  }

  prev() {
    if (this.currentIndex > 0) {
      this.goTo(this.currentIndex - 1);
    }
  }

  next() {
    if (this.currentIndex < this.totalSteps - 1) {
      this.goTo(this.currentIndex + 1);
    }
  }

  goTo(index) {
    if (index < 0 || index >= this.totalSteps || index === this.currentIndex) {
      return;
    }

    // Update images
    this.images[this.currentIndex].classList.remove('active');
    this.images[index].classList.add('active');

    // Update dots
    if (this.dots.length) {
      this.dots[this.currentIndex].classList.remove('active');
      this.dots[index].classList.add('active');
    }

    // Update thumbnails
    if (this.thumbnails.length) {
      this.thumbnails[this.currentIndex].classList.remove('active');
      this.thumbnails[index].classList.add('active');
    }

    this.currentIndex = index;
    this.updateUI();
    this.updateButtonStates();

    // Dispatch event for external listeners
    this.element.dispatchEvent(new CustomEvent('gallery:change', {
      detail: { index, total: this.totalSteps }
    }));
  }

  updateUI() {
    const currentImage = this.images[this.currentIndex];

    // Update step counter
    if (this.stepCounter) {
      this.stepCounter.textContent = `${this.currentIndex + 1}/${this.totalSteps}`;
    }

    // Update caption
    if (this.stepLabel) {
      this.stepLabel.textContent = `Step ${this.currentIndex + 1}/${this.totalSteps}:`;
    }
    if (this.stepDescription && currentImage) {
      this.stepDescription.textContent = currentImage.alt || '';
    }

    // Update progress bar
    if (this.progressBar) {
      const progress = ((this.currentIndex + 1) / this.totalSteps) * 100;
      this.progressBar.style.width = `${progress}%`;
    }
  }

  updateButtonStates() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex === this.totalSteps - 1;
    }
  }

  handleKeyboard(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.prev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.next();
        break;
      case 'Home':
        e.preventDefault();
        this.goTo(0);
        break;
      case 'End':
        e.preventDefault();
        this.goTo(this.totalSteps - 1);
        break;
    }
  }

  initSwipe() {
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    const threshold = 50;

    this.element.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
    }, { passive: true });

    this.element.addEventListener('touchmove', (e) => {
      distX = e.touches[0].pageX - startX;
      distY = e.touches[0].pageY - startY;
    }, { passive: true });

    this.element.addEventListener('touchend', () => {
      if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > threshold) {
        if (distX > 0) {
          this.prev();
        } else {
          this.next();
        }
      }
      distX = 0;
      distY = 0;
    });
  }

  openLightbox(img) {
    // Check if lightbox exists (from page.js)
    if (typeof window.openLightbox === 'function') {
      window.openLightbox(img.src, img.alt);
    } else {
      // Fallback: open image in new tab
      window.open(img.src, '_blank');
    }
  }

  startAutoPlay() {
    if (this.autoPlayDelay > 0 && !this.autoPlayInterval) {
      this.autoPlayInterval = setInterval(() => {
        if (this.currentIndex < this.totalSteps - 1) {
          this.next();
        } else {
          this.goTo(0);
        }
      }, this.autoPlayDelay);
    }
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  destroy() {
    this.stopAutoPlay();
    // Remove event listeners if needed
  }
}

// Initialize all galleries on page
function initGalleries() {
  const galleries = document.querySelectorAll('.doc-screenshot-gallery');
  galleries.forEach((gallery) => {
    if (!gallery.dataset.initialized) {
      new ScreenshotGallery(gallery);
      gallery.dataset.initialized = 'true';
    }
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGalleries);
} else {
  initGalleries();
}

// Re-initialize after dynamic content load (for section loader)
document.addEventListener('section:loaded', initGalleries);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ScreenshotGallery, initGalleries };
}
