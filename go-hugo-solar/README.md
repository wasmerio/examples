# solar-theme-hugo

## Demo

https://hugo-solar.wasmer.app

## About the theme

solar-theme-hugo is a Hugo theme maintained by bake. This template does not copy the theme source. It imports github.com/bake/solar-theme-hugo as a Hugo module pinned to commit 97632b71c241, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by bake: https://github.com/bake/solar-theme-hugo
License: GPL-2.0
Pinned commit: `97632b71c2410a22269fd0456f61ae51adfd1063`
