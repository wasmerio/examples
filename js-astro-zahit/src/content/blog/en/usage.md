---
title: 'Zahit Theme: How to Write and Organize Content'
description: 'Discover how to create bilingual posts, use content collections, and leverage Zahit’s smart language switching mechanism.'
pubDate: '2026-05-21'
tags: ['zahit-guide', 'usage', 'i18n']
translationKey: 'zahit-usage'
---

One of Zahit's most powerful assets is its clean, out-of-the-box support for bilingual content management. This guide will walk you through the folder architecture of your posts, formatting your post metadata (frontmatter), and utilizing Zahit’s smart language switcher to link Turkish and English posts.

---

## 📂 Content Directory Structure

All blog posts reside under the `src/content/blog/` directory. Within this directory, articles are organized into localized subfolders:

- `src/content/blog/tr/` — Holds your Turkish articles.
- `src/content/blog/en/` — Holds your English articles.

Astro automatically parses all files ending with `.md` or `.mdx` inside these subfolders thanks to the content collection loader defined in `src/content.config.ts`.

---

## 📋 The Post Frontmatter Schema

Every markdown post must contain a metadata block at the very top, enclosed by triple dashes `---`. Zahit's content collection schema enforces the following fields:

```markdown
---
title: 'Your Article Title'
description: 'A brief description of your article.'
pubDate: '2026-05-17'
tags: ['tag1', 'tag2']
translationKey: 'unique-post-identifier'
---
```

### Explaining the Fields:
- **`title` & `description`:** Essential fields rendered at the top of the article and dynamically injected into the HTML `<head>` tag for optimal SEO indexation.
- **`pubDate`:** The publication date. Zahit uses this date to sort posts chronologically and group them dynamically by year inside the `/archive/` page.
- **`tags`:** An array of tags. Make sure to include `zahit-guide` if you want them grouped under the theme guide archive.
- **`translationKey`:** A custom unique text key linking the English and Turkish translations of the post together.

---

## 🌐 The Smart i18n Switching Mechanism

Zahit implements an advanced routing system inside the header language navigation toggle. When a visitor is reading an English post and clicks **"TR"**, the theme does not simply bounce them to the Turkish home page. 

Instead, it searches through your blog collection to find a Turkish post that shares the exact same `translationKey` value.

- **If an identical key is found:** It seamlessly redirects the reader directly to the Turkish translation page.
- **If no matching key is found:** It gracefully redirects the reader to the `/archive/` page.


### Best Practice Example:

To write a post about minimalist design in both languages:

1. Create `src/content/blog/tr/sadelik.md` containing `translationKey: 'simplicity-post'`.
2. Create `src/content/blog/en/simplicity.md` containing `translationKey: 'simplicity-post'`.

With this configuration, readers can toggle back and forth between English and Turkish on the fly without ever losing their place.

---

## Next Steps

Now that you know how to organize and draft posts, you are ready to adjust the design tokens, switch colors, and modify your social link matrices.

Read our final guide: **[Zahit Theme: Advanced Customization & Colors](/en/blog/customization/)** to learn more.
