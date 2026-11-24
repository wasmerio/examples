+++
title = "Getting Started"
date = 2026-01-02T00:00:00Z
draft = false
tags = ["setup", "hugo-modules"]
SubTitle = "Install the theme and get a site running in a few minutes."
+++

### Prerequisites

- Hugo extended v0.112.0 or later
- Go 1.21 or later (required for Hugo Modules)

Check your versions:

```bash
hugo version
go version
```

### Create a new site

```bash
hugo new site my-site
cd my-site
git init
hugo mod init github.com/yourname/my-site
```

### Add the theme

In `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/mdashx/basicwebtheme"
```

Then pull it:
