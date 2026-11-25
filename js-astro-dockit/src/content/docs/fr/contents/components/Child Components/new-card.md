---
title: Composant NewCard
description: Un composant de carte moderne avec icônes, effets de survol et bordures en dégradé pour afficher le contenu.
sidebar:
  order: 2
---

Le composant NewCard est un élément de carte polyvalent et moderne parfait pour présenter des fonctionnalités, des services ou des blocs de contenu. Il comprend un beau style, un support d'icône et des effets de survol interactifs.

## Props

| Prop | Type | Requis | Défaut | Description |
|------|------|----------|---------|-------------|
| `icon` | string | Non | - | Nom de l'icône Starlight à afficher |
| `title` | string | Oui | - | Le titre de la carte (prend en charge HTML) |
| `iconColor` | string | Non | - | Couleur personnalisée pour l'icône |
| `size` | string | Non | "large" | Variante de taille de carte ("large" ou "sm") |

## Fonctionnalités

- **Intégration d'icône** - Utilise le système d'icônes de Starlight
- **Deux variantes de taille** - Options grande (par défaut) et petite
- **Animation au survol** - Icône de flèche avec effet de rotation
- **Style en dégradé** - Bordures et arrière-plans en dégradé modernes
- **Support HTML** - La prop titre prend en charge le contenu HTML
- **Design responsive** - S'adapte aux différentes tailles d'écran
- **Contenu slot** - Accepte du contenu personnalisé dans le corps de la carte

## Exemples d'utilisation

### NewCard de base
```mdx
import NewCard from "../../../../components/user-components/NewCard.astro";

<NewCard 
  title="Commencer"
  icon="rocket"
>
  Guide de configuration rapide pour faire fonctionner votre site de documentation en quelques minutes.
</NewCard>
```

### Variante petite carte
```mdx
import NewCard from "../../../../components/user-components/NewCard.astro";

<NewCard 
  title="Configuration"
  icon="setting"
  size="sm"
>
  Pas je site-instellingen en uiterlijk aan.
</NewCard>
```

### Kaart met aangepaste icoon kleur
```mdx
import NewCard from "../../../../components/user-components/NewCard.astro";

<NewCard 
  title="API Referentie"
  icon="document"
  iconColor="#3b82f6"
>
  Volledige API documentatie en voorbeelden.
</NewCard>
```

### Grid van NewCards
```mdx
import NewCard from "../../../../components/user-components/NewCard.astro";
import Grid from "../../../../components/user-components/Grid.astro";

<Grid columns={3}>
  <NewCard title="Installeren" icon="add-document">
    Kom snel aan de slag
  </NewCard>
  
  <NewCard title="Configureren" icon="setting">
    Pas je setup aan
  </NewCard>
  
  <NewCard title="Deployen" icon="rocket">
    Publiceer je site
  </NewCard>
</Grid>
```

## Grootte varianten

### Grote kaarten (Standaard)
- Volledige padding (py-12 px-10)
- 2rem icoon grootte
- Bevat hover pijl animatie
- Best voor functie showcases

### Kleine kaarten
- Compacte padding (p-6)
- 1.4rem icoon grootte
- Geen pijl animatie
- Perfect voor compacte layouts

## Beschikbare iconen

Het component gebruikt Starlight's icoon bibliotheek. Populaire iconen omvatten:

- `rocket` - Voor starts/lanceringen
- `setting` - Voor configuratie
- `document` - Voor documentatie
- `add-document` - Voor nieuwe content
- `laptop` - Voor development
- `star` - Voor uitgelichte content

Zie de [Starlight icoon referentie](https://starlight.astro.build/reference/icons/) voor een complete lijst.

## Styling

Het component bevat:
- **Gradient achtergronden** - Subtiele kleurovergangen
- **Border effecten** - Moderne gradient randen
- **Hover staten** - Vloeiende overgangen
- **Dark mode ondersteuning** - Automatische kleur aanpassingen

## Beste praktijken

- Gebruik consistente iconen binnen een grid
- Houd titels kort en impactvol
- Groepeer gerelateerde kaarten samen
- Gebruik aangepaste icoon kleuren spaarzaam
- Test beide grootte varianten om de beste fit te vinden