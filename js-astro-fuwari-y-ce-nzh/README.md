<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Asterris](https://github.com/yCENzh/Fuwari-yCENzh) Astro theme by yCENzh, copied from commit `654bc14b9cedac58636fab02546a8f69d899a570` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-fuwari-y-ce-nzh.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.jsonc.
  - Resized 2 images over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [yCENzh](https://github.com/yCENzh), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# 🍥Fuwari

基于 [Astro](https://astro.build) 开发的静态博客模板。

[**🖥️在线预览**](https://fuwari.oh1.top)

![Preview Image](https://raw.githubusercontent.com/saicaca/resource/main/fuwari/home.png)

## 食用方法
1.  [Fork本项目](https://github.com/yCENzh/fuwari/fork)
2.  使用静态托管网站创建一个项目 -> 导入现有Git存储库 -> 保存并构建(本项目以pnpm构建)
3.  没了,非常的简单,后续食用方法请查看我的博客

Fuwari 是一个开源的主题。本网站用于该项目的文档、演示与社区信息。

- 网站： https://fuwari.oh1.top
- 仓库： https://github.com/yCENzh/fuwari
- License： MIT（见 ./LICENSE）

## 📄 License

This project is licensed under the MIT License.