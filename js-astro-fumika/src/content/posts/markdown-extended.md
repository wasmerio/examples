---

title: Markdown Extended Features
published: 2024-05-01
updated: 2026-09-09
description: 'Read more about Markdown features in Fumika'
image: ''
tags: [Demo, Example, Markdown, Fumika]
category: 'Examples'
draft: false
---

## GitHub Repository Cards

You can add dynamic cards that link to GitHub repositories, on page load, the repository information is pulled from the GitHub API.

::github{repo="Fabrizz/MMM-OnSpotify"}

Create a GitHub repository card with the code `::github{repo="<owner>/<repo>"}`.

```markdown
::github{repo="iyanarmanda/fumika"}
```

## Admonitions

Following types of admonitions are supported: `note` `tip` `important` `warning` `caution`

:::note
Highlights information that users should take into account, even when skimming.
:::

:::tip
Optional information to help a user be more successful.
:::

:::important
Crucial information necessary for users to succeed.
:::

:::warning
Critical content demanding immediate user attention due to potential risks.
:::

:::caution
Negative potential consequences of an action.
:::

### Basic Syntax

```markdown
:::note
Highlights information that users should take into account, even when skimming.
:::

:::tip
Optional information to help a user be more successful.
:::
```

### Custom Titles

The title of the admonition can be customized.

:::note[MY CUSTOM TITLE]
This is a note with a custom title.
:::

```markdown
:::note[MY CUSTOM TITLE]
This is a note with a custom title.
:::
```

### GitHub Syntax

> [!TIP]
> [The GitHub syntax](https://github.com/orgs/community/discussions/16925) is also supported.

```
> [!NOTE]
> The GitHub syntax is also supported.

> [!TIP]
> The GitHub syntax is also supported.
```

### Spoiler

You can add spoilers to your text. The text also supports **Markdown** syntax.

The content :spoiler[is hidden **ayyy**]!

```markdown
The content :spoiler[is hidden **ayyy**]!
```

## Typography Features

:::warning
These feature below not supported in **Frontmatter Post** and **TOC**
:::

### Ruby Text

Add small characters above the text. For example:
- Welcome to {Tokyo}^(とうきょう)!
- {[漢][字]}^([かん][じ]) are Japanese characters.
- He is a {rookie}^(beginner) in this baseball team.

```markdown
Welcome to {Tokyo}^(とうきょう)!

{[漢][字]}^([かん][じ]) are Japanese characters.

He is a {rookie}^(beginner) in this baseball team.
```

### Text Direction

Controlling text direction (RTL/LTR) within your content.

#### Inline Usage:

This is an English sentence containing an inline Persian phrase: :rtl[سلام دنیا] in the middle of a text.

---

:::rtl
این یک متن فارسی است که یک عبارت انگلیسی :ltr[Hello World] در وسط آن قرار دارد
:::

```markdown
This is an English sentence containing an inline Persian phrase: :rtl[سلام دنیا] in the middle of a text.

این یک متن فارسی است که یک عبارت انگلیسی :ltr[Hello World] در وسط آن قرار دارد
```

#### Single-Line Block Usage:

::rtl[این یک خط متن کامل به زبان فارسی است.]

---

::ltr[This is a full single-line sentence explicitly rendered as LTR.]

```markdown
::rtl[این یک خط متن کامل به زبان فارسی است.]

::ltr[This is a full single-line sentence explicitly rendered as LTR.]
```

#### Container Block Usage:

:::rtl
**عنوان فارسی**

این یک بلوک کامل شامل چند پاراگراف به زبان فارسی است.
- آیتم اول
- آیتم دوم
  :::

---

:::ltr
**English Sub-section**

This whole block is explicitly forced to be LTR inside an RTL document.
:::

```markdown
:::rtl
**عنوان فارسی**

این یک بلوک کامل شامل چند پاراگراف به زبان فارسی است.
- آیتم اول
- آیتم دوم
  :::

:::ltr
**English Sub-section**

This whole block is explicitly forced to be LTR inside an RTL document.
:::
```
