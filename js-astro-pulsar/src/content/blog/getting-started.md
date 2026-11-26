---
title: "Getting Started with Your New Blog"
description: "Learn how to customize and start using your new Astro blog theme"
published: true
date: 2024-01-15
author: "amirdaraee"
keywords: ["astro", "blog", "getting started", "tutorial"]
photo: "/sample-1.jpg"
imgCredit: "Photo by Sample Image 1"
language: "en"
---

# Welcome to Your New Blog!

This is an example blog post to help you get started with your new Astro theme. This theme comes with many features out of the box to help you create a beautiful, fast, and SEO-friendly blog.

## Features

This theme includes:

- **Dark Mode**: Toggle between light and dark themes with localStorage persistence
- **SEO Optimized**: Built-in meta tags, Open Graph, Twitter Cards, and structured data
- **Accessible**: ARIA labels, semantic HTML, and keyboard navigation support
- **Fast**: Built with Astro for optimal performance
- **Responsive**: Mobile-first design that looks great on all devices

## Writing Your First Post

To create a new blog post, simply add a new Markdown file to the `src/content/blog/` directory with the following frontmatter:

```yaml
---
title: "Your Post Title"
description: "A brief description of your post"
published: true
date: 2024-01-15
author: "amirdaraee"
keywords: ["keyword1", "keyword2"]
photo: "/path/to/image.jpg"
language: "en"
---
```

## Code Syntax Highlighting

The theme includes Prism syntax highlighting with the GitHub Dark theme:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to your new blog`;
}

greet("World");
```

```typescript
interface User {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const user: User = {
  name: "John Doe",
  email: "john@example.com",
  role: "admin"
};
```

## Customization

Check out the `src/config.ts` file to customize your site's title, description, social links, and more!

Happy blogging! 🚀
