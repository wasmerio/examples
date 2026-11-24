---
title: "Docs"
date: 2023-02-11T12:51:30+01:00
toc: true
---


## Install Hugo

Install Hugo on macOS, Linux, Windows, BSD, and on any machine that can run the Go compiler tool chain.

For full info visit official doc: {{< link url="https://gohugo.io/installation/" title="https://gohugo.io/installation/" >}}

## Quick Start

```bash
hugo new site quickstart
cd quickstart
git init
git submodule add https://github.com/matusstafura/berg-hugo-theme themes/berg
echo "theme = 'berg'" >> hugo.toml
```

and to start the server, run:
```shell
hugo server
```

## First Post

Create a new post in terminal:
```shell
hugo new posts/my-first-post.md
```

or manually, where you create a directory in `content` folder named `posts` and file `my-first-post.md`.

Fill the content of the file like below and save the file.

```md
---
title: "My First Post"
---

# Hello
