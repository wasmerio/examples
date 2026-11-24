---
title: Custom Error Pages
date: 2024-01-03 14:00:00 +00:00
description: Custom error pages can have custom emoji and colors.
categories: ["Features"]
tags: ["Cool Feature"]
url: features/custom-error-pages
params:
  icon: 🎏
  theme_color: gold
  uuid: F05B8799-A6D5-4298-8C21-259E16C335CC
---

There are some default custom error pages, for HTTP errors like [403](/errors/403/), [404](/errors/404/), [410](/errors/410/), [418](/errors/418/), [429](/errors/429/), [451](/errors/451/), [500](/errors/500/), or [503](/errors/503/), which all can have custom emoji and colors. If no icon is set, the site’s default icon is used, like always. A great way to use humorous emoji.

The web server has to be configured to return those files for each error state, which a Hugo theme cannot do. Managed hosting is not enough, self hosting will do the trick. On nginx, the following declared in the site’s server block will do the trick:

```nginx
error_page 403 /errors/403/index.html;
error_page 404 /errors/404/index.html;
error_page 410 /errors/410/index.html;
error_page 418 /errors/418/index.html;
error_page 429 /errors/429/index.html;
error_page 451 /errors/451/index.html;
error_page 500 /errors/500/index.html;
error_page 503 /errors/503/index.html;
```

