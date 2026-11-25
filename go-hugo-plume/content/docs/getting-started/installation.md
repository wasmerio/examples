+++
title = 'Installation'
linkTitle = 'Installation'
description = 'Installation instructions for the Plume theme.'
weight = 0
draft = false
+++

## Installation (new site)

Create a new Hugo site with Plume:

```bash {linenos=false}
hugo new site mysite
cd mysite
hugo mod init github.com/<username>/<site>
hugo mod tidy
hugo mod get github.com/Dobefu/hugo-theme-plume
```

Add to your `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/Dobefu/hugo-theme-plume"
```

## Installation (existing site)

### As a Hugo Module

```bash {linenos=false}
hugo mod init github.com/<username>/<site>
hugo mod tidy
hugo mod get github.com/Dobefu/hugo-theme-plume
```

Add to your `hugo.toml`:

