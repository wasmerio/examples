---
title: "Global Edge Network"
description: "Learn how Virex's global edge network delivers your application with sub-50ms latency to users worldwide."
section: "Features"
order: 11
draft: false
---

Virex deploys your application to over 200 edge locations worldwide, ensuring fast load times for every user regardless of their location. This guide explains how our edge network works and how to optimize your application for it.

## How It Works

When you deploy to Virex, your application is distributed across our global edge network:

1. **Build** — Your application is built in our cloud infrastructure
2. **Distribute** — Static assets are pushed to all 200+ edge locations
3. **Route** — User requests are automatically routed to the nearest edge
4. **Serve** — Content is served with minimal latency

```
User in Tokyo → Tokyo Edge (12ms)
User in London → London Edge (8ms)
User in São Paulo → São Paulo Edge (15ms)
```

## Edge Locations

Our network spans six continents with points of presence in major metropolitan areas:

### North America
San Francisco, Los Angeles, Seattle, Denver, Dallas, Chicago, Atlanta, Miami, New York, Toronto, Montreal

### Europe
London, Amsterdam, Frankfurt, Paris, Madrid, Milan, Stockholm, Warsaw, Dublin

### Asia Pacific
Tokyo, Osaka, Singapore, Hong Kong, Sydney, Melbourne, Mumbai, Seoul, Jakarta

### South America
São Paulo, Buenos Aires, Santiago, Bogotá

### Africa & Middle East
Johannesburg, Cape Town, Dubai, Tel Aviv

### Additional Regions
New locations are added regularly. Check our [status page](/status) for the current list.

## Automatic Optimization

Virex automatically optimizes your content for edge delivery:

### Static Assets

All static files (JS, CSS, images, fonts) are:

- Compressed with Brotli/Gzip
- Cached at the edge with optimal TTLs
- Served with immutable cache headers for versioned assets

### HTML Pages

For static sites and pre-rendered pages:

- HTML is cached at the edge
- Stale-while-revalidate ensures fast responses during updates
- Instant cache invalidation on new deployments

### Dynamic Content

For server-rendered or API routes:

- Requests are routed to the nearest compute region
- Response caching is configurable per-route
- Edge functions can run logic at the edge

## Cache Configuration

Control caching behavior in your `virex.config.js`:

```javascript
export default {
  edge: {
    caching: {
      // Cache static assets for 1 year
      static: '1y',
      // Cache HTML for 1 hour, revalidate in background
      html: '1h',
      // Custom rules for specific paths
      rules: [
        { path: '/api/*', cache: 'no-store' },
        { path: '/blog/*', cache: '1d' },
      ],
    },
  },
};
```

Or use response headers in your application:

```javascript
// Next.js API route example
export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.json({ data: 'cached for 1 hour' });
}
```

## Edge Functions

Run code at the edge for ultra-low latency responses:

```javascript
// virex/edge/middleware.js
export default function middleware(request) {
  // Runs at the edge, closest to the user
  const country = request.geo.country;
  
  if (country === 'DE') {
    return Response.redirect('/de');
  }
  
  return request;
}
```

Edge functions are ideal for:

- **Geolocation routing** — Redirect users based on location
- **A/B testing** — Route users to different variants
- **Authentication** — Validate tokens before hitting origin
- **Bot protection** — Block malicious traffic at the edge

## Performance Metrics

Monitor your edge performance in the Virex dashboard:

### Core Web Vitals

- **LCP** (Largest Contentful Paint) — How fast main content loads
- **FID** (First Input Delay) — How responsive the page is
- **CLS** (Cumulative Layout Shift) — Visual stability

### Edge Metrics

- **Edge Hit Rate** — Percentage of requests served from cache
- **Origin Latency** — Time to fetch from origin when cache misses
- **Global P50/P95** — Latency percentiles across all regions

## Regional Routing

For applications with data residency requirements, configure regional routing:

```javascript
export default {
  edge: {
    regions: {
      // EU users only hit EU edges and origins
      eu: {
        countries: ['DE', 'FR', 'IT', 'ES', 'NL', ...],
        origin: 'eu-west-1',
      },
      // US users hit US infrastructure
      us: {
        countries: ['US', 'CA'],
        origin: 'us-east-1',
      },
    },
  },
};
```

## SSL/TLS

All edge connections are secured with TLS 1.3:

- **Automatic certificates** — SSL provisioned automatically for all domains
- **Custom certificates** — Upload your own for enterprise requirements
- **HSTS** — Strict transport security enabled by default
- **Certificate transparency** — All certs logged for security

## DDoS Protection

Our edge network includes built-in DDoS protection:

- **Layer 3/4 protection** — Network-level attack mitigation
- **Layer 7 protection** — Application-level attack detection
- **Rate limiting** — Configurable per-route limits
- **Bot detection** — Machine learning-based bot identification

## Best Practices

1. **Use immutable asset URLs** — Include content hashes in filenames for optimal caching
2. **Set appropriate cache headers** — Don't over-cache dynamic content
3. **Leverage edge functions** — Move logic closer to users when possible
4. **Monitor cache hit rates** — Low hit rates indicate caching opportunities
5. **Use regional routing for compliance** — Keep data in required jurisdictions

## Troubleshooting

### High origin latency

Check if cacheable content is being cached:

```bash
virex analytics cache --path /api/products
```

### Stale content after deploy

Force cache invalidation:

```bash
virex cache purge --all
```

### Regional performance issues

Check edge health for specific regions:

```bash
virex status --region asia-pacific
```
