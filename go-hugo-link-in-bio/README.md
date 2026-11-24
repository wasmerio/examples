# Link In Bio

## Demo

https://hugo-link-in-bio.wasmer.app

## About the theme

Link In Bio is a Hugo theme maintained by HugoBlox. This template does not copy the theme source. It imports github.com/HugoBlox/hugo-theme-link-in-bio as a Hugo module pinned to commit fb176920db83, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's published example.

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

Theme by HugoBlox: https://github.com/HugoBlox/hugo-theme-link-in-bio
License: MIT
Pinned commit: `fb176920db83743f65e8d00080ddade04d548bc5`
