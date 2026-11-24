# Bootstrap Theme for Personal Blog and Documentations

## Demo

https://hugo-bootstrap-theme-for-personal-blog-and-do.wasmer.app

## About the theme

Bootstrap Theme for Personal Blog and Documentations is a Hugo theme maintained by razonyang. This template does not copy the theme source. It imports github.com/razonyang/hugo-theme-bootstrap as a Hugo module pinned to commit 6424069c0b7f, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

## Customise

Edit `hugo.toml` and the files under `content/`. Update the theme with `hugo mod get -u`. To change copies of the theme files, run `hugo mod vendor` and edit the vendored module.

## Run locally

Install Hugo extended 0.146.5 and Go 1.25.5. From this folder:

```bash
hugo mod get
hugo server
```

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs `hugo mod get` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by razonyang: https://github.com/razonyang/hugo-theme-bootstrap
License: MIT
Pinned commit: `6424069c0b7f9e66d994ef1eeea05355cf4b931b`
