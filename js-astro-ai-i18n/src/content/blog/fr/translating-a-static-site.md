---
title: "Traduire un site statique sans CMS"
description: "Une traduction est un fichier placé à côté de l'original. Tout le reste découle de cette seule décision."
date: 2026-03-04
glyph: arc
---
Le premier site multilingue que nous avons construit utilisait une plateforme de traduction. Les textes vivaient dans une interface web, le site les récupérait lors du build, et chaque question sur un changement nécessitait que quelqu'un se connecte pour vérifier.

Le second utilisait des fichiers. `en/pricing.md` et `fr/pricing.md`, côte à côte dans le dépôt, et rien d'autre. Cela a été plus simple de toutes les manières qui comptent, et les raisons ne sont pas celles auxquelles nous nous attendions.

## Les diffs

Une traduction stockée dans une base de données n'a pas d'historique lisible. Une traduction stockée dans un fichier a le même historique que le code : qui l'a modifiée, quand, et ce que disait la phrase auparavant. Réviser une traduction revient alors à réviser une pull request, une tâche que l'équipe sait déjà accomplir.

## Le chemin est la clé

`fr/pricing.md` est le `pricing.md` français parce que les chemins correspondent, et pour aucune autre raison. Il n'y a pas de table de correspondance.

Cette règle mérite d'être défendue, car la tentation de la briser est réelle. Un slug localisé est plus lisible et légèrement plus performant en SEO. Le coût est que la question « de quelle page s'agit-il d'une traduction » cesse d'être une opération sur une chaîne de caractères pour devenir une table, lue par le sélecteur de langue, le contrôle de fraîcheur et le sitemap. Chacun d'eux se retrouve alors à une seule ligne obsolète d'être erroné.

## L'obsolescence est le vrai problème

Traduire une page une fois est facile. Savoir que l'anglais a changé il y a trois semaines et que l'allemand non, c'est là qu'une machine est nécessaire.

Nous stockons le hash du texte anglais à partir duquel chaque traduction a été faite. La traduction est obsolète quand le hash ne correspond plus. C'est un petit fichier et une idée simple, et c'est ce qui fait la différence entre un site qui est multilingue et un site qui l'a été un jour.
