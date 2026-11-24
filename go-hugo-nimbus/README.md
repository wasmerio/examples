# Nimbus

## Demo

https://hugo-nimbus.wasmer.app

## About the theme

Nimbus is a Hugo theme maintained by k-s-pavan-kumar. This template does not copy the theme source. It imports github.com/k-s-pavan-kumar/hugo-nimbus as a Hugo module pinned to commit 832d53c5a7cc, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by k-s-pavan-kumar: https://github.com/k-s-pavan-kumar/hugo-nimbus
License: MIT
Pinned commit: `832d53c5a7ccf7a22a2d5c6452a3f7bf622c3bd5`
