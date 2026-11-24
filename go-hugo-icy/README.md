# Icy

## Demo

https://hugo-icy.wasmer.app

## About the theme

Icy is a Hugo theme maintained by DejavuMoe. This template does not copy the theme source. It imports github.com/DejavuMoe/hugo-theme-icy as a Hugo module pinned to commit ccebe26d6ac3, builds it with Hugo extended, and serves the result on Wasmer Edge. The theme has no example site at this commit, so the demo pages come from Hugo's basic example.

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

Theme by DejavuMoe: https://github.com/DejavuMoe/hugo-theme-icy
License: MIT
Pinned commit: `ccebe26d6ac3ec1e533246df9474a435e1c1ec34`
Demo content from gohugoio/hugoBasicExample (MIT) at `c500a6256906e2cd7c4d707370dca721906e94b3`.
