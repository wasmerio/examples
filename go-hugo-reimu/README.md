# Reimu

## Demo

https://hugo-reimu.wasmer.app

## About the theme

Reimu is a Hugo theme maintained by D-Sketon. This template does not copy the theme source. It imports github.com/D-Sketon/hugo-theme-reimu as a Hugo module pinned to commit 3be8426113f2, builds it with Hugo extended, and serves the result on Wasmer Edge. The theme has no example site at this commit, so the demo pages come from Hugo's basic example.

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

Theme by D-Sketon: https://github.com/D-Sketon/hugo-theme-reimu
License: MIT
Pinned commit: `3be8426113f2313ca2ecc8b9475da91cb308afd3`
Demo content from gohugoio/hugoBasicExample (MIT) at `c500a6256906e2cd7c4d707370dca721906e94b3`.
