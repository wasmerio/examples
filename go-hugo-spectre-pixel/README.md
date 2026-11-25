# Spectre Pixel Theme

## Demo

https://hugo-spectre-pixel.wasmer.app

## About the theme

Spectre Pixel Theme is a Hugo theme maintained by st-wong. This template does not copy the theme source. It imports github.com/st-wong/hugo-spectre-pixel-theme as a Hugo module pinned to commit 8fd99bdd4002, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by st-wong: https://github.com/st-wong/hugo-spectre-pixel-theme
License: MIT
Pinned commit: `8fd99bdd4002c12605b93a02fd2458846aaa2911`
