---
title: Hiding Icons
date: 2024-01-05 19:00:00 +00:00
description: Hiding icons is an option.
categories: ["Manuals"]
url: manuals/hiding-icons
params:
  hide_icon: true
  hide_list_icon: true
  theme_color: hotpink
  uuid: 38E1A0BC-6F42-4287-8F54-797E87D9B9F3
---

If an icon is not appropriate for a page, it can be hidden with `hide_icon: true` in the page's frontmatter.

This page’s relevant YAML frontmatter:

```yaml
---
params:
  hide_icon: true
---
```

Without it and just `icon:` (= empty icon), the link above the title would still be present.

If the icon should also be hidden from lists, add `hide_list_icon` to the YAML frontmatter:

```yaml
---
params:
  hide_list_icon: true
---
```

