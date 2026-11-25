---
title: Example blog entry
date: 2024-01-10 04:01:01 +0100
draft: false
tags: [Work, 2024]
---

You are on the demo page of the Frühling theme for the static site generator Hugo. Sources of the theme are available here: https://github.com/romka/fruhling. Sources of this demo-site are here: https://github.com/romka/fruhling-demo. 


The theme supports all standard Markdown formatting features:
- lists,
- **varied** _styling_,
- `code blocks`,
- photo galleries as a separate data type,
- and 2 types of galleries embedded within other content.
<!--more-->

Using the shortcode `{{`<` embedded-gallery "path/to/gallery" `>`}}`, for example, `{{`<` embedded-gallery "2024/art" `>`}}`, you can insert a gallery located in the `content/embedded-gallery` directory. This is convenient if you need to reuse the same gallery in different locations.

{{< embedded-gallery "2024/art" >}}

With the shortcode `{{`<` embedded-local-gallery "flie1.jpg" "file2.jpg" `>`}}`, you can insert a link to a gallery created from files in the current directory.

{{< embedded-local-gallery "OIG.kOwVe0zG0rPqqb.OWOn4.jpg" "OIG.zCJbq2VUr1dsu55xDNKl.jpg" >}}
