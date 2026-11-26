---
# /publications/. The body follows the count in the lede. The words on each
# entry are site/publication.md. Owned by the `publications` feature.
title: 'Publications'
description: 'Everything in src/data/papers.bib, newest first, with the BibTeX for each.'
count: '{count} entries,'
labels:
  # the Scholar figures over the list; {date} is the last refresh
  citations: 'citations'
  asOf: 'as of {date}'
  hIndex: 'h-index'
  i10: 'i10-index'
  # when the filter leaves nothing
  noResults: 'No publications match that filter.'
---

parsed from `src/data/papers.bib` at build time. Each one carries its own BibTeX; entries with an underlined title have a page of their own.
