# Saral

## Demo

https://hugo-saral.wasmer.app

## About the theme

Saral is a Hugo theme maintained by dipeshsingh253. This template does not copy the theme source. It imports github.com/dipeshsingh253/saral as a Hugo module pinned to commit edfa5cdb2aa5, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's published example.

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

Theme by dipeshsingh253: https://github.com/dipeshsingh253/saral
License: MIT
Pinned commit: `edfa5cdb2aa5c468b7c44cbf0291da2085cbfed8`
