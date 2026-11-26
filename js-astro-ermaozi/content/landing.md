---
title: 自定义首页示例
description: 展示 Plume 风格的 Hero、功能、图文、资料与自定义首页区域。
permalink: /landing/
home: true
config:
  - type: doc-hero
    hero:
      name: ermaozi
      text: 内容站点起点
      tagline: 博客、文档、搜索与增强 Markdown
      image: /img/logo.svg
      actions:
        - text: 开始使用 →
          link: /docs/
          theme: brand
        - text: 浏览博客
          link: /blog/
          theme: alt
          suffixIcon: simple-icons:github
          target: _self
          rel: noopener
  - type: hero
    backgroundImage:
      light: /img/logo.svg
    backgroundAttachment: fixed
    filter: opacity(0.14) blur(1px)
    hero:
      name: ImageBg
      tagline: 浅色与深色背景资源
      text: 图片、滤镜与 fixed attachment 使用 frozen ImageBg 语义。
      actions:
        - text: 查看配置
          link: /docs/guide/configuration/
          theme: brand
          icon: material-symbols:settings
  - type: features
    title: 内置能力
    description: 用相同的内容模型构建博客与文档。
    features:
      - title: 响应式布局
        icon:
          src: /img/logo.svg
          alt: ermaozi
          width: 48
          height: 48
          wrap: true
        details:
          - 适配桌面、平板与手机。
          - 支持指针与键盘。
        link: /docs/
        linkText: 了解更多
      - title: 全文搜索
        icon: material-symbols:search
        details: 构建时生成 Pagefind 索引。
      - title: 双语内容
        icon: <span aria-hidden="true">🌐</span>
        details: 支持语言切换与 hreflang。
  - type: image-text
    title: 一份配置，多种页面
    description: 站点身份、导航和功能开关集中维护。
    image: /img/logo.svg
    width: 210
    list:
      - title: 博客
        description: 博客列表、分类、标签与归档
      - 文档侧栏、目录与上下篇导航
      - 深色模式、搜索和增强 Markdown
  - type: text-image
    title: 反向图文区域
    description: 同一组件通过 type 切换桌面排列方向。
    image:
      light: /img/logo.svg
      dark: /img/logo.svg
      alt: ermaozi
    width: 12rem
    backgroundImage:
      dark: /img/logo.svg
    backgroundAttachment: local
    list:
      - 图片支持浅色与深色资源
      - 背景支持 local attachment
  - type: profile
    name: Site Author
    description: 在 site.config.mjs 中替换通用资料。
    avatar: /img/logo.svg
    circle: true
  - type: Announcement
    title: 可扩展首页区域
    description: theme/components/home 中的 Astro 或 Vue 组件会按文件名自动注册。
  - type: posts
    collection: blog
  - type: custom
createTime: 2026/08/05 20:24:51
---

# 自定义内容

`custom` 区域会渲染首页 Markdown 正文，可继续使用主题的 Markdown 扩展。
