# Lanyon

## Demo

https://hugo-lanyon.wasmer.app

## About the theme

Lanyon is a Hugo theme maintained by tummychow. This template does not copy the theme source. It imports github.com/tummychow/lanyon-hugo as a Hugo module pinned to commit cd7b91420a90, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by tummychow: https://github.com/tummychow/lanyon-hugo
License: MIT
Pinned commit: `cd7b91420a90e8f5cba8e6fc68ac4ce0a558ea92`
