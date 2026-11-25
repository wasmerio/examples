---
title: "Python Integration"
meta_title: "Python Integration - Power AI"
description: "Discover our powerful integration capabilities and seamless connections"
image: ""
draft: false
category: "Development"
icon: "/images/integrations/Python.svg"
page_header:
  badge: "Integration Details"
  title: |
    Python
  subtitle: Automate image generation in your n8n workflows with PowerAI
  button_primary:
    enable: true
    label: "Connect"
    link: "/contact"
---

## Overview

The Python integration provides a powerful SDK for integrating AI-powered image generation into your Python applications. From data science projects to web backends, generate stunning visuals with a clean, Pythonic API.

## Key Features

- **Simple API**: Intuitive, Python-friendly interface
- **Async Support**: Full async/await support for high-performance applications
- **Type Hints**: Complete type annotations for better IDE support
- **Data Integration**: Seamless integration with NumPy, Pandas, and Matplotlib
- **Batch Processing**: Efficiently generate multiple images in parallel

## How It Works

1. **Install the Package**: `pip install powerai-sdk`
2. **Initialize the Client**: Set up with your API credentials
3. **Generate Images**: Use the API to create images from prompts
4. **Process Results**: Handle images as URLs, bytes, or PIL objects
5. **Scale Up**: Use batch generation for large-scale projects

## Use Cases

- **Data Science**: Generate visualizations and illustrations for reports
- **Web Applications**: Create dynamic images for Django, Flask, FastAPI
- **Machine Learning**: Generate training data and augment datasets
- **Automation Scripts**: Create images for automated reports and dashboards
- **Research**: Generate diagrams and figures for academic papers

## Setup Instructions

To set up the Python integration:

```bash
pip install powerai-sdk
```

```python
import powerai

client = powerai.Client(api_key='your-api-key')

def generate_image():
    result = client.images.generate(
        prompt='A serene mountain landscape at sunrise',
        width=1920,
        height=1080,
        format='png'
    )

    print(result.url)
    # Or save directly
    result.save('output.png')
```

## Technical Details

- **SDK Version**: v2.3.0
- **Python Support**: 3.8, 3.9, 3.10, 3.11, 3.12
- **Dependencies**: requests, aiohttp, Pillow (optional)
- **Package Size**: 150KB installed
- **License**: MIT

## Advanced Features

### Async Generation

```python
import asyncio
import powerai

async def generate_async():
    client = powerai.AsyncClient(api_key='your-api-key')
    result = await client.images.generate(
        prompt='A futuristic cityscape',
        width=1920,
        height=1080
    )
    return result

asyncio.run(generate_async())
```

### Batch Generation

```python
results = client.images.generate_batch([
    {'prompt': 'Image 1 description'},
    {'prompt': 'Image 2 description'},
    {'prompt': 'Image 3 description'}
])
```

### Custom Models

```python
result = client.images.generate(
    prompt='Your prompt',
    model='powerai-xl-v2',
    style='photorealistic',
    quality='high'
)
```

### Integration with NumPy

```python
import numpy as np
from powerai import Client

client = Client(api_key='your-api-key')

# Generate from data
data = np.random.rand(10, 10)
prompt = f'Visualize this data: {data.tolist()}'
result = client.images.generate(prompt=prompt)
```

## Pricing

Python SDK is free to use. Pay only for API calls. Pricing starts at $0.01 per image with volume discounts for high-usage applications. Academic and research discounts available.
