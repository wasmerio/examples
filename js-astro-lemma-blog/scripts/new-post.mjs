// Starts a post: bun run new <slug> [--en]
// Creates src/content/posts/<slug>/zh.md (en.md with --en) as a draft dated today.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
const lang = args.includes('--en') ? 'en' : 'zh';
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('usage: bun run new <slug> [--en]   (slug: lowercase letters, digits and hyphens, e.g. fno-notes)');
  process.exit(1);
}
const dir = new URL(`../src/content/posts/${slug}/`, import.meta.url);
const file = new URL(`${lang}.md`, dir);
if (existsSync(file)) {
  console.error(`src/content/posts/${slug}/${lang}.md already exists`);
  process.exit(1);
}
const now = new Date();
const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, '0')).join('-');
mkdirSync(dir, { recursive: true });
writeFileSync(
  file,
  `---
title: ${lang === 'zh' ? '标题' : 'Title'}
description: ${lang === 'zh' ? '一两句摘要, 显示在标题下和文章列表里.' : 'A sentence or two, shown under the title and in the post list.'}
date: ${today}
tags: []
draft: true
---

## ${lang === 'zh' ? '引言' : 'Introduction'} \\label{sec:intro}

`,
);
console.log(`created src/content/posts/${slug}/${lang}.md (draft: shown by bun run dev only, until draft: false)`);
