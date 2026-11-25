# Post-Deployment Verification

Checklist and verification steps after deploying to production.

## Quick Checklist

### Essential

- [ ] Homepage loads without errors
- [ ] All navigation links work
- [ ] Projects page shows case studies
- [ ] Individual project pages load
- [ ] Contact page displays email
- [ ] Theme toggle works
- [ ] Mobile navigation works

### SEO

- [ ] Page titles correct (check browser tab)
- [ ] Meta descriptions in page source
- [ ] Open Graph images load when sharing
- [ ] Sitemap at `/sitemap-index.xml`
- [ ] Robots.txt at `/robots.txt`

### Performance

- [ ] Pages load in under 3 seconds
- [ ] Images optimized
- [ ] No console errors

## Verification Steps

### 1. Check Meta Tags

View page source (Ctrl+U / Cmd+U):

```html
<title>Your Name - Professional Portfolio</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:image" content="https://yoursite.com/og-image.png">
```

**Tools:**
- [Meta Tags Checker](https://metatags.io/)
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 2. Test Social Sharing

Share URL on LinkedIn, Twitter, Slack. Check preview image and description.

If incorrect:
1. Verify `SITE_URL` is set correctly
2. Check `/og-image.png` is accessible
3. Use debugger tools to refresh cache

### 3. Verify Sitemap

Visit `https://yoursite.com/sitemap-index.xml`

**Submit to search engines:**
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

### 4. Check Structured Data

Use [Google Rich Results Test](https://search.google.com/test/rich-results):
- Test homepage for Person, WebSite schema
- Test project page for Article/Project schema

### 5. Performance Testing

**Lighthouse (Chrome DevTools):**
1. Open DevTools (F12)
2. Lighthouse tab
3. Run audit
4. Target: 90+ for all categories

**Other tools:**
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

### 6. Mobile Testing

- Chrome DevTools device emulation
- Test navigation, readability, tap targets
- No horizontal scrolling

### 7. Accessibility

- Lighthouse accessibility audit
- [WAVE](https://wave.webaim.org/)
- Tab through page (focus states visible?)

## Common Issues

### Images Not Loading

- Check paths are correct (case-sensitive)
- Verify images in `dist/` folder
- Check for typos

### Wrong Environment Variables

- Verify env vars in hosting platform
- Trigger rebuild after changes
- Check for typos

### Styles Look Different

- Clear browser cache (Ctrl+Shift+R)
- Check CSS files served correctly
- Verify build completed

### 404 on Page Refresh

**Netlify:** Add `public/_redirects`:
```
/* /index.html 200
```

**Vercel:** Usually automatic

## Monitoring

### Uptime Monitoring

- [UptimeRobot](https://uptimerobot.com/) — 50 monitors free
- [Freshping](https://www.freshworks.com/website-monitoring/)

### Check Periodically

**Weekly:** Site accessible, no console errors

**Monthly:** Lighthouse audit, broken links check

**After updates:** New content appears, links work, social previews correct
