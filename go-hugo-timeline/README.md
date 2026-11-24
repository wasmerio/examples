# timeline

## Demo

https://hugo-timeline.wasmer.app

## About the theme

timeline is a Hugo theme maintained by s4n7h0. This template does not copy the theme source. It imports github.com/s4n7h0/hugo-theme-timeline as a Hugo module pinned to commit b2edb87d3406, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by s4n7h0: https://github.com/s4n7h0/hugo-theme-timeline
License: MIT
Pinned commit: `b2edb87d3406c0f71a78c9325e03d764c002e54a`
