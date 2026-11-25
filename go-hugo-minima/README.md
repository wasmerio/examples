# Minima

## Demo

https://hugo-minima.wasmer.app

## About the theme

Minima is a Hugo theme maintained by mivinci. This template does not copy the theme source. It imports github.com/mivinci/hugo-theme-minima as a Hugo module pinned to commit ebe8c37492bd, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by mivinci: https://github.com/mivinci/hugo-theme-minima
License: MIT
Pinned commit: `ebe8c37492bddf77319e343ee54f1c7b7e575f93`
