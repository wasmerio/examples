# Hugo minimalist SPA

## Demo

https://hugo-minimalist-spa.wasmer.app

## About the theme

Hugo minimalist SPA is a Hugo theme maintained by SAGGameDeveloper. This template does not copy the theme source. It imports github.com/SAGGameDeveloper/hugo-minimalist-spa as a Hugo module pinned to commit 2637ff850398, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

## Customise

Edit `hugo.toml` and the files under `content/`. Update the theme with `hugo mod get -u`. To change copies of the theme files, run `hugo mod vendor` and edit the vendored module.

## Run locally

Install Hugo extended 0.127.0 and Go 1.25.5. From this folder:

```bash
hugo mod get
hugo server
```

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs `hugo mod get` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by SAGGameDeveloper: https://github.com/SAGGameDeveloper/hugo-minimalist-spa
License: MIT
Pinned commit: `2637ff850398526afea3d17b989d072250ab68e0`
