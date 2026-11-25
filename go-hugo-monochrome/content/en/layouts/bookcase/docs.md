---
title: 'Bookcase Layout Document'
bookcase_cover_src: 'cover/bookcase.png'
bookcase_cover_src_dark: 'cover/bookcase_dark.png'
weight: 20
---


Bookcase layout is useful for creating another viewpoint of list contents.

> This layout can only be used on section page (`_index.md`).

## Configuration

```yaml
---
type: 'bookcase'
---
```

> Specify `type` in front-matter will change the template lookup order.

### bookcase_list_sections

List subsections.

```yaml
---
bookcase_list_sections: true
---
```

> default: true

### bookcase_list_pages

List pages.

```yaml
---
bookcase_list_pages: true
---
```

> default: true

