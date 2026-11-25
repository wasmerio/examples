---
title: Composant Accordion
description: Un composant de contenu pliable pour organiser les informations dans des sections extensibles.
sidebar:
  order: 6
---

Le composant Accordion crée des sections de contenu pliables qui aident à organiser les informations de manière efficace en termes d'espace. Les utilisateurs peuvent cliquer sur l'en-tête pour développer ou réduire le contenu.

## Props

| Prop | Type | Requis | Description |
|------|------|----------|-------------|
| `type` | string | Non | Attribut de données pour le style ou le ciblage JavaScript |
| `question` | string | Oui | Le texte de l'en-tête affiché dans l'accordéon |
| `answer` | string/HTML | Oui | Le contenu affiché lorsque l'accordéon est développé |

## Fonctionnalités

- **Basculement interactif** - Cliquez pour développer/réduire le contenu
- **Animation d'icône** - L'icône plus tourne lors du basculement
- **Design responsive** - Fonctionne sur toutes les tailles d'écran
- **Style personnalisé** - Prend en charge la personnalisation du thème
- **Accessible** - Support de la navigation au clavier

## Exemples d'utilisation

### Accordion de base
```mdx
import Accordion from "../../../../components/user-components/Accordion.astro";

<Accordion 
  question="Qu'est-ce que Dockit?" 
  answer="Dockit est un thème de documentation moderne construit avec Astro et Starlight." 
/>
```

### Accordion avec Type
```mdx
import Accordion from "../../../../components/user-components/Accordion.astro";

<Accordion 
  type="faq"
  question="Hoe pas ik het thema aan?" 
  answer="Je kunt kleuren, lettertypen en layout aanpassen via de configuratiebestanden." 
/>
```

### Meerdere Accordions
```mdx
import Accordion from "../../../../components/user-components/Accordion.astro";

<Accordion 
  question="Installatie" 
  answer="Voer npm install uit om te beginnen met Dockit." 
/>

<Accordion 
  question="Configuratie" 
  answer="Bewerk het astro.config.mjs bestand om je site aan te passen." 
/>

<Accordion 
  question="Deployment" 
  answer="Deploy naar Netlify, Vercel of elke statische hosting provider." 
/>
```

## Styling

Het component bevat ingebouwde stijlen met ondersteuning voor:
- Lichte en donkere thema varianten
- Hover en focus staten
- Vloeiende animaties
- Aangepaste spatiëring en typografie

## Beste praktijken

- Gebruik duidelijke, beknopte vragen als headers
- Houd antwoordinhoud gefocust en scanbaar
- Groepeer gerelateerde accordions samen
- Gebruik de `type` prop voor consistente styling over vergelijkbare accordions