---
# DEMO CONTENT. The case with a living editor: `authors` includes someone who
# has an ORCID, so this is the page where the "iD" badge beside a name renders.
#
# The body below is also where the icon-led list lives — `<ul class="tool-landscape">`
# with an inline `.ti` svg per row and a `.tool-links` run at the end of it. The
# CSS for all three is in src/components/Prose.astro, and the icons are pasted
# paths: there is no icon package to install and no component to import, because
# markdown can only give you raw HTML anyway.
title: 'Laelius de Amicitia'
description: >-
  A dialogue on friendship, written in the same year as De Officiis and set in
  129 BC. Laelius, having just lost Scipio, is asked what friendship is for.
publication: cicero_de_amicitia_2021
authors: [cicero, marek]
order: 3
# `featured` is what the entry pages' paper block selects on — three of the four
# demo papers carry it, so the block is visibly a curated subset of /papers/
# rather than all of it.
featured: true

# Not out yet: the paper page badges this as "to appear" and /papers/ marks the
# row. An enum rather than a flag, so front matter never has to be read as a
# negation — see the `status` field in src/content.config.ts.
status: to-appear

# Two projects, one of which — the Perseus letters — has a `redirect` and so no
# page on this site. The chip for it links straight out; the one for the
# vocabulary links to its page here.
projects: [latin-vocabulary, perseus-corpus]

figure:
  src: ../../assets/papers/officia-plate.svg
  alt: The four sources of duty, drawn as four linked circles.
  # This figure carries its own background, so it must NOT be plated.
  plate: false

# Only `paper`, `replication` and `slides` exist; any other key here is
# silently dropped by the schema. Add one in src/content.config.ts if you
# need it, and a label for it in the paper page's LINK_LABELS.
links:
  paper:
    cambridge: https://www.cambridge.org/core/
    perseus: https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:2007.01.0038
---

Friendship, Cicero argues, cannot be a transaction. If you enter it for what you
can get, you have entered something else that resembles it, and the resemblance
will not survive the first occasion when the friendship costs you something.

The positive claim is harder than the negative one: that friendship is possible
only between people who are already good, because it consists in each wanting
for the other what the other should want for themselves — and someone who wants
the wrong things for himself is no use as a friend to anybody.

> Friendship improves happiness and abates misery, by the doubling of our joy
> and the dividing of our grief.

Written in 44 BC, the year after Tullia died and the year before he did.

## What this edition is built from

Three things, each of which can be inspected on its own:

<ul class="tool-landscape">
  <li>
    <svg class="ti" width="20" height="20" style="--ti: #e0b364" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/></svg>
    <strong>The manuscripts</strong> — nine witnesses, of which two are independent and the rest descend from one of them. Where they disagree, the reading of the older pair is printed and the other is recorded below the rule.<br>
    <span class="tool-links">
      <svg class="ti" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg> <a href="https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:2007.01.0038">Perseus text</a>
      &nbsp;&middot;&nbsp;
      <svg class="ti" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/></svg> <a href="https://github.com/PerseusDL/canonical-latinLit">Collation</a>
    </span>
  </li>
  <li>
    <svg class="ti" width="20" height="20" style="--ti: #5cc8e8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h2M3 12h2M3 18h2M9 6h12M9 12h12M9 18h12"/></svg>
    <strong>The apparatus</strong> — every departure from the older pair, with the witness it comes from. Negative rather than positive: silence means the manuscripts agree, which keeps the foot of the page for the places where they do not.<br>
    <span class="tool-links">
      <svg class="ti" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg> <a href="https://archive.org/details/delaelius00cice">Scan of the 1890 apparatus</a>
    </span>
  </li>
  <li>
    <svg class="ti" width="20" height="20" style="--ti: #f18fa2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>
    <strong>One passage nobody has fixed</strong> — the sentence at §58 is unmetrical in every witness and has attracted four conjectures, none of which convinces. It is printed as the manuscripts have it, between daggers. A row needs no links, and this one has none.
  </li>
</ul>

The last row is the useful one for a reader deciding whether to trust the rest.
