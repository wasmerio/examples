---
# Words shared by a publication entry (/publications/), a paper-page entry
# (the entry page's paper block) and a paper page (/papers/<slug>/).
labels:
  pdf: 'PDF'
  doi: 'DOI'
  # the entry's `url`, shown when it has no DOI
  link: 'Link'
  hasPage: 'has a paper page'
  bibtex: 'BibTeX'
  moreAuthors: 'and {count} more authors'
  alsoPresented: 'Also presented at'
  # the status in a list row, and alone on a paper page with no venue line
  toAppear: 'to appear'
  toAppearAlone: 'To appear'
  # before a venue derived from `conferenceName`; a stated venue is its own sentence
  publishedAt: 'Published at'
  toAppearAt: 'To appear at'
plurals:
  citations: { one: '{count} citation', other: '{count} citations' }
# A paper page's link keys → their names. A key with no row renders as typed,
# and `<venue>_<kind>` is derived — see linkLabel() in src/lib/papers.ts.
linkLabels:
  acm: 'ACM DL'
  ieee: 'IEEE Xplore'
  arxiv: 'arXiv'
  doi: 'DOI'
  pdf: 'PDF'
  preprint: 'Preprint'
  zenodo: 'Zenodo'
  repo: 'Repository'
  data: 'Data'
  loeb: 'Loeb'
  archive: 'Internet Archive'
  perseus: 'Perseus'
---
