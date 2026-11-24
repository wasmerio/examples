---
title: "Introducing Indigo"
date: 2018-10-01T09:00:00-04:00
draft: false
categories: ["meta"]
tags: ["typography", "indieweb"]
---


Indigo is a lightweight theme for [Hugo][hugo] with [IndieWeb][indieweb] features baked in. It's great for longer-form blogging, placing its focus on distraction-free reading and beautiful typefaces.

<!--more-->

## IndieWeb features

A key feature of this theme is its support for IndieWeb features, including microformats and web sign-in.

### Web sign-in

Indigo handles web sign-in by setting the `authorization_endpoint` to [IndieAuth.com][indieauth]:

> IndieAuth.com is part of the [IndieWeb movement][why] to take back control of your online identity. Instead of logging in to websites as "you on Twitter" or "you on Facebook", **you should be able to log in as just "you"**.

This allows you to sign in to certain services simply by providing your site's domain name.

### microformats

Indigo marks up content with appropriate [microformats][mf2], which provides semantic definitions of your content to other software. Posts are marked up with `h-entry` classes, like `p-name`, `p-author`, and `e-content`, while the author bio is marked up with `h-card` classes, including `u-photo`, `u-url`, `p-locality`/`p-country-name`, and `p-note`.

## Open typefaces

Indigo uses a combination of three beautiful typefaces to render your words.

- [Fira Sans][fira-sans] for heading text
- [Charter][charter] for body text
- [Fira Code][fira-code] for monospaced text

Licenses are included in the theme’s `static/fonts` folder.

Have a look at a couple of paragraphs of placeholder text using the wonderfully readable Charter:

---
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend nulla ac elit venenatis posuere. Sed id aliquam arcu, et malesuada lectus. **Donec et dignissim massa. Pellentesque in laoreet nibh. Pellentesque sagittis, libero quis vestibulum aliquam, ante risus imperdiet magna, at ornare dolor libero quis nunc.** Donec quis tempus purus. Cras ornare magna ac facilisis tristique. Nulla aliquet purus quis massa rutrum interdum ac at magna. Cras fermentum magna id orci viverra facilisis. Ut vitae lobortis nisl.

Sed interdum tincidunt venenatis. Sed hendrerit dictum nisi, at dignissim orci consectetur quis. Aenean sed nisl et nisl placerat euismod. Proin hendrerit nulla at rhoncus molestie. Cras eu gravida erat, vestibulum ornare diam. _Praesent nunc arcu, ultrices et risus sed, dictum mattis dui. Maecenas vitae nisl at massa porta pellentesque_. Donec eget urna eget nisl imperdiet scelerisque eget a mauris. Nam fringilla sem id vehicula rhoncus. Curabitur tincidunt massa mauris, facilisis placerat odio eleifend sit amet. Etiam nec vehicula sapien, at dignissim risus. Sed elit erat, lacinia eu vulputate at, semper eu nulla. Quisque a urna sed nulla viverra egestas nec quis nunc. Curabitur iaculis elit in orci sollicitudin suscipit.

---
