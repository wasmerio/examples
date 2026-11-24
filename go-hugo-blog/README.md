# Blog

## Demo

https://hugo-blog.wasmer.app

## About the theme

Blog is a Hugo theme maintained by guangzhengli. This template does not copy the theme source. It imports github.com/guangzhengli/hugo-theme-ladder as a Hugo module pinned to commit d8561d116bec, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by guangzhengli: https://github.com/guangzhengli/hugo-theme-ladder
License: MIT
Pinned commit: `d8561d116bec61da1c7a39fbe4e3a5e21ad42888`
