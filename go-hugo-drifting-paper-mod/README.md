# Drifting-PaperMod

## Demo

https://hugo-drifting-paper-mod.wasmer.app

## About the theme

Drifting-PaperMod is a Hugo theme maintained by DriftingBoats. This template does not copy the theme source. It imports github.com/DriftingBoats/Drifting-PaperMod as a Hugo module pinned to commit 2839e8785ed8, builds it with Hugo extended, and serves the result on Wasmer Edge. The theme has no example site at this commit, so the demo pages come from Hugo's basic example.

## Customise

Edit `hugo.toml` and the files under `content/`. Update the theme with `hugo mod get -u`. To change copies of the theme files, run `hugo mod vendor` and edit the vendored module.

## Run locally

Install Hugo extended 0.145.0 and Go 1.25.5. From this folder:

```bash
hugo mod get
hugo server
```

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs `hugo mod get` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by DriftingBoats: https://github.com/DriftingBoats/Drifting-PaperMod
License: MIT
Pinned commit: `2839e8785ed8ef047ad4c9583ff64c5d5804b179`
Demo content from gohugoio/hugoBasicExample (MIT) at `c500a6256906e2cd7c4d707370dca721906e94b3`.
