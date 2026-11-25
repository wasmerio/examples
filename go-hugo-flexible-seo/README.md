# Flexible-SEO-Hugo

## Demo

https://hugo-flexible-seo.wasmer.app

## About the theme

Flexible-SEO-Hugo is a Hugo theme maintained by pjbakker. This template does not copy the theme source. It imports github.com/pjbakker/flexible-seo-hugo as a Hugo module pinned to commit d65d15e84bd4, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by pjbakker: https://github.com/pjbakker/flexible-seo-hugo
License: MIT
Pinned commit: `d65d15e84bd47c59a7a2182c2e7589ac6ef35264`
