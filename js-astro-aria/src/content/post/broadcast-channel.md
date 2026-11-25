---
layout: ../../layouts/post.astro
title: "BroadcastChannel: Turn Your Telegram Channel into a Microblog"
description: A zero-JS microblog engine that renders Telegram channel updates as clean web pages using modern CSS features.
dateFormatted: Aug 11, 2024
---

I frequently share tools and links on [X/Twitter](https://x.com/0xKaibi) and sync them over to my Telegram channel. After seeing [Austin mention he was building a site](https://x.com/austinit/status/1817832660758081651) to aggregate his past shares, I remembered the [Sepia](https://github.com/Planetable/SiteTemplateSepia) template I had recently seen and wondered if I could turn my Telegram channel into an automated microblog.

It turned out to be fairly straightforward—I knocked out the core features over a single weekend. The fun part was achieving **zero client-side JavaScript**. Here are some interesting CSS tricks used along the way:

1. **Spoiler overlays and mobile search toggle**: Built purely with the CSS `:checked` pseudo-class and the `+` adjacent sibling combinator. ([Reference](https://www.tpisoftware.com/tpu/articleDetails/2744))
2. **Page transitions**: Handled via CSS View Transitions without client routers. ([Reference](https://liruifengv.com/posts/zero-js-view-transitions/))
3. **Image lightbox**: Built using the native HTML `popover` attribute. ([Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover))
4. **Back-to-top button**: Toggled dynamically using CSS `animation-timeline` (supported in Chrome 115+). ([Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view))
5. **Masonry image grid**: Laid out using CSS Grid masonry. ([Reference](https://www.smashingmagazine.com/native-css-masonry-layout-css-grid/))
6. **Visitor analytics**: Tracked with an ancient web trick—a 1x1 transparent tracking pixel embedded behind the logo.
7. **Strict zero-JS enforcement**: Guaranteed by sending `Content-Security-Policy: script-src 'none'`. ([Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src))

Once it was working, I open-sourced it. I did not expect it to resonate so much—it gained over 800 stars in its first week.

If you want to try it out, check out the repository on GitHub:

[![BroadcastChannel repository on GitHub](https://github.html.zone/ccbikai/BroadcastChannel)](https://github.com/ccbikai/BroadcastChannel)
