---
# DEMO CONTENT. THE CASE WITH A BIBTEX ENTRY BUT NO VENUE BADGE.
#
# `cicero_de_fato_1942` in src/data/papers.bib has no `abbr`, so there is no
# badge — and this page must not therefore call the work a preprint, which is
# what an earlier fallback did. It appeared in a journal. Without a badge, the
# breadcrumb above the title, the row on /papers/ and the related-papers line
# on /projects/latin-vocabulary/ all show what the entry says it appeared in:
# the journal's name. Long, but the entry's own and so never wrong. A site that
# wants something shorter there gives the entry an `abbr` and venues.yml a row,
# which is exactly what a badge is. See paperVenueShort() in src/lib/papers.ts.
#
# No `description` either, on purpose: the page's meta description and its
# feed entry then fall back to the same journal name, not to the site's blurb.
# See paperDescription().
title: 'De Fato: on what is up to us'
publication: cicero_de_fato_1942
authors: [cicero]
order: 5
projects: [latin-vocabulary]
links:
  paper:
    perseus: https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:2007.01.0046
---

What survives of the _De Fato_ is a fragment — the opening is lost, the ending
is lost, and what is left is the middle of an argument with Hirtius about
whether anything is genuinely up to us. Cicero's answer is that the Stoic
picture of fate, taken seriously, leaves nothing for a person to be
responsible for, and that Chrysippus's attempt to save both — fate and
assent — saves neither.

The piece matters for the vocabulary as much as the argument. _Fatum_,
_causa_, _adsensio_: each is a Greek technical term being given a Latin life
for the first time, and the text is candid about the fit being imperfect.
