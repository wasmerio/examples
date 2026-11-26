#!/usr/bin/env node
// pnpm new "文章标题" [分类]
// Creates src/content/posts/<category>/<slug>.md with a unique abbrlink (8 hex chars,
// same shape as hexo-abbrlink crc32) so URLs look like the existing ones.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';

const [title, category = 'others'] = process.argv.slice(2);
if (!title) {
  console.error('用法: pnpm new "文章标题" [分类目录]');
  process.exit(1);
}

const root = 'src/content/posts';
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const used = new Set(
  walk(root)
    .filter((f) => f.endsWith('.md'))
    .map((f) => readFileSync(f, 'utf8').match(/^abbrlink:\s*(\S+)/m)?.[1])
    .filter(Boolean),
);
let abbrlink;
do abbrlink = randomBytes(4).toString('hex');
while (used.has(abbrlink));

const now = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
}).format(new Date());

const slug = title.trim().replace(/[\\/:*?"<>|\s]+/g, '-');
const dir = join(root, category);
const file = join(dir, `${slug}.md`);
if (existsSync(file)) {
  console.error(`已存在: ${file}`);
  process.exit(1);
}
mkdirSync(dir, { recursive: true });
writeFileSync(
  file,
  `---
title: ${title}
tags:
  -
categories:
  - ${category}
abbrlink: ${abbrlink}
date: ${now}
updated: ${now}
# cover: ./${slug}/cover.jpg
---

:::tip{type=home}
一句话介绍这篇文章。
:::

## 正文
`,
);
console.log(`已创建 ${file}  →  /posts/${abbrlink}/`);
