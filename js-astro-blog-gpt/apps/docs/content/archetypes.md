# Archetype 模板

每次写新文章都手动复制粘贴 YAML Frontmatter 既繁琐又容易出错。BlogGPT 内置了 `pnpm new` 命令行工具，可以根据根目录 `archetypes/` 文件夹下的模板一键生成新内容。

## 使用命令新建内容

在项目根目录下运行：

```bash
pnpm new <post|page|category|tag> <slug> [--use <模板名>] [--title <标题>]
```

### 常用示例

```bash
# 1. 创建普通单文件文章：content/posts/my-post.mdx
pnpm new post my-post --title "你好，世界"

# 2. 使用 bundle 模板创建内容包文章：content/posts/photo-essay/index.mdx
pnpm new post photo-essay --use bundle --title "摄影随笔"

# 3. 创建独立页面：content/pages/uses.mdx
pnpm new page uses --title "常用工具"

# 4. 创建分类定义文件：content/categories/notes.mdx
pnpm new category notes --title "读书笔记"
```

## 模板目录结构（`archetypes/`）

项目根目录下的 `archetypes/` 文件夹决定了 `pnpm new` 生成文件的初始结构：

```text
archetypes/
├── posts/
│   ├── default/
│   │   └── [slug].mdx
│   └── bundle/
│       └── [slug]/
│           └── index.mdx
├── pages/       # 同样包含 default/ 和 bundle/
├── categories/  # 同样包含 default/ 和 bundle/
└── tags/        # 同样包含 default/ 和 bundle/
```

- **默认模板**：`pnpm new post <slug>` 使用 `archetypes/posts/default/`，生成 `content/posts/<slug>.mdx`。
- **内容包模板**：加上 `--use bundle` 后使用 `archetypes/posts/bundle/`，生成 `content/posts/<slug>/index.mdx`。
- **自定义模板**：在对应内容类型下创建目录（如 `archetypes/posts/tutorial/`），再用 `--use tutorial` 选择。命令会复制目录中的全部文件，并替换路径和内容中的变量；模板也可以包含配图、附件或多语言文件。

默认文章模板会设置 `draft: true`。准备发布时，请改为 `draft: false`，并设置不晚于构建时间的发布日期。

## 模板可用变量

你可以在 `archetypes/` 下的任意模板文件中使用 `{{ 变量名 }}` 占位符，执行 `pnpm new` 时会自动替换为实际值：

| 变量名           | 示例输出                   | 说明                                                |
| ---------------- | -------------------------- | --------------------------------------------------- |
| `{{ title }}`    | `你好，世界`               | `--title` 参数传入的标题（未传时直接使用 `slug`）。 |
| `{{ slug }}`     | `hello-world`              | 命令行传入的 `<slug>` 短名称。                      |
| `{{ type }}`     | `post`                     | 内容类型（`post`、`page`、`category` 或 `tag`）。   |
| `{{ template }}` | `bundle`                   | `--use` 指定的模板名称（或默认模板名）。            |
| `{{ date }}`     | `2026-10-24`               | 当前 UTC 日期（`YYYY-MM-DD`）。                     |
| `{{ time }}`     | `08-00-00`                 | 当前 UTC 时间，使用连字符（`HH-mm-ss`）。           |
| `{{ datetime }}` | `2026-10-24T08:00:00.000Z` | UTC ISO 8601 时间戳。                               |
| `{{ year }}`     | `2026`                     | 当前 UTC 四位年份。                                 |
| `{{ month }}`    | `10`                       | 当前 UTC 两位月份（`01`–`12`）。                    |
| `{{ day }}`      | `24`                       | 当前 UTC 两位日期（`01`–`31`）。                    |
