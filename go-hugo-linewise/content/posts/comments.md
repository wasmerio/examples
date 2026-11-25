---
title: "Comments"
description: "Add a comment section to your blog posts."
date: 2026-06-04
tags: ["meta", "reference"]
---


Linewise supports comments through a provider setting. It ships with [giscus](https://giscus.app), a system that stores discussions in your GitHub repository. Comments are disabled by default.

## Setup

Choose your provider in `hugo.toml`. The default is `"none"`.

```toml
[params.linewise.comments]
provider = "none"
```

### Using giscus

You need a public GitHub repository with Discussions enabled, plus four identifiers from the giscus configuration page.

**1. Enable Discussions**: go to your repo on GitHub, open **Settings -> Features -> Discussions**, check the box, and save.

**2. Install the giscus app**: visit [github.com/apps/giscus](https://github.com/apps/giscus), install it, and grant access to your blog repo.

**3. Get your IDs**: open [giscus.app](https://giscus.app), fill in your repo name, and pick a Discussion category. Copy the values shown:

| Field        | Example            |
| ------------ | ------------------ |
| `repo`       | `"tabsp/linewise"` |
| `repoId`     | `"R_kgDO..."`      |
| `category`   | `"Comments"`       |
| `categoryId` | `"DIC_kwDO..."`    |

**4. Update your config:**

```toml
[params.linewise.comments]
provider = "giscus"

[params.linewise.comments.giscus]
repo = "tabsp/linewise"
repoId = "R_kgDO..."
category = "Comments"
