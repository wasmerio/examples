# Hugo Cards

## Demo

https://hugo-cards.wasmer.app

## About the theme

Hugo Cards is a Hugo theme maintained by bul-ikana. This template does not copy the theme source. It imports github.com/bul-ikana/hugo-cards as a Hugo module pinned to commit 7f961b20dfb0, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by bul-ikana: https://github.com/bul-ikana/hugo-cards
License: MIT
Pinned commit: `7f961b20dfb08842db8489e7515c143705898bd2`
