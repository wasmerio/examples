# Tranquilpeak

## Demo

https://hugo-tranquilpeak.wasmer.app

## About the theme

Tranquilpeak is a Hugo theme maintained by kakawait. This template does not copy the theme source. It imports github.com/kakawait/hugo-tranquilpeak-theme as a Hugo module pinned to commit 3b5676afca7e, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

## Customise

Edit `hugo.toml` and the files under `content/`. Update the theme with `hugo mod get -u`. To change copies of the theme files, run `hugo mod vendor` and edit the vendored module.

## Run locally

Install Hugo extended 0.122.0 and Go 1.25.5. From this folder:

```bash
hugo mod get
hugo server
```

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs `hugo mod get` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by kakawait: https://github.com/kakawait/hugo-tranquilpeak-theme
License: GPL-3.0
Pinned commit: `3b5676afca7e667fc0d5c7f012c2ad00ca6dd9f0`
