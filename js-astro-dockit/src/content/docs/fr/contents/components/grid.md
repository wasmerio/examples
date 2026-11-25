---
title: Composant Grid
description: Un système de mise en page en grille flexible pour organiser le contenu en colonnes responsives.
sidebar:
  order: 4
---

Le composant Grid offre un système de mise en page en grille responsive qui s'adapte automatiquement aux différentes tailles d'écran, ce qui le rend parfait pour organiser des cartes, des blocs de contenu ou d'autres éléments.

## Props

| Prop | Type | Requis | Défaut | Description |
|------|------|----------|---------|-------------|
| `columns` | number | Non | 2 | Nombre de colonnes à afficher sur les grands écrans |

## Fonctionnalités

- **Design responsive** - S'adapte automatiquement de plusieurs colonnes à une seule colonne sur mobile
- **Colonnes flexibles** - Prend en charge 1 à 6 colonnes sur les grands écrans
- **Espacement automatique** - Espaces cohérents entre les éléments de la grille
- **Contenu slot** - Accepte tout contenu comme enfants
- **Mobile-first** - Colonne unique sur petits écrans, adaptable sur grands écrans

## Exemples d'utilisation

### Grille deux colonnes (Par défaut)
```mdx
import Grid from "../../../../components/user-components/Grid.astro";
import { Card } from '@astrojs/starlight/components';

<Grid>
  <Card title="Fonctionnalité une">
    Description de la première fonctionnalité
  </Card>
  <Card title="Fonctionnalité deux">
    Description de la deuxième fonctionnalité
  </Card>
</Grid>
```

### Grille trois colonnes
```mdx
import Grid from "../../../../components/user-components/Grid.astro";
import { Card } from '@astrojs/starlight/components';

<Grid columns={3}>
  <Card title="Commencer">
    Guide de démarrage rapide
  </Card>
  <Card title="Configuration">
    Setup en aanpassing
  </Card>
  <Card title="Deployment">
    Je site publiceren
  </Card>
</Grid>
```

### Vier kolommen grid
```mdx
import Grid from "../../../../components/user-components/Grid.astro";
import { Card } from '@astrojs/starlight/components';

<Grid columns={4}>
  <Card title="HTML">
    Semantische markup
  </Card>
  <Card title="CSS">
    Moderne styling
  </Card>
  <Card title="JavaScript">
    Interactieve functies
  </Card>
  <Card title="Astro">
    Statische site generatie
  </Card>
</Grid>
```

### Gemengde content grid
```mdx
import Grid from "../../../../components/user-components/Grid.astro";
import { Card, Badge } from '@astrojs/starlight/components';

<Grid columns={2}>
  <div>
    <h3>Documentatie</h3>
    <p>Complete gidsen en API referentie</p>
    <Badge text="Bijgewerkt" variant="success" />
  </div>
  
  <Card title="Snelle links">
    - [Installatie](/install)
    - [Configuratie](/config)
    - [Voorbeelden](/examples)
  </Card>
</Grid>
```

## Responsief gedrag

Het Grid component past zich aan verschillende schermformaten aan:
- **Mobiel**: Altijd enkele kolom
- **Tablet**: 2 kolommen (ongeacht columns prop)
- **Desktop**: Gespecificeerde aantal kolommen