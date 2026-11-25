# HugoTeX

## Demo

https://hugo-te-x.wasmer.app

## About the theme

HugoTeX is a Hugo theme maintained by 7ma7X. This template does not copy the theme source. It imports github.com/7ma7X/HugoTeX as a Hugo module pinned to commit 0d79ad018508, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by 7ma7X: https://github.com/7ma7X/HugoTeX
License: MIT
Pinned commit: `0d79ad018508e9f3d7dedc83e83cc80d6f6c884d`
