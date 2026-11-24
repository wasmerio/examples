# Shibui (渋い)

## Demo

https://hugo-shibui.wasmer.app

## About the theme

Shibui (渋い) is a Hugo theme maintained by ntk148v. This template does not copy the theme source. It imports github.com/ntk148v/shibui as a Hugo module pinned to commit b6d6ee034426, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by ntk148v: https://github.com/ntk148v/shibui
License: MIT
Pinned commit: `b6d6ee034426db4b73ddaef66a1fb2d6f95bd1d3`
