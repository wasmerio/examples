# Hugo NexT

## Demo

https://hugo-nex-t.wasmer.app

## About the theme

Hugo NexT is a Hugo theme maintained by hugo-next. This template does not copy the theme source. It imports github.com/hugo-next/hugo-theme-next as a Hugo module pinned to commit 2c5a754f1ca8, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by hugo-next: https://github.com/hugo-next/hugo-theme-next
License: MIT
Pinned commit: `2c5a754f1ca84fb90b785cf99f0b9ab4dd8446de`
