---
# DEMO CONTENT. The filename is the URL: this is /papers/de-re-publica/, and
# src/data/papers.bib refers to it as page = {/papers/de-re-publica/}. Rename
# one without the other and the build fails.
title: 'De Re Publica: the mixed constitution'
description: >-
  Six books on the best form of the state, of which most is lost. What survives
  argues that a constitution combining monarchy, aristocracy and democracy is
  more stable than any of the three on its own.

# The BibTeX key. Everything bibliographic — venue, year, DOI, the citation
# itself — comes from that entry. Nothing is repeated here.
publication: cicero_de_re_publica_1928

# Keys from src/data/authors.yml. A typo here fails the build.
authors: [cicero, keyes]

order: 1
featured: true

# The conference series' own homepage, which is a third thing: `abbr` in
# papers.bib badges the edition this text was printed in, `links.paper` below
# points at the text itself, and this points at the event where the work was
# presented. Only the last of the three tells a reader whether it runs again.
conferenceName: Symposium Ciceronianum Arpinas
conferenceUrl: https://www.tulliana.eu/

# The same work, presented again at venues that publish nothing — so there is
# no BibTeX entry to point at and nothing for /publications/ to list.
additionalPresentations:
  - name: Colloquium on the Roman Constitution
    shortName: Colloquium Constitutionis
    url: https://classics.org/
  - name: Collegium Politicum
    url: https://www.collegiumpoliticum.org/

# Keys from src/content/projects/. Written here and nowhere else: the project
# page derives its own list of papers by scanning this field.
projects: [latin-vocabulary]

figure:
  src: ../../assets/papers/mixed-constitution.svg
  alt: >-
    Consul, senate and assembly, each connected to the other two and together
    constituting the res publica.
  # Dark line art on a transparent background, so it needs the white plate.
  plate: true
  # And a window frame, so the plate has an edge to sit against rather than
  # floating as a bright rectangle. The string is the titlebar label.
  frame: approach overview

# Label -> URL. The labels are yours; they render in the order written. A key
# of the form `<venue>_<kind>` gets a derived label: `colloquium_pdf` renders
# as "PDF (COLLOQUIUM)", so the decks from a work's several outings can sit
# side by side under `slides` with no label table to extend. See linkLabel().
links:
  paper:
    loeb: https://www.loebclassics.com/view/LCL213/1928/volume.xml
    archive: https://archive.org/details/derepublicadeleg00ciceuoft
  replication:
    perseus: https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:2007.01.0044
  slides:
    pdf: /assets/pdf/editions/de-re-publica-excerpt.pdf
    colloquium_pdf: /assets/pdf/editions/de-re-publica-excerpt.pdf
---

Written between 54 and 51 BC and cast as a dialogue set a lifetime earlier, in
129 BC. Scipio Aemilianus and his circle spend three days arguing about what
holds a state together, and the answer Cicero puts in Scipio's mouth is that no
simple constitution does.

## The argument

Monarchy, aristocracy and democracy each have a virtue the others lack, and each
decays into a characteristic vice — tyranny, oligarchy, mob rule. Left alone,
every simple constitution runs through that cycle. A constitution that combines
all three sets each against the others, and the resulting balance is what
survives.

The claim is not original to Cicero — Polybius had made it about Rome a century
before — but the form is. He is arguing that the Roman republic was not designed
and did not need to be: it accumulated.

> Our constitution was not the work of one man's genius but of many, and not of
> one lifetime but of several ages and generations.

## What survives

Most of the six books are lost. Book VI survives separately as the _Somnium
Scipionis_, preserved because Macrobius wrote a commentary on it, and about a
third of the rest was recovered in 1819 from a palimpsest in the Vatican Library
— the text had been scraped off and written over with Augustine on the Psalms.

That recovery is why this page can cite a 1928 edition of a work from 51 BC.

<figure class="compare">
  <div class="compare-pair">
    <a href="/assets/img/papers/palimpsest-before.svg">
      <img
        src="/assets/img/papers/palimpsest-before.svg"
        alt="A parchment leaf: the original text faint and horizontal, Augustine's commentary written darkly across it at right angles."
        width="640"
        height="400"
        loading="lazy"
      />
    </a>
    <a href="/assets/img/papers/palimpsest-after.svg">
      <img
        src="/assets/img/papers/palimpsest-after.svg"
        alt="The same leaf as a printed page: numbered lines, a gap where the reading is lost, and an apparatus below the rule."
        width="640"
        height="400"
        loading="lazy"
      />
    </a>
  </div>
  <figcaption>
    The same leaf. Left: the palimpsest as Angelo Mai found it. Right: as the 1928 edition sets
    it. Click either for full size.
  </figcaption>
</figure>

The gap in the right-hand column is not a printing error. It is a passage the
scraping took and the recovery did not give back, and the convention is to show
it rather than to guess.
