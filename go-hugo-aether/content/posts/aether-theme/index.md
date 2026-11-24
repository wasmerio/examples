---
title: "Aether: A Clean Theme for Hugo"
date: 2018-05-02T14:33:42-04:00
description: " Aether is new theme for Hugo that emphasizes motion, material, and depth as design elements. Distracting styling and page elements are forgone to focus on the content."
categories: ["Web"]
dropCap: true
displayInMenu: false
displayInList: true
draft: false
resources:
- name: featuredImage
  src: "mdd-macbook.jpg"
  params:
    description: "A MacBook showing a website using the aether theme"
---

Today's web is a frustrating mess of pop-ups, intrusive banners, and ads obstructing the content. I designed aether to be free of all these distractions and simply highlight the content. The result feels more like a native application than a website. Interactions are intuitive, content is the focus, and distractions are omitted.

Aether is a Hugo theme for blogs that elevates good writing and photography. If you use Hugo for your blog, give aether a try.

## Installation
In the root directory of your Hugo Project, clone the aether repo into the themes directory.

```shell session
git clone https://github.com/josephhutch/aether.git themes/aether
```

## Usage

### Website Configuration

Add the following parameters to your config file if they are not present already.

```toml
baseURL = "https://yourwebsitenamegoeshere.com/"
locale = "The language tag for the language the website is written in"
title = "The website title that is used in each page title, displayed in the browser tab and search results"
theme = "aether"

[pagination]
