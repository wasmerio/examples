# Raditian Free Hugo Theme

## Demo

https://hugo-raditian-free.wasmer.app

## About the theme

Raditian Free Hugo Theme is a Hugo theme maintained by radity. This template does not copy the theme source. It imports github.com/radity/raditian-free-hugo-theme as a Hugo module pinned to commit 0b5c9f204993, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by radity: https://github.com/radity/raditian-free-hugo-theme
License: MIT
Pinned commit: `0b5c9f20499332b4134ca0741b0bdf8fac5d320f`
