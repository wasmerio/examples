# 内容包与附件

当一篇文章包含多张配图、截图或可供读者下载的附件（如 `.zip` 压缩包、`.pdf` 讲义）时，如果把所有文件都塞进全局的 `public/` 目录，日积月累会非常难以维护。为此，BlogGPT 提供了**内容包（Content Bundles）**机制。

## 一个目录，一篇内容

无需将文章写成单独的 `.md` 文件，你可以为文章创建一个专属文件夹，并在其中放置 `index.md`（或多语言文件 `index.zh.md` / `index.en.md`）：

```text
content/posts/my-trip/
├── index.zh.md
├── index.en.md
├── photos/
│   ├── sunset.jpg
│   └── map.png
└── downloads/
    └── itinerary.pdf
```

你可以使用命令行工具一键生成内容包目录：

```bash
pnpm new post my-trip --use bundle --title "旅行随笔"
```

## 使用相对路径引用

在 `index.md`（或 `index.zh.md`）中，直接使用以 `./` 开头的相对路径即可引用同一目录下的图片与下载文件：

```markdown
![海湾日落](./photos/sunset.jpg)

点击下载完整行程单：[下载 PDF 行程单](./downloads/itinerary.pdf)
```

Frontmatter 中的文章封面图同样支持相对路径：

```yaml
---
title: 旅行随笔
image: ./photos/sunset.jpg
---
```

执行 `pnpm build` 时，BlogGPT 会自动处理内容包中的图片并将附件打包到对应的文章路径下。更好用的是，同一个内容包目录下的中文稿（`index.zh.md`）和英文稿（`index.en.md`）可以直接共用同一份 `./photos/` 和 `./downloads/` 资源，无需重复保存两份图片。

## 内容包与 `public/` 目录如何选择？

| 使用场景                                                 | 推荐存放位置                              | 引用路径写法                         |
| -------------------------------------------------------- | ----------------------------------------- | ------------------------------------ |
| 某篇文章专属的配图、截图、封面图或下载附件               | **内容包目录**（`content/posts/<slug>/`） | 相对路径（如 `./photos/sunset.jpg`） |
| 全站通用的静态资源（网站图标、作者头像、字体、验证文件） | **`public/` 根目录**                      | 根路径（如 `/favicon.svg`）          |
