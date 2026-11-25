# Theme

## Demo

https://hugo-theme.wasmer.app

## About the theme

Theme is a Hugo theme maintained by hugo-porto. This template does not copy the theme source. It imports github.com/hugo-porto/theme as a Hugo module pinned to commit 3176d55b6261, builds it with Hugo extended, and serves the result on Wasmer Edge. The theme has no example site at this commit, so the demo pages come from Hugo's basic example.

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

Theme by hugo-porto: https://github.com/hugo-porto/theme
License: MIT
Pinned commit: `3176d55b6261056b1e233b493ac145be002f6e30`
Demo content from gohugoio/hugoBasicExample (MIT) at `c500a6256906e2cd7c4d707370dca721906e94b3`.
