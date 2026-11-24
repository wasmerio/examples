# Blank Magazine

## Demo

https://hugo-blank-magazine.wasmer.app

## About the theme

Blank Magazine is a Hugo theme maintained by codesign2020. This template does not copy the theme source. It imports github.com/codesign2020/blank-magazine as a Hugo module pinned to commit f0d103f75759, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by codesign2020: https://github.com/codesign2020/blank-magazine
License: MIT
Pinned commit: `f0d103f75759f9c00b7ae3f8a4d7453f97b43aa2`
