# Ticky Tacky Dark

## Demo

https://hugo-ticky-tacky-dark.wasmer.app

## About the theme

Ticky Tacky Dark is a Hugo theme maintained by kc0bfv. This template does not copy the theme source. It imports github.com/kc0bfv/ticky_tacky_dark as a Hugo module pinned to commit f626fbd274d1, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by kc0bfv: https://github.com/kc0bfv/ticky_tacky_dark
License: MIT
Pinned commit: `f626fbd274d172fb7532bc52721d6be6123e7009`
