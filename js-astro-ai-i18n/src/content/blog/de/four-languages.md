---
title: "Was uns der Release in vier Sprachen gelehrt hat"
description: "Sechs Monate, vier Regionen und die drei Fehler, die uns die meiste Zeit gekostet haben."
date: 2026-05-12
glyph: stack
---
Letzten Frühling haben wir unser erstes richtig mehrsprachiges Produkt veröffentlicht: vier Sprachen, ein Build, ein Repository. Hier ist, was schiefgelaufen ist, geordnet nach der Schwere der Auswirkungen.

## Links innerhalb einer übersetzten Seite

Das ist der Fehler, den niemand bemerkt. Die Seite rendert, der Link funktioniert, nur ist er einfach in der falschen Sprache. Ein französischer Leser klickt mitten im Satz auf einen Link und landet ganz oben auf einer englischen Seite, womit er den Faden verliert.

Die Lösung liegt im Build-Prozess, nicht im Content: Wenn ein Link auf eine Seite verweist, die in dieser Sprache existiert, wird er umgeschrieben; wenn nicht, bleibt er unverändert. Das manuelle Umschreiben der Dateien müsste nach jeder Übersetzung erneut erfolgen.

## Layout geht von Englisch aus

Deutsch ist länger. Nicht gelegentlich, sondern zuverlässig um etwa ein Drittel. Jeder Button, dessen Größe auf das englische Label abgestimmt war, ging kaputt. Da dieser Fehler wie ein Designproblem und nicht wie ein Übersetzungsproblem aussah, wurde er eine Woche lang von den falschen Leuten über den falschen Kanal gemeldet.

Jetzt gilt die Regel: Nichts wird exakt auf den Inhalt zugeschnitten. In Englisch kostet das nichts und spart pro Sprache einen ganzen Tag.

## Seitentitel werden in Zeichen gemessen

Ein Suchergebnis wird bei etwa 67 Zeichen abgeschnitten. Ein übersetzter Titel, der mit 90 Zeichen perfekt klingt, ist ein Titel, dessen Ende niemand sieht. Wir mussten dies explizit in die Anweisungen an die Übersetzer schreiben, da Treue zum Original und Passgenauigkeit unterschiedliche Ziele sind und nur eines davon in der Datei sichtbar ist.

## Was richtig lief

Eine Entscheidung hat mehr Zeit gespart, als die drei oben genannten Fehler gekostet haben: Jede Sprache antwortet für jede Seite, egal ob sie übersetzt wurde oder nicht. Niemand landet jemals auf einer 404-Seite, nur weil eine Übersetzung eine Woche hinterherhinkt, und keine von uns veröffentlichte URL musste jemals verschoben werden.
