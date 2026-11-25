---
title: '封面图'
description: >
    封面图和作者头像。
date: '2025-01-18T13:34:56+08:00'
draft: false
cover:
    image: cover-x-3.png
categories:
    - docs
tags:
    - cover
    - avatar
    - post
---


## 添加封面图

```yaml
---
title: "your-post-title"
# ...
cover:
    image: example.jpg # or URL
    alt: xxx # Optional
    width: 750 # Optional
    height: 500 # Optional
---
```

### 为作者添加作者头像

```yaml
---
title: "author-name"
# ...
avatar:
    image: example-avatar.jpg
    alt: Example Avatar
cover:
    image: example-background.jpg
    alt: Example Background Image
```

