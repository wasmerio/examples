---
title: "HTML5 Integration"
meta_title: "HTML5 Integration - Power AI"
description: "Discover our powerful integration capabilities and seamless connections"
image: ""
draft: false
category: "Development"
icon: "/images/integrations/HTML5.svg"
page_header:
  badge: "Integration Details"
  title: |
    HTML5
  subtitle: Automate image generation in your n8n workflows with PowerAI
  button_primary:
    enable: true
    label: "Connect"
    link: "/contact"
---

## Overview

The HTML5 integration provides seamless embedding of AI-generated images directly into your HTML5 projects. Generate and display dynamic visuals without leaving your development environment.

## Key Features

- **Direct Embedding**: Generate images with simple HTML5-compatible code
- **Responsive Images**: Automatically create multiple image sizes for responsive design
- **Lazy Loading Support**: Optimize performance with AI-generated placeholder images
- **Canvas Integration**: Generate images directly to HTML5 canvas elements
- **Web Components**: Use our custom web components for easy integration

## How It Works

1. **Include the SDK**: Add the PowerAI JavaScript library to your HTML5 project
2. **Initialize the Client**: Set up your API credentials
3. **Generate Images**: Use our API to create images on demand
4. **Display Content**: Embed generated images with optimized code
5. **Cache Results**: Store generated images for improved performance

## Use Cases

- **Dynamic Websites**: Generate unique images for each page load
- **E-commerce**: Create product images and promotional banners
- **Blogs**: Generate featured images and illustrations
- **Landing Pages**: Create hero images and background graphics
- **Portfolios**: Generate portfolio pieces and showcase images

## Setup Instructions

To set up the HTML5 integration:

1. Sign up for a PowerAI account and get your API key
2. Include the PowerAI SDK in your HTML: `<script src="https://cdn.powerai.io/sdk.js"></script>`
3. Initialize the client with your API key
4. Use the API to generate images: `powerai.generate(prompt, options)`
5. Display the result in your HTML5 application

## Technical Details

- **SDK Version**: v3.2.0
- **API Protocol**: RESTful with WebSocket support
- **Supported Formats**: PNG, JPG, WebP, GIF
- **Max Resolution**: Up to 4K (3840x2160)
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Code Example

```html
<script>
  const client = new PowerAI("your-api-key");

  async function generateImage() {
    const result = await client.generate({
      prompt: "A beautiful sunset over mountains",
      width: 1920,
      height: 1080,
      format: "webp",
    });

    document.getElementById("image-container").src = result.url;
  }
</script>
```

## Pricing

HTML5 integration is free to use. Pay only for the images you generate. Pricing starts at $0.01 per image with volume discounts available.
