# heyo

## Demo

https://hugo-heyo.wasmer.app

## About the theme

heyo is a Hugo theme maintained by LucasVadilho. This template does not copy the theme source. It imports github.com/LucasVadilho/heyo-hugo-theme as a Hugo module pinned to commit 020b8995f5d4, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by LucasVadilho: https://github.com/LucasVadilho/heyo-hugo-theme
License: MIT
Pinned commit: `020b8995f5d4c9bb9d4013bc815443c1622aac40`
