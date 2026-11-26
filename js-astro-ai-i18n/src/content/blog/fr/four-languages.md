---
title: "Ce que le déploiement en quatre langues nous a appris"
description: "Six mois, quatre locales et les trois erreurs qui nous ont coûté le plus de temps."
date: 2026-05-12
glyph: stack
---
Nous avons lancé notre premier produit véritablement multilingue le printemps dernier : quatre langues, un build, un seul dépôt. Voici ce qui a échoué, par ordre d'importance.

## Les liens à l'intérieur d'une page traduite

C'est le défaut que personne ne remarque. La page s'affiche, le lien fonctionne, mais il est simplement dans la mauvaise langue. Un lecteur français clique sur un lien en milieu de phrase et atterrit en haut d'une page anglaise, perdant ainsi son fil.

La solution se trouve dans le build plutôt que dans le contenu : quand un lien pointe vers une page qui existe dans la langue actuelle, on le réécrit ; sinon, on ne le touche pas. Réécrire les fichiers eux-mêmes obligerait à tout refaire après chaque traduction.

## La mise en page suppose l'anglais

L'allemand est plus long. Pas occasionnellement : systématiquement, d'environ un tiers. Tous les boutons dont la taille était ajustée au label anglais ont cassé. Ce problème ressemblait alors à un défaut de design plutôt qu'à un souci de traduction, et il a donc été signalé par les mauvaises personnes via le mauvais canal pendant une semaine.

Désormais, la règle est que rien n'est dimensionné selon son contenu. Cela ne coûte rien en anglais et permet de gagner un jour par langue.

## Les titres de page se mesurent en caractères

Un résultat de recherche est tronqué à environ soixante-sept caractères. Un titre traduit qui s'affiche parfaitement à quatre-vingt-dix caractères est un titre dont personne ne voit la fin. Nous avons dû l'indiquer explicitement dans les instructions données au traducteur, car la fidélité et la longueur sont deux objectifs différents et un seul d'entre eux est visible dans le fichier.

## Ce qui a fonctionné

Une décision a permis de gagner plus de temps que n'en ont coûté les trois erreurs précédentes : chaque langue répond pour chaque page, qu'elle ait été traduite ou non. Personne ne tombe sur une erreur 404 parce qu'une traduction a une semaine de retard, et aucune URL publiée n'a jamais eu besoin d'être déplacée.
