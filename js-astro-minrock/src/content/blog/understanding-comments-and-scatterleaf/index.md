---
title: "Understanding Comments & ScatterLeaf: Architecture, Personas & Digital Sovereignty"
description: "A clear, visual guide to how comments work in Minrock: separating the 3 personas, the car vs. engine analogy, and zero-setup configuration."
pubDate: 2026-09-17
tags: ["minrock", "scatterleaf", "architecture", "guide", "comments", "web-components"]
draft: false
---

One of the most common questions when building a modern static blog is: **"How do comments work without a heavy database, invasive trackers, or slow iframes?"**

When integrating **ScatterLeaf** into **Minrock**, we designed an architecture that balances three critical pillars: **zero friction for the reader**, **minimal setup for the blog owner**, and **100% self-hosted digital sovereignty for infrastructure purists**.

If you've ever wondered whether you need to deploy a Cloudflare Worker, configure tokens, or what happens when you turn comments on or off, this guide will make everything crystal clear.

---

## 🚗 The Analogy: The Car vs. The Engine

The easiest way to understand the relationship between Minrock and ScatterLeaf is through the automotive analogy:

```
┌────────────────────────────────────────────────────────┐
│                      MINROCK (The Car)                 │
│  Sleek chassis, calibrated typography, Obsidian vault  │
│  ready to drive. You just turn the key and go!         │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │           SCATTERLEAF (The Engine)             │   │
│   │  Web Component + Serverless Edge Broker        │   │
│   │  Mediates with GitHub Discussions securely.    │   │
│   └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

* **Minrock is the Car:** Anyone who downloads this theme wants a beautiful, lightning-fast static blog. You don't need to understand mechanics or rebuild the transmission just to drive it.
* **ScatterLeaf is the Engine:** It is an open-source, modular Web Component library with a companion serverless broker. It ships with the blueprint of how the engine was built for developers who want to inspect or modify it, but you don't need to rebuild it to use it.

---

## 🎭 The 3 Personas: Who Does What?

To eliminate all confusion, let's distinguish the **three distinct roles** involved in the ecosystem:

| Role | Who are they? | Setup Required? | What do they actually do? |
| :--- | :--- | :---: | :--- |
| **1. The Reader** | Casual site visitor | **Zero** | Clicks *"Sign in with GitHub"*, authorizes OAuth, and writes Markdown notes. |
| **2. The Blog Creator** | Anyone using Minrock | **10 seconds** | Enables Discussions on GitHub and sets `repo` in `site.ts`. Needs no worker. |
| **3. The Self-Hoster** | Sovereignty / privacy purist | **Optional** | Deploys their own Cloudflare Worker using ScatterLeaf's open-source template. |

### 1. The Reader (Site Visitor)
* **What they do:** They visit your article, read your thoughts, and want to leave feedback.
* **What they configure:** **Absolutely nothing technical.** They click the green **"Sign in with GitHub"** button, authorize the secure OAuth popup (standard GitHub consent, just like logging into any modern web app), and submit their comment.

### 2. The Blog Creator (Anyone who uses Minrock)
* **What they do:** They clone the Minrock template to create their personal blog or portfolio.
* **Do they need to create a Cloudflare Worker?** **No!**
* **Do they need to generate personal access tokens?** **No!**
* **How do they configure comments?** In literally **10 seconds**:
  1. Go to their blog repository on GitHub and turn on **Discussions** (one checkbox under *Settings ➔ Features*).
  2. Open `src/config/site.ts` in Minrock and update the repository name:
     ```typescript
     comments: {
       enabled: true,
       provider: 'scatterleaf',
       repo: 'their-username/their-blog-repo', // <--- THAT'S IT!
       category: 'General'
     }
     ```
  They can simply use the public multi-tenant ScatterLeaf broker that is already operational on the edge!

### 3. The Infrastructure Architect (Self-Hosters & Purists)
* **What they do:** They are developers or privacy purists who want **100% control over their entire pipeline**, refusing to route even anonymous requests through third-party infrastructure.
* **What we provide:** In the [`scatterleaf/worker/`](https://github.com/rnt-rez/scatterleaf) repository, we provide the complete open-source Cloudflare Worker code and a 3-minute deployment guide (`npm run worker:deploy`).
* **Summary:** Self-hosting the broker is an **empowering option**, not an entry barrier!

---

## 🏗️ Architecture & Data Flow

Here is how data flows from your blog to the GitHub Discussions database without ever exposing private secrets:

```
[ Reader Browser ]
       │
       ▼  (Renders natively via Shadow DOM)
<scatter-leaf> Web Component
       │
       ├── Public GraphQL Queries (Anonymous reading)
       │         │
       ▼         ▼
[ Cloudflare Edge Broker ] ── (Cached global responses / Rate-limit protection)
       │
       ▼  (OAuth authorization code exchange)
[ GitHub Discussions API ] ── (Permanent, free, transparent discussion storage)
```

---

## 🎛️ The 3 Operational Modes in Minrock

Minrock gives you three distinct operational choices in [`src/config/site.ts`](file:///src/config/site.ts):

| Mode | Configuration | What Visitors Experience |
| :--- | :--- | :--- |
| **1. Live Production** | `enabled: true`<br>`broker: 'https://...'`<br>`clientId: '...'` | Full real-time synchronization with GitHub Discussions. Readers can log in, post, reply, and react live. |
| **2. Demo / Showcase** | `enabled: true`<br>`broker: ''`<br>`clientId: ''` | **Interactive playground!** Renders realistic simulated comments with audio TTS, translation, and reactions. Visitors can test all features in browser memory without posting spam to your GitHub. |
| **3. Completely Disabled** | `enabled: false` | **Zero overhead.** The Astro static compiler completely removes all comment markup and scripts. **0 bytes of JS, 0 network requests.** |

---

## 🕊️ Total Sovereignty: Zero Vendor Lock-in

At the core of Minrock's design is our commitment to **digital sovereignty**. You are never locked into our stack.

All comment logic is cleanly isolated inside a single component: [`src/components/Comments.astro`](src/components/Comments.astro).

* **Want to use any other comment provider?** Paste your script or custom widget into `Comments.astro`.
* **Prefer a minimalist guestbook or custom form?** Drop it in without friction.
* **Want zero comments forever?** Set `comments.enabled = false`.

No complex refactoring required. Your notes remain plain, portable Markdown; your architecture remains cleanly decoupled; and your digital space remains truly sovereign.
