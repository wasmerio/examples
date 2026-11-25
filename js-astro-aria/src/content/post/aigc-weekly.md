---
layout: ../../layouts/post.astro
title: Building a Fully Automated AI Weekly with AI Agents
description: How I built AIGC Weekly using Claude agents, Next.js 15, and Cloudflare to collect, curate, write, and publish AI news on autopilot.
dateFormatted: Dec 13, 2025
---

I recently put together a fun project called **[AIGC Weekly](https://aigc-weekly.agi.li)**. Beyond curating weekly highlights in generative AI, it is an experiment in building with **Agentic AI**.

Here is why I built it and how a team of AI agents keeps it running on autopilot.

![AIGC Weekly](https://aigc-weekly.agi.li/opengraph-image.png)

## Why Build AIGC Weekly?

Like many developers, I feel buried under the daily flood of AI updates:

- Endless new repositories launching on GitHub every morning
- Constant debates and announcements on Twitter/X and Hacker News
- Engineering blogs publishing faster than anyone can read

> **Information overload** is real, especially in AI where things move by the hour. I wanted a way to cut through the noise and pull out the signals that actually matter.

Curating that by hand every single week gets old fast.

Since we already have powerful LLMs like Claude, why not let AI take the editor seat? That is how **AIGC Weekly** started.

The goal is simple: **fully automated, high quality, zero human intervention.**

## How It Works

AIGC Weekly is more than a website; it is an **autonomous publishing pipeline**. Every Sunday at 8:00 AM, while most people are still asleep, the agents go to work:

1. **Research (Automated Collection)**: The agent pulls fresh updates from 15+ sources, including Hacker News, technical AI blogs, and curated Telegram channels.
2. **Curate (Intelligent Filtering)**: Acting like a picky editor-in-chief, the agent evaluates items against criteria like GitHub star velocity, community discussion, and practical value.
3. **Write (Content Generation)**: The writing agent takes the selected highlights, writes clear headlines and summaries, and structures the full weekly issue.
4. **Publish (Automated Deployment)**: The agent talks directly to the CMS over MCP (Model Context Protocol) to publish the post and update the RSS feed.

The whole sequence runs quietly inside Cloudflare containers.

## Tech Stack: Serverless + AI Agent

I also wanted to use this project to try out a modern Web + AI stack:

| Component | Technology |
| --- | --- |
| Frontend | Next.js 15 (App Router) + OpenNext |
| CMS | Payload CMS 3.0 |
| Infrastructure | Cloudflare D1 / R2 / Containers |
| AI Core | Anthropic Claude Agent SDK |
| Web Scraping | Firecrawl |

The biggest win here is going completely **serverless**. There are no servers to baby, everything scales on demand, and operating costs are negligible.

## Check It Out

If you are curious about **AI agent workflows**, **Next.js in production**, or **serverless setups**, take a look:

- **Live Site**: [https://aigc-weekly.agi.li/](https://aigc-weekly.agi.li/)
- **GitHub**: [https://github.com/miantiao-me/aigc-weekly](https://github.com/miantiao-me/aigc-weekly)

Hope to see you around in this little AI-run corner of the web.
