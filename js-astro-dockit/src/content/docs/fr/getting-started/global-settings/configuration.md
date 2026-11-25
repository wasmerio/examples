---
title: Configuration globale
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

### Options de configuration

| Option | Type | Description |
|--------|------|-------------|
| `site.title` | String | Le titre principal de votre site |
| `site.description` | String | Brève description de votre documentation |
| `site.author` | String | Nom d'auteur par défaut |
| `site.email` | String | Adresse e-mail de contact |
| `site.base_url` | String | L'URL de production de votre site |
| `metadata.meta_image` | String | Image Open Graph par défaut |

## Configuration du thème (`theme.json`)

Personnalisez l'apparence visuelle de votre site:

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

### Thema opties

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