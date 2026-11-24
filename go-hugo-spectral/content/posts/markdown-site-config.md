+++
title = 'Markdown Support in Site Configuration'
summary = 'Learn how to use Markdown syntax in your Site Configuration.'
date = 2023-02-15T10:00:00-07:00
draft = false
tags = ['markdown', 'markup']
+++

Unlike generic pages, posts, and other content types, this theme uses Site Configuration to define the home landing page, menu, header, and footer.

By default, any content set in Site Configuration assumes HTML markup.

## Markdown Support in Site Configuration

You may optionally enable Markdown support on the description attributes of any section that has a description.

### Configure Markdown Site Wide

```toml
[parmas]
  useMarkdown = true

  [params.banner]
    title = 'Spectral supports plain text'
    description = '''
Subtitle supports [Markdown](#)
    '''
```

### Configure Markdown for a particular section

```toml
[parmas]
  [params.banner]
    title = 'Spectral supports <a href="#">HTML</a>'
    description = 'Subtitle supports <a href="#">HTML</a>'

  [[params.sections]]
    useMarkdown = true
    sectionLayout = 'wide'
