import { join } from 'node:path';

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-|-$/g, '');
}

const [title = 'A new title', description = 'A new description'] = Bun.argv.slice(2);
const slug = createSlug(title);
const currentDate = new Date().toISOString().replace(/\.\d+/, '');

// JSON strings are valid YAML, so a title with a colon or quotes doesn't break the frontmatter
const frontmatter = `---
title: ${JSON.stringify(title)}
pubDate: ${currentDate}
description: ${JSON.stringify(description)}
slug: ${slug}
published: false
---

## Subtitle
Content goes here...
`;

const filename = `${slug}.mdx`;
const filepath = join(import.meta.dir, '..', 'src', 'content', 'notes', filename);
const file = Bun.file(filepath);

if (await file.exists()) {
  console.log('The draft note already exists, please use it');
} else {
  await file.write(frontmatter);

  console.log([
    `Created new post: ${filename}`,
    `Path: ${filepath}`,
    `Slug: ${slug}`,
    `Published: false (change to true when ready)`
  ].join('\n'));
}
