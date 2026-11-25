# Volks-Typo Screenshots

This directory contains screenshots for the Astro theme portal submission and documentation.

## Required Screenshots

### 1. Featured Image (volks-typo-featured.png)
- **Size:** 1280x640px
- **Purpose:** Main image for Astro theme portal
- **Content:** Hero shot showcasing the theme's unique Bauhaus/monumental aesthetic
- **Suggestion:** Split view showing both mobile and desktop layouts with striking typography

### 2. Desktop View (volks-typo-desktop.png)
- **Size:** 1440x900px or similar
- **Purpose:** Show full desktop layout with sidebar
- **Content:** Homepage or blog listing with sidebar visible
- **Key elements:** Header, navigation, sidebar with bio/categories, main content

### 3. Mobile View (volks-typo-mobile.png)
- **Size:** 390x844px (iPhone 14 Pro) or similar
- **Purpose:** Demonstrate responsive design
- **Content:** Homepage or blog post on mobile
- **Key elements:** Mobile navigation, readable typography, proper spacing

### 4. Blog Post (volks-typo-blog-post.png)
- **Size:** 1440x900px or similar
- **Purpose:** Showcase typography and content layout
- **Content:** Full blog post with headings, paragraphs, lists, code blocks
- **Key elements:** Typography hierarchy, monumental rule, readability

### 5. Categories Page (volks-typo-categories.png)
- **Size:** 1440x900px or similar
- **Purpose:** Show blog organization features
- **Content:** Categories page with multiple categories and posts
- **Key elements:** Category cards, post listings, visual hierarchy

## How to Generate Screenshots

### Option 1: Manual Screenshots
1. Run the development server: `npm run dev`
2. Open the site in your browser
3. Use browser developer tools to set specific viewport sizes
4. Take screenshots using your OS screenshot tool
5. Save with the exact filenames listed above

### Option 2: Using Browser DevTools
1. Open Chrome DevTools (F12)
2. Click the device toolbar icon (or Ctrl+Shift+M)
3. Set custom viewport sizes as needed
4. Use "Capture screenshot" option in DevTools menu

### Option 3: Automated with Playwright (Recommended)
Run the provided script:
```bash
npm run generate-screenshots
```

## Image Optimization

After capturing, optimize the images:
- Use PNG format for all screenshots
- Compress with tools like TinyPNG or ImageOptim
- Ensure text remains crisp and readable
- Keep file sizes reasonable (< 500KB each)