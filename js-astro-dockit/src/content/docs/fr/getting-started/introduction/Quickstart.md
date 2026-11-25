---
title: Démarrage rapide
description: Configurez les paramètres globaux de DocKit, les options de thème et les préférences à l'échelle du site.
---

DocKit offre des options de configuration globale flexibles pour personnaliser l'apparence, le comportement et les fonctionnalités de votre site de documentation. Ce guide couvre tous les paramètres essentiels que vous pouvez configurer.

## Fichiers de configuration

DocKit utilise plusieurs fichiers de configuration situés dans le répertoire `src/config/`:

```
src/config/
├── config.json      # Configuration principale du site
├── theme.json       # Options de thème et de style  
├── menu.json        # Structure du menu de navigation
├── social.json      # Liens de réseaux sociaux
└── locals.json      # Paramètres de localisation
```

## Configuration principale (`config.json`)

Le fichier de configuration principal contrôle les paramètres de base de votre site:

```json
{
  "site": {
    "title": "Documentation DocKit",
    "description": "Belle documentation rendue facile",
    "author": "Votre nom",
    "email": "votre.email@exemple.com",
    "base_url": "https://votredomaine.com"
  },
  "metadata": {
    "meta_author": "Équipe DocKit",
    "meta_image": "/images/og-image.png",
    "meta_description": "Créez une belle documentation avec DocKit"
  }
}
```

### Configuratie-opties

| Optie | Type | Beschrijving |
|--------|------|-------------|
| `site.title` | String | De hoofdtitel van je site |
| `site.description` | String | Korte beschrijving van je documentatie |
| `site.author` | String | Standaard auteursnaam |
| `site.email` | String | Contact e-mailadres |
| `site.base_url` | String | De productie URL van je site |
| `metadata.meta_image` | String | Standaard Open Graph afbeelding |

## Thema configuratie (`theme.json`)

Pas het visuele uiterlijk van je site aan:

```json
{
  "theme": {
    "primary_color": "#2563eb",
    "secondary_color": "#64748b", 
    "accent_color": "#06b6d4",
    "background_color": "#ffffff",
    "text_color": "#1e293b"
  },
  "layout": {
    "sidebar_width": "280px",
    "content_max_width": "1200px",
    "enable_breadcrumbs": true,
    "enable_toc": true
  },
  "features": {
    "dark_mode": true,
    "search": true,
    "print_button": true,
    "edit_page": true
  }
}
```

### Thema-opties

#### Kleuren
- `primary_color`: Hoofdmerkkleur voor links en knoppen
- `secondary_color`: Secundaire elementen en randen
- `accent_color`: Highlights en call-to-action elementen
- `background_color`: Hoofdachtergrondkleur
- `text_color`: Standaardtekstkleur

#### Layout
- `sidebar_width`: Breedte van de navigatiezijbalk
- `content_max_width`: Maximale breedte van het contentgebied
- `enable_breadcrumbs`: Toon/verberg breadcrumb navigatie
- `enable_toc`: Toon/verberg inhoudsopgave

#### Functies
- `dark_mode`: Donkere modus schakelaar inschakelen
- `search`: Site zoekfunctionaliteit inschakelen
- `print_button`: Printknop op pagina's tonen
- `edit_page`: "Bewerk deze pagina" links tonen

## Navigatiemenu (`menu.json`)

Definieer de navigatiestructuur van je site:

```json
{
  "main": [
    {
      "name": "Aan de slag",
      "url": "/getting-started/",
      "children": [
        {
          "name": "Introductie", 
          "url": "/getting-started/introduction/"
        },
        {
          "name": "Globale instellingen",
          "url": "/getting-started/global-settings/"
        }
      ]
    },
    {
      "name": "Gidsen",
      "url": "/guides/"
    },
    {
      "name": "Referentie", 
      "url": "/reference/"
    }
  ]
}
```

## Sociale links (`social.json`)

Configureer sociale media en externe links:

```json
{
  "social": [
    {
      "name": "GitHub",
      "icon": "github",
      "url": "https://github.com/jouwgebruikersnaam/jouw-repo"
    },
    {
      "name": "Twitter",
      "icon": "twitter", 
      "url": "https://twitter.com/jouwgebruikersnaam"
    },
    {
      "name": "Discord",
      "icon": "discord",
      "url": "https://discord.gg/your-server"
    }
  ]
}
```

## Lokalisatie (`locals.json`)

Stel meertalige ondersteuning in:

```json
{
  "defaultLocale": "nl",
  "locales": {
    "nl": {
      "label": "Nederlands",
      "lang": "nl",
      "dir": "ltr"
    },
    "en": {
      "label": "English", 
      "lang": "en",
      "dir": "ltr"
    }
  }
}
```

## Astro configuratie

DocKit integreert ook met Astro's configuratie in `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'DocKit',
      description: 'Mooie documentatie gemakkelijk gemaakt',
      logo: {
        src: './src/assets/logo.svg',
      },
      customCss: [
        './src/styles/global.css',
      ],
    }),
  ],
});
```

## Omgevingsvariabelen

Configureer omgevingsspecifieke instellingen met behulp van `.env` bestanden:

```bash
# .env.local
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_ANALYTICS_ID=jouw-analytics-id
GITHUB_TOKEN=jouw-github-token
```

## Beste praktijken

### Prestaties
- Houd configuratiebestanden klein en gefocust
- Gebruik juiste datatypes (strings, booleans, numbers)
- Vermijd diep geneste structuren

### Onderhoud  
- Documenteer je aangepaste configuraties
- Gebruik versiebeheer voor configuratiewijzigingen
- Test configuratiewijzigingen eerst in ontwikkeling

### Beveiliging
- Commit nooit gevoelige data naar configuratiebestanden
- Gebruik omgevingsvariabelen voor geheimen
- Valideer configuratie-inputs

## Probleemoplossing

### Veelvoorkomende problemen

**Configuratie laadt niet**: Zorg ervoor dat JSON-bestanden geldige syntaxis hebben en juiste bestandsextensies.

**Stijlen worden niet toegepast**: Controleer dat theme.json waarden geldige CSS-syntaxis gebruiken.

**Menu wordt niet getoond**: Verifieer dat menu.json structuur overeenkomt met het verwachte formaat.

**Build fouten**: Valideer alle configuratiebestanden tegen hun schema's.

---

Hulp nodig met geavanceerde configuratie? Bekijk onze [aanpassingsgids](/guides/customization) of vraag het in onze [community discussies](https://github.com/jouwgebruikersnaam/dockit/discussions).