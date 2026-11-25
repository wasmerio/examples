---
title: "Config File"
description: Some basics on the configuration of the theme
date: 2019-04-20T16:18:12+01:00
publishDate: 2019-04-20T19:12:12+01:00
---


Here is the basic config file used for personal-web.

You can use it as a base for your website.

<!--more-->

```TOML
baseURL = "https://example.com/"
languageCode = "en-us"
title = "Edna West"
theme = "personal-web"
copyright="© Edna West"
googleAnalytics = ""
enableEmoji=true
enableRobotsTXT=true
pygmentsUseClasses=true
pygmentsCodeFences=true

[params.intro]
  main = "Hi, I'm Edna :wave:"
  sub = "I'm a Web Developer and Entrepreneur"

[params.main]
  latestPublishHeader = "My Latest Project"

[taxonomies]
  design = "designs"
  tech = "techs"

[blackfriday]
  hrefTargetBlank = true

[params]
  breadcrumb = true
  accentColor = "#FD3519"
  mainSections = ['portfolio']
  rendererSafe = true # set to true if the renderer is not marked unsafe

