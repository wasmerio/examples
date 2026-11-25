---
title: "Migrate to Hugo from Jekyll"
date: 2021-10-22T17:12:11+07:00
comment: true
tags: ["hugo"]
---


## Move static content to `static`

Jekyll has a rule that any directory not starting with `_` will be copied as-is to the `_site` output. Hugo keeps all static content under `static`. You should therefore move it all there.
With Jekyll, something that looked like

```shell
▾ <root>/
    ▾ images/
        logo.png
```

should become

```shell
▾ <root>/
    ▾ static/
        ▾ images/
            logo.png
```

Additionally, you'll want any files that should reside at the root (such as `CNAME`) to be moved to `static`.

## Create your Hugo configuration file

Hugo can read your configuration as JSON, YAML or TOML. Hugo supports parameters custom configuration too. Refer to the [Hugo configuration documentation](/overview/configuration/) for details.

## Set your configuration publish folder to `_site`

The default is for Jekyll to publish to `_site` and for Hugo to publish to `public`. If, like me, you have [`_site` mapped to a git submodule on the `gh-pages` branch](http://blog.blindgaenger.net/generate_github_pages_in_a_submodule.html), you'll want to do one of two alternatives:

1. Change your submodule to point to map `gh-pages` to public instead of `_site` (recommended).

```shell
git submodule deinit _site
git rm _site
git submodule add -b gh-pages git@github.com:your-username/your-repo.git public
```

