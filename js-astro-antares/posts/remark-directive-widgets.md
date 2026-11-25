---
title: remark-directive-widgets
description: |
  remark-directive-widgets is a remark plugin implemented by this theme itself, used to create custom components based on the remark-directive plugin syntax.  
  remark-directive-widgets 是这个主题自身实现的remark插件，用于根据remark-directive插件语法创建自定义组件。
---

# note

:::note{type=info}
info note
:::

:::note{type=success}
success note
:::

:::note{type=warn}
warn note
:::

:::note{type=error}
error note
:::

# blockquote

:::blockquote
blockquote
:::

:::blockquote{type=success}
success blockquote
:::

:::blockquote{type=warn}
warn blockquote
:::

:::blockquote{type=error}
error blockquote
:::

# btn

:::btn{url=/}
url btn
:::

:::btn{onclick="alert('QAQ')"}
onclick btn
:::

# spoiler

:::spoiler
Hello Antares
:::

:::spoiler{open=true}
Hello Antares
:::

:::spoiler{expand=true title="Custom title"}
Hello Antares
:::

# tabs

::::tabs

:::tab
1
:::

:::tab
2
:::
:::tab
3
:::

::::