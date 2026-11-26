---
name: wisp-writer
description: 在 Wisp（Astro 技术博客主题）站点中写作的 skill。用户要求写、改写、扩写一篇博客文章，把笔记、论文、文档或对话整理成博客，批量生成文章草稿，或者检查文章的 frontmatter、格式、标签是否合规时使用。提供文章模板、创建脚本、检查脚本和中文技术写作规范，保证文章风格与主题一致。画图请交给 wisp-diagram skill，本 skill 不负责。
---

# wisp-writer：用 Wisp 主题写出风格一致的文章

Wisp 的取向是安静、准确、克制。文章写在 `src/content/posts/<slug>/index.mdx`（或 `index.md`），frontmatter 以 `src/content.config.ts` 为准。本 skill 提供：

```
SKILL.md
reference/   frontmatter.md  style-guide.md  elements.md  templates/
scripts/     new_post.py  check_post.py  tests/   （Python + uv，PEP 723 内联依赖，无需安装）
```

## 命令约定

所有命令在站点根目录运行，写成 `uv run <skill>/scripts/<脚本>.py ...`，`<skill>` 是本 skill 的目录：

- 随主题安装（默认）：`node_modules/astro-wisp/skills/wisp-writer`（`pnpm exec wisp skills` 打印绝对路径）；在主题仓库内是 `packages/astro-wisp/skills/wisp-writer`。下文示例写作 `skills/wisp-writer`，按实际位置替换。
- 放在 `<站点>/.claude/skills/wisp-writer/` 或 `~/.claude/skills/wisp-writer/`：把路径换成实际位置；脚本会从当前目录向上寻找 `astro.config.*` 或 `src/content`，也可以用 `--root <站点根目录>` 指定。
- 找不到站点时脚本会提示并以退出码 2 结束，不会写入任何文件。
- 没有 uv 时：`python3 <路径>/new_post.py ...` 同样可以运行（只用标准库，需要 Python 3.10+）。

## 工作流

1. **明确读者和要点。** 动笔前写下三件事：读者是谁（会用什么、不会什么），读完能带走什么（一句话结论），文章类型。资料不足时先问用户，不要编造事实、数据或引用。
2. **创建文章。** 按类型选模板：`tutorial` 教程、`deep-dive` 原理深挖、`algorithm` 算法讲解（含交互组件）、`note` 短笔记、`paper-reading` 论文解读。
   ```bash
   uv run skills/wisp-writer/scripts/new_post.py attention-explained \
     --title "自注意力机制讲解" --template deep-dive \
     --tags "LLM,Transformer" --category 机器学习 \
     --description "从直觉到公式，讲清楚自注意力的计算过程。"
   ```
   slug 用 kebab-case；已存在会报错。脚本会列出现有标签和分类，**优先复用**。参数：`--draft`、`--md`/`--mdx`、`--date`、`--list-templates`。
3. **写作。** 遵循 [style-guide](reference/style-guide.md)，元素写法见 [elements](reference/elements.md)，字段见 [frontmatter](reference/frontmatter.md)。替换模板里的全部 `TODO`。
4. **配图与交互。** 需要图时，使用 wisp-diagram skill 产出源文件和 `.wisp.svg`，再用图表引用语法放进文章；简单流程直接用 Mermaid。需要交互演示时使用现有 explainer 组件（目前是 `MatMul`）；其他算法需要新增组件，方法见 `docs/guide/explainers.md`，那属于代码改动，应单独说明并征得同意，不要在写文章时顺手改。
5. **检查并修复。**
   ```bash
   uv run skills/wisp-writer/scripts/check_post.py attention-explained --strict
   ```
   输出格式 `文件:行号 级别 规则 说明`。error 必须修；warning 逐条判断，能修就修；info 只是提示。`--json` 供程序读取，`--all` 检查全部文章。
6. **预览。** `pnpm build` 必须通过（会校验 frontmatter 和 Mermaid）；想看效果用 `pnpm dev`。可选：用 Playwright 对文章页分别在 light 和 dark 主题截图各一张，检查公式、图表和代码块是否溢出、深色下是否看得清。

## 硬规则

1. 正文从 h2 开始，不写 h1，层级不跳级；h2/h3 简短聚焦，可用名词短语或自然短问句，不放代码和纯文本公式。
2. `title` ≤ 80、`description` ≤ 200 个字符；`description` 写清文章解决什么问题。
3. 标签和分类复用已有写法，大小写一致（不要同时有 `llm` 和 `LLM`）。
4. 中文段落用全角标点与弯引号 `“”`（不用 `「」`）；中英文之间不手动加空格；中文强调用 `**粗体**`，不用斜体；纯数字不加反引号。
5. 术语首次出现时用英文前置：`English Term（中文说明）`，缩写须给全称：`SM（Streaming Multiprocessor，流式多处理器）`，禁止倒写成“中文（缩写）”。
6. 每个代码块都有语言标识；长代码块的折叠是可选项，默认不用管。
7. 每张图都有 alt，描述图要表达的结论；图注用 `"图 N：说明"`。
8. 不硬编码颜色，不写 `style=`，不用 Tailwind 色阶；颜色只能来自主题变量。
9. 用到组件的文章必须是 `.mdx` 并 `import`；交互组件加 `client:visible`。
10. 不编造事实、数据、引用和链接；没有把握的内容明确标注或删掉。
11. 不改动现有文章，除非用户要求；只在 `src/content/posts/<slug>/` 内工作。

## 示例片段

下面是符合语气的一段（讲清一件事，不铺垫，不夸张）：

```markdown
## 为什么要除以 √d

假设 $q$ 和 $k$ 的每个分量都是方差为 1 的独立随机变量，那么点积 $q \cdot k$ 的方差是 $d_k$。维度越大，点积越大，softmax 就越接近 one-hot，梯度会变得很小。

除以 $\sqrt{d_k}$ 之后，方差回到 1 左右，softmax 的输出保持在温和的范围内。没有这一步，深层网络很难训练。
```

对比：“众所周知，这个超级简单但非常重要的小技巧能够极大地提升效果！”——空洞、过度强调、没有信息。

## 常见错误

- 开头写“本文将介绍……”“随着……的发展”，应直接给出结论或问题。
- 在正文中写 `# 标题`；或 h2 之后直接写 h4。
- 标题用长句子或关键词大拼盘（“从 A、B 到 C 与 D 的原理全解”），应保持简短聚焦。
- 中文里混用半角逗号、括号，或混用直角引号 `「」` 与弯引号 `“”`；用斜体强调中文；用反引号包裹纯数字。
- `.md` 文件里写组件，或 `.mdx` 里忘了 `import`；交互组件忘了 `client:visible`。
- 图片没有 alt；引用了尚未生成的 `.excalidraw`（先画图，再引用）；引用 `.wisp.svg` 而不是源文件。
- 同一概念用了新标签（`Llm`、`大模型` 与已有 `LLM` 并存）。
- Mermaid 节点堆砌长句导致渲染拥挤；节点应写简短架构短语，细节放进正文。
- 留下 `TODO` 占位就交付；`check_post.py --strict` 能发现。
- 只写代码不解释：代码前说明目的，代码后说明关键点或预期输出。
