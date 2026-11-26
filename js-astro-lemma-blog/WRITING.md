# 写作速查表

完整示例见 `src/content/posts/hello-math/zh.md` (草稿, 只在 `bun run dev` 中显示).

## 新文章

```sh
bun run new fno-notes        # 新建 src/content/posts/fno-notes/zh.md
bun run new fno-notes --en   # 同一篇的英文版 en.md
bun run dev                  # 预览 http://localhost:4321/posts/fno-notes/
```

一篇文章一个文件夹, 图片和视频放在同一个文件夹里. 中英文版本共用一个文件夹, 可以只有其中一个.

```yaml
---
title: 标题
description: 一两句摘要, 必填. 显示在标题下, 文章列表和搜索引擎结果里.
date: 2026-10-10
updated: 2026-11-01      # 可选, 显示 "更新于", 也是 sitemap 的 lastmod
tags: [PDE, 神经算子]
draft: true              # 改成 false 才会发布
numbering: true          # 可选, false 关闭章节编号
ai: true                 # 可选, 文章由 AI 撰写时写上, 日期行会显示 AI 标记
macros:                  # 可选, 只在本文生效
  Lap: '\Delta'
  norm: ['\left\| #1 \right\|', 1]
---
```

frontmatter 是 YAML: 值里有 "冒号 + 空格" 时 (例如 `description: "一览: 公式, 定理"`), 要加引号, 否则内容同步会失败, dev 服务器停在旧内容上.

## 章节

```md
## 引言 \label{sec:intro}
### 记号
```

`##` 和 `###` 自动编号 (1, 1.1). 引用写 `第 \ref{sec:intro} 节`.

## 公式

```md
行内 $u_t = \Delta u$, 行间:

$$
\begin{equation}
  -\Delta u = f \quad \text{in } \Omega
  \label{eq:poisson}
\end{equation}
$$

由 \eqref{eq:poisson} 可知 ...
```

- `\eqref` 和 `\ref` 可以直接写在正文里, 不用加 `$`. 引用写在公式前面也可以.
- 全站宏在 `lemma.config.mjs` 的 `math.macros` 里, 比如 `\R`, `\set{...}`, `\inner{u}{v}`.
- 已加载 physics, mathtools, cases, mhchem 等宏包. 用了未定义的宏, 构建时会给出 `[mathjax]` 警告.

## 定理

```md
:::theorem[Lax-Milgram]{#thm:lax}
设 $a$ 是 Hilbert 空间 $V$ 上有界且强制的双线性型, 则 ...
:::

:::proof
由 Riesz 表示定理 ...
:::
```

可用的环境: theorem, lemma, proposition, corollary, definition, example, remark, proof. 编号按节计 (2.1, 2.2). 引用写 `定理 \ref{thm:lax}`. `:::proof[定理 \ref{thm:lax} 的证明]` 可以替换证明的标题.

## 引用文献

```md
见 \cite{evans2010}, \cite{a, b}, \cite[第 6 章]{evans2010}.
```

- 文献条目写在 `src/bibliography.bib` 里, 是普通的 BibTeX, 直接编辑即可. citekey 就是条目里 `@article{key,` 的 `key`.
- 也可以用文献管理软件导出 BibTeX, 再把文件加进 `lemma.config.mjs` 的 `bibliography.files`.
- 文末自动生成 "参考文献", 按首次引用的顺序编号. key 不存在时, 构建会给出 `[cite]` 警告.

## 图, 表, 交换图

```md
:::figure{#fig:mesh .invert-dark}
![网格](./mesh.png)

图注, 可以有公式 $h \to 0$.
:::

:::table{#tab:err}
| $h$ | 误差 |
|--:|--:|
| 0.1 | 1.2e-3 |

表注写在下面, 显示在表格上方.
:::
```

- 引用写 `图 \ref{fig:mesh}`, `表 \ref{tab:err}`.
- `.invert-dark`: 透明背景上的黑线图, 在深色模式下自动反色. 照片不要加.
- 图片原图尽量小于 2 MB. 线条图优先用 SVG.

交换图和 TikZ 图 (本机用 LaTeX 编译, 可以放进 `:::figure` 里):

````md
```tikzcd
A \arrow[r, "f"] \arrow[d, "g"'] & B \arrow[d, "h"] \\
C \arrow[r, "k"'] & D
```

```tikz
\draw[->] (0,0) -- (2,1) node[right] {$u(x,t)$};
```
````

- 全站宏和本文的宏在图里同样可用.
- 编译结果缓存在 `tikz-cache/`. 这个目录要一起 commit, 否则部署时没有这张图.
- 编译出错时, 构建会给出 `[tikz]` 警告, 页面上显示源码.

## 视频

```md
:::figure[解的演化.]{#fig:evolution}
![热方程的解](./heat.mp4)
:::
```

- 视频小于 25 MiB 时, 直接放进文章文件夹.
- 视频更大时, 先运行 `bun run media:push`. 它会上传到 R2 (`media.chengrui.dev`), 并让 git 忽略这个文件. 文章里的写法不变. 上传要用 `cf` 命令行工具: 先安装 `cf`, 再运行 `cf auth login`.
- 压缩建议: H.264, 1080p 以内. `ffmpeg -i in.mov -c:v libx264 -crf 26 -preset slow -an out.mp4`.

## 其他

- 脚注: `正文[^1]`, 然后 `[^1]: 注释内容.`
- 代码块: 用三个反引号, 写上语言, 比如 ` ```python `. 页面上有复制按钮.
- 用 `.md`, 不要用 `.mdx`. MDX 会把 `{` 和 `<` 当成代码, TeX 会出错.
- 站内搜索只搜已发布的文章 (不含草稿), 索引在 `bun run build` 时生成. `bun run dev` 用的是上一次 build 的索引, 所以刚写的内容要 build 之后才搜得到. 公式搜不到, 行内公式在搜索摘要里显示为 "…"; 参考文献列表也不进索引.

## 关于页

关于页 (`/about/` 和 `/en/about/`) 的内容都在 `src/content/about/` 里:

- `zh.md`, `en.md`: frontmatter 写姓名, 链接和各个板块 (包括论文), 正文写简介. 每个字段的说明见本节和 `README.md` 的 "About page" 一节; `src/about.sample/` 里的虚构资料用到了全部板块, 可以照着写. 删掉其中一个, 对应语言就没有关于页, 页头也没有 "关于" 链接.
- 其他文件 (例如 `cv.pdf`): 在 frontmatter 里用相对路径链接 (`href: cv.pdf`, 论文的 `pdf: paper.pdf` 或 `url: paper.pdf`, 可以带 `#page=2`), 发布在 `/about/cv.pdf`. 没有被链接的文件不会发布, `zh.md` 和 `en.md` 本身也不会.

```yaml
sections:
  - heading: 教育经历
    items:
      - when: 2023 – 今
        title: 博士研究生, 某某大学
        subtitle: '数学系 · 导师: 某某教授'
        links:
          - { label: 课题组, href: 'https://example.com' }
```

姓名下面的 `links` 显示为一排按钮, 按钮上写链接的去向: `mailto:` 显示邮箱地址, `https://github.com/<用户名>` 显示用户名, 其他链接显示 `label`, 前面各有一个图标. 有关于页的语言, 页脚就不再显示邮箱和 GitHub.

除了条目和论文, 板块还可以用 `kind:` 指明类型. GitHub 贡献图 (`activity`) 固定在简介下面, 写在哪里都一样; 其他板块按写的顺序排列. 姓名下面的链接也固定在页面顶部. `heading` 都可以省略:

```yaml
sections:
  - kind: activity                # 过去一年的 GitHub 贡献, 构建时获取, 固定在简介下面
    heading: 动态
    github: jczhang02             # 可省略, 默认是 lemma.config.mjs 里的 site.links.github
  - kind: now                     # 近况, 带地点和当地时间
    text: 在写多尺度动理学的学习闭包.
    updated: 2026 年 10 月
    place: 北湖
    timezone: Asia/Shanghai       # IANA 时区名
  - kind: facts                   # 概览: 标签和值, href 可选
    heading: 概览
    facts:
      - { label: 所在地, value: 北湖 }
  - kind: stack                   # 兴趣与工具, 按组列出
    heading: 兴趣与工具
    groups:
      - { label: 研究, tags: [算子学习, 谱方法] }
  - kind: projects                # 软件: 标题链接到 href, 没有 href 时链接到 repo; 不写 stars 时从 GitHub 获取, 为 0 时只显示 GitHub 图标
    heading: 软件
    projects:
      - { title: sno, note: 谱神经算子., repo: 'https://github.com/…', stars: 412, when: 2025 }
  - kind: posts                   # 本语言最新的几篇文章
    heading: 近期文章
    limit: 3
```

GitHub 贡献和 stars 在 `bun run build` 时重新获取, `bun run dev` 用 6 小时内的缓存 (`node_modules/.cache/lemma/`). 所以页面上的数据停在最后一次部署的那一天. 获取失败时用上一次的缓存. 贡献数据的最后一天距今超过两天时, 会注明 "截至" 哪一天: 构建时用了旧缓存, 或者页面部署后过了两天以上 (由浏览器判断), 都会这样. 完全没有缓存时, 构建会报错停止, 不会悄悄少掉贡献图; `bun run dev` 只给出一行 `[about]` 警告, 不显示这一块. `timezone` 写错时构建也会报错, 并指出是哪个字段.

条目字段: `when` (左栏时间, 原样显示), `title` (必填), `subtitle`, `note`, `href`, `links`. 值里有 "冒号 + 空格" 时要加引号.

字段名写错, 或者值的类型不对 (比如 `year: '2025'`, 没加引号的 arXiv 编号), 构建会报错, 并指出是哪个字段, 例如 `sections.3.publications.2.year`. 顶层的 `tagline:`, `links:`, `self:`, `sections:` 后面留空, 等于没写.

### 论文

论文直接写在 frontmatter 里, 一篇一项, 按年份倒序显示. 下面这段可以整段复制:

```yaml
  - heading: 代表论文
    selectedOnly: true          # 没有自己的列表: 显示下面各板块里 selected: true 的论文
  - heading: 全部论文
    publications:
      - title: 'Neural Operators for Burgers'' Equation: A Study'
        authors: [张三, Some Coauthor, Another Author]   # 按显示的样子写
        venue: Journal of Computational Physics          # 可选, 西文斜体, 中文正体
        year: 2026                                       # 可选, 没有年份的排在最后
        note: Oral                                       # 可选, 写在 venue 后面
        selected: true                                   # 可选, 放进 "代表论文"
        url: 'https://example.com/paper'                 # 可选, 标题的链接
        pdf: paper.pdf                                   # 可选, 网址或本文件夹里的文件
        arxiv: '2601.00001'                              # 可选, 编号 (加引号) 或网址
        doi: 10.0000/example                             # 可选, 编号或网址
        links:                                           # 可选, 排在 PDF · arXiv · DOI 后面
          - { label: 代码, href: 'https://github.com/example/code' }
        bibtex: |                                        # 可选, 有它才显示 "BibTeX" 复制按钮
          @article{zhang2026burgers,
            title = {Neural Operators for Burgers' Equation: A Study},
            author = {Zhang, San and Coauthor, Some and Author, Another},
            journal = {Journal of Computational Physics},
            year = {2026},
          }
      - title: 偏微分方程的谱方法
        authors: [张三, 李四]
        venue: '中国科学: 数学'
        year: 2025
```

- 作者列表里, `self` 列出的名字加粗. `'Zhang, San'` 也匹配 `San Zhang`; 名字后面的 `*` 之类的符号不影响匹配.

### 模板标记

模板里的占位内容都带着 `ABOUT_TEMPLATE`. 正式构建 (`bun run build`, `bun run deploy`) 时, 正文或字段值里只要还有这个标记, 这一语言的关于页就不生成, 页头也没有 "关于" 链接, 构建给出一行警告. YAML 注释里的标记不算. 把所有占位内容换掉, 正文和字段值里的标记全部删除后, 页面才会上线. `bun run dev` 不受影响, 可以边写边看.

### 隐私

这个文件夹只放真实内容. 除非你要求, agent 不会主动查看它 (见 `AGENTS.md`). 调整关于页的样式时, 用 `src/about.sample/` 里的虚构资料: `bun run dev:sample` (端口 4399). `LEMMA_ABOUT` 有值时, `bun run deploy` 会拒绝运行, 虚构资料不会上线.
