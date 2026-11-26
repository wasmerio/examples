---
title: "Welcome to the Blog"
description: "This is your first blog post using Astro Content Collections. Learn how to create and manage blog posts with type safety."
pubDate: "2024-01-15"
updatedDate: "2024-01-15"
heroImage: "1.jpg"
tags: ["astro", "blog", "getting-started"]
author: "Astro Theme Switcher"
---

Welcome to your new Astro blog! This blog is powered by [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/), which provides a type-safe way to manage your content.

## What is Content Collections?

Content Collections are Astro's way of organizing and validating your content. They provide:

- **Type Safety**: Your frontmatter is validated against a schema
- **Organization**: All your blog posts live in one place
- **Developer Experience**: Autocomplete and type checking for your content

## Getting Started

To create a new blog post, simply add a new Markdown file to the `src/content/blog/` directory. Each post should include frontmatter with the following fields:

- `title`: The title of your blog post
- `description`: A brief description for SEO and previews
- `pubDate`: The publication date
- `updatedDate`: (Optional) When the post was last updated
- `heroImage`: (Optional) An image to display with the post
- `tags`: (Optional) An array of tags for categorization
- `author`: (Optional) The author name

## Writing Your First Post

Create a new `.md` file in `src/content/blog/` and start writing! You can use all standard Markdown features, and since you have MDX enabled, you can even use React components in your posts.

Happy blogging! 🚀
