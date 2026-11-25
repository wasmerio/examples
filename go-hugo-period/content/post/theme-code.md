---
title: "代码高亮与 Markdown 进阶排版"
slug: "theme-code"
date: 2024-12-02
description: "Chroma 代码高亮的配置与用法（行号/指定行高亮/一键复制），以及表格、脚注、任务列表、定义列表的完整演示。"
featured: "images/covers/theme-code.svg"
categories: ["技术"]
tags: ["hugo", "代码高亮", "markdown"]
author: "Period"
---


本主题内置 **Hugo Chroma** 代码高亮：Atom One Dark 深色配色、行号、长行横向滚动与一键复制。

## 代码块用法

三个反引号 + 语言名即可，语法高亮由 Chroma 自动完成：

```go
package main

import "fmt"

func main() {
    // 支持 Go/Python/JS/TOML/Bash 等 100+ 语言
    fmt.Println("Hello, Period!")
}
```

需要高亮指定行时，用 `highlight` 短代码 + `hl_lines`（行号从 1 计）：

```text
{{< highlight go "hl_lines=2" >}}
func add(a, b int) int {
    return a + b   // ← 这一行会被背景高亮
}
{{< /highlight >}}
```

Bash 示例（注意行号会自动生成）：

```bash
hugo server -D
hugo --minify && npx pagefind --site public
```

每个代码块右上角有**复制按钮**（悬停高亮），点击即复制全文。

## 高亮配置

