---
title: "Git Workflow Best Practices"
description: "Essential git commands and workflows for efficient development"
publishedAt: 2024-01-10
category: "Development"
---

Quick reference for common git workflows:

## Feature Branch Workflow

1. Create feature branch:
```bash
git checkout -b feature/new-feature
```

2. Regular commits with conventional commit messages:
```bash
git commit -m "feat: add new feature"
git commit -m "fix: address review feedback"
```

3. Rebase before merging:
```bash
git fetch origin main
git rebase origin/main
``` 