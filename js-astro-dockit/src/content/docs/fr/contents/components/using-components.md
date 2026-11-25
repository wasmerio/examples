---
title: Utiliser les composants
description: Apprenez à utiliser et personnaliser les composants dans votre documentation.
sidebar:
  order: 1
---

Dockit offre plusieurs options de composants pour créer une documentation riche et interactive. Vous avez accès aux composants intégrés d'Astro Starlight ainsi qu'à une collection de composants personnalisés pré-construits.

## Composants Astro Starlight

Vous pouvez utiliser tous les composants puissants fournis avec le framework Astro Starlight. Ceux-ci incluent des cartes, des badges, des blocs de code, des onglets et de nombreux autres éléments de documentation utiles.

Pour une documentation complète et des exemples d'utilisation de tous les composants Starlight disponibles, visitez:
**[https://starlight.astro.build/components/using-components/](https://starlight.astro.build/components/using-components/)**

## Composants pré-construits Dockit

En plus des composants Starlight, Dockit contient une collection de composants spécialement conçus pour les besoins de documentation. Tous ces composants se trouvent dans le dossier `user-components`.

### Composants personnalisés disponibles

Les composants pré-construits suivants sont disponibles pour utilisation dans votre documentation:

- **[Accordion](./accordion)** - Sections de contenu pliables pour organiser l'information
- **[Button](./button)** - Éléments de bouton personnalisables avec différents styles
- **[Grid](./grid)** - Système de mise en page en grille flexible pour organiser le contenu
- **[ListCard](./list-card)** - Listes basées sur des cartes pour afficher des fonctionnalités ou des éléments
- **[NewCard](./new-card)** - Composant de carte amélioré avec un style moderne

Chaque composant a sa propre page de documentation détaillée avec des exemples d'utilisation, des props et des meilleures pratiques.

## Emplacement des composants

Tous les composants personnalisés sont organisés dans la structure suivante:

```
src/
  components/
    user-components/     ← Composants personnalisés principaux
      ├── Accordion.astro
      ├── Button.astro
      ├── Grid.astro
      ├── ListCard.astro
      └── NewCard.astro
```

## Aan de slag

Om te beginnen met het gebruik van deze componenten in je documentatie, importeer ze eenvoudig aan het begin van je MDX bestanden en gebruik ze zoals getoond in de individuele component documentatie.