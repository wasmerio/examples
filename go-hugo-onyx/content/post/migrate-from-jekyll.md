+++
title = "Migrating to Hugo from Jekyll"
date = 2014-03-10
linkTitle = "Migrating from Jekyll"
draft = false
[menu.main]
  weight = 2004
  identifier = "migrating-to-hugo-from-jekyll"
+++

## Move static content to `static` {#move-static-content-to-static}

Jekyll has a rule that any directory not starting with `_` will be
copied as-is to the `_site` output. Hugo keeps all static content
under `static`. You should therefore move it all there. With Jekyll,
something that looked like

```text
▾ <root>/
    ▾ images/
        logo.png
```

should become

```text
▾ <root>/
    ▾ static/
        ▾ images/
            logo.png
```

Additionally, you'll want any files that should reside at the root
(such as `CNAME`) to be moved to `static`.


## Create your Hugo configuration file {#create-your-hugo-configuration-file}

Hugo can read your configuration as JSON, YAML or TOML. Hugo supports
parameters custom configuration too. Refer to the [Hugo configuration
