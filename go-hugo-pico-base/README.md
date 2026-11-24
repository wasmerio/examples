# Pico Base

## Demo

https://hugo-pico-base.wasmer.app

## About the theme

Pico Base is a Hugo theme maintained by mnordhaus. This template does not copy the theme source. It imports github.com/mnordhaus/pico-base as a Hugo module pinned to commit 573aca9b49a9, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's published example.

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

Theme by mnordhaus: https://github.com/mnordhaus/pico-base
License: MIT
Pinned commit: `573aca9b49a98c3d4fa3d06d3d20d760b86c3f39`
