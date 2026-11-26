---
# 测试关于页布局用的虚构资料 (LEMMA_ABOUT=sample, bun run dev:sample). 人名, 单位和论文都是编的.
# 中文版没有 tagline 字段, 用来检查可选字段缺失时的情况; 联系按钮用中文标签.
title: 关于
name: 乔林
links:
  - { label: 邮箱, href: 'mailto:lin.qiao@example.org' }
  - { label: 简历, href: cv.pdf }
  - { label: 谷歌学术, href: 'https://scholar.example.org/citations?user=abc123' }
  - { label: GitHub, href: 'https://github.com/example-lqiao' }
  - { label: 知乎, href: 'https://www.zhihu.example/people/lqiao' }
self: ['Qiao, Lin', '乔林']
sections:
  # 用 `kind:` 指明类型的块. activity: 过去一年的 GitHub 贡献, 构建时获取, 写在哪里都
  # 固定显示在简介下面. 不写 `github:` 时用 lemma.config.mjs 里的 site.links.github,
  # 所以这份虚构资料显示的是站长真实的贡献.
  - kind: activity
    heading: 动态
  # now: 近况, timezone (IANA 名称) 决定显示的当地时间.
  - kind: now
    text: 在写多尺度动理学的学习闭包, 同时给研究生开一门谱方法的读书课.
    updated: 2026 年 10 月
    place: 北湖
    timezone: Asia/Shanghai
  - kind: facts
    heading: 概览
    facts:
      - { label: 所在地, value: 北湖 }
      - { label: 办公室, value: '理科楼 B 座 412' }
      - { label: 语言, value: '中文, 英语, 一点德语' }
      - { label: 写作工具, value: 'LaTeX, Typst, Markdown' }
      - { label: 欢迎合作, value: 算子学习方向的合作, href: 'mailto:lin.qiao@example.org' }
  - kind: stack
    heading: 兴趣与工具
    groups:
      - { label: 研究, tags: [算子学习, 谱方法, 刚性 PDE, 多尺度动理学, 科学机器学习] }
      - { label: 语言, tags: [Python, Julia, C++, Fortran] }
      - { label: 工具, tags: [JAX, PyTorch, FEniCS, Dedalus, LaTeX, TikZ] }
  # 标题链接到 href, 没有 href 时链接到 repo. 这里的 stars 是手写的, 不写时从 GitHub 获取.
  - kind: projects
    heading: 软件
    projects:
      - title: sno
        note: JAX 写的谱神经算子, 含 NeurIPS 论文里的刚性求解器和学习闭包.
        repo: 'https://github.com/example-lqiao/sno'
        href: 'https://example.org/sno'
        stars: 412
        when: 2025
      - title: harbor
        note: 湍流槽道流上学习闭包的基准测试.
        repo: 'https://github.com/example-lqiao/harbor'
        stars: 57
        when: 2024
      - title: tikz-pde
        note: 画网格, 差分模板和相图的 TikZ 样式.
        repo: 'https://github.com/example-lqiao/tikz-pde'
        stars: 9
        when: 2022
      - title: northlake-notes
        note: 读书课的讲义, 没有年份, 也没有单独的主页.
        repo: 'https://github.com/example-lqiao/northlake-notes'
        stars: 0
  - heading: 工作经历
    items:
      - when: 2025 – 今
        title: 博士后, 计算科学研究院
        subtitle: '北湖大学 · 合作导师: Mira Halvorsen 教授'
        note: 刚性多尺度系统的算子学习; 带学习闭包的谱方法.
        href: 'https://example.org/ics'
      - when: 2024
        title: 研究实习, Harborview Labs 流体力学组
        subtitle: 暑期, 三个月
        links:
          - { label: 报告, href: 'https://example.org/report.pdf' }
          - { label: 代码, href: 'https://github.com/example-lqiao/harbor' }
  - heading: 教育经历
    items:
      - when: 2020 – 2025
        title: 应用数学博士, 北湖大学
        subtitle: '学位论文: 刚性且强非线性源项的反应扩散方程的谱神经算子方法'
        note: 导师周文教授. 优秀博士学位论文.
      - when: 2016 – 2020
        title: 数学学士, 东桥大学
  - heading: 代表论文
    selectedOnly: true
  - heading: 全部论文
    publications:
      - title: 'Spectral Neural Operators for Stiff Reaction–Diffusion Systems: Stability, Approximation Rates, and Learned Closures for Strongly Nonlinear Source Terms on Periodic and Bounded Domains'
        authors: [Xiaoyu Chen, Anna-Lena Müller, Lin Qiao*, Haoran Wang, 等]
        venue: Advances in Neural Information Processing Systems
        year: 2025
        selected: true
        url: 'https://example.org/papers/sno'
        pdf: 'https://example.org/papers/sno.pdf'
        arxiv: '2505.01234'
        doi: 10.5555/neurips.2025.01234
        links:
          - { label: 代码, href: 'https://github.com/example-lqiao/sno' }
          - { label: 幻灯片, href: 'https://example.org/sno-slides.pdf' }
        bibtex: |
          @inproceedings{qiao2025spectral,
            title = {Spectral Neural Operators for Stiff Reaction--Diffusion Systems},
            author = {Chen, Xiaoyu and Qiao, Lin and others},
            year = {2025},
          }
      - title: 刚性反应扩散方程的指数积分谱方法
        authors: [陈晓宇, 乔林, 周文]
        venue: '中国科学: 数学'
        year: 2024
        selected: true
        doi: 10.5555/scm.2024.0401
      - title: 'Learned Closures Fail Gracefully: A Negative Result'
        authors: [Lin Qiao, Chidi Okafor, Wen Zhou]
        venue: ICLR Workshop on Physics for Machine Learning
        year: 2023
      - title: On the Expressivity of Fourier Neural Operators
        authors: [Haoran Wang, Mira Halvorsen, Lin Qiao]
        venue: arXiv preprint
        year: 2022
        arxiv: '2210.04567'
  - kind: posts
    heading: 近期文章
    limit: 3
  - heading: 教学
    items: []
  - heading: 获奖
    items:
      - when: 2024
        title: 优秀研究生
      - title: 多家期刊审稿人
  # 没有一项写了日期: 列表占满整行.
  - heading: 服务
    items:
      - title: 北湖数值分析读书会组织者
        note: 每两周一次, 读谱方法和算子学习.
      - title: 本科生科研项目导师
---

我研究偏微分方程的数值分析与机器学习, 特别是刚性反应扩散系统的**算子学习**: 从少量轨迹学习解算子 $\mathcal{G}: u_0 \mapsto u(\cdot, T)$. 之前在[北湖大学](https://example.org)学习谱方法.

2026 年在找教职.
