# Random3

## Demo

https://hugo-random3.wasmer.app

## About the theme

Random3 is a Hugo theme maintained by 22decembre. This template does not copy the theme source. It imports github.com/22decembre/random3 as a Hugo module pinned to commit aaecaa508e75, builds it with Hugo extended, and serves the result on Wasmer Edge. The theme has no example site at this commit, so the demo pages come from Hugo's basic example.

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

Theme by 22decembre: https://github.com/22decembre/random3
License: CC-BY-4.0
Pinned commit: `aaecaa508e7558b87b3f24d216b01f688254d315`
Demo content from gohugoio/hugoBasicExample (MIT) at `c500a6256906e2cd7c4d707370dca721906e94b3`.
