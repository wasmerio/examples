# Chicago7

## Demo

https://hugo-chicago7.wasmer.app

## About the theme

Chicago7 is a Hugo theme maintained by akopdev. This template does not copy the theme source. It imports github.com/akopdev/hugo-theme-chicago7 as a Hugo module pinned to commit d5edc63d32bd, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by akopdev: https://github.com/akopdev/hugo-theme-chicago7
License: MIT
Pinned commit: `d5edc63d32bddaf63d99bba61e5f3e319a83db72`
