---
layout: ../../layouts/post.astro
title: "Under the Hood of SSH AI Chat: How It Works"
description: How I built a terminal AI chat app over SSH using Node.js, React Ink, GitHub SSH key auth, and the Vercel AI SDK.
dateFormatted: Aug 1, 2025
---

Hey everyone, I'm Miantiao. Today I want to walk you through a recent project of mine: **[SSH AI Chat](https://github.com/miantiao-me/ssh-ai-chat)**.

No client to install, no browser tabs open. Just one terminal command:

```bash
ssh username@chat.agi.li
```

Yes, that simple!

As someone with a soft spot for terminal user interfaces (TUIs), I have always thought chatting in a shell is inherently cool. I was originally blown away by `itter.sh`—reading a social network over SSH? It proved that SSH is not just for logging into VPS boxes; you can use it as a transport protocol for interactive terminal apps.

So I thought: what if you could chat with an AI over plain SSH? No apps to download, no browser tab, just type `ssh yourname@chat.agi.li` and you are talking to an LLM.

## Architecture

### Stack

- **SSH Server**: Node.js + `ssh2`
- **UI Framework**: React + Ink (terminal UI rendering)
- **Database**: PostgreSQL / PGLite
- **Cache**: Redis / ioredis-mock
- **AI Integration**: Vercel AI SDK

```txt
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SSH Client    │    │   SSH Server    │    │   React App     │
│                 │    │                 │    │                 │
│  ssh username@  │───▶│  Node.js +      │───▶│  Ink UI +       │
│  chat.agi.li    │    │  ssh2           │    │  React Hooks    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐
                       │   AI Services   │
                       │                 │
                       │  OpenAI API     │
                       │  Gemini API     │
                       │  DeepSeek API   │
                       └─────────────────┘
```

## Core Modules

### 1. SSH Server

The server handles incoming connections and SSH handshakes. It manages key exchange, queries public keys, verifies user identities, and enforces connection concurrency and rate limits.

### 2. GitHub Public Key Authentication

The neatest part of the auth design is using GitHub public keys. Users do not need to register an account or manage passwords; the server verifies your incoming SSH key against your public GitHub profile (`https://github.com/{username}.keys`). Keys are cached for 6 hours, keeping logins fast while respecting GitHub API rate limits.

### 3. Terminal UI with React and Ink

Ink lets you render React components directly into terminal escape sequences. Thinking in terms of React state and hooks—but outputting ANSI sequences to a terminal window instead of DOM nodes in a browser—feels surprisingly natural.

It handles:
- Multi-language UI
- Real-time message streaming
- Conversation history navigation
- Responsive terminal sizing

### 4. Chat Engine

The chat layer uses the Vercel AI SDK. When you hit Enter in the terminal, the system pulls conversation context, picks the target model, streams the response in real time, and persists the message history.

## Technical Hurdles and Solutions

### 1. Terminal Rendering Constraints

Building a smooth UI inside terminal emulators is tricky. Ink renders React components onto a virtual pseudo-terminal (PTY) to properly process terminal I/O. Parsing markdown responses (bold, italics, code blocks) is offloaded to a worker process so the main terminal thread stays responsive.

### 2. Session Isolation

Each incoming SSH connection gets its own isolated React application instance. Global state is managed via React Context, with full cleanup listeners on socket disconnects to prevent memory leaks.

### 3. Streaming Without Melting the Terminal

AI models stream responses token by token. Re-rendering the terminal on every single chunk instantly overwhelms terminal emulators and causes ugly flickering. By throttling terminal re-renders to once every 300 ms, the stream looks smooth without pegging the CPU.

### 4. Storage Flexibility

The project supports both PostgreSQL and embedded PGLite, as well as Redis and in-memory caching. You can run it locally as a self-contained binary or deploy it as a scaled multi-tenant service in production.

## Fun Design Details

- **Zero-Registration Auth**: Log in instantly using your existing GitHub SSH key.
- **Multiple Models**: Switch between DeepSeek-V3, DeepSeek-R1, Gemini 2.5 Flash, and Gemini 2.5 Pro, including expandable reasoning chains.
- **Automatic Language Detection**: Detects your preferred language from your client `$LANG` environment variable.
- **Keyboard Shortcuts**:
  - `Ctrl+C`: Quit
  - `N`: New chat
  - `I`: Focus input box
  - `?`: Show help overlay

## What I Learned

This project showed me just how much potential modern terminal applications have. SSH is not just an admin tool—it is an incredible platform for zero-install, cross-platform apps. Combining traditional protocols like SSH with modern frontend tooling like React and the Vercel AI SDK made for a really satisfying project.

## Try It Out

- **Run in terminal**: `ssh your-github-username@chat.agi.li`
- **GitHub**: [https://github.com/miantiao-me/ssh-ai-chat](https://github.com/miantiao-me/ssh-ai-chat)
