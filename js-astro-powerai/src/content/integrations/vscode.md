---
title: "VS Code Integration"
meta_title: "VS Code Integration - Power AI"
description: "Discover our powerful integration capabilities and seamless connections"
image: ""
draft: false
category: "Development"
icon: "/images/integrations/Vscode.svg"
page_header:
  badge: "Integration Details"
  title: |
    VS Code
  subtitle: Automate image generation in your n8n workflows with PowerAI
  button_primary:
    enable: true
    label: "Connect"
    link: "/contact"
---

## Overview

The VS Code integration brings AI-powered image generation directly into your development environment. Generate diagrams, documentation images, and visual assets without leaving your code editor.

## Key Features

- **Command Palette Integration**: Generate images with `Ctrl+Shift+P` commands
- **Context Menu Actions**: Right-click to generate images from selected text
- **Live Preview**: Preview generated images in a side panel
- **File Integration**: Save images directly to your project
- **Multi-language Support**: Works with all programming languages

## How It Works

1. **Install the Extension**: Search for "PowerAI" in the VS Code marketplace
2. **Authenticate**: Sign in with your PowerAI account
3. **Select Text**: Highlight text or use commands to generate images
4. **Customize Output**: Adjust settings for size, format, and style
5. **Save and Use**: Save images to your project or copy to clipboard

## Use Cases

- **Documentation**: Generate diagrams and illustrations for README files
- **Architecture Diagrams**: Create visual representations of system architecture
- **API Documentation**: Generate sequence diagrams and flowcharts
- **Blog Posts**: Create featured images and illustrations
- **Presentations**: Generate visuals for technical presentations

## Setup Instructions

To set up the VS Code integration:

1. Open VS Code and go to Extensions
2. Search for "PowerAI" and click Install
3. Reload VS Code when prompted
4. Sign in with your PowerAI account
5. Configure your preferred settings in the extension options
6. Start generating images with commands or context menu

## Technical Details

- **Extension Version**: v2.5.0
- **VS Code Support**: VS Code 1.70 and above
- **API Integration**: RESTful API with WebSocket support
- **Supported Formats**: PNG, JPG, SVG, WebP
- **Max Resolution**: Up to 4096x4096 pixels
- **Processing Time**: 2-10 seconds depending on complexity

## Commands

- `PowerAI: Generate Image` - Generate an image from a prompt
- `PowerAI: Generate from Selection` - Generate from selected text
- `PowerAI: Generate Diagram` - Generate a diagram type
- `PowerAI: Open Preview` - Open the image preview panel
- `PowerAI: Save Image` - Save the current image to file
- `PowerAI: Copy to Clipboard` - Copy image to clipboard

## Context Menu Options

Right-click on selected text to access:

- **Generate Image**: Create an image based on selection
- **Generate Diagram**: Create a diagram from selection
- **Generate Icon**: Create an icon from selection
- **Generate Screenshot**: Generate a mockup screenshot

## Settings

Configure the extension in VS Code Settings:

```json
{
  "powerai.apiKey": "your-api-key",
  "powerai.defaultWidth": 1920,
  "powerai.defaultHeight": 1080,
  "powerai.defaultFormat": "png",
  "powerai.autoSave": true,
  "powerai.saveLocation": "./images"
}
```

## Keyboard Shortcuts

- `Ctrl+Shift+P` → "PowerAI: Generate Image" - Quick generate
- `Ctrl+Shift+G` - Generate from selection
- `Ctrl+Shift+D` - Open preview panel
- `Ctrl+Shift+S` - Save current image

## Pricing

VS Code extension is free to install. Image generation uses your PowerAI quota. Pro plans include advanced features like batch generation and custom templates.
