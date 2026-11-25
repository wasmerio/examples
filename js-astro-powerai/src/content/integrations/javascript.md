---
title: "JavaScript Integration"
meta_title: "JavaScript Integration - Power AI"
description: "Discover our powerful integration capabilities and seamless connections"
image: ""
draft: false
category: "Development"
icon: "/images/integrations/JS.svg"
page_header:
  badge: "Integration Details"
  title: |
    JavaScript
  subtitle: Automate image generation in your n8n workflows with PowerAI
  button_primary:
    enable: true
    label: "Connect"
    link: "/contact"
---

## Overview

The JavaScript integration provides a comprehensive SDK for integrating AI-powered image generation into any JavaScript application. From Node.js backends to browser-based frontends, generate stunning visuals with just a few lines of code.

## Key Features

- **Universal Support**: Works in Node.js, browsers, and edge environments
- **TypeScript Support**: Full TypeScript definitions included
- **Async/Await API**: Modern, promise-based interface
- **Streaming Support**: Real-time image generation with progress updates
- **Error Handling**: Comprehensive error handling and retry logic

## How It Works

1. **Install the Package**: `npm install @powerai/sdk`
2. **Initialize the Client**: Set up with your API credentials
3. **Generate Images**: Use the API to create images from prompts
4. **Handle Results**: Process generated images as URLs or buffers
5. **Scale Up**: Use batch generation for multiple images

## Use Cases

- **Web Applications**: Generate user avatars, banners, and thumbnails
- **Node.js Services**: Create images for email templates, reports, and exports
- **React/Vue/Angular**: Integrate AI generation into modern frameworks
- **Serverless Functions**: Generate images in AWS Lambda, Cloud Functions, etc.
- **Electron Apps**: Build desktop apps with AI-generated content

## Setup Instructions

To set up the JavaScript integration:

```bash
npm install @powerai/sdk
```

```javascript
import PowerAI from "@powerai/sdk";

const client = new PowerAI({
  apiKey: "your-api-key",
});

async function generateImage() {
  const result = await client.images.generate({
    prompt: "A futuristic cityscape at sunset",
    width: 1920,
    height: 1080,
    format: "png",
  });

  console.log(result.url);
}
```

## Technical Details

- **SDK Version**: v4.1.0
- **Node.js Support**: v14.0.0 and above
- **Browser Support**: All modern browsers with ES6 support
- **Package Size**: 45KB minified, 15KB gzipped
- **Dependencies**: Zero runtime dependencies

## Advanced Features

### Batch Generation

```javascript
const images = await client.images.generateBatch([
  { prompt: "Image 1 description" },
  { prompt: "Image 2 description" },
  { prompt: "Image 3 description" },
]);
```

### Streaming

```javascript
const stream = await client.images.generateStream({
  prompt: "A detailed landscape",
  onProgress: (progress) => console.log(`${progress}% complete`),
});
```

### Custom Models

```javascript
const result = await client.images.generate({
  prompt: "Your prompt",
  model: "powerai-xl-v2",
  style: "photorealistic",
});
```

## Pricing

JavaScript SDK is free to use. Pay only for API calls. Pricing starts at $0.01 per image with volume discounts for high-usage applications.
