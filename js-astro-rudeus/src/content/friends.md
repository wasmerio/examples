---
type: friends
title: 友情链接
description: 互联网的朋友们的跃迁坐标
---

在 content 根目录创建 md 文件，并将 frontmatter 中的 `type` 改为 `friends`，即可生成一个友情链接页面。主题会自动读取 `src/content/friends.yaml` 中的内容，并生成友情链接列表，渲染到 Markdown 正文内容之前。

该文件的规则为包含多个对象的数组。每个对象中，`name` 的值为该网站的名称，`description` 的值为该网站的简介，`link` 的值为该网站的 URL，`avatar` 为该网站的图标/头像。

例如，你可以查看渲染此文档网页的友情链接列表的 [friends.yaml](https://github.com/crrashh1542/astro-theme-rudeus/blob/main/src/content/friends.yaml)，如下所示：

```yaml
- name: 云萧的咕咕屋
  description: Rudeus 主题作者的博客！
  link: https://blog.crrashh.com
  avatar: https://i.cdn.crrashh.com/avatar.jpg

- name: GitHub
  description: Rudeus 主题的源代码
  link: https://github.com/crrashh1542/astro-theme-rudeus
  avatar: https://i.cdn.crrashh.com/2026/0315/d5af9d5cb88d8e11

- name: 哔哩哔哩
  description: Rudeus 主题作者的哔哩哔哩账号
  link: https://space.bilibili.com/40683339
  avatar: https://i.cdn.crrashh.com/2026/0315/56e38bc9c507c86f
```
