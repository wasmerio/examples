---
title: "Custom Domain Setup"
description: Learn how to configure a custom domain for your Dockit documentation site with detailed setup instructions for various hosting platforms.
sidebar:
  order: 6
  label: "[information] Custom Domain Setup"
---

Setting up a custom domain for your Dockit documentation site helps establish your brand identity and provides a professional appearance. This guide covers the complete process of configuring custom domains across different hosting platforms.

## Overview

A custom domain allows you to serve your documentation from your own branded URL instead of the default hosting provider subdomain. For example:

- **Default**: `your-docs.netlify.app` or `your-docs.vercel.app`
- **Custom**: `docs.yourcompany.com` or `help.yourcompany.com`

## Prerequisites

Before setting up a custom domain, ensure you have:

1. **Domain ownership**: You own or control the domain you want to use
2. **DNS access**: Ability to modify DNS records for your domain
3. **Deployed site**: Your Dockit site is already deployed and working
4. **SSL certificate**: HTTPS support (usually provided automatically)

## Domain Configuration Options

### Subdomain Setup (Recommended)

Using a subdomain is the most common and recommended approach:

```
docs.yourcompany.com
help.yourcompany.com
support.yourcompany.com
knowledge.yourcompany.com
```

### Root Domain Setup

You can also use your root domain, though this requires additional considerations:

```
yourcompany.com
yourdocs.com
```

### Path-based Setup

Serve documentation from a specific path:

```
yourcompany.com/docs
yourcompany.com/help
```

## Platform-Specific Setup

### Netlify Configuration

#### Step 1: Add Custom Domain in Netlify

1. Go to your site's **Site Settings** in Netlify dashboard
2. Navigate to **Domain management** → **Custom domains**
3. Click **Add custom domain**
4. Enter your domain (e.g., `docs.yourcompany.com`)

#### Step 2: Configure DNS Records

Add a CNAME record in your DNS provider:

```
Type: CNAME
Name: docs (or your chosen subdomain)
Value: your-site-name.netlify.app
TTL: 3600 (or Auto)
```

#### Step 3: Enable HTTPS

Netlify automatically provisions SSL certificates through Let's Encrypt:

1. Wait for DNS propagation (up to 24 hours)
2. SSL certificate will be automatically issued
3. Force HTTPS redirect in **Site Settings** → **HTTPS**

#### Step 4: Configure _redirects (Optional)

Create a `_redirects` file in your `public/` directory:

```
# public/_redirects

# Force HTTPS
http://docs.yourcompany.com/* https://docs.yourcompany.com/:splat 301!

# Redirect old paths
/old-docs/* /new-docs/:splat 301
/v1/* /latest/:splat 301

# SPA fallback
/*  /index.html  200
```

### Vercel Configuration

#### Step 1: Add Domain in Vercel

1. Go to your project dashboard
2. Navigate to **Settings** → **Domains**
3. Enter your custom domain
4. Choose the deployment branch

#### Step 2: Configure DNS

For subdomains, add a CNAME record:

```
Type: CNAME
Name: docs
Value: cname.vercel-dns.com
```

For root domains, add A records:

```
Type: A
Name: @
Value: 76.76.19.61

Type: A  
Name: @
Value: 76.76.19.62
```

#### Step 3: Verify Domain

Vercel will automatically verify your domain and issue SSL certificates.

#### Step 4: Configure vercel.json

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### GitHub Pages Configuration

#### Step 1: Configure Repository Settings

1. Go to repository **Settings** → **Pages**
2. Select source (usually `main` branch)
3. Add custom domain in the **Custom domain** field

#### Step 2: Create CNAME File

Create a `CNAME` file in your repository root or `public/` directory:

```
docs.yourcompany.com
```

#### Step 3: Configure DNS

Add a CNAME record pointing to GitHub Pages:

```
Type: CNAME
Name: docs
Value: yourusername.github.io
```

#### Step 4: Enable HTTPS

GitHub Pages automatically provides SSL certificates for custom domains.

### Firebase Hosting Configuration

#### Step 1: Configure firebase.json

```json
{
  "hosting": {
    "public": "dist",
    "site": "your-project-id",
    "cleanUrls": true,
    "trailingSlash": false,
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

#### Step 2: Add Custom Domain

```bash
firebase hosting:channel:deploy live --only hosting
firebase hosting:site:get your-project-id
```

Add domain in Firebase Console:
1. Go to **Hosting** section
2. Click **Add custom domain**
3. Follow the verification steps

#### Step 3: DNS Configuration

Add the provided DNS records from Firebase Console.

## DNS Provider Examples

### Cloudflare DNS

```
Type: CNAME
Name: docs
Content: your-site.netlify.app
Proxy status: Proxied (orange cloud)
TTL: Auto
```

Additional Cloudflare settings:
- **SSL/TLS**: Full (strict)
- **Always Use HTTPS**: On
- **Automatic HTTPS Rewrites**: On

### Google Domains

```
Type: CNAME
Name: docs
Data: your-site.netlify.app.
TTL: 1 hour
```

### Namecheap DNS

```
Type: CNAME Record
Host: docs  
Value: your-site.netlify.app
TTL: Automatic
```

### Route 53 (AWS)

```json
{
  "Type": "CNAME",
  "Name": "docs.yourcompany.com",
  "Value": "your-site.netlify.app",
  "TTL": 300
}
```

## SSL Certificate Configuration

### Automatic SSL (Recommended)

Most modern hosting platforms provide automatic SSL:

- **Netlify**: Let's Encrypt (automatic)
- **Vercel**: Automatic SSL provisioning
- **GitHub Pages**: Automatic for custom domains
- **Firebase**: Google-managed certificates

### Manual SSL Configuration

For advanced setups, you might need manual SSL configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name docs.yourcompany.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Advanced Configuration

### Multiple Domains

Configure multiple domains for the same site:

```json
// netlify.toml
[[redirects]]
  from = "https://old-docs.com/*"
  to = "https://docs.yourcompany.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://help.yourcompany.com/*"
  to = "https://docs.yourcompany.com/:splat"
  status = 301
  force = true
```

### Internationalization Domains

Set up different domains for different languages:

```
docs.yourcompany.com (English)
docs-de.yourcompany.com (German)
docs-fr.yourcompany.com (French)
docs-es.yourcompany.com (Spanish)
```

### CDN Integration

Configure CDN for better performance:

```json
// vercel.json
{
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1", "sfo1", "fra1"],
  "github": {
    "enabled": false
  }
}
```

## Security Best Practices

### HSTS Configuration

Enable HTTP Strict Transport Security:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Content Security Policy

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; media-src 'self'; object-src 'none'; child-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self';
```

### Additional Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Performance Optimization

### DNS Optimization

1. **Use fast DNS providers**: Cloudflare, Route 53, or Google DNS
2. **Minimize DNS lookups**: Reduce external resource dependencies
3. **Enable DNS prefetching**: `<link rel="dns-prefetch" href="//example.com">`

### Caching Strategy

```
# Static assets
Cache-Control: public, max-age=31536000, immutable

# HTML files
Cache-Control: public, max-age=0, must-revalidate

# API responses
Cache-Control: public, max-age=300, s-maxage=600
```

## Monitoring and Analytics

### Domain Health Monitoring

Set up monitoring for your custom domain:

```javascript
// Basic uptime monitoring
async function checkDomainHealth() {
  try {
    const response = await fetch('https://docs.yourcompany.com/health');
    if (response.ok) {
      console.log('Domain is healthy');
    } else {
      console.error('Domain health check failed');
    }
  } catch (error) {
    console.error('Domain is unreachable:', error);
  }
}

setInterval(checkDomainHealth, 300000); // Check every 5 minutes
```

### Analytics Configuration

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID', {
    custom_map: {
      'custom_parameter': 'dimension1'
    }
  });
</script>
```

## Troubleshooting

### Common Issues

#### DNS Propagation Delays

DNS changes can take up to 48 hours to fully propagate worldwide:

```bash
# Check DNS propagation
dig docs.yourcompany.com
nslookup docs.yourcompany.com
```

Online tools:
- whatsmydns.net
- dnschecker.org

#### SSL Certificate Issues

Common SSL problems and solutions:

1. **Mixed content errors**: Ensure all resources use HTTPS
2. **Certificate mismatch**: Verify domain names match certificate
3. **Expired certificates**: Set up auto-renewal

#### Redirect Loops

Prevent infinite redirects:

```
# Incorrect
https://docs.yourcompany.com → https://docs.yourcompany.com

# Correct  
http://docs.yourcompany.com → https://docs.yourcompany.com
```

#### Performance Issues

Diagnose and fix performance problems:

```bash
# Test site speed
curl -w "@curl-format.txt" -o /dev/null -s "https://docs.yourcompany.com"

# Check response headers
curl -I "https://docs.yourcompany.com"
```

### Debug Tools

#### DNS Debugging

```bash
# Check A records
dig A docs.yourcompany.com

# Check CNAME records  
dig CNAME docs.yourcompany.com

# Check MX records
dig MX yourcompany.com

# Trace DNS resolution
dig +trace docs.yourcompany.com
```

#### SSL Debugging

```bash
# Check SSL certificate
openssl s_client -connect docs.yourcompany.com:443 -servername docs.yourcompany.com

# Test SSL configuration
curl -vI https://docs.yourcompany.com
```

## Migration Strategies

### Zero-Downtime Migration

Plan for seamless domain migration:

1. **Prepare new domain**: Set up and test thoroughly
2. **Update DNS with low TTL**: Reduce propagation time
3. **Monitor traffic**: Watch for any issues
4. **Implement redirects**: Guide users to new domain
5. **Update internal links**: Change all references
6. **Notify users**: Communicate the change

### Migration Checklist

- [ ] Domain ownership verified
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Redirects implemented
- [ ] Internal links updated
- [ ] External references notified
- [ ] Analytics tracking updated
- [ ] SEO considerations addressed
- [ ] Monitoring alerts configured
- [ ] Rollback plan prepared

## Best Practices

1. **Choose meaningful subdomains**: Use clear, descriptive names
2. **Enable HTTPS everywhere**: Never serve content over HTTP
3. **Monitor domain health**: Set up uptime monitoring
4. **Plan for disasters**: Have backup domains ready
5. **Document your setup**: Keep configuration records
6. **Regular maintenance**: Review and update configurations
7. **Security first**: Implement proper headers and policies
8. **Performance matters**: Optimize for speed and reliability

## Conclusion

Setting up a custom domain for your Dockit documentation site enhances your brand presence and provides a professional experience for your users. Follow the platform-specific instructions, implement proper security measures, and monitor your domain's health for the best results.

Remember to test thoroughly in a staging environment before making changes to production domains, and always have a rollback plan ready in case of issues.