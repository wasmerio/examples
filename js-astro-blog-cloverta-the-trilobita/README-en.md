# Astro-Blog-Template
<p align="right">[<a href="./README.md">中文</a> | <a href="./README-en.md">English</a>]</p>
<p align="center"><br>
    ✨Cloverta's Astro Blog Template✨<br>
    <br>
    Built With<br>
		<img alt="Static Badge" src="https://img.shields.io/badge/Astro-6.4-purple?style=for-the-badge">
    <img alt="Static Badge" src="https://img.shields.io/badge/Nodejs-26-green?style=for-the-badge">
    <img alt="Static Badge" src="https://img.shields.io/badge/Heart-♥️-pink?style=for-the-badge">
    <br>
</p>

## 😋 Features

<br>

<p align="center">
	<img width="928" height="433" alt="image" src="https://github.com/user-attachments/assets/fd10836d-eccb-4291-8efc-8f8dad69f0b5" alt="preview-en"/>
</p>

<br>

- Built with purely static pages, responsive, lightweight, and visually pleasing
- Easy to use, with automatic deployment via GitHub Actions
- <del><i>Astro Is All You Need</i></del>

For more previews, please see: <b>[My Blog](https://blog.cloverta.top/)</b>.

## 🧳 Usage

### 1. Use template

Click `Use this template`

Then clone it to your local machine.

### 2. Run / Build

> [!IMPORTANT]
>
> Before getting started, please <b>rename `.env.example` in the root directory to `.env` and configure the environment variables</b>, otherwise some features may not work properly.

For details about environment variables, see: <b>[EnvVariables-en.md](docs/EnvVariables-en.md)</b>

- Install dependencies

  ```shell
  npm install
  ```

- Local development

  ```shell
  npm run dev
  ```

- Local build

  ```shell
  npm run build
  ```

### 3. Deployment

#### Deploy automatically with GitHub Actions

For details, see: <b>[GithubActions-en.md](docs/GithubActions-en.md)</b>.

#### Manual deployment

Upload the generated `dist/` directory to your server, and configure `NGINX` to point to `index.html`.

### 4. Comments

This project uses self-hosted <b>[Remark42](https://remark42.com/)</b> as its comment system.

For installation and deployment details, please refer to the official documentation: <b>[Installation | Remark42](https://remark42.com/docs/getting-started/installation/)</b>

<br>

## ⚖️ License 

The source code in this repository is licensed under the `MIT License`.

Unless otherwise stated, all blog posts and other original non-code content in this repository are licensed under `CC BY-NC-ND 4.0`.
