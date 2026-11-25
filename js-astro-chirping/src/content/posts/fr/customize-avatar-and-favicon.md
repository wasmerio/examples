---
title: "Personnaliser l'avatar et le favicon (avec optimisation par défaut)"
description: "Comment personnaliser l'avatar de la barre latérale et le favicon du navigateur dans Chirping Astro, avec des exemples pour les assets locaux optimisés et les fallbacks public/distants."
pubDate: 2026-05-06
tags: [astro, images, avatar, favicon, personnalisation]
categories: [Personnalisation]
translationKey: customize-avatar-and-favicon
toc: true
---

Le branding du thème commence souvent par deux fichiers : votre avatar de profil dans la barre latérale et votre favicon dans l'onglet du navigateur. Ce guide montre le chemin le plus rapide, puis les options de repli.

## Avatar : chemin recommandé (optimisé)

Le thème est maintenant orienté optimisation d'abord pour les assets locaux dans `src`.

1. Placez votre fichier avatar dans `src/assets/images/site/`.
2. Importez-le dans `src/config.ts`.
3. Définissez `SITE.author.avatar` avec l'objet importé (pas `.src`).

```ts
import avatarImg from './assets/images/site/avatar.png';

export const SITE: SiteConfig = {
  // ...
  author: {
    name: 'Votre Nom',
    avatar: avatarImg,
    bio: "J'écris sur Astro et la performance web.",
  },
};
```

Pourquoi c'est préférable :

- Le rendu de la sidebar utilise Astro `Image` pour les métadonnées importées.
- Vous profitez du pipeline d'images Astro par défaut.
- Vous gardez le typage via `author.avatar?: string | ImageMetadata`.

## Avatar fallback 1 : chemin `/public` (sans optimisation)

Si vous avez besoin d'une URL publique stable, utilisez un chemin chaîne sous `public/` :

```ts
author: {
  name: 'Votre Nom',
  avatar: '/images/avatar.png',
}
```

Dans ce cas, le rendu utilise volontairement un `img` classique. Les fichiers dans `public/` sont servis tels quels.

## Avatar fallback 2 : URL distante (sans optimisation dans le fallback Sidebar)

```ts
author: {
  name: 'Votre Nom',
  avatar: 'https://example-cdn.com/avatars/me.jpg',
}
```

Ici aussi, le rendu retombe sur un `img` classique dans la sidebar. Utile si votre avatar est géré à l'extérieur.

## Favicon : personnalisation la plus rapide

Le favicon est importé dans `src/layouts/BaseLayout.astro` :

```ts
import faviconImg from '../assets/images/site/favicon.svg';
```

Puis lié dans `<head>` :

```astro
<link rel="icon" type="image/svg+xml" href={withBase(faviconImg.src)} />
```

Méthode la plus rapide pour le personnaliser :

1. Remplacez `src/assets/images/site/favicon.svg` par votre fichier.
2. Gardez le même nom si vous ne voulez pas toucher au code.

## Exemple favicon : utiliser PNG au lieu de SVG

Si vous préférez PNG, importez un PNG et mettez à jour le `type` :

```ts
import faviconImg from '../assets/images/site/favicon.png';
```

```astro
<link rel="icon" type="image/png" href={withBase(faviconImg.src)} />
```

## Exemple favicon : fournir plusieurs tailles d'icônes

Pour une meilleure couverture navigateurs/appareils, ajoutez des liens d'icônes supplémentaires :

```astro
<link rel="icon" type="image/svg+xml" href={withBase(faviconImg.src)} />
<link rel="icon" type="image/png" sizes="32x32" href={withBase('/icons/favicon-32.png')} />
<link rel="icon" type="image/png" sizes="16x16" href={withBase('/icons/favicon-16.png')} />
<link rel="apple-touch-icon" sizes="180x180" href={withBase('/icons/apple-touch-icon.png')} />
```

Stockez ces fichiers de taille fixe dans `public/icons/`.

## Quelle option choisir ?

- Vous voulez la meilleure performance par défaut et la maintenance la plus simple : utilisez un avatar importé depuis `src/assets`.
- Vous avez besoin d'une URL fixe ou d'une image hébergée ailleurs : utilisez un chemin/URL chaîne pour l'avatar.
- Vous voulez changer le favicon sans toucher au code : remplacez `src/assets/images/site/favicon.svg`.
- Vous visez une large compatibilité appareils/navigateurs : ajoutez plusieurs icônes PNG.

Avec ces options, vous pouvez personnaliser l'avatar et l'icône d'onglet sans modifier l'architecture globale du thème.
