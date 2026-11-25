# TwentyNineteen Hugo

## Demo

https://hugo-twenty-nineteen.wasmer.app

## About the theme

TwentyNineteen Hugo is a Hugo theme maintained by jeremybise. This template does not copy the theme source. It imports github.com/jeremybise/twentynineteen-hugo as a Hugo module pinned to commit 7c0a63e24114, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by jeremybise: https://github.com/jeremybise/twentynineteen-hugo
License: GPL-2.0
Pinned commit: `7c0a63e24114098ba74b3b94f5f8fa43fb5eafb7`
