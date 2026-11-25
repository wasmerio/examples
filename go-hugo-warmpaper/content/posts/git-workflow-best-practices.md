---
title: "Git 工作流最佳实践"
date: 2026-03-05
tags: ["Git", "工具", "工程化"]
categories: ["技术"]
---


在团队协作中，一个好的 Git 工作流能够极大提升效率。

## 常见工作流对比

### Git Flow

适合有固定发布周期的项目。

```
master ───────●───────────●─────────
              ╲         ╱
develop ───────●───●───●───────────
                   ╲ ╱
feature            ●
```

### GitHub Flow

适合持续部署的项目。

- 从 main 分支创建功能分支
- 提交更改并创建 Pull Request
- 审核通过后合并到 main

### Trunk-Based Development

适合需要快速迭代的团队。

> 所有开发者直接在主干分支工作，通过短命特性分支进行代码评审。

## 提交信息规范

### Conventional Commits

```
<type>(<scope>): <description>

[body]
