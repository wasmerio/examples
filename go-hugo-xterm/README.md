# xterm

## Demo

https://hugo-xterm.wasmer.app

## About the theme

xterm is a Hugo theme maintained by manid2. This template does not copy the theme source. It imports github.com/manid2/hugo-xterm as a Hugo module pinned to commit c507667454ea, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by manid2: https://github.com/manid2/hugo-xterm
License: GPL-3.0
Pinned commit: `c507667454eae6c6c7444d465d6b497d125838f9`
