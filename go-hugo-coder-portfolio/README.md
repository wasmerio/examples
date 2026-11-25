# Coder Portfolio

## Demo

https://hugo-coder-portfolio.wasmer.app

## About the theme

Coder Portfolio is a Hugo theme maintained by naro143. This template does not copy the theme source. It imports github.com/naro143/hugo-coder-portfolio as a Hugo module pinned to commit 255d92337c07, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by naro143: https://github.com/naro143/hugo-coder-portfolio
License: MIT
Pinned commit: `255d92337c07e77035210ed40cb53e1dd2d4921d`
