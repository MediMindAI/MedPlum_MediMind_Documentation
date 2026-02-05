/**
 * LRU Cache with TTL support
 * Designed for caching section content with memory management
 */

const LRUCache = {
  // Configuration
  config: {
    maxItems: 25,
    maxSizeBytes: 50 * 1024 * 1024, // 50MB
    defaultTTL: 30 * 60 * 1000 // 30 minutes
  },

  // Internal storage
  cache: new Map(),
  accessOrder: [],
  currentSize: 0,

  /**
   * Initialize cache with custom config
   */
  init: function(options = {}) {
    this.config = { ...this.config, ...options };
    this.cache = new Map();
    this.accessOrder = [];
    this.currentSize = 0;
    return this;
  },

  /**
   * Generate cache key
   */
  key: function(lang, sectionId) {
    return `${lang}-${sectionId}`;
  },

  /**
   * Get item from cache
   */
  get: function(key) {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check TTL
    if (item.expiry && Date.now() > item.expiry) {
      this.delete(key);
      return null;
    }

    // Update access order (move to end)
    this._updateAccessOrder(key);

    return item.value;
  },

  /**
   * Set item in cache
   */
  set: function(key, value, ttl = this.config.defaultTTL) {
    const size = this._estimateSize(value);

    // Evict items if necessary
    while (
      (this.cache.size >= this.config.maxItems ||
       this.currentSize + size > this.config.maxSizeBytes) &&
      this.accessOrder.length > 0
    ) {
      this._evictLRU();
    }

    // Remove existing item if updating
    if (this.cache.has(key)) {
      const existing = this.cache.get(key);
      this.currentSize -= existing.size;
    }

    // Store item
    const item = {
      value: value,
      size: size,
      expiry: ttl ? Date.now() + ttl : null,
      timestamp: Date.now()
    };

    this.cache.set(key, item);
    this.currentSize += size;
    this._updateAccessOrder(key);

    return this;
  },

  /**
   * Check if key exists and is valid
   */
  has: function(key) {
    if (!this.cache.has(key)) {
      return false;
    }

    const item = this.cache.get(key);
    if (item.expiry && Date.now() > item.expiry) {
      this.delete(key);
      return false;
    }

    return true;
  },

  /**
   * Delete item from cache
   */
  delete: function(key) {
    const item = this.cache.get(key);
    if (item) {
      this.currentSize -= item.size;
      this.cache.delete(key);
      this.accessOrder = this.accessOrder.filter(k => k !== key);
    }
    return this;
  },

  /**
   * Clear all items
   */
  clear: function() {
    this.cache.clear();
    this.accessOrder = [];
    this.currentSize = 0;
    return this;
  },

  /**
   * Clear items for a specific language
   */
  clearLang: function(lang) {
    const keysToDelete = [];
    this.cache.forEach((_, key) => {
      if (key.startsWith(`${lang}-`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.delete(key));
    return this;
  },

  /**
   * Get cache statistics
   */
  stats: function() {
    return {
      items: this.cache.size,
      maxItems: this.config.maxItems,
      sizeBytes: this.currentSize,
      maxSizeBytes: this.config.maxSizeBytes,
      utilizationPercent: Math.round((this.currentSize / this.config.maxSizeBytes) * 100)
    };
  },

  /**
   * Update access order (move key to most recently used)
   */
  _updateAccessOrder: function(key) {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);
  },

  /**
   * Evict least recently used item
   */
  _evictLRU: function() {
    if (this.accessOrder.length === 0) {
      return;
    }

    const lruKey = this.accessOrder.shift();
    const item = this.cache.get(lruKey);

    if (item) {
      this.currentSize -= item.size;
      this.cache.delete(lruKey);
    }
  },

  /**
   * Estimate size of value in bytes
   */
  _estimateSize: function(value) {
    if (typeof value === 'string') {
      return value.length * 2; // UTF-16
    }
    if (typeof value === 'object') {
      return JSON.stringify(value).length * 2;
    }
    return 64; // Default estimate
  }
};

// Export for global use
window.LRUCache = LRUCache;
