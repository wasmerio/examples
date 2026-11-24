# terminal-cookbook

## Demo

https://hugo-terminal-cookbook.wasmer.app

## About the theme

terminal-cookbook is a Hugo theme maintained by rullmann. This template does not copy the theme source. It imports github.com/rullmann/hugo-theme-terminal-cookbook as a Hugo module pinned to commit be15b9007685, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by rullmann: https://github.com/rullmann/hugo-theme-terminal-cookbook
License: MIT
Pinned commit: `be15b90076851c1f3953841ed31b9cd978bcf74f`
