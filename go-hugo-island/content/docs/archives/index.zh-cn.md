---
title: '归档页面'
description: >
    如何启用归档页面。
date: '2025-01-26T20:44:58+08:00'
draft: false
cover:
    image: cover-x-8.png
tags:
    - archives
categories:
    - docs
authors:
    - bob
---


你需要创建 `content/archives/_index.md` 来启用归档页面。

```
---
title: "Archives"
description: "..."
draft: false
icon: archive-box
cover:
    image: cover.jpg
---
```

如果你的 `_index.md` 不在 `content/archives/` 目录下面，那你可以给你的 `_index.md` 的 frontmatter 添加 `type: archives` 来启用这一特性。

```
---
title: "Archives"
description: "..."
draft: false
icon: archive-box
cover:
    image: cover.jpg
type: archives
---
```

