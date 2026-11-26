# Constructa: design and motion

The layered entrance, shared mark, independent navigation, and chapter bridges
are documented in the current [design refresh](design-refresh.md). This document
retains the original section-driven foundation and reference provenance.

The real document is the experience, not a hidden fallback. Each enabled chapter
has its own scroll timeline; there is no global scene track, forced slide
snapping, or relocated content. Lenis can smooth desktop wheel input without
replacing the document. Feature settings live in `cv.json`.

## References

- [Dennis Snellenberg](https://www.awwwards.com/sites/dennis-snellenberg):
  oversized type, generous editorial
  spacing, magnetic actions, quiet navigation, and a coherent work-to-contact arc.
- [Bruno Simon](https://www.awwwards.com/sites/bruno-simon-portfolio): an
  interactive visual identity rather than a decorative hero image. This site
  does not imitate the driving interaction or its assets.
- [Obys](https://obys.agency/): typographic scale, inversion, asymmetric pacing,
  and motion that changes the composition rather than merely fading cards in.
- [React Bits](https://reactbits.dev/): the idea of expressive mixed typography
  and pixel-globe artwork. Constructa implements its effects independently;
  no component, port, tool, or exported template asset is redistributed.

These are design references, not affiliations, copied layouts, or claims that
Constructa has received an award. See [third-party notices](../LICENSES/THIRD_PARTY.md).

## Visual system

- Warm paper `#f2eadb`, almost-black ink `#121110`, signal red `#f03a17`.
- Anton display, Space Grotesk reading type, JetBrains Mono annotations,
  Instrument Serif italic for the human, literary counterpoint.
- Large open spreads, sharp rules, small numbered annotations, controlled grain.
- Six palettes with dark variants; the default is a configuration choice.
- Demo illustrations are original SVGs for neutral example content. User images
  and credentials must remain accurate and appropriately licensed.
- No fabricated credentials, awards, metrics, or client work.

Typography and geometry are code-native. Mixed letters use seeded composition
instead of substituting a flattened title image. The pixel globe is decorative
artwork, not an indication that a visitor's location is being tracked. Both
effects have configuration controls and must retain a readable static state.

No accepted Image Gen design screenshot is part of this theme specification.
The source portfolio's concept request failed because the service was unavailable;
the repository should not claim visual fidelity to an image that was not produced.

## Section compositions and motion

| Section | Composition | Scroll behavior |
| --- | --- | --- |
| Portfolio | Giant mixed-type heading, diagonal plane, pixel globe, concise copy, explicit metrics | Short local sticky opening; text and artwork move without delaying access to the next chapter |
| About | Large statement, facts, literary quote, method and record | Words gain ink with reading progress; facts and quote enter in sequence |
| Experience | Inverted paper, oversized years, clear service record | Local timeline grows; years and records reveal independently; expanders remain in flow |
| Projects | Editorial case spreads, configured images, quiet case index | Local vertical progress moves a horizontal exhibition on large screens; normal stacked records on mobile, short screens, reduced-motion, and no-JS |
| Education | Quiet paper spread, school timeline and typographic certificate | Year numerals drift against the content; certification seal resolves into place |
| Skills | Inverted materials index and a filterable type wall | Group headings and tools stagger into view; filtering remeasures the document |
| Gallery | Oversized field-note title and a draggable image contact sheet | Prints settle from a looser composition; strip mode stays native horizontally scrollable |
| Contact | Full signal-color typographic finale, direct email, profiles, poster tool | Large statement unfolds; a circular mark rotates into the final contact composition |

## Behavioral contract

- GSAP ScrollTrigger owns visual scroll effects, Lenis only smooths desktop
  wheel input using actual document scrolling. Touch stays native.
- Anchors, command search, browser history, keyboard focus, and section index
  target the same real DOM sections.
- One shared active-section state drives the rail, navigation, HUD, and local
  section progress. Layout changes refresh trigger geometry.
- Native dialogs stop background smooth scrolling without blocking dialog scroll.
- Hero pinning and the project exhibition require a sufficiently large viewport
  and no reduced-motion preference. The project controller enables the horizontal
  layout only after connecting to the real articles. Deep links and keyboard
  focus reveal the matching article within that local scroll interval.
- No-JS and reduced-motion expose content without long sticky tracks, invisible
  words, animated decoration, or boot delays.
- Reduced-motion changes at runtime tear down animation and smoothing.
- Print resets sticky/transformed elements and retains compact CV and one-page
  zero-margin A4 poster modes.

## Copy and customization

The visible copy belongs in `cv.json`: profile and content lists, `hero`,
`sections`, and interface strings under `ui`. Keep the first viewport edited:
one dominant heading, a short description, a useful action, and supporting
information that is actually relevant. Do not add pseudo-status badges or
invented metrics to fill empty space.

The chapter array controls order and navigation; captions and counters should
reflect the content that is actually enabled. Long names, translated copy,
and fewer projects are normal configurations to test, not exceptional cases.
