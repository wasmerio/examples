# Spectral

## Demo

https://hugo-spectral.wasmer.app

## About the theme

Spectral is a Hugo theme maintained by lauramosherllc. This template does not copy the theme source. It imports github.com/lauramosherllc/hugo-spectral as a Hugo module pinned to commit 3e7dd5272ff9, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's published example.

## Customise

Edit `hugo.toml` and the files under `content/`. Update the theme with `hugo mod get -u`. To change copies of the theme files, run `hugo mod vendor` and edit the vendored module.

## Run locally

Install Hugo extended 0.114.0 and Go 1.25.5. From this folder:

```bash
hugo mod get
hugo server
```

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs `hugo mod get` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by lauramosherllc: https://github.com/lauramosherllc/hugo-spectral
License: NOASSERTION
Pinned commit: `3e7dd5272ff94efe53d4219c0d88c3fdfb0a3363`
