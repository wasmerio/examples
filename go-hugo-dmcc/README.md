# DMCC

## Demo

https://hugo-dmcc.wasmer.app

## About the theme

DMCC is a Hugo theme maintained by dannymcc. This template does not copy the theme source. It imports github.com/dannymcc/DMCC-Hugo-theme as a Hugo module pinned to commit f2f7564b3c03, builds it with Hugo extended, and serves the result on Wasmer Edge. The theme has no example site at this commit, so the demo pages come from Hugo's basic example.

## Customise

Edit `hugo.toml` and the files under `content/`. Update the theme with `hugo mod get -u`. To change copies of the theme files, run `hugo mod vendor` and edit the vendored module.

## Run locally

Install Hugo extended 0.121.1 and Go 1.25.5. From this folder:

```bash
hugo mod get
hugo server
```

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs `hugo mod get` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by dannymcc: https://github.com/dannymcc/DMCC-Hugo-theme
License: MIT
Pinned commit: `f2f7564b3c031b7373eed9592980ccfb6ac61051`
Demo content from gohugoio/hugoBasicExample (MIT) at `c500a6256906e2cd7c4d707370dca721906e94b3`.
