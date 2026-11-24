# Articles

## Demo

https://hugo-articles.wasmer.app

## About the theme

Articles is a Hugo theme maintained by henglgh. This template does not copy the theme source. It imports github.com/henglgh/hugo-articles as a Hugo module pinned to commit 3d888a1bbd2b, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's published example.

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

Theme by henglgh: https://github.com/henglgh/hugo-articles
License: GPL-3.0
Pinned commit: `3d888a1bbd2bb090a6d0c9cd5c10baedde378ea2`
