+++
title = '02. Features'
date = 2025-03-28
draft = false
featured_image = "https://raw.githubusercontent.com/elecbrandy/freshpink/gh-pages/basic.png"
tags = ['tag_a', 'tag_c']
+++

<br>

## 1. Main Image
____
You can set a main image on the homepage.
Add the image URL in the `[params]` section of `hugo.toml` under `mainImageUrl`.

If you don’t want a main image, set `showMainImage` to `false`.

```toml
mainImageUrl = "https://i.imgur.com/URQWyyY.png"
showMainImage = true
```

<br>
<br>

## 2. GitHub Contribution Chart
____

You can also show your GitHub contribution graph on the homepage.
Add your GitHub username to `githubUsername` in the `[params]` section of `hugo.toml`.
Control visibility with `showGithubChart`.

```toml
githubUsername = "elecbrandy"
showGithubChart = true
```

<br>
<br>

