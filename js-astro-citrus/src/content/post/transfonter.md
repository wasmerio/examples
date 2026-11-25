---
title: "How to Create a Font Subset with Transfonter"
description: "A guide to using Transfonter to create optimized font subsets"
publishDate: "2025-02-10"
tags: ["fonts", "optimization", "web performance"]
---

## What is Transfonter?

[Transfonter](https://transfonter.org/) is a free online tool that helps convert and subset fonts. It supports various formats (TTF, OTF, WOFF, WOFF2) and allows users to optimize web fonts by reducing their size while maintaining essential glyphs.

## Why Use Font Subsetting?

Font files often contain thousands of glyphs, including symbols and characters for multiple languages. Subsetting removes unnecessary glyphs, reducing file size and improving website performance. This is particularly useful when only a specific language set or symbols are needed.

For example, I encountered an issue when using the SF Pro Rounded font with the Satori library for generating OG images, as described in this post: [Example OG Social Image](posts/social-image/). When using multiple font variants, the project failed to build due to memory overflow errors. Increasing the memory limit did not help. Moreover, using even a single font file larger than ~3.5MB is considered bad practice, let alone multiple variants at the same time.

After subsetting the font, I ended up with two subsets, both containing **only Latin characters**: one slightly over 100KB and another around 355KB. This significantly reduced the overall font size while keeping the necessary glyphs.

## Creating a Font Subset with Transfonter

Let's take **SF Pro Rounded**, a multilingual font, and divide it into two subsets:

- **Basic subset**: Includes Latin characters and essential symbols.
- **Extended subset**: Includes additional glyphs beyond the basic set.

### Upload the Font
1. Go to [Transfonter](https://transfonter.org/).
2. Click **Add Fonts** and select the **SF Pro Rounded Regular** font file (TTF or OTF format).

### Define Unicode Ranges
For subsetting, use the following ranges:

#### Basic Subset

transfonter.org latin + essential symbols unicode-range:
```
0000-007F, 00A0-024F, 2190-22FF, 2934-2937, F6D5-F6D8
```

#### Extended Subset

transfonter.org additional glyphs unicode-range:
```
0080-00A0, 0250-218F, 2300-FFFF
```

:::tip
You can find out the character codes and view the glyph tables of a font using built-in system tools:
- Windows: Use Character Map (charmap). Open the Start menu, search for "Character Map," and select a font to see its glyphs and Unicode codes.
- macOS: Open Font Book, select a font, and switch to "Repertoire" mode to see all available characters along with their codes.
- Linux: Use gucharmap (GNOME Character Map) or kcharselect (for KDE) to browse Unicode symbols in installed fonts.
:::

### Generate the Font Files
1. Check the **Subset** box in Transfonter.
2. Enter the Unicode ranges above for each subset.
3. Click **Convert** to generate the optimized font files.
4. Download the converted fonts.

:::tip
Additionally, when using Transfonter, you can upload and convert multiple fonts at the same time. The tool allows batch processing, and after conversion, all optimized fonts can be downloaded as a ZIP archive, making it easier to manage multiple font files efficiently.
:::

### Implement in CSS
Once the fonts are ready, use `@font-face` to load them efficiently:

```css
@font-face {
  font-family: "SFProRounded";
  src: url("/fonts/SF-Pro-Rounded-Regular-Basic.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "SFProRounded";
  src: url("/fonts/SF-Pro-Rounded-Regular-Extended.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}
```

### Test the Fonts
Ensure the fonts load correctly by inspecting network requests in the browser's developer tools. Verify that only necessary subsets are downloaded.

## Conclusion
Using Transfonter for font subsetting helps optimize web performance by reducing font file sizes while keeping necessary glyphs. Try it out with your fonts to enhance your website's loading speed!