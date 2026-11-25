---
title: "Getting Started with Hugo"
date: 2022-10-26T17:12:11+07:00
comment: true
tags: ["hugo"]
---


## Step 1. Install Hugo

Go to [Hugo releases](https://github.com/spf13/hugo/releases) and download the
appropriate version for your OS and architecture.

Save it somewhere specific as we will be using it in the next step.

More complete instructions are available at [Install Hugo](https://gohugo.io/getting-started/installing/)

## Step 2. Build the Docs

Hugo has its own example site which happens to also be the documentation site
you are reading right now.

Follow the following steps:

```
1. Clone the [Hugo repository](http://github.com/spf13/hugo)
2. Go into the repo
3. Run hugo in server mode and build the docs
4. Open your browser to http://localhost:1313
```

Corresponding pseudo commands:

```shell
git clone https://github.com/spf13/hugo
cd hugo
/path/to/where/you/installed/hugo server --source=./docs
> 29 pages created
> 0 tags index created
> in 27 ms
> Web Server is available at http://localhost:1313
> Press ctrl+c to stop
```

Once you've gotten here, follow along the rest of this page on your local build.

