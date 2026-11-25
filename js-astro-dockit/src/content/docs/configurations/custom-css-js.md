---
title: "Custom CSS & JavaScript"
description: Learn how to add custom CSS styles and JavaScript functionality to your Dockit documentation site.
sidebar:
  order: 4
  label: "[node] Custom CSS & JavaScript"
---


Dockit allows you to easily add custom CSS styles and JavaScript functionality to enhance your documentation site's appearance and behavior. This guide covers various methods for implementing custom code.

## Custom CSS

### Adding Global Styles

You can add global CSS styles that will apply to all pages of your documentation site.

#### Method 1: Using the Theme Configuration

Add your custom CSS to the theme configuration file:

```json
// src/config/theme.json
{
  "customCSS": [
    "src/styles/custom.css",
    "src/styles/components.css"
  ]
}
```

#### Method 2: Direct CSS Injection

Create a CSS file in your `src/styles/` directory:

```css
/* src/styles/custom.css */

/* Custom color scheme */
:root {
  --custom-primary: #6366f1;
  --custom-secondary: #8b5cf6;
  --custom-accent: #06b6d4;
}

/* Custom component styling */
.custom-card {
  background: linear-gradient(135deg, var(--custom-primary), var(--custom-secondary));
  border-radius: 12px;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Override default styles */
.starlight-aside--tip {
  border-left-color: var(--custom-accent);
  background-color: rgba(6, 182, 212, 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .custom-card {
    padding: 1rem;
  }
}
```

### Component-Specific Styles

You can also add styles specific to certain components:

```css
/* Navigation customization */
.sidebar-nav {
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Button variations */
.btn-gradient {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.btn-gradient:hover {
  transform: translateY(-2px);
}

/* Code block enhancements */
.astro-code {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

/* Typography improvements */
.content h2 {
  position: relative;
  padding-left: 1rem;
}

.content h2::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: var(--custom-primary);
  border-radius: 2px;
}
```

## Custom JavaScript

### Adding Interactive Functionality

Enhance your documentation with custom JavaScript functionality.

#### Method 1: Global Scripts

Add JavaScript that runs on all pages:

```javascript
// src/assets/scripts/custom.js

// Enhanced search functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add search shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('[data-search-input]');
      if (searchInput) {
        searchInput.focus();
      }
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Copy code functionality
function addCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach(block => {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.onclick = () => {
      navigator.clipboard.writeText(block.textContent);
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    };
    
    block.style.position = 'relative';
    block.appendChild(button);
  });
}

// Initialize on page load
addCopyButtons();
```

#### Method 2: Component-Specific Scripts

Add JavaScript for specific components:

```javascript
// Interactive tabs functionality
class TabComponent {
  constructor(container) {
    this.container = container;
    this.tabs = container.querySelectorAll('.tab-button');
    this.panels = container.querySelectorAll('.tab-panel');
    this.init();
  }

  init() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => this.switchTab(index));
    });
  }

  switchTab(activeIndex) {
    this.tabs.forEach((tab, index) => {
      tab.classList.toggle('active', index === activeIndex);
    });
    
    this.panels.forEach((panel, index) => {
      panel.classList.toggle('active', index === activeIndex);
    });
  }
}

// Initialize tab components
document.querySelectorAll('.tab-container').forEach(container => {
  new TabComponent(container);
});

// Theme switcher enhancement
function enhanceThemeSwitch() {
  const themeSwitch = document.querySelector('.theme-switch');
  if (themeSwitch) {
    themeSwitch.addEventListener('click', function() {
      document.body.classList.add('theme-transition');
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 300);
    });
  }
}

enhanceThemeSwitch();
```

### Analytics and Tracking

Add analytics tracking to your documentation:

```javascript
// Google Analytics integration
function initializeAnalytics() {
  if (typeof gtag !== 'undefined') {
    // Track page views
    gtag('config', 'GA_TRACKING_ID', {
      page_title: document.title,
      page_location: window.location.href
    });

    // Track search queries
    document.addEventListener('search', function(e) {
      gtag('event', 'search', {
        event_category: 'engagement',
        event_label: e.detail.query
      });
    });

    // Track external link clicks
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      link.addEventListener('click', function() {
        gtag('event', 'click', {
          event_category: 'outbound',
          event_label: this.href
        });
      });
    });
  }
}

initializeAnalytics();
```

## Advanced Customization

### CSS Variables and Theming

Utilize CSS custom properties for dynamic theming:

```css
/* Advanced theme variables */
:root {
  --primary-hue: 240;
  --primary-saturation: 100%;
  --primary-lightness: 50%;
  --primary-color: hsl(var(--primary-hue), var(--primary-saturation), var(--primary-lightness));
  --primary-light: hsl(var(--primary-hue), var(--primary-saturation), calc(var(--primary-lightness) + 20%));
  --primary-dark: hsl(var(--primary-hue), var(--primary-saturation), calc(var(--primary-lightness) - 20%));
  
  /* Dynamic spacing */
  --space-unit: 1rem;
  --space-xs: calc(var(--space-unit) * 0.25);
  --space-sm: calc(var(--space-unit) * 0.5);
  --space-md: calc(var(--space-unit) * 1);
  --space-lg: calc(var(--space-unit) * 1.5);
  --space-xl: calc(var(--space-unit) * 2);
}

[data-theme="dark"] {
  --primary-lightness: 60%;
}
```

### JavaScript Modules

Organize your JavaScript using ES6 modules:

```javascript
// src/assets/scripts/modules/search.js
export class SearchEnhancer {
  constructor(options = {}) {
    this.options = {
      highlightResults: true,
      showResultCount: true,
      ...options
    };
  }

  enhance() {
    // Search enhancement logic
  }
}

// src/assets/scripts/modules/navigation.js
export class NavigationEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.addKeyboardNavigation();
    this.addScrollSpy();
  }

  addKeyboardNavigation() {
    // Keyboard navigation logic
  }

  addScrollSpy() {
    // Scroll spy functionality
  }
}

// src/assets/scripts/main.js
import { SearchEnhancer } from './modules/search.js';
import { NavigationEnhancer } from './modules/navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  new SearchEnhancer().enhance();
  new NavigationEnhancer();
});
```

## Best Practices

### Performance Optimization

1. **Minimize CSS and JavaScript**: Use minification tools for production builds
2. **Lazy Loading**: Load non-critical JavaScript after page load
3. **CSS Specificity**: Use efficient selectors to avoid performance issues

### Maintainability

1. **Modular Code**: Organize CSS and JavaScript into logical modules
2. **Documentation**: Comment your custom code thoroughly
3. **Version Control**: Track changes to custom styles and scripts

### Browser Compatibility

1. **Progressive Enhancement**: Ensure basic functionality works without JavaScript
2. **CSS Fallbacks**: Provide fallbacks for modern CSS features
3. **Feature Detection**: Use feature detection instead of browser detection

## Troubleshooting

### Common Issues

#### Styles Not Applying

- Check CSS specificity
- Verify file paths in configuration
- Ensure CSS is properly imported

#### JavaScript Errors

- Check browser console for error messages
- Verify script loading order
- Test in different browsers

#### Theme Conflicts

- Use CSS custom properties for theme-aware styles
- Test in both light and dark modes
- Avoid hardcoded colors

### Debug Mode

Enable debug mode to troubleshoot custom code:

```javascript
// Enable debug logging
const DEBUG = process.env.NODE_ENV === 'development';

function debugLog(message, data) {
  if (DEBUG) {
    console.log(`[Custom Script] ${message}`, data);
  }
}
```

## Examples

### Custom Alert Component

```css
.custom-alert {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  border-left: 4px solid;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.custom-alert--info {
  border-left-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.custom-alert--success {
  border-left-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.custom-alert--warning {
  border-left-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}
```

### Interactive Code Examples

```javascript
function createInteractiveExample(container) {
  const codeBlock = container.querySelector('pre');
  const runButton = document.createElement('button');
  
  runButton.textContent = 'Run Example';
  runButton.className = 'run-example-btn';
  runButton.onclick = () => {
    try {
      eval(codeBlock.textContent);
    } catch (error) {
      console.error('Example execution error:', error);
    }
  };
  
  container.appendChild(runButton);
}

// Apply to all code examples
document.querySelectorAll('.interactive-example').forEach(createInteractiveExample);
```

This documentation provides a comprehensive guide for adding custom CSS and JavaScript to your Dockit site, including practical examples and best practices for maintainable customization.