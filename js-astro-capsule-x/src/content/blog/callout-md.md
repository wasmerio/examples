---
title: "Callout Syntax (MD)"
description: "Using GitHub-style blockquote syntax for callouts in Markdown files"
pubDate: 2026-07-04T12:00:00
tags: ["tutorial", "components"]
---

## Callout Syntax (MD)

This guide shows how to use GitHub-style alert syntax in Markdown (.md) files.

> **Note:** For MDX files, see [Callout Components (MDX)](/callout-mdx) which uses Astro components.

### Basic Usage

Use blockquotes with special syntax to create alerts.

#### Note

> [!NOTE]
> This is a **note** alert. It's perfect for supplementary information that readers might find helpful.

#### Tip

> [!TIP]
> This is a **tip** alert. It's great for sharing shortcuts or recommendations.

#### Important

> [!IMPORTANT]
> This is an **important** alert. Use it when readers need to pay special attention.

#### Warning

> [!WARNING]
> This is a **warning** alert. Use it when readers need to be careful about something.

#### Caution

> [!CAUTION]
> This is a **caution** alert. Use it to advise about risks or negative outcomes.

### Multi-line Alerts

Alerts can contain multiple paragraphs and other markdown content.

> [!NOTE]
> This is the first paragraph of the note. It provides some initial context or information.
>
> This is the second paragraph. Alerts can contain multiple paragraphs to provide more detailed explanations.
>
> You can also include **bold**, *italic*, and `code` formatting.

### Lists in Alerts

Alerts support lists and other markdown features.

> [!TIP]
> Here are some best practices:
>
> 1. Keep alerts concise and to the point
> 2. Use the appropriate type for the content
> 3. Don't overload alerts with too much information
>
> Or use unordered lists:
> - Feature one
> - Feature two
> - Feature three

### How to Use

Use this syntax in any Markdown file:

```markdown
> [!NOTE]
> Your content here.
```

### Available Types

| Type | Use Case |
|------|----------|
| `NOTE` | General information, side notes |
| `TIP` | Suggestions, best practices |
| `IMPORTANT` | Critical information |
| `WARNING` | Potential issues, important considerations |
| `CAUTION` | Risks, negative outcomes |

### MD vs MDX

| Feature | MD (.md) | MDX (.mdx) |
|---------|----------|------------|
| Syntax | `> [!NOTE]` | `<Callout type="note">` |
| Import required | No | Yes |
| Component customization | Limited | Full |
| Best for | Simple callouts | Complex layouts |
