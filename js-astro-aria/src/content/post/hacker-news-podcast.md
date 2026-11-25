---
layout: ../../layouts/post.astro
title: Listening to Hacker News as a Podcast
description: Using AI and Cloudflare to turn daily Hacker News top stories into a podcast you can subscribe to in any podcast app.
dateFormatted: Mar 3, 2025
---

Hacker News has always been my go-to for interesting tech finds and community discussions. I used to spend about half an hour scrolling through it every single day.

Over the Spring Festival break, DeepSeek was everywhere, so I tried wiring up a Cloudflare Workflow to generate daily recaps. But the outputs were too brief and the API kept timing out. Then I tested GPT-4-class models, and the results still didn't feel right, so I put the project on ice for a bit.

When Gemini 2.0 dropped, I gave it another shot. The generated write-ups were noticeably better. So I threw together a web UI and hooked up an RSS feed. Now I can catch up on Hacker News on my commute using any generic podcast app.

- **Live Demo**: [https://hacker-news.agi.li](https://hacker-news.agi.li)
- **RSS Feed**: [https://hacker-news.agi.li/rss.xml](https://hacker-news.agi.li/rss.xml)
- **GitHub**: [https://github.com/miantiao-me/hacker-news](https://github.com/miantiao-me/hacker-news)

[![Hacker News Podcast Preview](https://github.html.zone/miantiao-me/hacker-news)](https://github.com/miantiao-me/hacker-news)

## Features

- Scrapes top Hacker News posts automatically each day
- Uses AI to summarize both the articles and top comment threads
- Generates speech audio with Edge TTS
- Works in the browser and in standard podcast players
- Runs on a daily cron with zero manual upkeep
- Includes both brief summaries and the full spoken script

## Tech Stack

- **Next.js**: Web app framework
- **Cloudflare Workers**: Runtime and hosting
- **Edge TTS**: Voice synthesis
- **OpenAI-compatible API**: Text generation (Gemini 2.0)
- **Tailwind CSS + shadcn/ui**: Frontend styling

## How It Works

1. **Daily Fetch**: Grabs the top-voted Hacker News posts each morning.
2. **AI Summarization**: Gemini 2.0 translates and condenses key insights and discussion highlights into a spoken script.
3. **Audio Generation**: Edge TTS converts the script into an audio file.
4. **Storage**: Content and audio assets are saved to Cloudflare R2 and KV.
5. **Distribution**: Serves the episodes over an RSS feed and a web player.

## Future Plans

Right now it uses Edge TTS with a single female voice. Ideally, a two-host conversational format (alternating male and female voices) would sound much more engaging. Doubao's TTS voices sound fantastic, but they require a paid subscription. When I get more free time, I will look into improving the audio side.

## Recommendation: Cloudflare Workflows

Finally, a quick shout-out to Cloudflare Workflows. It is an awesome, cost-effective platform for running background workflows.

![Cloudflare Workflow](https://static.miantiao.me/share/2025/0ZROOg/postspark_export_2025-03-22_21-39-43.webp)
