# hugo take theme

## Demo

https://hugo-take.wasmer.app

## About the theme

hugo take theme is a Hugo theme maintained by takeokunn. This template does not copy the theme source. It imports github.com/takeokunn/hugo-take-theme as a Hugo module pinned to commit 756b7f5dbd51, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by takeokunn: https://github.com/takeokunn/hugo-take-theme
License: MIT
Pinned commit: `756b7f5dbd516b8a313311cd4ec4a460afe53763`
