---
_schema: default
title: Overview
description: 'A complete documentation template for Astro: grouped sidebar, built-in search, reference pages, diagrams, media and a print layout. You write Markdown; the template handles the rest.'
pageSections:
  - _component: page-sections/heroes/hero-center
    sectionLabel: Hero
    eyebrow: Open source Astro template
    eyebrowShowDot: true
    heading: Docs your users actually <span class="highlight">finish</span>.
    headingLevel: h1
    subtext: 'A complete documentation site — grouped sidebar, built-in search, reference pages, diagrams and a print layout. Start from the template on GitHub, write Markdown, and let the rest of your team edit the pages visually in CloudCannon.'
    alignmentHorizontal: start
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: Get started
        hideText: false
        link: /installation/
        iconName: arrow-right
        iconColor: default
        iconPosition: after
        variant: primary
        size: md
      - _component: building-blocks/core-elements/button
        text: What's included
        hideText: false
        link: /introduction/
        iconName: ''
        iconColor: default
        iconPosition: before
        variant: secondary
        size: md
    maxContentWidth: 2xl
    paddingHorizontal: none
    paddingVertical: lg
    colorScheme: inherit
    lockColorScheme: false
    backgroundColor: base

  - _component: page-sections/explainers/stats
    sectionLabel: Numbers
    eyebrow: ''
    heading: ''
    headingLevel: h2
    alignmentHorizontal: start
    subtext: ''
    stats:
      - number: 58
        prefix: ''
        suffix: ''
        label: components
        sublabel: page sections, building blocks and navigation blocks
      - number: 100
        prefix: ''
        suffix: ''
        label: Lighthouse performance
        sublabel: on the pages this site ships
      - number: 33
        prefix: ''
        suffix: 'KB'
        label: search index
        sublabel: built with the site, served from your own origin
      - number: 30
        prefix: '~'
        suffix: s
        label: cold build on CloudCannon
        sublabel: from clone to live preview
    layout: tiles
    dividers: false
    maxContentWidth: 2xl
    paddingHorizontal: none
    paddingVertical: lg
    colorScheme: inherit
    lockColorScheme: false
    backgroundColor: base

  - _component: page-sections/explainers/tabbed-content
    sectionLabel: Feature demos
    eyebrow: ''
    heading: Try the features. Don't read about them.
    headingLevel: h2
    subtext: Every panel below is the shipped component, wired up and working.
    alignmentHorizontal: start
    variant: panel
    navigationPosition: top
    items:
      - title: Callouts
        subtext: ''
        iconName: ''
        iconColor: default
        contentSections:
          - _component: building-blocks/core-elements/simple-text
            text: Four kinds, for the things a reader would otherwise learn the hard way.
            size: sm
          - _component: building-blocks/core-elements/alert
            variant: note
            title: Note
            text: Context that helps, but isn't required to succeed.
            iconName: ''
          - _component: building-blocks/core-elements/alert
            variant: warning
            title: Rotating a key revokes the old one
            text: Existing clients fail on the next request. Deploy the new key before rotating.
            iconName: ''
      - title: Code tabs
        subtext: ''
        iconName: ''
        iconColor: default
        contentSections:
          - _component: building-blocks/core-elements/simple-text
            text: One sample, many languages. The reader's choice is remembered site-wide, so a Python developer stays in Python across every page.
            size: sm
          - _component: building-blocks/core-elements/code-tabs
            filename: ''
            showCopy: true
            tabs:
              - label: cURL
                language: bash
                code: |-
                  curl https://api.acme.com/v1/invoices \
                    -H "Authorization: Bearer $ACME_KEY" \
                    -d customer=cus_8Kq2
                highlight: ''
              - label: Node
                language: js
                code: |-
                  import { Acme } from '@acme/sdk'

                  const acme = new Acme(process.env.ACME_KEY)
                highlight: ''
              - label: Python
                language: python
                code: |-
                  from acme import Acme

                  acme = Acme(os.environ['ACME_KEY'])
                highlight: ''
      - title: Annotations
        subtext: ''
        iconName: ''
        iconColor: default
        contentSections:
          - _component: building-blocks/core-elements/simple-text
            text: Notes sit under the block rather than in comments, so the snippet stays copy-paste clean.
            size: sm
          - _component: building-blocks/core-elements/code-annotations
            filename: src/data/header.json
            language: json
            highlight: ''
            showCopy: true
            code: |-
              {
                "search": true,
                "themeToggle": true,
                "topbarLinks": [
                  { "name": "GitHub", "path": "https://github.com/acme/docs" }
                ]
              }
            notes:
              - line: 2
                text: Builds the search index at compile time and ships it with the site — no search service, no API key.
              - line: 4
                text: Links beside the brand. Add, remove and reorder them on the page in CloudCannon's Visual Editor.
      - title: Diagrams
        subtext: ''
        iconName: ''
        iconColor: default
        contentSections:
          - _component: building-blocks/core-elements/simple-text
            text: Written as text and rendered in the browser, so they diff in review and whoever inherits the page can edit them without a design tool.
            size: sm
          - _component: building-blocks/core-elements/diagram
            caption: ''
            definition: |-
              flowchart LR
                A[Event] --> B{Retry?}
                B -- yes --> C[Queue]
                B -- no --> D[Dead letter]
      - title: Reference
        subtext: ''
        iconName: ''
        iconColor: default
        contentSections:
          - _component: building-blocks/core-elements/simple-text
            text: Parameter lists for the pages where a table would be three columns of nothing.
            size: sm
          - _component: building-blocks/core-elements/param-list
            params:
              - name: logoAlt
                type: string
                required: true
                defaultValue: ''
                description: The logo's alt text — what screen readers announce, and what shows if the image fails to load.
              - name: defaultTheme
                type: '"dark" | "light" | "system"'
                required: false
                defaultValue: '"dark"'
                description: The color scheme a reader gets before they choose one.
    maxContentWidth: 2xl
    paddingHorizontal: none
    paddingVertical: lg
    colorScheme: inherit
    lockColorScheme: false
    backgroundColor: base

  - _component: page-sections/collections/card-collection
    sectionLabel: Browse the docs
    eyebrow: ''
    heading: ''
    headingLevel: h2
    alignmentHorizontal: start
    subtext: ''
    items:
      - image: ''
        imageAlt: ''
        link: /introduction/
        contentSections:
          - _component: building-blocks/core-elements/heading
            text: Introduction
            level: h3
            size: xs
            iconName: arrow-right
            iconPosition: after
          - _component: building-blocks/core-elements/simple-text
            text: What the template gives you out of the box, and who it's for.
            size: sm
      - image: ''
        imageAlt: ''
        link: /installation/
        contentSections:
          - _component: building-blocks/core-elements/heading
            text: Installation
            level: h3
            size: xs
            iconName: arrow-right
            iconPosition: after
          - _component: building-blocks/core-elements/simple-text
            text: From the GitHub template to a running docs site in about four minutes.
            size: sm
      - image: ''
        imageAlt: ''
        link: /writing-content/
        contentSections:
          - _component: building-blocks/core-elements/heading
            text: Writing content
            level: h3
            size: xs
            iconName: arrow-right
            iconPosition: after
          - _component: building-blocks/core-elements/simple-text
            text: Frontmatter, callouts, tabbed code blocks, tables and images.
            size: sm
      - image: ''
        imageAlt: ''
        link: /configuration/
        contentSections:
          - _component: building-blocks/core-elements/heading
            text: Configuration
            level: h3
            size: xs
            iconName: arrow-right
            iconPosition: after
          - _component: building-blocks/core-elements/simple-text
            text: One data file for the header, the sidebar, search and feedback.
            size: sm
      - image: ''
        imageAlt: ''
        link: /theming/
        contentSections:
          - _component: building-blocks/core-elements/heading
            text: Theming
            level: h3
            size: xs
            iconName: arrow-right
            iconPosition: after
          - _component: building-blocks/core-elements/simple-text
            text: Design tokens control the whole surface, light and dark.
            size: sm
      - image: ''
        imageAlt: ''
        link: /config-api/
        contentSections:
          - _component: building-blocks/core-elements/heading
            text: Config API
            level: h3
            size: xs
            iconName: arrow-right
            iconPosition: after
          - _component: building-blocks/core-elements/simple-text
            text: Every option, its type, default and effect.
            size: sm
    layout: grid
    columns: 3
    gap: sm
    aspectRatio: none
    maxContentWidth: 2xl
    paddingHorizontal: none
    paddingVertical: lg
    colorScheme: inherit
    lockColorScheme: false
    backgroundColor: base

  - _component: page-sections/collections/feature-list
    sectionLabel: Also included
    eyebrow: ''
    heading: Also included, no plugins required
    headingLevel: h2
    subtext: ''
    alignmentHorizontal: start
    items:
      - title: Built-in search
        description: index built with the site, ⌘K anywhere
        iconName: ''
        iconColor: default
      - title: Dark mode
        description: token-driven, respects the system
        iconName: ''
        iconColor: default
      - title: Code tabs
        description: one sample, many languages
        iconName: ''
        iconColor: default
      - title: Code annotations
        description: highlighted lines, numbered notes
        iconName: ''
        iconColor: default
      - title: On-page contents
        description: with scroll tracking
        iconName: ''
        iconColor: default
      - title: Page feedback
        description: per-page helpful votes
        iconName: ''
        iconColor: default
      - title: Mobile drawer
        description: the full sidebar on small screens
        iconName: ''
        iconColor: default
      - title: Print styles
        description: a real print layout
        iconName: ''
        iconColor: default
      - title: SEO and OG
        description: meta, structured data and a sitemap
        iconName: ''
        iconColor: default
    columns: 3
    gap: md
    rounded: true
    maxContentWidth: 2xl
    paddingHorizontal: lg
    paddingVertical: lg
    colorScheme: inherit
    lockColorScheme: false
    backgroundColor: surface

  - _component: page-sections/conversion/cta-split
    sectionLabel: Closing CTA
    heading: Ship your docs this week.
    headingLevel: h2
    subtext: MIT licensed, with no theme to maintain. Every component is source you own and can change.
    imageSource: ''
    imageAlt: ''
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: Get started
        hideText: false
        link: /installation/
        iconName: ''
        iconColor: default
        iconPosition: before
        variant: primary
        size: md
      - _component: building-blocks/core-elements/button
        text: Browse the components
        hideText: false
        link: /page-builder/
        iconName: ''
        iconColor: default
        iconPosition: before
        variant: secondary
        size: md
    reverse: false
    maxContentWidth: 2xl
    paddingHorizontal: lg
    paddingVertical: xl
    colorScheme: inherit
    lockColorScheme: false
    backgroundColor: accent
    rounded: true
---
