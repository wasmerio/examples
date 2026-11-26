# Deployment

FORMA generates a static site with Astro. Use Node.js 22.12 or newer.

1. Set `PUBLIC_SITE_URL` to the final canonical URL and `PUBLIC_BASE_PATH` if the site is hosted below a path.
2. Review `src/data/global/seo.json` and enable indexing only after replacing all demo content.
3. Run `npm ci` and `npm run build`.
4. Upload the contents of `dist/` to a static host or connect the repository to a provider that builds Astro projects.

The demo contact form validates in the browser and does not send or store inquiries. Configure and test your own form service before collecting data. Confirm the privacy policy, cookies and other legal content for the actual site before launch.
