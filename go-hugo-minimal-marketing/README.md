# Minimal Marketing

## Demo

https://hugo-minimal-marketing.wasmer.app

## About the theme

Minimal Marketing is a Hugo theme maintained by letItCurl. This template does not copy the theme source. It imports github.com/letItCurl/minimal_marketing as a Hugo module pinned to commit ad8b62c250a4, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's published example.

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

Theme by letItCurl: https://github.com/letItCurl/minimal_marketing
License: MIT
Pinned commit: `ad8b62c250a46715d7e6081257b2d2cedf29479a`
