# Tale

## Demo

https://hugo-tale.wasmer.app

## About the theme

Tale is a Hugo theme maintained by EmielH. This template does not copy the theme source. It imports github.com/EmielH/tale-hugo as a Hugo module pinned to commit f366fd37ceb0, builds it with Hugo extended, and serves the result on Wasmer Edge. The theme has no example site at this commit, so the demo pages come from Hugo's basic example.

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

Theme by EmielH: https://github.com/EmielH/tale-hugo
License: MIT
Pinned commit: `f366fd37ceb0420544e8a27c33bdaf1b2d042427`
Demo content from gohugoio/hugoBasicExample (MIT) at `c500a6256906e2cd7c4d707370dca721906e94b3`.
