<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [AI Chat Bot](https://github.com/Marve10s/Astro-Vercel-SDK-AI-Chatbot) Astro theme by Marve10s, copied from commit `14f60225e3625af4ed40fa9c3eaa1a3b7d3369d3` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-vercel-sdk-ai-chatbot.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** The theme's example env file lists `AI_PROVIDER`, `AI_MODEL`, `AI_TEMPERATURE`, `AI_MAX_TOKENS`, `AI_BASE_URL`, `AI_API_KEY`, `AI_PROJECT_ID`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `MISTRAL_API_KEY`, `FIREWORKS_API_KEY`, `COHERE_API_KEY`, `TOGETHER_API_KEY`, `PERPLEXITY_API_KEY`, `DEEPSEEK_API_KEY`, `OPENROUTER_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_CONVEX_URL`, `PUBLIC_CONVEX_URL`, `CONVEX_URL`, `CONVEX_DEPLOYMENT`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [Marve10s](https://github.com/Marve10s), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# 🚀 [Astro AI Chatbot Template - Vercel SDK Edition](https://template-astro-vercel-sdk-ai-chatbo.vercel.app/)

<div align="center">

<img src="https://github.com/user-attachments/assets/7191280a-c335-415e-a74c-307e9174ce84"
     alt="Astro Template"
     width="1920" height="1080"
     style="display:block; margin-bottom:20px;" />

![Astro](https://astro.build/assets/press/astro-icon-light-gradient.svg)

[![Available at](https://img.shields.io/badge/Available%20at-Astro%20Themes-purple?style=for-the-badge&link=https://astro.build/themes/)](https://portal.astro.build/themes/ai-chat-bot/) 

[![Astro](https://img.shields.io/badge/Astro-0C1222?style=for-the-badge&logo=astro&logoColor=FDFDFE)](https://astro.build) [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com) [![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://sdk.vercel.ai) [![Prompt Kit](https://img.shields.io/badge/Prompt%20Kit-FF6B6B?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0ZGNjI2QiIvPgo8cGF0aCBkPSJNMTIgN2w0IDQgNCA0djEwYzAtNC40LTMuNi0zLjYtMy42LTMuNnoiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTEyIDE3bC00LTRsNC00djhoIiBmaWxsPSIjMDAwMDAwIi8+Cjwvc3ZnPgo=)](https://prompt-kit.dev)

</div>

## 🌟 Overview

Astro AI Chatbot Template is a modern, production-ready template for building AI-powered chat interfaces. Built with Astro, React, and the Vercel AI SDK, it provides a beautiful, responsive UI with mock implementations that you can easily replace with real AI providers.

Perfect for developers who want to quickly bootstrap AI chat applications with multiple provider support, conversation history, file uploads, and a polished user experience.

## 🚀 Quick Start

1. **Clone and Install**

   ```bash
   git clone https://github.com/Marve10s/Astro-Vercel-SDK-AI-Chatbot.git
   cd Astro-Vercel-SDK-AI-Chatbot
   pnpm install
   ```

   **Or Fork and Install**

   1.1 Click the 'Fork' button in the top right corner of this repository

   1.2 Clone your forked repository

   ```bash
   git clone https://github.com/YOUR_USERNAME/Astro-Vercel-SDK-AI-Chatbot.git
   cd Astro-Vercel-SDK-AI-Chatbot && pnpm install
   ```

2. **Development**

   ```bash
   pnpm dev
   ```

3. **Configure Environment**

   ```bash
   cp .env.example .env.local
   ```

   Add your API keys for the providers you want to use:
   - OpenAI (`OPENAI_API_KEY`)
   - Anthropic (`ANTHROPIC_API_KEY`)
   - Google Gemini (`GOOGLE_GENERATIVE_AI_API_KEY`)
   - Groq (`GROQ_API_KEY`)

4. **Build**

   ```bash
   pnpm build
   pnpm preview
   ```

## ⭐ Features

- 🤖 **Multiple AI Providers** - OpenAI, Anthropic, Google Gemini, Groq
- 💬 **Real-time Streaming** - Token-by-token response streaming
- 📁 **File Uploads** - Support for image attachments
- 🌙 **Dark/Light Mode** - Built-in theme switching
- 💾 **Conversation History** - Persistent chat sessions
- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS
- ⚡ **Fast Performance** - Astro's static generation + React islands
- 🔧 **TypeScript** - Full type safety
- 🧩 **Modular Components** - Easy to customize and extend

## 📁 Project Structure

```plaintext
/
├── public/              # Static assets
├── src/
│   ├── components/
│   │   ├── Chatbot.tsx          # Main chat interface
│   │   ├── ThemeToggle.tsx      # Theme switcher
│   │   ├── prompt-kit/          # UI primitives
│   │   │   ├── chat-container.tsx
│   │   │   ├── message.tsx
│   │   │   ├── prompt-input.tsx
│   │   │   └── ...
│   │   └── ui/                  # Shared UI components
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   ├── mocks/                   # Mock implementations
│   │   ├── ai-vercel-sdk.ts     # AI provider mocks
│   │   └── supabase.ts          # Database mocks
│   ├── pages/
│   │   └── index.astro          # Main page
│   └── styles/
│       └── global.css           # Global styles + Tailwind
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind configuration
└── package.json
```

## 📊 Performance

<div>

[![PageSpeed Desktop](https://img.shields.io/badge/PageSpeed%20Desktop-98-success?style=for-the-badge&logo=pagespeed-insights)](https://pagespeed.web.dev/)

| Metric            | Score   |
| ----------------- | ------- |
| 🚀 Performance    | 98/100  |
| ♿ Accessibility  | 96/100  |
| 🏗️ Best Practices | 100/100 |
| 🔍 SEO            | 100/100 |

</div>

## 🛠️ Customization

### AI Providers

Add support for new AI providers by extending the mock implementations in `src/mocks/ai-vercel-sdk.ts`:

```typescript
export type Provider = "openai" | "anthropic" | "google" | "groq" | "your-provider";
```

### UI Components

- Modify `src/components/prompt-kit/` for core UI changes
- Add custom components in `src/components/`
- Customize themes in `src/styles/global.css`

### Backend Integration

Replace mock functions with real API calls:

```typescript
// Replace this in Chatbot.tsx
import { generateChat } from "@/mocks/ai-vercel-sdk";

// With your real implementation
import { generateChat } from "@/lib/ai-service";
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The template works with any static hosting service. For API routes, use:

```typescript
// src/pages/api/chat.ts
export const config = { runtime: "edge" };

export async function POST({ request }) {
  // Your AI logic here
}
```

## 🎨 Share Your Creation

Have you built something amazing with this template? I'd love to see it!

- Create a [GitHub issue](https://github.com/yourusername/astro-ai-chatbot-template/issues) with screenshots
- Share your demo link and modifications

### 🌟 Community Showcases

Check out these amazing implementations by our community:

*[Your project here - be the first to showcase!]*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ using [Astro](https://astro.build) and [Vercel AI SDK](https://sdk.vercel.ai)

</div>
