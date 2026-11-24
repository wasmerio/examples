---
title: "Noesis: A Clean Theme for Hugo"
date: 2018-05-02T14:33:42-04:00
description: "Noesis is a Hugo theme for blogs that emphasizes motion, material, and depth while keeping the focus on writing and photography."
categories: ["Web"]
displayInMenu: false
displayInList: true
draft: false
resources:
- name: featuredImage
  src: "noesis-macbook.png"
  params:
    description: "A MacBook showing a website using the noesis theme"
---


Today's web is a frustrating mess of pop-ups, intrusive banners, and ads obstructing the content. I designed noesis to be free of all these distractions and simply highlight the content. The result feels more like a native application than a website. Interactions are intuitive, content is the focus, and distractions are omitted.

Noesis is a Hugo theme for blogs that elevates good writing and photography. If you use Hugo for your blog, give noesis a try.

## Installation
In the root directory of your Hugo Project, clone the noesis repo into the themes directory.

```shell session
git clone https://github.com/josephhutch/noesis.git themes/noesis
```

## Usage

### Website configuration

Add the following parameters to your `hugo.toml` file if they are not present already.

```toml
baseURL = "https://yourwebsitenamegoeshere.com/"
locale = "en-US"
title = "Your site title"
theme = "noesis"

[pagination]
  pagerSize = 10

[services]
  [services.googleAnalytics]
    id = "Your Google Analytics measurement ID - optional"
  [services.disqus]
    shortname = "Your shortname for Disqus - optional"

[params]
  brand = "The name that is displayed in the top left of the website - optional, title is fallback"
  description = "The website's description"
  mainSections = ["posts"]

  [params.appearance]
