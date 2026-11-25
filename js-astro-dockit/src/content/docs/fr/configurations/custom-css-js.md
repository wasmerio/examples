---
title: "CSS & JavaScript personnalisés"
description: Apprenez à ajouter des styles CSS personnalisés et des fonctionnalités JavaScript à votre site de documentation Dockit.
sidebar:
  order: 4
  label: "[node] CSS & JavaScript personnalisés"
---

Dockit vous permet d'ajouter facilement des styles CSS personnalisés et des fonctionnalités JavaScript pour améliorer l'apparence et le comportement de votre site de documentation. Ce guide couvre différentes méthodes pour implémenter du code personnalisé.

## CSS personnalisé

### Ajouter des styles globaux

Vous pouvez ajouter des styles CSS globaux qui s'appliquent à toutes les pages de votre site de documentation.

#### Méthode 1: Utilisation de la configuration du thème

Ajoutez votre CSS personnalisé au fichier de configuration du thème:

```json
// src/config/theme.json
{
  "customCSS": [
    "src/styles/custom.css",
    "src/styles/components.css"
  ]
}
```

#### Méthode 2: Injection CSS directe

Créez un fichier CSS dans votre répertoire `src/styles/`:

```css
/* src/styles/custom.css */

/* Palette de couleurs personnalisée */
:root {
  --custom-primary: #6366f1;
  --custom-secondary: #8b5cf6;
  --custom-accent: #06b6d4;
}

/* Style de composant personnalisé */
.custom-card {
  background: linear-gradient(135deg, var(--custom-primary), var(--custom-secondary));
  border-radius: 12px;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Remplacer les styles par défaut */
.starlight-aside--tip {
  border-left-color: var(--custom-accent);
  background-color: rgba(6, 182, 212, 0.1);
}

/* Design responsive */
@media (max-width: 768px) {
  .custom-card {
    padding: 1rem;
  }
}
```

### Styles spécifiques aux composants

Vous pouvez également ajouter des styles spécifiques à certains composants:

```css
/* Personnalisations de navigation */
.sidebar-nav {
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Variations de boutons */
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

/* Code blok verbeteringen */
.astro-code {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

/* Typografie verbeteringen */
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

## Aangepaste JavaScript

### Interactieve functionaliteit toevoegen

Verbeter je documentatie met aangepaste JavaScript-functionaliteit.

#### Methode 1: Globale scripts

Voeg JavaScript toe dat op alle pagina's wordt uitgevoerd:

```javascript
// src/assets/scripts/custom.js

// Verbeterde zoekfunctionaliteit
document.addEventListener('DOMContentLoaded', function() {
  // Zoek sneltoetsen toevoegen
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('[data-search-input]');
      if (searchInput) {
        searchInput.focus();
      }
    }
  });

  // Vloeiend scrollen voor ankerlinks
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

// Code kopieer functionaliteit
function addCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach(block => {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Kopiëren';
    button.onclick = () => {
      navigator.clipboard.writeText(block.textContent);
      button.textContent = 'Gekopieerd!';
      setTimeout(() => {
        button.textContent = 'Kopiëren';
      }, 2000);
    };
    
    block.style.position = 'relative';
    block.appendChild(button);
  });
}

// Initialiseren bij pagina laden
addCopyButtons();
```

#### Methode 2: Component-specifieke scripts

Voeg JavaScript toe voor specifieke componenten:

```javascript
// Interactieve tabs functionaliteit
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

// Initialiseer tab componenten
document.querySelectorAll('.tab-container').forEach(container => {
  new TabComponent(container);
});

// Thema-wisselaar verbetering
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

### Analytics en tracking

Voeg analytics tracking toe aan je documentatie:

```javascript
// Google Analytics integratie
function initializeAnalytics() {
  if (typeof gtag !== 'undefined') {
    // Paginaweergaven bijhouden
    gtag('config', 'GA_TRACKING_ID', {
      page_title: document.title,
      page_location: window.location.href
    });

    // Zoekopdrachten bijhouden
    document.addEventListener('search', function(e) {
      gtag('event', 'search', {
        event_category: 'engagement',
        event_label: e.detail.query
      });
    });

    // Externe link clicks bijhouden
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

## Geavanceerde aanpassingen

### CSS variabelen en theming

Gebruik CSS custom properties voor dynamische theming:

```css
/* Geavanceerde thema variabelen */
:root {
  --primary-hue: 240;
  --primary-saturation: 100%;
  --primary-lightness: 50%;
  --primary-color: hsl(var(--primary-hue), var(--primary-saturation), var(--primary-lightness));
  --primary-light: hsl(var(--primary-hue), var(--primary-saturation), calc(var(--primary-lightness) + 20%));
  --primary-dark: hsl(var(--primary-hue), var(--primary-saturation), calc(var(--primary-lightness) - 20%));
  
  /* Dynamische spatiëring */
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

### JavaScript modules

Organiseer je JavaScript met ES6 modules:

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
    // Zoek verbetering logica
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
    // Toetsenbord navigatie logica
  }

  addScrollSpy() {
    // Scroll spy functionaliteit
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

## Beste praktijken

### Prestatie-optimalisatie

1. **CSS en JavaScript minimaliseren**: Gebruik minification tools voor productie builds
2. **Lazy Loading**: Laad niet-kritieke JavaScript na pagina laden
3. **CSS specificiteit**: Gebruik efficiënte selectors om prestatieproblemen te voorkomen

### Onderhoudbaarheid

1. **Modulaire code**: Organiseer CSS en JavaScript in logische modules
2. **Documentatie**: Documenteer je aangepaste code grondig
3. **Versiebeheer**: Houd wijzigingen in aangepaste stijlen en scripts bij

### Browser compatibiliteit

1. **Progressive Enhancement**: Zorg ervoor dat basisfunctionaliteit werkt zonder JavaScript
2. **CSS fallbacks**: Zorg voor fallbacks voor moderne CSS-functies
3. **Feature detectie**: Gebruik feature detectie in plaats van browser detectie

## Probleemoplossing

### Veelvoorkomende problemen

#### Stijlen worden niet toegepast

- Controleer CSS specificiteit
- Verifieer bestandspaden in configuratie
- Zorg ervoor dat CSS correct geïmporteerd is

#### JavaScript fouten

- Controleer browser console op foutmeldingen
- Verifieer script laadvolgorde
- Test in verschillende browsers

#### Thema conflicten

- Gebruik CSS custom properties voor thema-bewuste stijlen
- Test in zowel lichte als donkere modus
- Vermijd hardcoded kleuren

### Debug modus

Schakel debug modus in om aangepaste code te debuggen:

```javascript
// Debug logging inschakelen
const DEBUG = process.env.NODE_ENV === 'development';

function debugLog(message, data) {
  if (DEBUG) {
    console.log(`[Aangepast Script] ${message}`, data);
  }
}
```

## Voorbeelden

### Aangepast waarschuwingscomponent

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

### Interactieve code voorbeelden

```javascript
function createInteractiveExample(container) {
  const codeBlock = container.querySelector('pre');
  const runButton = document.createElement('button');
  
  runButton.textContent = 'Voorbeeld uitvoeren';
  runButton.className = 'run-example-btn';
  runButton.onclick = () => {
    try {
      eval(codeBlock.textContent);
    } catch (error) {
      console.error('Voorbeeld uitvoeringsfout:', error);
    }
  };
  
  container.appendChild(runButton);
}

// Toepassen op alle code voorbeelden
document.querySelectorAll('.interactive-example').forEach(createInteractiveExample);
```

Deze documentatie biedt een uitgebreide gids voor het toevoegen van aangepaste CSS en JavaScript aan je Dockit site, inclusief praktische voorbeelden en beste praktijken voor onderhoudbare aanpassingen.