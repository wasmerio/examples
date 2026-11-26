---
title: "Tools, die sich im Hintergrund halten"
description: "Warum wir aufgehört haben, Funktionen in unsere internen Tools einzubauen, und was mit denen passierte, die wir entfernt haben."
date: 2026-01-20
glyph: grid
---
Jedes Tool, das wir für uns selbst bauen, beginnt gleich. Jemand erledigt etwas zum dritten Mal von Hand, regt sich darüber auf, und eine Woche später gibt es ein Skript. Dieses Skript ist meistens die beste Version des Tools, die es jemals geben wird.

Was dann folgt, ist der interessante Teil. Das Skript bekommt ein Flag. Dann einen interaktiven Modus. Dann eine Konfigurationsdatei, weil es inzwischen zu viele Flags zum Merken gibt. Sobald es eine Konfigurationsdatei hat, kann niemand mehr sagen, was es tut, ohne es zu öffnen.

## Die Regel, auf die wir uns geeinigt haben

Ein Tool verdient eine neue Option nur dann, wenn die Alternative ein Fork wäre. Nichts anderes zählt. Bequemlichkeit ist kein Grund, Symmetrie ebenso: Zwei Befehle, die jeweils fünf Flags nutzen, werden nicht dadurch verbessert, dass sie ein sechstes gemeinsam haben.

Wir haben letzten Herbst elf Optionen aus unserem internen Build-Tool entfernt. Neun davon waren noch nie von jemandem genutzt worden. Eine wurde von einem Cronjob verwendet, der seit vier Monaten stillschweigend fehlgeschlagen war. Die elfte war tatsächlich nützlich und ist nun der Standard.

## Was wir behalten haben

- Eine Möglichkeit zu sehen, was das Tool tun wird, bevor es es tut.
- Ein Exit-Code, auf den ein Skript verzweigen kann.
- Eine Ausgabe, die für einen Menschen eine Tabelle und für ein Programm JSON ist, je nachdem, ob jemand zusieht.

Letzteres ist mehr wert als jedes Feature, das wir gestrichen haben. Derselbe Befehl funktioniert im Terminal und in einer Pipeline, ohne dass man sich ein Flag merken muss, um dies zu bewirken.

## Was wir anders machen würden

Wir hätten aufschreiben sollen, warum jede Option existiert, in dem Moment, als wir sie hinzugefügt haben. Ein Jahr später war der einzige ehrliche Weg, dies herauszufinden, die Option zu entfernen und zu sehen, wer sich beschwert. Das hat funktioniert, ist aber ein langsamer Weg, um etwas zu lernen, das wir einmal wussten.
