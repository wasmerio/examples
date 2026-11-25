---
title: Composant ListCard
description: Un composant de carte pour afficher des listes de contenu catégorisées avec des icônes et des compteurs d'articles.
sidebar:
  order: 3
---

Le composant ListCard crée des cartes attrayantes qui affichent des catégories de contenu avec des icônes, des titres, des compteurs d'articles et des images en vedette optionnelles. Parfait pour organiser des sections de documentation ou des listes de fonctionnalités.

## Props

| Prop | Type | Requis | Description |
|------|------|----------|-------------|
| `title` | string | Oui | Le titre principal affiché dans l'en-tête de la carte |
| `imageIcon` | string | Oui | Chemin vers l'image d'icône (40x40px recommandé) |
| `number` | number | Oui | Nombre d'articles ou d'éléments dans cette catégorie |
| `image` | string | Non | Image en vedette optionnelle pour une mise en page de carte large |

## Fonctionnalités

- **Affichage d'icône** - Affiche les icônes de catégorie avec le texte alt approprié
- **Compteur d'articles** - Affiche le nombre d'éléments dans chaque catégorie
- **Deux modes de mise en page** - Mises en page compactes et larges basées sur la présence d'image
- **Design responsive** - S'adapte aux différentes tailles d'écran
- **Contenu slot** - Accepte du contenu personnalisé dans le corps de la carte
- **Intégration d'image** - Utilise le composant ImageMod pour des images optimisées

## Exemples d'utilisation

### ListCard de base
```mdx
import ListCard from "../../../../components/user-components/ListCard.astro";

<ListCard
  title="Commencer"
  imageIcon="/sidebar-icons/Introduction.svg"
  number={5}
>
  Guides essentiels pour vous aider à démarrer rapidement avec Dockit.
</ListCard>
```

### ListCard avec image en vedette
```mdx
import ListCard from "../../../../components/user-components/ListCard.astro";

<ListCard
  title="Composants"
  imageIcon="/sidebar-icons/Themes.svg"
  number={12}
  image="/assets/components-preview.png"
>
  Leer hoe je alle beschikbare componenten gebruikt en aanpast in je documentatie.
</ListCard>
```

### Meerdere ListCards in Grid
```mdx
import ListCard from "../../../../components/user-components/ListCard.astro";
import Grid from "../../../../components/user-components/Grid.astro";

<Grid columns={2}>
  <ListCard
    title="Configuratie"
    imageIcon="/sidebar-icons/Global Settings.svg"
    number={8}
  >
    Pas je site-instellingen, thema en functionaliteit aan.
  </ListCard>

  <ListCard
    title="Navigatie"
    imageIcon="/sidebar-icons/Navigation.svg"
    number={6}
  >
    Stel menu's, breadcrumbs en site navigatie in.
  </ListCard>
</Grid>
```

### ListCard in een functielijst
```mdx
import ListCard from "../../../../components/user-components/ListCard.astro";

<div style="display: flex; flex-direction: column; gap: 1rem;">
  <ListCard
    title="API Referentie"
    imageIcon="/sidebar-icons/API.svg"
    number={25}
  >
    Volledige documentatie van alle beschikbare API endpoints en parameters.
  </ListCard>
  
  <ListCard
    title="Voorbeelden"
    imageIcon="/sidebar-icons/Examples.svg"
    number={15}
  >
    Praktische codevoorbeelden en use cases voor veelvoorkomende scenario's.
  </ListCard>
</div>
```

## Styling

Het component bevat ingebouwde styling voor:
- **Compacte layout**: Icoon, titel en teller in één rij
- **Brede layout**: Uitgelichte afbeelding met content ernaast
- **Hover effecten**: Subtiele animaties bij mouse hover
- **Donkere modus**: Automatische kleur aanpassingen

## Beste praktijken

- Gebruik consistente icoon stijlen en formaten
- Houd titels kort en beschrijvend
- Update de `number` prop wanneer content wijzigt
- Groepeer gerelateerde ListCards samen voor betere organisatie
- Gebruik uitgelichte afbeeldingen spaarzaam voor visuele balans