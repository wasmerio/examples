# Deployment

Build your site for production:

```bash
npm run build
```

This generates a static site in the `dist/` folder.

## Vercel

### Option 1: CLI

```bash
npm i -g vercel
vercel
```

### Option 2: Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Vercel auto-detects Astro settings

### Error Pages

Create `vercel.json` for custom error pages:

```json
{
  "routes": [
    { "handle": "error" },
    { "status": 403, "src": "/(.*)", "dest": "/403" },
    { "status": 500, "src": "/(.*)", "dest": "/500" }
  ]
}
```

## Netlify

### Option 1: CLI

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 2: Git Integration

1. Connect repository in [Netlify Dashboard](https://app.netlify.com/)
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Netlify Forms

The contact form supports Netlify Forms out of the box:

```astro
<ContactForm netlify formName="contact" />
```

### Error Pages

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/404"
  status = 404
```

## Cloudflare Pages

1. Connect repository in [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Set build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Deploy

### Error Pages

Create `public/_redirects`:

```
# 404 handling
/*    /404    404
```

For 403/500, configure in Cloudflare dashboard or use Workers.

## Static Hosting

Upload the `dist/` folder to any static host:

- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Surge
- Any web server

### Server Configuration

For Apache or Nginx, you'll need to configure:
- Error page routing (403, 404, 500)
- Gzip compression
- Static asset caching

<details>
<summary>Apache (.htaccess) example</summary>

Create `public/.htaccess`:

```apache
ErrorDocument 403 /403
ErrorDocument 404 /404
ErrorDocument 500 /500

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
</IfModule>
```
</details>

<details>
<summary>Nginx example</summary>

```nginx
server {
    listen 80;
    server_name yoursite.com;
    root /var/www/dist;

    error_page 404 /404.html;
    
    location / {
        try_files $uri $uri/ /404.html;
    }

    location ~* \.(png|jpg|svg|css|js)$ {
        expires 1y;
    }
}
```
</details>

## Environment Variables

Set these in your hosting provider's dashboard:

| Variable | Purpose | Required |
|----------|---------|----------|
| `SITE_URL` | Canonical URL for SEO | Yes |
| `SITE_NAME` | Site name | Yes |
| `SITE_DESCRIPTION` | Site description | Yes |
| `SITE_AUTHOR` | Author name | Yes |
| `SUPABASE_URL` | Supabase project URL (if using Supabase) | No |
| `SUPABASE_ANON_KEY` | Supabase anon key (if using Supabase) | No |
| `AUTH_API_URL` | Custom auth API URL | No |
| `PUBLIC_GA_ID` | Google Analytics ID | No |

See [Configuration documentation](./02-configuration.md#environment-variables) for details.

## Dashboard Deployment Notes

When deploying applications with the dashboard:

### Authentication Setup

The dashboard requires authentication to protect routes. Before deploying:

1. **Implement Auth Middleware**: See [Authentication documentation](./08-authentication.md#dashboard-integration) for setup
2. **Configure Auth Provider**: Set up Supabase, Auth0, or custom auth solution
3. **Test Protected Routes**: Ensure `/dashboard/*` routes redirect unauthenticated users to `/login`

### Environment Variables

Add dashboard-specific environment variables:

```bash
# Authentication (example with Supabase)
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key

# Or custom API
AUTH_API_URL=https://api.yoursite.com
AUTH_API_KEY=your-api-key
```

### Replace Sample Data

The dashboard uses sample data from `src/lib/dashboard-data.ts`. Replace with real API calls:

```typescript
// Before (sample data)
export function getProjects() {
  return [/* sample data */];
}

// After (real API)
export async function getProjects() {
  const response = await fetch(`${API_URL}/projects`);
  return response.json();
}
```

### Session Management

Configure secure session cookies in production:

```typescript
// Example session cookie configuration
cookies.set('session', token, {
  httpOnly: true,
  secure: true, // HTTPS only
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/'
});
```

### CORS Configuration

If using a separate API server, configure CORS:

```typescript
// Example CORS headers
headers: {
  'Access-Control-Allow-Origin': 'https://yoursite.com',
  'Access-Control-Allow-Credentials': 'true'
}
```

## Pre-deployment Checklist

### Configuration
- [ ] Update `site` in `astro.config.mjs`
- [ ] Update all values in `src/config/site.ts` (name, description, url, author)
- [ ] Update `src/config/contact.ts` with your contact info
- [ ] Configure feature flags in `src/config/features.ts`

### Branding
- [ ] Replace `public/logo.svg` with your logo
- [ ] Replace `public/favicon.svg` with your favicon
- [ ] Replace `public/images/og-image.png` (1200x630px recommended)
- [ ] Update social links in `src/config/site.ts`

### Content
- [ ] Remove or replace sample blog posts
- [ ] Remove or replace sample testimonials
- [ ] Update documentation content
- [ ] Review and update legal pages (privacy, terms)

### Forms & Integrations
- [ ] Configure contact form backend (Netlify, Formspree, or custom)
- [ ] Set up newsletter endpoint if using newsletter feature
- [ ] Add Google Analytics ID if needed

### Dashboard (if using)
- [ ] Replace sample data in `src/lib/dashboard-data.ts` with real API calls
- [ ] Implement authentication middleware (see [Authentication docs](./08-authentication.md))
- [ ] Configure dashboard navigation in `src/config/dashboard-navigation.ts`
- [ ] Set up environment variables for auth provider
- [ ] Test dashboard routes require authentication
- [ ] Verify dashboard works in production mode

### Testing
- [ ] Test all pages locally with `npm run preview`
- [ ] Verify sitemap at `/sitemap.xml`
- [ ] Test RSS feed at `/rss.xml`
- [ ] Check Open Graph with [opengraph.xyz](https://www.opengraph.xyz/)
- [ ] Validate JSON-LD with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Test on mobile devices
- [ ] Verify dark mode works correctly

## Performance Tips

1. **Images**: Use WebP/AVIF formats, optimize with tools like Squoosh
2. **Fonts**: The theme uses system fonts by default (no external requests)
3. **JavaScript**: Minimal JS, only for essential interactions
4. **CSS**: Tailwind purges unused styles automatically
