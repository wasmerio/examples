# digio

## Demo

https://hugo-digio.wasmer.app

## About the theme

digio is a Hugo theme maintained by danapixels. This template does not copy the theme source. It imports github.com/danapixels/digio-theme as a Hugo module pinned to commit e709d448536e, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's published example.

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

Theme by danapixels: https://github.com/danapixels/digio-theme
License: GPL-3.0
Pinned commit: `e709d448536eda15e7013b37dd9673a23d9f4d37`
