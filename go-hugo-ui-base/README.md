# UI Base

## Demo

https://hugo-ui-base.wasmer.app

## About the theme

UI Base is a Hugo theme maintained by pkgstore. This template does not copy the theme source. It imports github.com/pkgstore/hugo-ui-blog-old as a Hugo module pinned to commit f1650afd5ccb, builds it with Hugo extended, and serves the result on Wasmer Edge. The theme has no example site at this commit, so the demo pages come from Hugo's basic example.

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

Theme by pkgstore: https://github.com/pkgstore/hugo-ui-blog-old
License: MIT
Pinned commit: `f1650afd5ccb57eb3b78db4fcaa6ff7e83846196`
Demo content from gohugoio/hugoBasicExample (MIT) at `c500a6256906e2cd7c4d707370dca721906e94b3`.
