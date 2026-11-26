<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Rudeus](https://github.com/crrashh1542/astro-theme-rudeus) Astro theme by crrashh1542, copied from commit `348b22bba99a05cdc674f2e9e924ded3c3f82771` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-rudeus.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [crrashh1542](https://github.com/crrashh1542), Apache-2.0. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Theme Rudeus

![版本](https://img.shields.io/github/package-json/v/crrashh1542/astro-theme-rudeus)
![上次提交](https://badgen.net/github/last-commit/crrashh1542/astro-theme-rudeus)
![开源协议](https://img.shields.io/github/license/crrashh1542/astro-theme-rudeus)

> 学习 Astro 也要拿出真本事！

## 关于

如你所见，Rudeus 是一个简洁明亮的基于 Astro 博客主题。由于项目主要为自用的用途，所以烦请各位理解部分配置和其他主题不一样~

注：此主题处于开发初期，不建议用于生产环境。

## 博客配置和写文章

详见文档 <https://rudeus-docs.crrashh.com>

## 部署

1. 安装 Node.js 18 及以上版本，再安装 PNPM。
2. 拉取此项目，安装依赖，启动开发服务器，默认端口为 20480。

```shell
pnpm install
pnpm dev
```

3. 开发环境预览完成后，构建生产环境页面，在 `dist` 目录下即可查收和部署~

```shell
pnpm build
```
