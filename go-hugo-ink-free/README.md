# ink-free

## Demo

https://hugo-ink-free.wasmer.app

## About the theme

ink-free is a Hugo theme maintained by chollinger93. This template does not copy the theme source. It imports github.com/chollinger93/ink-free as a Hugo module pinned to commit 0313b7c5cf62, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by chollinger93: https://github.com/chollinger93/ink-free
License: MIT
Pinned commit: `0313b7c5cf62ac1547be095d8fd7364b5c9eda8d`
