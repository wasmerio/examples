# Ivy

## Demo

https://hugo-ivy.wasmer.app

## About the theme

Ivy is a Hugo theme maintained by yihui. This template does not copy the theme source. It imports github.com/yihui/hugo-ivy as a Hugo module pinned to commit f7377e6fb752, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by yihui: https://github.com/yihui/hugo-ivy
License: Unlicense
Pinned commit: `f7377e6fb7521f294d8dce6bd08f93612af90765`
