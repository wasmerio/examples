---
title: Composant Button
description: Un composant de bouton simple et personnalisable avec plusieurs variantes de style.
sidebar:
  order: 5
---

Le composant Button offre un élément de bouton propre et accessible qui peut être stylisé avec différentes variantes pour correspondre à vos besoins de conception.

## Props

| Prop | Type | Requis | Description |
|------|------|----------|-------------|
| `label` | string | Oui | Le texte affiché sur le bouton |
| `link` | string | Oui | L'URL vers laquelle le bouton doit pointer |
| `variant` | string | Non | Variante de style (primary, secondary, outline, etc.) |

## Fonctionnalités

- **Plusieurs variantes** - Différents styles visuels pour différents cas d'utilisation
- **Liens accessibles** - Éléments d'ancrage correctement structurés
- **Design responsive** - S'adapte aux différentes tailles d'écran
- **Style personnalisé** - Facile à étendre avec des classes CSS supplémentaires
- **HTML sémantique** - Utilise les bons éléments de lien pour la navigation

## Exemples d'utilisation

### Bouton primaire
```mdx
import Button from "../../../../components/user-components/Button.astro";

<Button 
  label="Commencer" 
  link="/getting-started" 
  variant="primary" 
/>
```

### Bouton secondaire
```mdx
import Button from "../../../../components/user-components/Button.astro";

<Button 
  label="En savoir plus" 
  link="/docs" 
  variant="secondary" 
/>
```

### Bouton contour
```mdx
import Button from "../../../../components/user-components/Button.astro";

<Button 
  label="Voir la source" 
  link="https://github.com/your-repo" 
  variant="outline" 
/>
```

### Meerdere knoppen
```mdx
import Button from "../../../../components/user-components/Button.astro";

<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <Button 
    label="Download" 
    link="/download" 
    variant="primary" 
  />
  <Button 
    label="Documentatie" 
    link="/docs" 
    variant="secondary" 
  />
  <Button 
    label="GitHub" 
    link="https://github.com/your-repo" 
    variant="outline" 
  />
</div>
```

## Beschikbare varianten

Het component ondersteunt verschillende knopstijlen via de `variant` prop:

- **primary** - Hoofdstijl voor call-to-action
- **secondary** - Secundaire actie styling  
- **outline** - Gecontureerde knopstijl
- **ghost** - Minimale styling met hover effecten
- **danger** - Voor destructieve of waarschuwingsacties

## Styling

Knoppen erven styling van het thema's button CSS klassen:
- `.btn` - Basis knopstijlen
- `.btn-primary` - Primaire variant stijlen
- `.btn-secondary` - Secundaire variant stijlen
- `.btn-outline` - Outline variant stijlen