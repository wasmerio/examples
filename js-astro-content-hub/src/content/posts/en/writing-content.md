---
title: "Writing content the easy way"
date: 2026-01-26
description: "How to author a post or a docs page in this hub using Markdown and frontmatter."
tags: ["guide", "markdown"]
---

# Writing content the easy way

A page is just a Markdown file with a small frontmatter block at the top.

```md
---
title: "My page"
date: 2026-01-26
description: "One-line summary."
tags: ["guide"]
---

# My page

Write your content here.
```

Posts live under `src/content/posts/<locale>/` and docs under
`src/content/docs/<product>/<locale>/`. The build validates frontmatter and
rewrites relative links for you, so you can keep GitHub-friendly paths in the
source.
