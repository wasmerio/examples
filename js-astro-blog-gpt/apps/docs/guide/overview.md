# 认识 BlogGPT

**BlogGPT** 是一款基于 [Astro](https://astro.build/) 构建的静态博客主题，界面设计受 ChatGPT 启发。它将可折叠、可调整宽度的侧边栏导航与专注的正文阅读区融为一体，非常适合技术博客、个人随笔与多语言知识库。

所有文章与页面均以标准 Markdown 或 MDX 文件保存在代码仓库中，无需数据库或复杂的后台管理系统。

## 从这里开始

你可以根据当前需求直接跳转到对应章节：

| 你想做什么                                 | 推荐阅读章节                                      |
| ------------------------------------------ | ------------------------------------------------- |
| 在本地初始化并预览新博客                   | [安装与预览](./getting-started.md)                |
| 修改站点名称、域名和浅色/深色主题          | [站点与外观](../config/site.md)                   |
| 了解文章头部元数据（YAML）怎么写           | [Frontmatter 字段说明](../content/frontmatter.md) |
| 用命令行一键创建带模板的新文章             | [Archetype 模板](../content/archetypes.md)        |
| 搭建中英双语或多语言博客                   | [语言与多语言内容](../content/languages.md)       |
| 将配图与下载附件和文章放在同一目录         | [内容包与附件](../content/bundles.md)             |
| 配置侧边栏菜单、作者名片与友情链接         | [导航、作者和友链](../config/navigation.md)       |
| 管理文章分类、标签或新建关于页面           | [分类、标签和页面](../content/taxonomy.md)        |
| 开启数学公式、流程图、提示块或社交分享卡片 | [文章增强](../config/enhancements.md)             |
| 调整阅读统计、一键复制分享模板与分页数量   | [阅读界面、分享与统计](../config/reading.md)      |
| 注入自定义 CSS、第三方统计或客户端脚本     | [自定义 Hook 与扩展](../customization/hooks.md)   |
| 部署到 Vercel、Netlify 或 GitHub Pages     | [构建与部署](./deployment.md)                     |
| 从 Hugo、Hexo 或 Jekyll 迁移旧文章         | [迁移现有博客](./migration.md)                    |
| 查阅 `blog.config.ts` 的全部配置项         | [配置参考](../config/reference.md)                |

## 常用文件与目录

使用官方 [BlogGPT Starter 模板](https://github.com/Raincarnator/astro-theme-BlogGPT-starter) 创建项目后，你日常主要会接触以下文件和目录：

```text
.
├── blog.config.ts       # 核心配置文件（站点信息、作者、外观、导航与功能开关）
├── friends.config.ts    # 友情链接分组配置
├── content/             # 存放所有 Markdown / MDX 内容
│   ├── posts/           # 博客文章
│   ├── pages/           # 独立页面（如关于页 About）
│   ├── categories/      # 分类信息定义
│   └── tags/            # 标签信息定义
├── archetypes/          # `pnpm new` 使用的默认内容模板
├── custom/              # 自定义扩展目录（头部标签注入、样式覆盖与客户端钩子）
└── public/              # 根路径静态资源目录（如 favicon.svg、头像、全局文件）
```

## 演示站点

想直接体验 BlogGPT 的实际阅读与交互效果？欢迎访问[在线演示站点](https://demo.bloggpt.reincarnatey.net)。
