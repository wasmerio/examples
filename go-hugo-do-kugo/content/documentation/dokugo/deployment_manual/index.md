---
author: DoKugo
title: Manual Deployment
description: Content generation and manual deployment
date: 2021-04-13
categories:
    - dokugo
categories_weight: 5
tags:
    - themes
    - documentation
    - hugo
    - deployment
draft: false
---


This very short guide will help you to generate your content with Hugo. 
You will get some hints how to deploy your website manually to your webhoster.

## Deployment

When you think you're ready to publish something just run `hugo`:

```bash
$ hugo 
Start building sites … 

                   | EN  
-------------------+-----
  Pages            |  7  
  Paginator pages  |  0  
  Non-page files   |  0  
  Static files     |  9  
  Processed images |  0  
  Aliases          |  0  
  Sitemaps         |  1  
  Cleaned          |  0  

Total in 14 ms
```

This command will create the `public` folder inside your project root. 

```bash
$ tree demodokugo/ -L 1
demodokugo/
├── config.toml
├── content
├── public      <----- Your generated content
└── themes
```

There are now dozen of possibilities how to publish the site and it is impossible to cover them all.
Best of all, head to your webhoster and check their documentation how to upload your website to the webserver.
