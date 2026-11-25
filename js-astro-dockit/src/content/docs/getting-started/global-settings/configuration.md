---
title: Global Configuration
description: Configure DocKit's global settings, theme options, and site-wide preferences.

---

DocKit provides flexible global configuration options to customize your documentation site's appearance, behavior, and functionality. This guide covers all the essential settings you can configure.

## Configuration Files

DocKit uses several configuration files located in the `src/config/` directory:

```
src/config/
├── config.json      # Main site configuration
├── theme.json       # Theme and styling options  
├── menu.json        # Navigation menu structure
├── social.json      # Social media links
└── locals.json      # Localization settings
```

## Main Configuration (`config.json`)

The main configuration file controls your site's basic settings:

```json
{
  "site": {
    "title": "DocKit Documentation",
    "description": "Beautiful documentation made simple",
    "author": "Your Name",
    "email": "your.email@example.com",
    "base_url": "https://yourdomain.com"
  },
  "metadata": {
    "meta_author": "DocKit Team",
    "meta_image": "/images/og-image.png",
    "meta_description": "Create beautiful documentation with DocKit"
  }
}
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `site.title` | String | Your site's main title |
| `site.description` | String | Brief description of your documentation |
| `site.author` | String | Default author name |
| `site.email` | String | Contact email address |
| `site.base_url` | String | Your site's production URL |
| `metadata.meta_image` | String | Default Open Graph image |

## Theme Configuration (`theme.json`)

Customize your site's visual appearance:

```json
{
  "theme": {
    "primary_color": "#2563eb",
    "secondary_color": "#64748b", 
    "accent_color": "#06b6d4",
    "background_color": "#ffffff",
    "text_color": "#1e293b"
  },
  "layout": {
    "sidebar_width": "280px",
    "content_max_width": "1200px",
    "enable_breadcrumbs": true,
    "enable_toc": true
  },
  "features": {
    "dark_mode": true,
    "search": true,
    "print_button": true,
    "edit_page": true
  }
}
```

### Theme Options

#### Colors
- `primary_color`: Main brand color for links and buttons
- `secondary_color`: Secondary elements and borders
- `accent_color`: Highlights and call-to-action elements
- `background_color`: Main background color
- `text_color`: Default text color

#### Layout
- `sidebar_width`: Width of the navigation sidebar
- `content_max_width`: Maximum width of content area
- `enable_breadcrumbs`: Show/hide breadcrumb navigation
- `enable_toc`: Show/hide table of contents

#### Features
- `dark_mode`: Enable dark mode toggle
- `search`: Enable site search functionality
- `print_button`: Show print button on pages
- `edit_page`: Show "Edit this page" links

## Navigation Menu (`menu.json`)

Define your site's navigation structure:

```json
{
  "main": [
    {
      "name": "Getting Started",
      "url": "/getting-started/",
      "children": [
        {
          "name": "Introduction", 
          "url": "/getting-started/introduction/"
        },
        {
          "name": "Global Settings",
          "url": "/getting-started/global-settings/"
        }
      ]
    },
    {
      "name": "Guides",
      "url": "/guides/"
    },
    {
      "name": "Reference", 
      "url": "/reference/"
    }
  ]
}
```

## Social Links (`social.json`)

Configure social media and external links:

```json
{
  "social": [
    {
      "name": "GitHub",
      "icon": "github",
      "url": "https://github.com/yourusername/your-repo"
    },
    {
      "name": "Twitter",
      "icon": "twitter", 
      "url": "https://twitter.com/yourusername"
    },
    {
      "name": "Discord",
      "icon": "discord",
      "url": "https://discord.gg/your-server"
    }
  ]
}
```

## Localization (`locals.json`)

Set up multi-language support:

```json
{
  "defaultLocale": "en",
  "locales": {
    "en": {
      "label": "English",
      "lang": "en",
      "dir": "ltr"
    },
    "de": {
      "label": "Deutsch", 
      "lang": "de",
      "dir": "ltr"
    }
  }
}
```

## Astro Configuration

DocKit also integrates with Astro's configuration in `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'DocKit',
      description: 'Beautiful documentation made simple',
      logo: {
        src: './src/assets/logo.svg',
      },
      customCss: [
        './src/styles/global.css',
      ],
    }),
  ],
});
```

## Environment Variables

Configure environment-specific settings using `.env` files:

```bash
# .env.local
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_ANALYTICS_ID=your-analytics-id
GITHUB_TOKEN=your-github-token
```

## Best Practices

### Performance
- Keep configuration files small and focused
- Use appropriate data types (strings, booleans, numbers)
- Avoid deeply nested structures

### Maintenance  
- Document your custom configurations
- Use version control for configuration changes
- Test configuration changes in development first

### Security
- Never commit sensitive data to configuration files
- Use environment variables for secrets
- Validate configuration inputs

## Troubleshooting

### Common Issues

**Configuration not loading**: Ensure JSON files have valid syntax and proper file extensions.

**Styles not applying**: Check that theme.json values use valid CSS syntax.

**Menu not showing**: Verify menu.json structure matches the expected format.

**Build errors**: Validate all configuration files against their schemas.

---

Need help with advanced configuration? Check out our [customization guide](/guides/customization) or ask in our [community discussions](https://github.com/yourusername/dockit/discussions).