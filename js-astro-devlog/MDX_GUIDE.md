# 📚 Complete MDX & Content Authoring Guide

This guide covers everything you need to write engaging, rich technical articles using MDX in **DEV.LOG**.

---

## 📑 Table of Contents
1. [Creating an Article](#1-creating-an-article)
2. [Frontmatter Fields](#2-frontmatter-fields)
3. [MDX Components](#3-mdx-components)
   - [`<Callout />`](#component-1-callout)
   - [`<ArchitecturePanel />`](#component-2-architecturepanel)
   - [`<SpeechBubble />`](#component-3-speechbubble)
   - [`<CharacterAside />`](#component-4-characteraside)
4. [Code Blocks & Highlighting](#4-code-blocks--highlighting)
5. [Adding Images](#5-adding-images)

---

## 1. Creating an Article

Create a new file in `src/content/blog/` with a `.mdx` or `.md` extension.

Example: `src/content/blog/05-understanding-edge-rendering.mdx`

---

## 2. Frontmatter Fields

Every article starts with a YAML frontmatter block:

```yaml
---
title: "Understanding Edge Rendering & Dynamic Islands"
description: "A comprehensive deep dive into sub-millisecond edge compute and caching strategies."
pubDate: 2026-09-20
category: "Architecture" # 'Tech' | 'Design' | 'Architecture' | 'Story' | 'Culture'
tags: ["Astro", "Edge", "Performance", "Cloud"]
heroImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80"
heroImageAlt: "Edge server network visualization"
issueNumber: "Vol. 05" # Optional magazine issue badge
featured: false # Set to true to highlight this article on the homepage
---
```

---

## 3. MDX Components

Import the components at the top of your `.mdx` file:

```mdx
import Callout from '../../components/mdx/Callout.astro';
import ArchitecturePanel from '../../components/mdx/ArchitecturePanel.astro';
import SpeechBubble from '../../components/mdx/SpeechBubble.astro';
import CharacterAside from '../../components/mdx/CharacterAside.astro';
```

---

### Component 1: `<Callout />`

Used to draw attention to tips, warnings, techniques, and secret insights.

#### Props:
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `type` | `'tip'` \| `'warning'` \| `'secret'` \| `'technique'` | `'tip'` | Color & icon theme |
| `title` | `string` | `undefined` | Header title |
| `badge` | `string` | Depends on type | Custom pill badge text |

#### Examples:

```mdx
<Callout type="tip" title="Static Site Generation">
  Astro pre-renders pages into pure static HTML during build time, resulting in instant response times worldwide.
</Callout>

<Callout type="technique" title="Zero Runtime Hydration">
  Use `client:visible` to only hydrate components when they scroll into the viewport.
</Callout>

<Callout type="warning" title="Watch Out For Layout Shifts">
  Always specify explicit `width` and `height` dimensions or aspect ratio placeholders on image tags.
</Callout>

<Callout type="secret" title="Compiler Optimization" badge="DEEP DIVE">
  By compiling JSX to lightweight static template literals at build time, hydration runtimes are completely avoided.
</Callout>
```

---

### Component 2: `<ArchitecturePanel />`

Used to create side-by-side technical comparison grids, architectural diagrams, or multi-column feature breakdowns.

#### Props:
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `1` \| `2` \| `3` | `2` | Number of columns on desktop |
| `title` | `string` | `'Architecture Matrix'` | Panel title |
| `caption` | `string` | `undefined` | Monospace footer caption |
| `badge` | `string` | `'ARCHITECTURE PANEL'` | Tag displayed on the top right |

#### Examples:

```mdx
<ArchitecturePanel columns={2} title="Client-Side Rendering vs Islands Architecture" caption="Runtime Evaluation Comparison">
  <div class="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
    <h5 class="text-sm font-bold text-rose-600 dark:text-rose-400 mb-2">❌ Monolithic SPA</h5>
    <ul class="text-xs space-y-1.5 text-zinc-700 dark:text-zinc-300">
      <li>• Massive JavaScript bundle sizes</li>
      <li>• Slower Time to Interactive (TTI)</li>
      <li>• Hydration waterfall delays</li>
    </ul>
  </div>

  <div class="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
    <h5 class="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2">⚡ Astro Islands</h5>
    <ul class="text-xs space-y-1.5 text-zinc-700 dark:text-zinc-300">
      <li>• 0KB client JS baseline</li>
      <li>• Sub-50ms First Contentful Paint</li>
      <li>• Isolated island hydration</li>
    </ul>
  </div>
</ArchitecturePanel>
```

---

### Component 3: `<SpeechBubble />`

Used for dialogue, quotes, multi-persona debates, or conversational discussions.

#### Props:
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `speaker` | `string` | `'Alex Rivera'` | Name of the person |
| `role` | `string` | `undefined` | Subtitle or job title |
| `avatar` | `string` | `'⚡'` | Emoji character OR image URL / local path |
| `side` | `'left'` \| `'right'` | `'left'` | Avatar alignment |
| `variant` | `'normal'` \| `'shout'` \| `'thought'` | `'normal'` | Visual bubble style |

#### Examples:

```mdx
<SpeechBubble speaker="Elena Rostova" role="Principal Architect" avatar="🚀" side="left">
  "How do we handle real-time search without introducing heavy client-side search libraries?"
</SpeechBubble>

<SpeechBubble speaker="Alex Morgan" role="Software Engineer" avatar="⚡" side="right" variant="shout">
  "Pagefind compiles static indexes at build time! The client search library is only 8KB."
</SpeechBubble>

<SpeechBubble speaker="Marcus Vance" role="Security Engineer" avatar="🔒" side="left" variant="thought">
  "Thinking about edge validation and token integrity..."
</SpeechBubble>
```

---

### Component 4: `<CharacterAside />`

Used for author commentary, tips, and personal remarks.

#### Props:
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `'Architecture Note'` | Heading label |
| `role` | `string` | `'Lead Engineer'` | Subtitle |
| `avatar` | `string` | `'⚡'` | Emoji or image path |

#### Example:

```mdx
<CharacterAside name="Alex Morgan" role="Author" avatar="/images/avatar.jpg">
  "When designing animations, always prefer `cubic-bezier(0.16, 1, 0.3, 1)` for fluid, natural spring dynamics."
</CharacterAside>
```

---

## 4. Code Blocks & Highlighting

Powered by **Astro Expressive Code**:

### File Name & Language
````markdown
```typescript title="src/services/api.ts"
export async function fetchData(endpoint: string) {
  const res = await fetch(endpoint);
  return res.json();
}
```
````

### Diff Blocks (Additions / Deletions)
````markdown
```typescript title="src/auth.ts" ins={4} del={2}
// Old insecure method:
const token = localStorage.getItem('token');
// Secure HTTP-only cookie approach:
const token = Astro.cookies.get('session')?.value;
```
````

---

## 5. Adding Images

You can use standard Markdown image syntax or HTML:

```markdown
![System Architecture Diagram](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80)
```

For local images, place them in `public/images/` and reference them with `/images/filename.jpg`:

```markdown
![My Diagram](/images/my-diagram.png)
```
