---
title: "Research Tool"
description: "Developed an academic literature management tool with automated citation extraction, PDF annotation, and collaborative note-taking for research teams."
pid: 2
date: 2025-08-20
title_de: "Forschungstool"
description_de: "Ein akademisches Literaturverwaltungstool mit automatischer Zitationsextraktion, PDF-Annotation und kollaborativer Notizfunktion für Forschungsteams entwickelt."
slug: "research-tool"
ready: true
featured: false
tags: ["Python", "NLP", "PostgreSQL", "FastAPI", "Research"]
category: "research"
image: "/images/projects/research-tool/logo.png"
# coverImage: "/images/projects/research-tool/cover.png"
# gallery:
#   - "/images/projects/research-tool/screenshot-1.png"
links:
  - label: "GitHub"
    url: "https://github.com/username/research-tool"
---

<div class="lang-en">

## Context

Academic researchers juggle hundreds of papers across multiple devices and tools. Existing reference managers focus on citation formatting but lack the ability to extract insights, connect related concepts, and collaborate on annotations in real time.

## Problem

- Researchers spend 30% of their time on literature management instead of actual research
- PDF annotations are trapped in individual tools with no cross-paper linking
- Citation extraction from PDFs is error-prone and requires manual correction
- No simple way to share annotated reading lists with lab members

## Solution

I built **Research Tool** as a lightweight, self-hostable literature management platform:

- **Automated citation extraction** using NLP to parse references from uploaded PDFs with 95%+ accuracy
- **Smart PDF viewer** with inline annotations that sync across devices
- **Knowledge graph** connecting papers by shared references, authors, and topics
- **Collaborative workspaces** where lab members can share annotations and reading lists
- **FastAPI backend** with PostgreSQL for fast full-text search across all papers and notes
- **BibTeX/RIS export** for seamless integration with LaTeX and Word

Key decisions:
- Used spaCy + custom NER models for citation extraction instead of regex — handles diverse citation styles
- Built the viewer as a Progressive Web App for offline reading support
- Chose PostgreSQL's full-text search over Elasticsearch to reduce infrastructure complexity

## Outcome

- Used by 2 research groups (15 researchers) during a full academic semester
- Reduced literature review setup time from days to hours
- Citation extraction accuracy of 96.3% across tested papers
- Positive feedback on collaborative annotation workflow — adopted as lab standard

## Tech Stack

Python, FastAPI, spaCy, PostgreSQL, React, PDF.js, Docker

</div>

<div class="lang-de">

## Kontext

Akademische Forscher jonglieren Hunderte von Artikeln über mehrere Geräte und Tools. Bestehende Referenzmanager konzentrieren sich auf Zitationsformatierung, bieten aber keine Möglichkeit, Erkenntnisse zu extrahieren, verwandte Konzepte zu verknüpfen und Annotationen in Echtzeit zu teilen.

## Problem

- Forscher verbringen 30% ihrer Zeit mit Literaturverwaltung statt mit Forschung
- PDF-Annotationen sind in einzelnen Tools eingeschlossen ohne paper-übergreifende Verknüpfung
- Zitationsextraktion aus PDFs ist fehleranfällig und erfordert manuelle Korrekturen
- Keine einfache Möglichkeit, annotierte Leselisten mit Labormitgliedern zu teilen

## Lösung

Ich habe das **Research Tool** als leichtgewichtige, self-hostbare Literaturverwaltungsplattform entwickelt:

- **Automatische Zitationsextraktion** mittels NLP zum Parsen von Referenzen aus hochgeladenen PDFs mit 95%+ Genauigkeit
- **Smarter PDF-Viewer** mit Inline-Annotationen, die geräteübergreifend synchronisieren
- **Wissensgraph** zur Verknüpfung von Papern über gemeinsame Referenzen, Autoren und Themen
- **Kollaborative Arbeitsbereiche** zum Teilen von Annotationen und Leselisten

## Ergebnis

- Von 2 Forschungsgruppen (15 Forschern) während eines vollen akademischen Semesters genutzt
- Literatur-Review-Einrichtungszeit von Tagen auf Stunden reduziert
- Zitationsextraktionsgenauigkeit von 96,3% über getestete Paper

## Tech Stack

Python, FastAPI, spaCy, PostgreSQL, React, PDF.js, Docker

</div>
