# Period

## Demo

https://hugo-period.wasmer.app

## About the theme

Period is a Hugo theme maintained by leanku. This template does not copy the theme source. It imports github.com/leanku/hugo-period as a Hugo module pinned to commit 3743869251a8, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's published example.

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

Theme by leanku: https://github.com/leanku/hugo-period
License: NOASSERTION
Pinned commit: `3743869251a8bb330c837cd3a82a68ad93a3ed72`
