# Tufte

## Demo

https://hugo-tufte.wasmer.app

## About the theme

Tufte is a Hugo theme maintained by yashhere. This template does not copy the theme source. It imports github.com/yashhere/hugo-theme-tufte as a Hugo module pinned to commit 96d10ae41994, builds it with Hugo extended, and serves the result on Wasmer Edge. The theme has no example site at this commit, so the demo pages come from Hugo's basic example.

## Customise

Edit `hugo.toml` and the files under `content/`. Update the theme with `hugo mod get -u`. To change copies of the theme files, run `hugo mod vendor` and edit the vendored module.

## Run locally

Install Hugo extended 0.127.0 and Go 1.25.5. From this folder:

```bash
hugo mod get
hugo server
```

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs `hugo mod get` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by yashhere: https://github.com/yashhere/hugo-theme-tufte
License: MIT
Pinned commit: `96d10ae41994c9e6cf0e6660f5c708055ccba5a7`
Demo content from gohugoio/hugoBasicExample (MIT) at `c500a6256906e2cd7c4d707370dca721906e94b3`.
