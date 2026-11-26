import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';

// 读取全局 config.yaml
const configPath = path.resolve(process.cwd(), 'config.yaml');
let config = { site: { author: 'Alex Chen' }, categories: [] };

try {
  if (fs.existsSync(configPath)) {
    config = load(fs.readFileSync(configPath, 'utf-8')) || config;
  }
} catch {}

const args = process.argv.slice(2);
const title = args[0];
const customSlug = args[1];

if (!title) {
  console.log(`
📝 使用方式:
   pnpm new "文章标题" [自定义英文-slug]

示例:
   pnpm new "2026年Q1宏观周期与投资复盘" q1-macro-review
   pnpm new "为什么每个自主智能体都需要验证步骤"

提示:
   若不提供自定义 slug，脚本会自动根据日期与时间戳生成规范文件名。
`);
  process.exit(1);
}

// 格式化当前日期 YYYY-MM-DD
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

// 生成文件名 slug
function generateSlug(text, custom) {
  if (custom) {
    return custom.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
  }
  // 提取标题里的英文/拼音字母与数字
  const ascii = text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (ascii.length >= 3) {
    return ascii;
  }
  // 如果是纯中文且未指定 slug，采用时间戳后缀保证唯一与规范
  const timeSuffix = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `post-${timeSuffix}`;
}

const slug = generateSlug(title, customSlug);
const fileName = `${dateStr}-${slug}.md`;
const targetDir = path.resolve(process.cwd(), 'src/content/posts');
const targetFile = path.resolve(targetDir, fileName);

if (fs.existsSync(targetFile)) {
  console.error(`❌ 文件已存在: ${targetFile}`);
  process.exit(1);
}

const defaultAuthor = config.site?.author || 'Alex Chen';
const availableCategories = (config.categories || []).map((c) => c.slug);
const defaultCategory = availableCategories[0] || 'general';

const content = `---
title: "${title}"
excerpt: "简短的一句话导语，概括本篇的核心论点或假设..."
date: ${dateStr}
category: "${defaultCategory}" # 可选分类: ${availableCategories.join(', ') || 'general'}
author: "${defaultAuthor}"
readingTime: 5
featured: false
tags: []
---

## 核心假设与背景

记录本篇的思考起点与核心决策逻辑...

## 详细分析与论证

展开具体细节、事实依据与逻辑推演...

## 复盘与后续观察

后续如何验证？在什么条件下需要修正甚至证伪原有假设？
`;

fs.writeFileSync(targetFile, content, 'utf-8');

console.log(`
✅ 新文章创建成功！
📄 文件位置: src/content/posts/${fileName}
📁 绝对路径: ${targetFile}

💡 你现在可以在 VSCode / Obsidian 中打开并开始写作了！
`);
