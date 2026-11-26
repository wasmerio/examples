# create-astro-theme-starread

## 项目概述
create-astro-theme-starread 是一个 Astro 主题安装器，帮助用户快速创建基于 starread 主题的博客或网站项目。该工具会自动复制主题模板文件并引导用户完成依赖安装和开发环境配置。

## 安装步骤

1. 创建项目：
根据您使用的包管理器，选择以下命令之一：
```bash
# 使用 pnpm
pnpm create astro-theme-starread my-blog

# 使用 npm
npx create-astro-theme-starread my-blog

# 使用 yarn
yarn create astro-theme-starread my-blog

# 使用 cnpm
cnpm init astro-theme-starread my-blog
```

2. 进入项目目录：
```bash
cd my-blog
```

3. 安装依赖（工具会自动提示，也可手动运行）：
```bash
npm install
# 或使用其他包管理器
pnpm install / yarn install / cnpm install
```

4. 启动开发服务器：
```bash
npm run dev
# 或使用其他包管理器
pnpm dev / yarn dev / cnpm dev
```

## 功能特点
- 一键创建基于 starread 主题的 Astro 项目
- 自动复制主题模板文件
- 支持多种包管理器（npm/pnpm/yarn/cnpm）
- 交互式安装流程，简单易用