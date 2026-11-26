<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [CVPage](https://github.com/reonokiy/cvpage) Astro theme by reonokiy, copied from commit `2c7a7387ab213fb8b9852762e4324472800c633f` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-cvpage.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [reonokiy](https://github.com/reonokiy), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# CVPage

![Demo](./public/demo.png)

## Features

- Dark Mode Suppport
- Multiple Language Support

## Installation

To Build this project locally, you need to have Node.js and pnpm installed on your machine. Follow these steps:

```bash
git clone https://github.com/reonokiy/cvpage
cd cvpage
pnpm install
pnpm run dev

# for building for production
pnpm run build
# pnpm run preview
```
## Configuration

All configuration is done in the `content/` directory.

### `content/cv`

Currently only yaml files in the `content/cv` folder is available. Filename should be in format of `[lang].yaml`. For example, `en.yaml`, `zh.yaml`.

#### Components

- baseinfo
    - `v0.email`
    - `v0.phone`
    - `v0.github`
    - `v0.google-scholar`
- cvinfo
    - `v0.markdown` 
    - `v0.unordered-list`
    - `v0.unordered-list-with-item`

You can find all schemas in the [schema](./schema) directory.

```
# yaml-language-server: $schema=../../schema/cv.json
```

With this line on the top of your YAML file, you can get schema validation and auto-completion support.