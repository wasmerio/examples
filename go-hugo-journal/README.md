# Journal

## Demo

https://hugo-journal.wasmer.app

## About the theme

Journal is a Hugo theme maintained by cvhariharan. This template does not copy the theme source. It imports github.com/cvhariharan/hugo-journal as a Hugo module pinned to commit adbf28f5bd9a, builds it with Hugo extended, and serves the result on Wasmer Edge. The demo pages come from the theme's exampleSite folder.

## Customise

Edit `hugo.toml` and the files under `content/`. Update the theme with `hugo mod get -u`. To change copies of the theme files, run `hugo mod vendor` and edit the vendored module.

## Run locally

Install Hugo extended 0.145.0 and Go 1.25.5. From this folder:

```bash
hugo mod get
hugo server
```

## Deploy to Wasmer

This folder is a Wasmer Edge template. Deploy it from the Wasmer template catalog, or with the Wasmer CLI from this directory. The build runs `hugo mod get` and then Hugo, and static-web-server serves the published site.

## License and credits

Theme by cvhariharan: https://github.com/cvhariharan/hugo-journal
License: MIT
Pinned commit: `adbf28f5bd9af1af4c8798cb94abc189f9a9019b`
