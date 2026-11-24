# Paper

## Demo

https://hugo-paper.wasmer.app

## About the theme

Paper is a Hugo theme maintained by nanxiaobei. This template does not copy the theme source. It imports github.com/nanxiaobei/hugo-paper as a Hugo module pinned to commit f7ed52a1da04, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

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

Theme by nanxiaobei: https://github.com/nanxiaobei/hugo-paper
License: MIT
Pinned commit: `f7ed52a1da04aa2c536a9c075354191dc10152f8`
