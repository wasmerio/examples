---
layout: ../../layouts/post.astro
title: Leveling Up My Blog Typography with AI
description: Using AI prompts to rethink post layout and styling, turning plain markdown into well-crafted pages.
dateFormatted: Mar 23, 2025
---

When Claude 3.7 came out, I tried using it to generate UI mockups for an email app, and the output turned out surprisingly well.

Later that week on Twitter/X, I came across a few prompts shared by [Qiaomu](https://x.com/vista8/status/1901224129405338102) for generating landing pages, slide decks, 3D educational animations, and SVG posters. They looked really interesting.

### Tech Stack Update

Over the weekend, I upgraded my blog engine and rewrote the site with Astro, Tailwind CSS, and MDX. Because MDX gives you component-level flexibility, post pages can now render pretty much anything you throw at them.

I took Qiaomu's prompts, tweaked them to fit blog posts, and used them to style my articles. The result blew me away—no more stressing over post layout or formatting.

## Before and After

### [Hacker News Podcast](/post/hacker-news-podcast)

**Before:**

![Hacker News Before](https://static.miantiao.me/share/2025/wm70yi/hn-old.png)

**After:**

![Hacker News After](https://static.miantiao.me/share/2025/P9Rcfo/hn-new.png)

---

### [RSS Beauty](/post/rss-beauty)

**Before:**

![RSS Beauty Before](https://static.miantiao.me/share/2025/DWNmIh/rss-old.png)

**After:**

![RSS Beauty After](https://static.miantiao.me/share/2025/keIqtA/rss-new.png)

---

### [Sink](/post/sink)

**Before:**

![Sink Before](https://static.miantiao.me/share/2025/T2xVdS/sink-old.png)

**After:**

![Sink After](https://static.miantiao.me/share/2025/udluK7/sink-new.png)

---

### [URL Longer](/post/looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong)

**Before:**

![URL Longer Before](https://static.miantiao.me/share/2025/8KZoRB/long-old.png)

**After:**

![URL Longer After](https://static.miantiao.me/share/2025/rE7o6B/long-new.png)

---

## More Examples

- [Remove Image Background Locally in Browser with AI](/post/ai-remove-image-background)
- [BroadcastChannel - Turn Your Telegram Channel into a MicroBlog](/post/broadcast-channel)
- [DNS.Surf - Query Global DNS Resolution Results](/post/dns-surf)
- [TempMail.Best - The Best Disposable Temporary Email](/post/email-ml)

## The Prompt

Adapted from [Qiaomu's tweet](https://x.com/vista8/status/1901224129405338102):

```md
# 生成文章网页

你是一名专业的网页设计师和前端开发专家，对现代 Web 设计趋势和最佳实践有深入理解，尤其擅长创造具有极高审美价值的用户界面。你的设计作品不仅功能完备，而且在视觉上令人惊叹，能够给用户带来强烈的"Aha-moment"体验。

请根据最后提供的内容，设计一个**美观、现代、易读**的"中文"可视化网页。请充分发挥你的专业判断，选择最能体现内容精髓的设计风格、配色方案、排版和布局。

**设计目标：**

* **视觉吸引力：** 创造一个在视觉上令人印象深刻的网页，能够立即吸引用户的注意力，并激发他们的阅读兴趣。
* **可读性：** 确保内容清晰易读，无论在桌面端还是移动端，都能提供舒适的阅读体验。
* **信息传达：** 以一种既美观又高效的方式呈现信息，突出关键内容，引导用户理解核心思想。
* **情感共鸣:** 通过设计激发与内容主题相关的情感（例如，对于励志内容，激发积极向上的情绪；对于严肃内容，营造庄重、专业的氛围）。

**设计指导（请灵活运用，而非严格遵循）：**

* **整体风格：**
  * 可以考虑杂志风格、出版物风格，或者其他你认为合适的现代 Web 设计风格。
  * 配色参考 shadcn ui 的 Zinc 主题配色。
  * 目标是创造一个既有信息量，又有视觉吸引力的页面，就像一本精心设计的数字杂志或一篇深度报道。
* **Hero 模块（可选，但强烈建议）：**
  * 如果你认为合适，可以设计一个引人注目的 Hero 模块。
  * 它可以包含标题(h2)、副标题（p）、一段引人入胜的引言。
* **排版：**
  * 精心选择字体组合（衬线和无衬线），以提升中文阅读体验。
  * 利用不同的字号、字重、颜色和样式，创建清晰的视觉层次结构。
  * 可以考虑使用一些精致的排版细节（如首字下沉、悬挂标点）来提升整体质感。
  * Tabler icon 中有很多图标，选合适的点缀增加趣味性。 使用实例 `icon-[tabler--label]`
* **配色方案：**
  * 选择一套既和谐又具有视觉冲击力的配色方案。
  * 考虑使用高对比度的颜色组合来突出重要元素。
  * 可以探索渐变、阴影等效果来增加视觉深度。
* **布局：**
  * 使用基于网格的布局系统来组织页面元素。
  * 充分利用负空间（留白），创造视觉平衡和呼吸感。
  * 可以考虑使用卡片、分割线、图标等视觉元素来分隔和组织内容。
* **调性：**整体风格精致, 营造一种高级感。

**技术规范：**

* 使用 tailwindCSS 定义样式。
* 不使用 JS , HTML 和 CSS 优先。
* 只生成正文区域，网页已经使用 `prose` 类包裹了, 可以使用 `not-prose` 突破限制。
* 实现完整的深色/浅色模式切换功能。
* 代码结构清晰、语义化，包含适当的注释。
* 实现完整的响应式，必须在所有设备上（手机、平板、桌面）完美展示。

**额外加分项：**

* **微交互：** 添加微妙而有意义的微交互效果来提升用户体验（例如，按钮悬停效果、卡片悬停效果、页面滚动效果）。
* **补充信息：** 可以主动搜索并补充其他重要信息或模块（例如，关键概念的解释、相关人物的介绍等），以增强用户对内容的理解。

**输出要求：**

* 输出一个独立的 MDX 文件，生成的语法符合 MDX 规范和 JSX 规范。
* 修改范围不要超出 mdx 文件。
* 不要在正文中出现标签，发布时间相关的信息。
* 外链增加 `nofollow`, 在新窗口打开, 保留 `title` 属性。
* 代码块不做任何修改，依旧使用 md 格式。
* 确保代码符合 W3C 标准，没有错误或警告。

请你像一个真正的设计师一样思考，充分发挥你的专业技能和创造力，打造一个令人惊艳的网页！

待处理内容：@miantiao_me
```
