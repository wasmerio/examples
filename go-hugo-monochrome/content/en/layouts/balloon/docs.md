---
title: 'Balloon Layout Document'
bookcase_cover_src: 'cover/balloon.png'
bookcase_cover_src_dark: 'cover/balloon_dark.png'
date: 2022-03-29
---


# Balloon Layout Document

Balloon is useful for demonstrating information step-by-step.

> This layout can be used on both section page (`_index.md`) and regular post (`xxx.md`).

## Configuration

```yaml
---
type: 'balloon'
---
```

> Specify `type` in front-matter will change the template lookup order.

### balloon_resources

Content resources. URL can be an absolute path (with `/` prefix, relative to base URL), or relative path (without `/`, relative to current path)

> Hugo will handle multilingual scenario out of the box

For example:

```
https://kaiiiz.github.io/hugo-theme-monochrome/about
        \____________________________________/\____/
                    base URL           balloon_resources
```

```yaml
---
balloon_resources: "/about"
---
```

> default: error will occur in page

