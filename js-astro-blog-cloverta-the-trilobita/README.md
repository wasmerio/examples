<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Blog Cloverta The Trilobita](https://github.com/ClovertaTheTrilobita/astro-blog-template) Astro theme by ClovertaTheTrilobita, copied from commit `e2174c25f7da7a8f895e805c297416d2f7fa0099` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-blog-cloverta-the-trilobita.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** The theme's example env file lists `PUBLIC_REMARK42_HOST`, `PUBLIC_REMARK42_SITE_ID`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [ClovertaTheTrilobita](https://github.com/ClovertaTheTrilobita), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro-Blog-Template

<p align="right">[<a href="./README.md">中文</a> | <a href="./README-en.md">English</a>]</p>

<p align="center"><br>
    ✨三叶的Astro博客模板✨<br><br>
    Built With<br>
    <img alt="Static Badge" src="https://img.shields.io/badge/Astro-6.4-purple?style=for-the-badge">
    <img alt="Static Badge" src="https://img.shields.io/badge/Nodejs-26-green?style=for-the-badge">
    <img alt="Static Badge" src="https://img.shields.io/badge/Heart-♥️-pink?style=for-the-badge">
    <br>
</p>


## 😋 特性

<br>

<p align="center">
    <img width="934" height="442" alt="image" src="https://github.com/user-attachments/assets/382d999d-9d30-4886-831f-a46fa59498bc" alt="preview-zh"/>
</p>

<br>

- 使用纯静态页面，响应迅速，轻盈美观
- 操作简易，Github Action自动部署
-  <del><i>Astro Is All You Need</i></del>

更多预览请移步：<b>[我的博客](https://blog.cloverta.top/)</b>。

## 🧳 使用

### 1. 使用模板

点击`Use this template`

并将其克隆到本地。

### 2. 运行/构建

> [!IMPORTANT]
>
> 在开始之前，请先<b>将根目录的`.env.example`重命名为`.env`并配置好环境变量</b>，否则功能会不完善

有关环境变量的说明详见：<b>[EnvVariables.md](docs/EnvVariables.md)</b>

- 安装依赖

  ```shell
  npm install
  ```

- 本地调试

  ```shell
  npm run dev
  ```

- 本地构建

  ```shell
  npm run build
  ```

### 3. 部署

#### 使用Github Actions自动化部署

详情参见：<b>[GithubActions.md](docs/GithubActions.md)</b>。

#### 手动部署

将生成的`dist/`目录上传至你的服务器，使用`NGINX`指向index.html。

### 4. 评论区

项目使用自托管 <b>[Remark42](https://remark42.com/)</b> 作为评论区系统。

安装部署详情请查看官方文档：<b>[Installation | Remark42](https://remark42.com/docs/getting-started/installation/)</b>

<hr>

## ⚖️ 许可

本仓库中的源代码部分采用 `MIT License` 开源。

除非另有说明，本仓库中的博客文章、其他原创的非代码内容采用 `CC BY-NC-ND 4.0` 协议。
