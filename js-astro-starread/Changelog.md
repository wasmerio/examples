# 更新日志 / Changelog

本文件依据 Git 标签（tag）整理各版本提交记录，版本按时间倒序排列。
格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/)，提交类型遵循 Conventional Commits（feat 新功能 / fix 修复 / refactor 重构 / perf 性能 / style 样式 / docs 文档 / build 构建 / chore 杂项）。

## [0.2.2] - 2026-09-06

-- feat: 支持 GFM 警告框语法并优化构建与细节
- docs: 修复多语言 GFM 文档格式与脚本告警框处理逻辑
- feat: 优化导航栏背景样式
- style: 重构导航配置表格样式与交互逻辑
- feat: 添加主题自动切换并重构 UI 样式
- refactor: 重构主题为独立包并统一路径别名
- refactor: 清理主题自动切换相关代码并优化多项细节
- chore: 发布版本并修复交互式 select 问题
- chore: 添加 git 提交信息规范文件

## [0.2.1] - 2026-07-07

- feat: 首页添加 Hero 区域，替换静态资源为 avif，添加配置自定义选项页面
- feat: 新增多语言支持并重构内容架构
- feat: 重构 Hero 区域并新增丰富的动态效果
- feat: 添加 Hero 区域支持和配置页面
- feat: 添加服务端渲染支持与资源上传 API
- feat(配置): 添加登录页面链接及配置布局
- feat: 迁移图标系统至 @lucide/astro 并更新相关配置
- refactor: 重构主题配置结构与资源
- refactor: 完成主题代码重构，迁移至 TypeScript 并优化结构
- refactor: 重构组件结构与样式，统一文章卡片与侧边组件
- refactor(navbar,search): 优化导航栏样式与搜索功能
- refactor: 重构项目代码结构与依赖管理
- refactor: 整理项目资源与文档，优化站点配置
- refactor: 移除动态组件加载逻辑，改为静态组件引入
- build(astro): 调整 astro 配置文件的 vite 配置结构
- build: 配置路径别名并切换为静态构建模式
- chore: 移除未使用的主题依赖包
- chore: 启用静态预渲染并移除生产环境配置页提示
- chore: 删除过时的 .versionrc 配置文件
- chore: 更新项目依赖并添加 pnpm 工作区配置
- fix(build): 修复文件名称导致构建失败问题

## [v0.2.0] - 2026-01-04

- feat(文章卡片): 添加水平和垂直布局选项并优化卡片组件
- feat(主题配置): 添加文章顶部波浪效果配置及实现
- refactor(主题配置): 重构最新文章组件配置结构
- refactor(algolia): 统一使用 permalink 作为文章标识并优化 URL 生成
- refactor(comment): 优化 Twikoo 评论组件加载逻辑
- fix: 统一使用 article.data.permalink 作为文章链接
- fix(Banner): 修复横幅背景图片懒加载问题

## [v0.1.9] - 2025-12-27

- feat(标签页): 添加笔记内容到标签统计和显示
- feat(layouts): 优化分类和标签页面的文章列表展示样式
- feat: 添加页面链接预获取功能以提升导航速度
- feat: 实现组件动态加载功能并添加进度组件
- feat(首页侧边栏): 用进度统计组件替换日历组件
- perf: 优化图片加载和页面性能
- fix(搜索): 优化搜索组件以支持 Astro 5 的 View Transitions
- refactor(article): 优化文章相关组件和工具函数
- refactor(Carousel): 优化轮播组件代码结构和无缝轮播逻辑
- refactor(主题): 移除主题切换功能及相关代码
- style: 优化代码格式和样式
- docs: 更新 README 文件中的徽章样式和链接
- docs: 更新 README 和主题文档的多语言版本
- chore: 更新依赖包版本

## [v0.1.6] - 2025-11-16

- feat(轮播组件): 实现无缝轮播效果并优化交互体验
- feat(主题): 添加暗黑模式切换功能
- refactor(LatestArticle): 优化文章列表布局和图片处理
- refactor(layouts): 提取基础布局组件并重构各页面布局
- refactor(components): 将部分组件从框架特定格式迁移至 Astro 格式
- refactor(components): 将 ArticleTOC 从 Vue 迁移到 Astro 组件
- refactor(components): 将 ArticleInfo 从 Vue 迁移到 Astro 组件
- refactor: 移除未使用的 Vue 相关依赖和配置
- refactor: 移除组件中多余的 client:load 指令
- refactor: 移除 gray-matter 依赖并实现原生 frontmatter 解析
- chore: 移除未使用的依赖 dotenv 和 typescript
- docs: 更新多语言文档内容和结构

## [v0.1.5] - 2025-11-15

- feat: 添加 Astro Starread 主题安装器
- chore: 添加 standard-version 发布脚本
- refactor(layouts): 移除所有布局中的 ClientRouter 导入和使用
- fix(search): 修复页面切换时搜索功能失效问题
- docs: 更新多语言文档中的本地搜索说明
- docs: 从多语言 README 中移除 `pnpm changelog` 命令

## [v0.1.4] - 2025-11-12

- feat(主题): 为多语言主题文档添加封面图片并更新数据
- fix(search): 修复搜索模态框层级和背景样式问题
- refactor(pushAlgolia): 改用原生方式读取 .env 文件并解析

## [v0.1.3] - 2025-11-09

- feat(侧边栏): 添加日历组件并重构统计信息显示
- fix(search): 修复搜索模态框的 DOM 结构错误
- refactor: 移除未使用的类型定义和今日访问统计组件
- docs: 更新变更日志并添加预览图片

## [v0.1.2] - 2025-10-29

- feat(calendar): 添加多语言支持的日历组件并替换统计组件
- refactor: 移除 StatsWidget 组件及其相关功能
- refactor(Comment): 简化 Twikoo 脚本加载逻辑
- refactor(search): 移除 Algolia 搜索组件并重定向到主页
- perf(评论和搜索): 优化脚本加载和搜索初始化性能
- style(theme): 更新主题颜色和键盘组件样式
- fix(search): 修复 Algolia 高亮标签的样式问题
- chore: 移除未使用的依赖并更新环境变量加载方式

## [v0.1.1] - 2025-10-25

- refactor(components): 迁移 React 组件到 Vue 并优化功能
- chore: 移除 conventional-changelog 相关依赖和脚本
- fix: 将 Twikoo 评论系统的 envId 设置为 'none'
- fix(routing): 添加保留路由检查避免冲突
- docs: 添加版本预览图片并更新标题格式

## [v0.1.0] - 2025-10-23

- feat: 添加 GitHub 风格警告框支持并移除主题切换功能
- feat: 添加多语言主题文档并更新配置
- feat: 添加多语言文档并更新 package.json 配置
- feat: 添加文章永久链接并优化搜索功能
- refactor(content): 统一处理文章和笔记的链接及分类标签
- docs: 在搜索文章中添加来源引用
- docs: 为多语言文档添加主题安装标签并调整样式
- chore: 清理无用文件和更新依赖项

## [v0.0.9] - 2025-10-23

- feat(layouts): 添加 canonical 链接并支持多内容类型
- feat: 支持笔记集合并优化文章链接处理
- feat(路由): 添加随机 permalink 支持并实现动态路由
- feat: 添加自动更新永久链接和索引功能
- feat(ArticleNav): 添加 basePath 属性支持不同路径的文章导航
- feat(notes): 添加笔记功能模块，包括配置和页面
- refactor: 移除笔记功能并简化文章导航
- style(tag): 更新标签页面的颜色样式以匹配主题
- style(layouts): 更新分类页面样式使用主题色

## [v0.0.8] - 2025-10-23

- feat(search): 添加 Algolia 搜索组件并实现搜索结果展示、分页和错误处理
- feat(组件): 添加文章目录组件并重构布局索引
- refactor(ArticleInfo): 重构文章信息组件并迁移至 TSX 格式
- refactor(search): 将搜索提供商从 Algolia 切换为本地搜索

## [v0.0.7] - 2025-10-23

- feat: 添加客户端路由并优化搜索组件
- feat(ArticleInfo): 添加深色模式波浪动画效果并优化样式
- feat(搜索): 将默认搜索提供商改为本地并添加粘性目录功能
- feat(搜索): 切换搜索服务提供商到 Algolia 并添加错误处理
- feat(文章统计): 添加文章字数统计和全站统计功能
- refactor(config): 重构主题配置结构，将配置项分组到更合理的模块中
- style: 优化代码块样式并清理无用配置
- docs: 更新 GFM 示例文章内容与多语言文档

## [v0.0.6] - 2025-10-23

- feat(主题配置): 添加建站日期和站点统计功能配置
- feat(统计): 添加站点统计组件并移除文章页的浏览量显示
- feat(组件): 优化文章列表显示逻辑和样式
- feat(search): 优化搜索页面样式和功能
- feat(Algolia): 添加 Algolia 品牌标识和版权声明
- feat(Algolia): 配置每页显示 5 条结果并更新样式
- fix(ArticleInfo): 修复 busuanzi 脚本加载后未立即执行的问题

## [v0.0.5] - 2025-10-23

- feat: 添加多语言支持并更新主题配置
- feat: 添加不蒜子统计功能并优化 UI 样式
- feat(config): 添加封面图片配置选项
- feat(components): 优化搜索组件样式，根据主题配置动态计算封面图高度
- fix: 修复 busuanzi 脚本路径并调整图片高度参数
- style: 更新全局样式和组件颜色主题
- chore: 更新示例文章数据内容

## [v0.0.5-beta.3] - 2025-10-23

- feat: 添加 build 脚本和 create-astro-theme-starread 命令
- feat(组件): 添加文章导航和信息组件并优化目录样式
- feat(配置): 添加首页 banner 配置类型定义
- feat(文章): 添加文章导航功能并优化数据处理
- feat(public): 添加 favicon 图标并更新数据内容
- fix(LatestArticle): 处理更多日期格式输入情况
- fix: 修正 favicon 链接语法错误，网站图标类型改为 png
- chore: 移除 postinstall.js 脚本及其相关功能
- docs(config): 完善主题配置接口的文档注释
- revert: 撤销移除的 standard-version 插件

## [v0.0.5-beta.2] - 2025-10-22

- feat: 添加 React 支持和 Algolia 搜索功能
- feat(Algolia): 优化搜索结果显示和索引配置
- refactor(Algolia): 使用环境变量配置索引名并优化搜索图标样式
- refactor(search): 将搜索页从目录结构移动到根路径并重构
- refactor(搜索): 将 Algolia 搜索组件从 Astro 迁移到 React
- refactor(scripts): 重构搜索相关脚本和类型定义
- refactor(changelog): changelog 使用 ES 语法
- docs: 更新文章目录结构并添加新文档

## [v0.0.5-beta.1] - 2025-10-22

- feat: 添加搜索页面布局文件
- feat(algolia): 添加 Algolia 数据推送脚本并移除无用配置
- feat(搜索): 重构搜索组件并添加本地搜索功能
- feat(配置): 在主题配置中添加轮播标题字段
- refactor(search): 重构搜索功能并简化实现
- refactor(search): 移除 pagefind 集成并统一搜索结果链接格式
- fix: 移除 Algolia 搜索的默认配置

## [v0.0.5-beta.0] - 2025-10-22

- feat: 添加自动生成文章索引的脚本
- feat: 添加初始数据文件包含多篇文章信息
- feat(搜索): 实现本地模拟数据的搜索功能
- refactor(search): 重构搜索组件并迁移到 Algolia 搜索方案
- chore: 删除模板文件 astro.config.mjs 和 package.json

## [v0.0.5-alpha.3] - 2025-10-22

- refactor: 重构项目为 Astro 主题模板并移除 Algolia 集成
- refactor(config): 将主题配置迁移到 starread.config 并添加内容集合配置
- refactor(search): 重构搜索功能配置和实现
- refactor(components): 统一从 starread.config 导入 themeConfig
- feat: 添加 Astro 主题初始配置文件、依赖、脚本文件和类型定义

## [v0.0.5-alpha.2] - 2025-10-22

- feat(布局): 添加移动端底部导航栏并调整页脚间距
- feat(search): 添加 Algolia 搜索功能集成
- feat: 添加 Algolia 搜索支持并重构主题切换逻辑
- refactor(组件): 使用 astro:assets 的 Image 组件替换 img 标签
- refactor(搜索配置): 简化搜索配置结构并移除 meilisearch 支持
- feat(组件): 为多个组件添加 client:load 指令以启用客户端交互

## [v0.0.5-alpha.1] - 2025-10-22

- feat(search): 添加本地搜索组件及交互逻辑
- feat(changelog): 添加自定义 CHANGELOG 更新器，将三级标题改为二级
- refactor(搜索组件): 将 Search 组件替换为 LocalSearch 组件并删除旧组件
- refactor(导航栏): 重构导航栏组件和搜索功能
- refactor(search): 替换 Algolia 为 Pagefind 实现本地搜索
- fix: 修复主页布局缩进问题并移除废弃的搜索页面
- chore: 删除不再使用的 meilisearch.xml 配置文件

## [v0.0.5-alpha.0] - 2025-10-22

- feat(搜索): 添加搜索组件并支持多种搜索后端
- feat(搜索): 添加 Meilisearch 爬虫配置文件
- feat(文章): 添加最新文章组件和文章加载配置
- chore: 添加 Algolia 搜索相关脚本和依赖

## [v0.0.4] - 2025-10-22

- feat(分类): 添加分类页面和布局组件
- feat(标签): 添加标签页面和功能
- feat(侧边栏): 添加标签云组件并优化文章目录样式
- feat(文章): 添加默认封面并优化轮播组件
- feat: 更新公共资源文件，包括 404 图片、默认封面和图标
- revert(package): 回退之前的版本更新插件

## [v0.0.3] - 2025-10-21

- feat: 更新首页和文档 slug 引用方式
- feat(components): 更新组件样式并添加新功能
- refactor(img): 删除多余的图片
- refactor(content): 重构内容配置并更新示例文章
- refactor(layouts): 重构文章和主页布局组件
- refactor: 移除无用文件、tailwind 配置并简化项目配置
- style: 移除深色模式和 markdown 自定义样式，优化深色模式样式
- docs(about): 添加关于页面的测试标题

## [v0.0.2] - 2025-10-21

- fix(文章页面): 调整页面布局和日期处理逻辑
- refactor(content): 合并工具菜单项配置以简化结构
- style(layout): 调整文章布局在中等屏幕下的宽度
- style(LatestArticles): 更新悬停背景色以支持深色模式
- style(styles): 添加深色模式下的颜色变量和样式
- docs: 统一文章日期格式为仅日期

## [v0.0.1] - 2025-10-21

- feat(content): 添加示例文章并更新主题配置
- refactor(components): 替换 SVG 图标为 Iconify 并优化导航菜单
- build: 添加 tailwind 插件以支持 iconify 图标
- build: 更新依赖并优化构建配置
- docs(home): 更新页脚版权信息为星阅主题驱动

## [v0.0.1-alpha.4] - 2025-10-21

- feat(theme): 更新星阅主题样式和功能
- docs: 添加 compareUrlFormat 到版本配置文件

## [v0.0.1-alpha.3] - 2025-10-21

- feat: 添加深色模式支持
- feat(components): 添加暗色模式支持并优化组件可见性
- style: 修复导航链接颜色和背景颜色的拼写错误，移除多余空行
- chore: 更新 changelog 生成工具并删除无用组件
- docs(.versionrc): 更新文档部分的 emoji 和标题样式

## [v0.0.1-alpha.2] - 2025-10-21

- feat: 添加博客主题基础结构和组件
- feat(theme): 实现主题配置系统并重构布局组件
- feat(配置): 添加主题配置文件并定义网站基本结构
- feat: 添加应用 logo 的 SVG 文件
- feat(components): 重构多个组件以使用主题配置和动态数据
- build: 添加 Tailwind CSS 配置文件
- chore: 更新 .gitignore 并添加 .changelogrc 配置文件

## [v0.0.1-alpha.1] - 2025-10-21

- feat: 初始化 Astro 项目基础结构和样式
- build: 添加 tailwindcss 支持并更新项目配置
- docs: 添加英文版 README 文件

## [v0.0.1-alpha.0] - 2025-10-21

- feat: 初始化 Astro 项目基础配置和文件结构
- chore: 初始提交
