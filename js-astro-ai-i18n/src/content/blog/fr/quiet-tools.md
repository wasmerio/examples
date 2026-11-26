---
title: "Des outils qui s'effacent"
description: "Pourquoi nous avons cessé d'ajouter des fonctionnalités à nos outils internes, et ce qu'est devenu ce que nous avons supprimé."
date: 2026-01-20
glyph: grid
---
Chaque outil que nous créons pour nous-mêmes commence de la même manière. Quelqu'un fait une tâche manuellement pour la troisième fois, s'agace, et une semaine plus tard, un script apparaît. Ce script est généralement la meilleure version que l'outil connaîtra.

C'est là que ça devient intéressant. Le script reçoit un flag. Puis un mode interactif. Puis un fichier de config, car il y a désormais trop de flags à retenir. Au moment où il a un fichier de config, plus personne n'est capable de dire ce qu'il fait sans l'ouvrir.

## La règle que nous avons adoptée

Un outil mérite une nouvelle option quand l'alternative est de créer un fork. Rien d'autre ne compte. La commodité n'est pas une raison, pas plus que la symétrie : deux commandes utilisant chacune cinq flags ne sont pas améliorées par un sixième flag commun.

L'automne dernier, nous avons supprimé onze options de notre outil de build interne. Neuf d'entre elles n'avaient jamais été utilisées. L'une était utilisée par un cron job qui échouait silencieusement depuis quatre mois. La onzième était réellement utile, et elle est désormais l'option par défaut.

## Ce que nous avons gardé

- Un moyen de voir ce que l'outil va faire, avant qu'il ne le fasse.
- Un code de sortie sur lequel un script peut s'appuyer.
- Une sortie sous forme de tableau pour un humain et en JSON pour un programme, selon qu'une personne regarde ou non.

Ce dernier point vaut plus que n'importe quelle fonctionnalité supprimée. La même commande fonctionne dans un terminal comme dans un pipeline, sans que personne n'ait à se souvenir d'un flag pour y parvenir.

## Ce que nous ferions différemment

Nous aurions dû noter la raison d'être de chaque option au moment de son ajout. Un an plus tard, la seule façon honnête de le découvrir était de la supprimer et de voir qui se plaignait. Cela a fonctionné, mais c'est une manière lente d'apprendre quelque chose que nous savions autrefois.
