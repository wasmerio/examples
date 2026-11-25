---
weight: 100
date: "2023-05-03T22:37:22+01:00"
draft: false
author: "Colin Wilson"
title: "Schnellstart"
icon: "rocket_launch"
toc: true
description: "Ein QuickStart -Leitfaden zum Erstellen neuer Inhalte in Lotus -Dokumenten"
publishdate: "2023-05-03T22:37:22+01:00"
tags: ["Beginners"]
---


## Neue Inhalte erstellen

Navigate to the root of your Hugo project and use the `hugo new` command to create a file in the `content/docs` directory:

```shell
hugo new docs/example-page.md
```

This will create a markdown file named `example-page.md` with the following default front matter:

```toml
+++
title = "Example Page"
description = ""
icon = "article"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 999
+++
```

Modify the options to suit your needs.

The code below shows the front matter code used to create this page, along with some markdown in the body:

```md
+++
weight = 100
date = "2023-05-03T22:37:22+01:00"
draft = true
author = "Colin Wilson"
title = "Quickstart"
icon = "rocket_launch"
toc = true
description = "A quickstart guide to creating new content in Lotus Docs"
publishdate = "2023-05-03T22:37:22+01:00"
