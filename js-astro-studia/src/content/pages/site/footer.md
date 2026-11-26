---
# The footer row: "© <year> <copyright>", your affiliation, these links, the
# email link and the theme's credit. FOOTER in src/consts.ts switches the email
# link and the credit; anything this cannot say goes through Base.astro's
# `footer` slot.
#
# A site about someone need not be copyright them; write '{name}' for SELF.
copyright: 'Dominik Fuchß'
# Text and links, joined with no added spaces. [] drops the part.
affiliation:
  - { label: 'Tusculum', href: 'https://en.wikipedia.org/wiki/Tusculum' }
  - ' and '
  - { label: 'Arpinum', href: 'https://en.wikipedia.org/wiki/Arpino' }
# The thin link row. `feature` hides a row while that feature is off.
links:
  - { label: 'Feed', href: '/feed.xml', feature: 'feed' }
  - { label: 'PGP', href: '/pgp-key/', feature: 'pgp' }
  - { label: 'Imprint', href: '/imprint/', feature: 'imprint' }
# The email link's text; the address is SITE.email.
email: 'Email'
---
