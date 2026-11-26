# Custom Fonts

Place your custom font files here.

## Adding Custom Fonts

1. **Add font files** to this directory (e.g., `.woff`, `.woff2`, `.ttf`)

2. **Create a CSS file** (e.g., `your-font.css`) with `@font-face` declarations:

```css
@font-face {
  font-family: 'Your Font Name';
  src: url('/fonts/your-font.woff2') format('woff2'),
       url('/fonts/your-font.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

3. **Update** `src/layouts/Layout.astro` to load your CSS file

4. **Update** `tailwind.config.mjs` to use your font:

```javascript
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Your Font Name', 'sans-serif']
      }
    }
  }
}
```

## Font Resources

- [Google Fonts](https://fonts.google.com/)
- [Font Squirrel](https://www.fontsquirrel.com/)
- [Adobe Fonts](https://fonts.adobe.com/)

## Performance Tip

Use `font-display: swap` to prevent invisible text during font loading.
