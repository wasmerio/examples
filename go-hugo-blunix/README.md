# hugo-theme-blunix

## Demo

https://hugo-blunix.wasmer.app

## About the theme

hugo-theme-blunix is a Hugo theme maintained by Blunix-GmbH. This template does not copy the theme source. It imports github.com/Blunix-GmbH/hugo-theme-blunix as a Hugo module pinned to commit b6f8c12dc470, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by Blunix-GmbH: https://github.com/Blunix-GmbH/hugo-theme-blunix
License: MIT
Pinned commit: `b6f8c12dc47042362e2a28af54d344459eeafb8a`
