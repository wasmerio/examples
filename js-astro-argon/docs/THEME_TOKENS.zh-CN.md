# 主题 Token 维护说明（中文）

本文档用于约束主题变量命名和维护流程，避免出现同义变量重复、组件样式不可控的问题。

## 1. 文件位置

- 主题变量定义：`src/styles/variables.styl`
- daisyUI 主题映射：`src/styles/global.css`
- 通用样式：`src/styles/main.css`
- Markdown 样式：`src/styles/markdown.css`

## 2. 分层规则

当前采用两层变量体系：

1. 品牌层（Argon 色板）
- 命名：`--argon-*`
- 仅表达基础色，不直接给组件使用。

2. 语义层（组件直接使用）
- 命名：`--surface-*`、`--border-*`、`--toc-*` 等。
- 组件中优先使用语义层，不直接耦合 `--argon-*`。

## 3. 常用语义 Token

- `--primary` / `--color-primary-content`
- `--card-bg` / `--page-bg`
- `--surface-soft` / `--surface-soft-hover` / `--surface-soft-active`
- `--surface-muted-hover` / `--surface-muted-active`
- `--surface-emphasis-hover` / `--surface-emphasis-active`
- `--border-divider` / `--border-divider-muted`
- `--toc-chip-bg` / `--toc-surface-hover` / `--toc-surface-active`

## 4. 新增或修改流程

1. 在 `src/styles/variables.styl` 定义新 Token。
2. 需要给 daisyUI 组件复用时，再映射到 `src/styles/global.css`。
3. 在组件和样式中替换引用。
4. 运行检查：

```bash
pnpm check
pnpm build
```

## 5. 维护约束

- 不新增组件耦合命名（例如 `--btn-*` 这类历史命名）。
- 不在多个文件重复定义同名 Token。
- 尽量避免硬编码颜色值，优先使用 Token。
