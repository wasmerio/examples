---
title: Shell one-liners I use every week
date: 2024-03-22
description: Find the biggest folders, copy repositories without node_modules, and other small commands that keep earning their keep.
tags: [shell, productivity]
---


A short list of commands I keep coming back to.

## Biggest folders first

```bash
du -sh -- */ | sort -rh | head -n 10
```

## Copy repositories without their dependencies

```bash
rsync -av --exclude 'node_modules' --exclude '.venv' ~/code/ /mnt/backup/code/
```

## What changed today?

```bash
git log --since=midnight --oneline --all
```

## Rename files in bulk

```bash
for f in *.jpeg; do mv -- "$f" "${f%.jpeg}.jpg"; done
```
