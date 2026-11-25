---
title: 📈 Communicate your results effectively with the best data visualizations
summary: Use popular tools such as HuggingFace, Plotly, Mermaid, and data frames.
date: 2023-10-25
authors:
  - me
tags:
  - Hugo
  - Hugo Blox
  - Markdown
cover:
  image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2560"
  position:
    x: 50
    y: 40
  overlay:
    enabled: true
    type: "gradient"
    opacity: 0.4
    gradient: "bottom"
  fade:
    enabled: true
    height: "80px"
  icon:
    name: "✨"
image:
  caption: 'Image credit: [**Unsplash**](https://unsplash.com)'
---


Hugo Blox is designed to give technical content creators a seamless experience. You can focus on the content and Hugo Blox handles the rest.

Use popular tools such as Plotly, Mermaid, and data frames.

## Embed Rich Content

HuggingFace Model

{{< embed platform="huggingface" resource="google/embeddinggemma-300m" type="model" >}}

HuggingFace Dataset

{{< embed platform="huggingface" resource="fka/awesome-chatgpt-prompts" type="dataset" >}}

GitHub Repository

{{< embed platform="github" resource="HugoBlox/kit" type="repo" >}}

Custom embed with manual data

{{< embed url="https://example.com" title="My Custom Resource" description="A great resource for learning" >}}

### Custom Images

Embed beautiful images from any source with Hugo image processing (Unsplash, custom URLs, etc.):

{{< embed url="https://example.com" title="Data Visualization Guide" description="Beautiful data visualization workspace" image="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&h=600&auto=format&fit=crop" width="800" height="600" quality="90" >}}

You can also add images to any platform embed:

{{< embed platform="github" resource="plotly/plotly.py" type="repo" image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&auto=format&fit=crop" width="600" height="400" >}}

## Charts

Hugo Blox supports the popular [Plotly](https://plot.ly/) format for interactive data visualizations. With Plotly, you can design almost any kind of visualization you can imagine!

Save your Plotly JSON in your page folder, for example `line-chart.json`, and then add the `{{</* chart data="line-chart" */>}}` shortcode where you would like the chart to appear.

