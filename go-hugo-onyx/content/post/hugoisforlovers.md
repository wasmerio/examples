+++
title = "Getting Started with Hugo"
date = 2014-04-02
tags = ["go", "golang", "development", "hugo"]
categories = ["Development", "golang"]
draft = false
[menu.main]
  weight = 2001
  identifier = "getting-started-with-hugo"
+++

## Step 1. Install Hugo {#step-1-dot-install-hugo}

Goto [hugo releases](https://github.com/spf13/hugo/releases) and download the appropriate version for your os
and architecture.

Save it somewhere specific as we will be using it in the next step.

More complete instructions are available at [installing hugo](/overview/installing/)


## Step 2. Build the Docs {#step-2-dot-build-the-docs}

Hugo has its own example site which happens to also be the
documentation site you are reading right now.

Follow the following steps:

1.  Clone the [hugo repository](http://github.com/spf13/hugo)
2.  Go into the repo
3.  Run hugo in server mode and build the docs
4.  Open your browser to <http://localhost:1313>

Corresponding pseudo commands:

```text
git clone https://github.com/spf13/hugo
cd hugo
/path/to/where/you/installed/hugo server --source=./docs
> 29 pages created
