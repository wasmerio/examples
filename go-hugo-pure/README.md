# hugo-pure

## Demo

https://hugo-pure.wasmer.app

## About the theme

hugo-pure is a Hugo theme maintained by undus5. This template does not copy the theme source. It imports github.com/undus5/hugo-pure as a Hugo module pinned to commit 6209a7f1656a, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's published example.

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

Theme by undus5: https://github.com/undus5/hugo-pure
License: MIT
Pinned commit: `6209a7f1656a0b55155b45bdbd91099ded3efeb0`
