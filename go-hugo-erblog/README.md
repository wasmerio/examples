# Erblog

## Demo

https://hugo-erblog.wasmer.app

## About the theme

Erblog is a Hugo theme maintained by ertuil. This template does not copy the theme source. It imports github.com/ertuil/erblog as a Hugo module pinned to commit b38f867912ef, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

## Customise

Edit `hugo.toml` and the files under `content/`. Update the theme with `hugo mod get -u`. To change copies of the theme files, run `hugo mod vendor` and edit the vendored module.

## Run locally

Install Hugo extended 0.167.0 and Go 1.25.5. From this folder:

```bash
hugo mod get
hugo server
```

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs `hugo mod get` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by ertuil: https://github.com/ertuil/erblog
License: MIT
Pinned commit: `b38f867912ef3a47543037142d84d9238444ac72`
