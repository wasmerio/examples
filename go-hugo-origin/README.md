# Origin

## Demo

https://hugo-origin.wasmer.app

## About the theme

Origin is a Hugo theme maintained by fourtyone11. This template does not copy the theme source. It imports github.com/fourtyone11/origin-hugo-theme as a Hugo module pinned to commit 021c45772a9a, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by fourtyone11: https://github.com/fourtyone11/origin-hugo-theme
License: MIT
Pinned commit: `021c45772a9a028b97ca1b9c25d0293ee4854df2`
