---
title: "Astro Fox File Structure"
summary: "Understanding the file structure of Astro Fox projects."
date: 2025-04-23
tags: ["astro", "tutorial", "file structure"]
categories: "tutorial"
draft: false
---

# Astro Fox File Structure

## Project Structure

Astro Fox projects have the following directory structure:

- **/public/**: Where public assets are stored, including web fonts and client scripts.

  - **/fonts/**: Web font files
  - **/js/**: Client scripts

- **/src/**: The main directory where source code is located.
  - **/app/**: Contains common components, layouts, and styles for the application.
    - **/components/**: Common components for the application
    - **/layouts/**: Layout components
    - **/styles/**: Global styles
  - **/components/**: Contains components related to blog, log, and projects.
    - **/blog/**: Blog-related components
    - **/log/**: Log-related components
    - **/project/**: Project-related components
    - **/common/**: Common UI components
    - **/about/**: About page components
  - **/content/**: Blog, log, and project information stored in Markdown/MDX format.
    - **/blog/**: Blog posts
    - **/log/**: Log entries
    - **/projects/**: Project information
  - **/pages/**: Directory containing Astro pages.
    - **index.astro**: Home page
    - **/blog/**: Blog pages
      - **index.astro**: Blog list page
      - **[...slug].astro**: Dynamic blog post pages
    - **/log/**: Log pages
      - **index.astro**: Log list page
      - **[...slug].astro**: Dynamic log entry pages
    - **/projects/**: Project pages
      - **index.astro**: Project list page
      - **[...slug].astro**: Dynamic project detail pages
    - **/about/**: About page
      - **index.astro**: About page
