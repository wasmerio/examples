---
title: "Building AI-Friendly Websites"
description: "How semantic HTML and structured data make your personal site readable by AI agents."
pubDate: 2025-11-15
tags: ["ai", "seo", "semantic-web"]
featured: true
---

The web was built for humans reading through browsers. But the next wave of consumers will be AI agents, retrieving information on behalf of people. If your personal site is going to represent you in that world, it needs to be machine-readable.

## The Shift in Audience

Today, a recruiter visits your site and scans your about page. Tomorrow, an AI agent will crawl your site, extract structured data about your experience, and present a summary to whoever asked. The question is: will your site make that easy or hard?

## Semantic HTML Matters

The foundation is semantic HTML. Using `<article>`, `<section>`, `<nav>`, `<header>`, `<time>`, and `<main>` gives structure that machines can parse without guessing.

A `<time datetime="2025-11-15">` tag is unambiguous. A `<span>November 15, 2025</span>` requires natural language parsing. The difference is small for humans but significant for automated systems.

## JSON-LD: Your Machine-Readable Resume

JSON-LD structured data is the most direct way to communicate with search engines and AI agents. It's a script tag in your page head that describes the content in a standardized vocabulary:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jane Developer",
  "jobTitle": "Software Engineer",
  "sameAs": [
    "https://github.com/janedeveloper",
    "https://linkedin.com/in/janedeveloper"
  ]
}
```

This isn't just for Google. Any agent that understands schema.org (and most do) can extract your identity, role, and connections from this data.

## Practical Steps

1. Use semantic HTML elements for page structure
2. Add JSON-LD structured data to every page type
3. Include proper Open Graph meta tags
4. Generate an RSS feed and sitemap
5. Write a permissive `robots.txt`
6. Use clean, predictable URL patterns
7. Put dates in `<time>` tags with ISO-8601 `datetime` attributes

Your website is becoming your API. Build it accordingly.
