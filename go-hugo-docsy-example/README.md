# Docsy Example

## Demo

https://hugo-docsy-example.wasmer.app

## About the theme

Docsy Example is a Hugo theme maintained by docsy. This template does not copy the theme source. It imports github.com/docsy/docsy-example as a Hugo module pinned to commit 3f00090a8ed7, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's published example.

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

Theme by docsy: https://github.com/docsy/docsy-example
License: Apache-2.0
Pinned commit: `3f00090a8ed781566d6b5969316d41779e3ad493`
