---
title: "使用 Hugo 搭建个人博客"
date: 2026-05-15
tags: ["Hugo", "博客", "Tutorial"]
categories: ["技术"]
---


Hugo 是目前最快的静态网站生成器之一。本文详细介绍如何搭建个人博客。

## 为什么选择 Hugo

- **速度极快**：数千页的站点也能毫秒级构建
- **灵活**：强大的模板系统和内容组织方式
- **免费**：完全开源，部署到 GitHub Pages 零成本

## 安装 Hugo

根据你的操作系统选择安装方式：

### macOS

```bash
brew install hugo
```

### Windows

```bash
winget install Hugo.Hugo.Extended
```

## 初始化站点

```bash
hugo new site my-blog
cd my-blog
```

## 配置主题

在 `hugo.toml` 中设置：

```toml
theme = "warmpaper"
baseURL = "https://yourname.github.io"
