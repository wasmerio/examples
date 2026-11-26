# 🛠️ Site Configuration Guide

Welcome to your personal dev blog template!

## ⚡ How to Edit Your Site

You can customize the entire blog from a single file:
👉 **[`src/config/site.ts`](file:///Users/nivin/Desktop/Dev/Blog%20Site/src/config/site.ts)**

### What you can customize:
1. **Your Author Profile**:
   - `name`: Your name (e.g. `"Alex Morgan"`)
   - `role`: Your job title / persona (e.g. `"Software Engineer & Creative Developer"`)
   - `avatar`: Path to your photo in `public/images/` (e.g. `"/images/avatar.jpg"`)
   - `bio`: Short developer bio displayed in articles and on the about page
   - `social`: Links to your GitHub, Twitter/X, LinkedIn, and email

2. **Site Branding & Meta**:
   - `name`: Blog name (e.g. `"DEV.LOG"`)
   - `title`: Default page title & SEO
   - `description`: Site meta description
   - `url`: Your production domain (e.g. `"https://devlog.example.com"`)

3. **Home Hero**:
   - `greeting`: Main header greeting (e.g. `"Hey, I'm Alex"`)
   - `badge`: Sub-headline status badge
   - `tagline`: Personal mission statement or intro paragraph

4. **Navigation & Categories**:
   - `navLinks`: Top navigation items
   - `categories`: Topic cards and descriptions

5. **About Me Page**:
   - `about.philosophyTitle`: Philosophy section heading
   - `about.philosophyParagraphs`: Story & philosophy paragraphs
   - `about.quote`: Featured highlight quote
   - `about.highlights`: 4 core focus pillars (with custom icons & descriptions)
   - `about.techArsenal`: List of your daily tools and technologies with categories

*(Alternatively, you can customize the markup and layout directly in [`src/pages/about.astro`](file:///Users/nivin/Desktop/Dev/Blog%20Site/src/pages/about.astro))*
