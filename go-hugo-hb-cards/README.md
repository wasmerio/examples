# HB Cards Theme

## Demo

https://hugo-hb-cards.wasmer.app

## About the theme

HB Cards Theme is a Hugo theme maintained by hbstack. This template does not copy the theme source. It imports github.com/hbstack/theme-cards as a Hugo module pinned to commit b0c024c59acf, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

## Customise

Edit `hugo.toml` and the files under `content/`. Update the theme with `hugo mod get -u`. To change copies of the theme files, run `hugo mod vendor` and edit the vendored module.

## Run locally

Install Hugo extended 0.145.0 and Go 1.25.5. From this folder:

```bash
hugo mod get
hugo server
```

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs `hugo mod get` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by hbstack: https://github.com/hbstack/theme-cards
License: MIT
Pinned commit: `b0c024c59acf428d1ddd7161da8fe8aaa5c0f65c`
