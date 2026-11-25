---
title: Deployment
lead: Building the site and putting it online, with GitHub Pages as the example.
weight: 2
---


## Building

```sh
hugo --minify
```

writes the site to `public/`: plain HTML, CSS and JavaScript that any web server can serve. Set `baseURL` in
`hugo.toml` to the address the site will have, including a subpath if it has one
(`https://you.github.io/my-lib/`).

## GitHub Pages

In your repository's settings, under **Pages**, set the source to **GitHub Actions**. Then add this workflow. It
installs Hugo and Go (for the theme as a Hugo module), builds the site and publishes it on every push to `main`:

```yaml {file=".github/workflows/pages.yml"}
name: Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
