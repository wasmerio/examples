# Shapez Theme

## Demo

https://hugo-shapez.wasmer.app

## About the theme

Shapez Theme is a Hugo theme maintained by djuelg. This template does not copy the theme source. It imports github.com/djuelg/Shapez-Theme as a Hugo module pinned to commit bfc2adf16fd4, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

## Customise

Edit `hugo.toml` and the files under `content/`. Update the theme with `hugo mod get -u`. To change copies of the theme files, run `hugo mod vendor` and edit the vendored module.

## Run locally

Install Hugo extended 0.122.0 and Go 1.25.5. From this folder:

```bash
hugo mod get
hugo server
```

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs `hugo mod get` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by djuelg: https://github.com/djuelg/Shapez-Theme
License: MIT
Pinned commit: `bfc2adf16fd4ec8d38f6450b18b65cdf91b12ab8`
