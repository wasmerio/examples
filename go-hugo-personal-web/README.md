# Personal Web

## Demo

https://hugo-personal-web.wasmer.app

## About the theme

Personal Web is a Hugo theme maintained by bjacquemet. This template does not copy the theme source. It imports github.com/bjacquemet/personal-web as a Hugo module pinned to commit 69cf270ceddf, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by bjacquemet: https://github.com/bjacquemet/personal-web
License: MIT
Pinned commit: `69cf270ceddf75831a9fb508dcbf1009a2ef855a`
