---
title: 'Zahit Theme: External Blog Posts Support'
description: 'Learn how to integrate articles published on Medium, Substack, or external platforms into your Zahit blog.'
pubDate: '2026-10-06'
tags: ['zahit-guide', 'usage', 'external']
translationKey: 'zahit-external-posts'
---

Zahit provides native support for external blog posts, allowing you to curate all your published work in one central, minimalist space. Whether you publish on Medium, Substack, Dev.to, or corporate engineering blogs, you can showcase these articles without sacrificing the theme’s clean visual identity.

In this guide, we will explore how to configure frontmatter parameters for external articles and how the Zahit ecosystem handles them.

---

## 📋 Frontmatter Configuration

To turn any markdown file into an external post pointer, include two parameters in the frontmatter block:

```markdown
---
title: 'Clean Code in the Age of AI'
description: 'An architectural deep dive into minimalist codebases published on Medium.'
pubDate: '2026-10-06'
tags: ['software', 'architecture']
external_url: 'https://medium.com/@username/clean-code'
external_source: 'Medium' # Optional: Renders as a badge next to the date
---
```

### Explaining the Parameters:

- **`external_url` (Required):** The valid URL destination of your external article. Once specified, the post card acts as an external link.
- **`external_source` (Optional):** The platform label (e.g., *Medium*, *Substack*, *Dev.to*, *AltaySec*). When provided, it renders as a sleek, minimal badge next to the publication date.

---

## ⚡ How the Ecosystem Behaves

When an external post is detected, every relevant component throughout Zahit automatically adapts:

### 1. Card & Listing Views (Home, Archive, Tags)
- **Direct Navigation:** Clicking the article card takes visitors straight to the external platform.
- **Secure New Tab:** Outgoing links open safely in a new tab via `target="_blank"` and `rel="noopener noreferrer"`.
- **Visual Clues:** The post title receives a subtle external arrow (`↗`), while a source badge accompanies the publication date.

### 2. Smart Fallback & 301 Redirect
If a visitor or search crawler navigates directly to the post’s local route (`/en/blog/post-slug/`), Astro intercepts the request before rendering and issues an HTTP `301 Moved Permanently` redirect to the destination URL.

### 3. RSS Feed Integration
Zahit’s `rss.xml` generator dynamically checks for external links. Feed readers and subscribers will see the direct target URL in the feed item’s `<link>` tag instead of a local stub page.

---

## 💡 Practical Tip

When drafting an external post markdown file, there is no need to write long body copy. You only need to provide the frontmatter metadata along with a concise `description`.

Just like standard posts, you can also link localized external articles across languages using the `translationKey` attribute.

---

## Next Steps

To explore more of Zahit’s capabilities, check out our companion guides:
- **[Zahit Theme: How to Write and Organize Content](/en/blog/usage/)**
- **[Zahit Theme: Advanced Customization & Colors](/en/blog/customization/)**
