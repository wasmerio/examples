---
title: "Übersetzung einer statischen Seite ohne CMS"
description: "Eine Übersetzung ist eine Datei neben dem Original. Alles andere ergibt sich aus dieser einen Entscheidung."
date: 2026-03-04
glyph: arc
---
Die erste mehrsprachige Seite, die wir bauten, nutzte eine Übersetzungsplattform. Die Texte lagen in einer Weboberfläche, die Seite lud sie zum Build-Zeitpunkt, und jede Frage darüber, was sich geändert hatte, erforderte einen Login und eine manuelle Prüfung.

Die zweite Seite nutzte Dateien. `en/pricing.md` und `fr/pricing.md`, nebeneinander im Repository, und sonst nichts. Das war in jeder wichtigen Hinsicht einfacher, und die Gründe dafür waren nicht die, die wir erwartet hatten.

## Diffs

Eine in einer Datenbank gespeicherte Übersetzung hat keine lesbare Historie. Eine in einer Datei gespeicherte Übersetzung hat dieselbe Historie wie der Code: Wer sie wann geändert hat und wie der Satz vorher aussah. Die Überprüfung einer Übersetzung wird so zur Überprüfung eines Pull-Requests, was ein Prozess ist, den das Team bereits beherrscht.

## Der Pfad ist der Schlüssel

`fr/pricing.md` ist die französische `pricing.md`, weil die Pfade übereinstimmen, und aus keinem anderen Grund. Es gibt keine Mapping-Tabelle.

Diese Regel ist es wert, verteidigt zu werden, denn die Versuchung, sie zu brechen, ist groß. Ein lokalisierter Slug liest sich besser und schneidet in der Suche marginal besser ab. Der Preis dafür ist, dass die Frage „Welche Seite ist dies eine Übersetzung von“ aufhört, eine String-Operation zu sein, und zu einer Tabelle wird, die der Sprachwähler, die Aktualitätsprüfung und die Sitemap auslesen. Jede dieser Komponenten ist dann nur eine veraltete Zeile davon entfernt, falsch zu liegen.

## Veralterung ist das eigentliche Problem

Eine Seite einmal zu übersetzen ist einfach. Zu wissen, dass das englische Original vor drei Wochen geändert wurde, das deutsche aber nicht, ist der Teil, für den man eine Maschine braucht.

Wir speichern den Hash des englischen Textes, auf dessen Basis die Übersetzung erstellt wurde. Die Übersetzung ist veraltet, wenn der Hash nicht mehr übereinstimmt. Es ist eine kleine Datei und eine kleine Idee, aber sie ist der Unterschied zwischen einer Seite, die mehrsprachig ist, und einer Seite, die einmal mehrsprachig war.
