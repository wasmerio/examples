# Troubleshooting

Common issues and solutions.

## Build Errors

### Schema Validation Error

```
[ERROR] Invalid frontmatter in "src/content/projects/my-project.mdx"
```

**Solution:** Check error message for invalid field. Common issues:
- Missing required field
- Wrong data type (string vs number)
- Invalid enum value

Run `npm run build` for detailed errors.

### TypeScript Errors

```bash
npm run astro check
```

### Module Not Found

```bash
rm -rf node_modules
npm install
rm -rf .astro
npm run dev
```

## Development Server

### Port Already in Use

```bash
npm run dev -- --port 3000
```

Or kill process on port 4321:
```bash
lsof -i :4321
kill -9 <PID>
```

### Hot Reload Not Working

1. Hard refresh (Ctrl+Shift+R)
2. Restart dev server
3. Clear browser cache
4. Check for syntax errors

### Styles Not Updating

1. Check CSS syntax errors
2. Clear browser cache
3. Restart dev server
4. Styles are scoped by default in Astro

## Content Issues

### Images Not Loading

Use correct import syntax:

```astro
---
import myImage from '../assets/image.png';
---

<img src={myImage.src} alt="Description" />
```

Or use OptimizedImage component:

```astro
import OptimizedImage from '../components/OptimizedImage.astro';

<OptimizedImage src="/path/to/image.png" alt="Description" />
```

### MDX Component Not Rendering

Import component in MDX file:

```mdx
import MyComponent from '../../components/MyComponent.astro';

<MyComponent />
```

### Draft Content Showing

Ensure `draft: true` in frontmatter. Draft filtering only works in production builds.

## Deployment Issues

### Environment Variables Not Working

1. Verify variables set in hosting platform
2. Check names match exactly (case-sensitive)
3. Rebuild after changes

### 404 on Page Refresh

**Netlify** — Create `public/_redirects`:
```
/* /index.html 200
```

**Vercel** — Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Sitemap Not Generated

1. Ensure `SITE_URL` is set
2. Check `astro.config.mjs` has sitemap integration
3. Rebuild

## Theme Issues

### Flash of Wrong Theme

Check `BaseLayout.astro` has inline theme script in `<head>`.

### Theme Not Persisting

1. Check localStorage not blocked
2. Verify View Transitions working
3. Check console for errors

## View Transitions Issues

### Navigation Not Smooth

1. Verify `ClientRouter` imported in `BaseLayout.astro`
2. Check `<ClientRouter />` in `<head>`
3. Use `<a>` tags for internal links

### JavaScript Not Running After Navigation

Use Astro lifecycle events:

```javascript
// Instead of DOMContentLoaded
document.addEventListener('astro:page-load', () => {
  // Your code
});
```

## Getting Help

1. Check [Astro Documentation](https://docs.astro.build)
2. Search [Astro Discord](https://astro.build/chat)
3. Open issue on [GitHub](https://github.com/erlandv/case/issues)

Include:
- Node.js version (`node -v`)
- Error messages (full stack trace)
- Steps to reproduce
