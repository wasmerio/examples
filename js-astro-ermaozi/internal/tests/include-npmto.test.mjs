import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { siteConfig } from '../../site.config.mjs'
import { renderMarkdown } from '../../theme/lib/markdown.ts'

const textContent = html => html.replace(/<[^>]+>/g, '').replaceAll('&#x26;', '&').replaceAll('&amp;', '&')

test('npm-to preserves the frozen manager, command, flag, separator, and fallback matrix', async () => {
  const previous = siteConfig.markdown.npmTo
  try {
    siteConfig.markdown.npmTo = ['yarn', 'pnpm']
    const configured = await renderMarkdown(`::: npm-to
\`\`\`sh
npm install && npm run docs
\`\`\`
:::`)
    assert.match(configured, /data-tab-value="yarn"/)
    assert.match(configured, /data-tab-value="pnpm"/)
    assert.doesNotMatch(configured, /data-tab-value="npm"/)
    assert.match(textContent(configured), /yarn && yarn docs/)
    assert.match(textContent(configured), /pnpm install && pnpm docs/)

    siteConfig.markdown.npmTo = true
    const all = await renderMarkdown(`::: npm-to tabs="npm,pnpm,yarn,bun,deno,invalid"
\`\`\`bash
cross-env NODE_ENV=production npm i --save-dev alpha --save-peer beta
npm run docs -- --clean-cache
npm init -y
npm ci
npm unlink alpha -g
npx vp-update --foo
mkdir keep
\`\`\`
:::`)
    for (const manager of ['npm', 'pnpm', 'yarn', 'bun', 'deno']) assert.match(all, new RegExp(`data-tab-value="${manager}"`))
    assert.doesNotMatch(all, /data-tab-value="invalid"/)
    const commands = textContent(all)
    assert.match(commands, /pnpm add --save-dev --save-peer alpha beta/)
    assert.match(commands, /yarn add --dev --peer alpha beta/)
    assert.match(commands, /bun add --development alpha beta/)
    assert.match(commands, /deno add --dev alpha beta/)
    assert.match(commands, /pnpm docs --clean-cache/)
    assert.match(commands, /yarn docs --clean-cache/)
    assert.match(commands, /bun run docs --clean-cache/)
    assert.match(commands, /deno run docs --clean-cache/)
    assert.match(commands, /pnpm install --frozen-lockfile/)
    assert.match(commands, /yarn install --immutable/)
    assert.match(commands, /bun install --frozen-lockfile/)
    assert.match(commands, /deno install --frozen/)
    assert.match(commands, /bunx vp-update --foo/)
    assert.match(commands, /deno run -A vp-update --foo/)
    assert.equal((commands.match(/mkdir keep/g) ?? []).length, 5)

    siteConfig.markdown.npmTo = false
    const disabled = await renderMarkdown(`::: npm-to
\`\`\`sh
npm install
\`\`\`
:::`)
    assert.doesNotMatch(disabled, /class="vp-code-tabs"/)
    assert.match(textContent(disabled), /npm install/)
  } finally {
    siteConfig.markdown.npmTo = previous
  }
})

test('include preserves frozen ranges, regions, frontmatter, depth, aliases, and relative assets', async () => {
  const root = await mkdtemp(path.join(process.cwd(), '.tmp-include-'))
  const snippets = path.join(root, 'snippets')
  const sourcePath = path.join(root, 'page.md')
  const previous = siteConfig.markdown.include
  await mkdir(snippets)
  await writeFile(sourcePath, '# Page\n')
  await writeFile(path.join(snippets, 'nested.md'), 'Nested content\n')
  await writeFile(path.join(snippets, 'full.md'), `---
title: Hidden frontmatter
---
  ## Included heading
  [Guide](./guide.md)
  ![Image](./image.png)
  <!-- @include: ./nested.md -->
`)
  await writeFile(path.join(snippets, 'lines.md'), `one
// #region named
two
three
// #endregion named
four
`)
  await writeFile(path.join(snippets, 'import.js'), 'const one = 1\nconst two = 2\nconst three = 3\nconst four = 4\n')
  try {
    siteConfig.markdown.include = true
    const shallow = await renderMarkdown('<!-- @include: ./snippets/full.md -->', { sourcePath })
    assert.match(shallow, /Included heading/)
    assert.doesNotMatch(shallow, /Hidden frontmatter|Nested content|include-env/)
    assert.match(shallow, /href="\.\/snippets\/guide\.md"/)
    assert.match(shallow, /src="\.\/snippets\/image\.png"/)

    siteConfig.markdown.include = { deep: true }
    const deep = await renderMarkdown('<!-- @include: ./snippets/full.md -->', { sourcePath })
    assert.match(deep, /Nested content/)

    const startOpen = await renderMarkdown('<!-- @include: ./snippets/lines.md{3-} -->', { sourcePath })
    assert.match(startOpen, /two[\s\S]*three[\s\S]*four/)
    const endOpen = await renderMarkdown('<!-- @include: ./snippets/lines.md{-2} -->', { sourcePath })
    assert.match(endOpen, /one[\s\S]*#region named/)
    assert.doesNotMatch(endOpen, />two</)
    const region = await renderMarkdown('<!-- @include: ./snippets/lines.md#named -->', { sourcePath })
    assert.match(region, /two[\s\S]*three/)
    assert.doesNotMatch(region, /region named|four/)

    siteConfig.markdown.include = {
      useComment: false,
      resolvePath: reference => reference.replace('@snippets', snippets),
      resolveImagePath: false,
    }
    const alias = await renderMarkdown('@include: @snippets/full.md', { sourcePath })
    assert.match(alias, /Included heading/)
    assert.match(alias, /href="\.\/snippets\/guide\.md"/)
    assert.match(alias, /src="\.\/image\.png"/)
    const ignoredComment = await renderMarkdown('<!-- @include: ./snippets/nested.md -->', { sourcePath })
    assert.doesNotMatch(ignoredComment, /Nested content/)

    const imported = await renderMarkdown('@[code{2-3} javascript{2}](./snippets/import.js)', { sourcePath })
    assert.doesNotMatch(imported, /code-block-title|const one|const four/)
    assert.match(textContent(imported), /const two = 2[\s\S]*const three = 3/)
    assert.match(imported, /line highlighted/)
    const single = await renderMarkdown('@[code{4}](./snippets/import.js)', { sourcePath })
    assert.match(textContent(single), /const four = 4/)
    assert.doesNotMatch(textContent(single), /const three = 3/)
    const importedMissing = await renderMarkdown('@[code](./snippets/missing.js)', { sourcePath })
    assert.match(textContent(importedMissing), /File not found/)
  } finally {
    siteConfig.markdown.include = previous
    await rm(root, { recursive: true, force: true })
  }
})
