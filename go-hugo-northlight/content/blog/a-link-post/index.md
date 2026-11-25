---
title: "A Link Post Pointing Elsewhere"
description: "Set externalUrl in front matter and the listing entry links straight out, with an icon saying so before the click."
date: 2025-10-02
externalUrl: "https://gohugo.io/documentation/"
tags: ["example"]
excludeFromSearch: true
---


This body is never reached from a listing, because every card and index row for this post
links to `externalUrl` instead. The page still builds, so an existing permalink does not
break.

`excludeFromSearch` is set here too, which keeps it out of the ⌘K index without keeping
it out of the site.

