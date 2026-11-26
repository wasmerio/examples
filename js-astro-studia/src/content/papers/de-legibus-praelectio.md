---
# DEMO CONTENT. THE CASE WITH NO BIBTEX ENTRY AT ALL.
#
# Every other page in this directory points at a key in src/data/papers.bib and
# takes its venue, year, DOI and citation from it. This one is a talk at a venue
# that publishes no proceedings — a working-group meeting, an invited lecture, a
# Latin-language colloquium — so there is nothing to point at, nothing to cite,
# and the page has to say where and when it happened itself.
#
# It is also the page that carries a sentence the template did not write, in a
# language the template does not speak, which is the other half of the same
# feature: see `venue` below and the `papers` block in src/content.config.ts.
title: 'De legibus naturae: praelectio Latine habita'
description: >-
  A lecture on natural law and the opening books of the De Legibus, given in
  Latin. The colloquium publishes nothing, so this page is all there is.

# Three speakers, which is also what makes this the page to look at for the
# byline: `venue.bylineConnector` below replaces the English "by", and the
# English ", and " between the last two names gives way to a plain comma.
authors: [cicero, quintus, atticus]
order: 4

# This is the page that proves the entry pages' paper block reads the `papers`
# collection and not the bibliography: it has no BibTeX entry, so it has no row
# in `publications` at all, and the old `publications.filter(pageSlug)` block
# could not have listed it however it was marked.
featured: true

# NO `publication` — and so, by the refinement in src/content.config.ts, a
# `year` of its own. It is the only date this page has: /papers/ shows it, a
# project's related-papers list sorts on it, and the feed dates the entry with
# it. Without it the talk would sort to the bottom of every list.
year: 2026

# The venue, stated rather than derived. One object, because the label, its url,
# the flag in front of it and the byline's connector only mean anything
# together: they are all parts of one sentence this page says for itself.
# Mutually exclusive with `publication` and with `conferenceName` — a page has
# one venue, so it has one place that says what it was.
venue:
  # A mark before the label. ardoco.de uses 🇩🇪 to say a talk was in German;
  # Latin has no flag, so the demo uses the building.
  mark: 🏛
  # The whole sentence, not a prefix: nothing is prepended to it, which is why
  # it can be in any language.
  label: Praelectio in Conventiculo Latino Arpinati habita
  # Short enough for the breadcrumb on this page and for the row on /papers/.
  # This is the equivalent of the venue badge a published paper gets, and the
  # reason the schema needs no separate `pubShortName` field.
  short: Conventiculum Arpinas
  url: https://www.tulliana.eu/
  # The byline's "by". Latin inflects the agent — "a Marco Tullio Cicerone" —
  # and the names in src/data/authors.yml are nominative, so the demo uses the
  # nominative "oratores" ("the speakers") rather than "a"/"ab". Which is the
  # point of the field: the template cannot know the right word, so it does not
  # guess one.
  bylineConnector: oratores

# The reverse edge still works: /projects/latin-vocabulary/ lists this talk
# alongside the published works, sorted by the year above.
projects: [latin-vocabulary]

# No figure, deliberately — a talk page with nothing but prose is the shape this
# case usually has, and the Cite section below is the part worth looking at.
links:
  paper:
    perseus: https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:2007.01.0045
---

Quaeritur utrum ius natura constitutum sit an opinione. Lex enim, si nihil est
nisi quod populus iussit, tum nihil interest inter ius et vim; sin autem ratio
summa insita in natura est, tum est aliquid quo leges ipsae iudicentur.

## What the lecture argued

The first book of the _De Legibus_ puts the question before it puts any answer:
is law a fact about nature, or a fact about what a particular people happened to
vote for? The dialogue's answer — that law is reason, and that a statute contrary
to reason is not a law in any sense that matters — is where every later
natural-law argument starts, and the one Roman jurists spend three centuries
qualifying.

The hour went on three passages and one objection:

- **I.18–19**, where law is defined as the highest reason, implanted in nature.
- **I.42–43**, the argument that if justice were a matter of statute, then
  statutes making theft or adultery lawful would make them just.
- **II.11**, the distinction between a law and a decree that merely has the form
  of one.
- The objection Quintus presses throughout: that a standard nothing can check is
  a standard nobody can appeal to.

Nothing was printed. The colloquium keeps no proceedings, and the reading list
handed round is the one above.
