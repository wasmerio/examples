# no-style-please

## Demo

https://hugo-no-style-please.wasmer.app

## About the theme

no-style-please is a Hugo theme maintained by Masellum. This template does not copy the theme source. It imports github.com/Masellum/hugo-theme-nostyleplease as a Hugo module pinned to commit cfbfe4e8ed13, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's published example.

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

Theme by Masellum: https://github.com/Masellum/hugo-theme-nostyleplease
License: MIT
Pinned commit: `cfbfe4e8ed13ba6256c9ea076690dba30dd8765b`
