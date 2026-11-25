# Perplex

## Demo

https://hugo-perplex.wasmer.app

## About the theme

Perplex is a Hugo theme maintained by bowman2001. This template does not copy the theme source. It imports github.com/bowman2001/perplex as a Hugo module pinned to commit c88d43ee621b, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

## Customise

Edit `hugo.toml` and the files under `content/`. Update the theme with `hugo mod get -u`. To change copies of the theme files, run `hugo mod vendor` and edit the vendored module.

## Run locally

Install Hugo extended 0.120.4 and Go 1.25.5. From this folder:

```bash
hugo mod get
hugo server
```

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs `hugo mod get` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by bowman2001: https://github.com/bowman2001/perplex
License: Apache-2.0
Pinned commit: `c88d43ee621b50b97bd92adcc8137bfac86fef13`
