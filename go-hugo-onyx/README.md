# Onyx

## Demo

https://hugo-onyx.wasmer.app

## About the theme

Onyx is a Hugo theme maintained by kaushalmodi. This template does not copy the theme source. It imports github.com/kaushalmodi/hugo-onyx-theme as a Hugo module pinned to commit 8be746225da2, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

## Customise

Edit `hugo.toml` and the files under `content/`. Update the theme with `hugo mod get -u`. To change copies of the theme files, run `hugo mod vendor` and edit the vendored module.

## Run locally

Install Hugo extended 0.73.0 and Go 1.25.5. From this folder:

```bash
hugo mod get
hugo server
```

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs `hugo mod get` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by kaushalmodi: https://github.com/kaushalmodi/hugo-onyx-theme
License: NOASSERTION
Pinned commit: `8be746225da27f2dc3e9dfa1a1ca696ddf5f04a4`
