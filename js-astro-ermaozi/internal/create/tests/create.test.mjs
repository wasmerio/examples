import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { configureSiteConfig } from '../bin/configure-site.mjs'
import { deploymentFiles } from '../bin/deployment-files.mjs'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('deployment choices generate current static-host configuration', () => {
  const github = deploymentFiles('github-pages', 'pnpm')['.github/workflows/deploy.yml']
  assert.match(github, /withastro\/action@v6/)
  assert.match(github, /actions\/deploy-pages@v5/)
  assert.match(github, /BASE_PATH:/)

  const gitlab = deploymentFiles('gitlab-pages', 'pnpm')['.gitlab-ci.yml']
  assert.match(gitlab, /pnpm install --frozen-lockfile/)
  assert.match(gitlab, /pages:\s*\n\s+publish: dist/)

  assert.match(deploymentFiles('netlify', 'yarn')['netlify.toml'], /command = "yarn build"/)
  assert.equal(JSON.parse(deploymentFiles('vercel')['vercel.json']).outputDirectory, 'dist')
  assert.equal(JSON.parse(deploymentFiles('firebase', 'npm', 'my-project')['.firebaserc']).projects.default, 'my-project')
  assert.deepEqual(deploymentFiles('custom'), {})
})

test('interactive answers update the generated site identity and multilingual switch', () => {
  const source = readFileSync(path.resolve(packageRoot, '../..', 'site.config.mjs'), 'utf8')
  const configured = configureSiteConfig(source, {
    siteName: 'My $ Astro Site',
    siteDescription: 'A clear "description".',
    multilingual: true,
  })
  assert.match(configured, /^\s*multilingual: true,$/m)
  assert.equal([...configured.matchAll(/^\s*siteName: "My \$ Astro Site",$/gm)].length, 2)
  assert.match(configured, /^\s*description: "A clear \\"description\\"\.",$/m)
  assert.doesNotThrow(() => configureSiteConfig(source, {
    siteName: 'ermaozi',
    siteDescription: '一个支持全文搜索、深色模式和增强 Markdown 的 Astro 静态博客主题。',
    multilingual: false,
  }))

  const english = configureSiteConfig(source, {
    siteName: 'English Site',
    siteDescription: 'English root description.',
    multilingual: true,
    defaultLanguage: 'en-US',
  })
  assert.match(english, /'zh-CN': \{[\s\S]*?home: '\/zh\/'/)
  assert.match(english, /'zh-CN': \{[\s\S]*?href: '\/zh\/blog\/'/)
  assert.match(english, /'zh-CN': \{[\s\S]*?icon: '\/img\/logo\.svg'/)
  assert.match(english, /'en-US': \{[\s\S]*?description: "English root description\."/)
  assert.match(english, /'en-US': \{[\s\S]*?home: '\/'/)
  assert.match(english, /'en-US': \{[\s\S]*?href: '\/blog\/'/)
  assert.doesNotMatch(english.slice(english.indexOf("    'en-US': {")), /['"]\/en\//)
})

test('creates an English-root multilingual project without moving shared snippets', () => {
  execFileSync(process.execPath, [path.join(packageRoot, 'scripts/sync-template.mjs')])
  const cwd = mkdtempSync(path.join(tmpdir(), 'ermaozi-create-english-'))
  execFileSync(process.execPath, [path.join(packageRoot, 'bin/create.mjs'), 'english-site', '--no-install', '--lang=en-US', '--multilingual'], { cwd })
  const created = path.join(cwd, 'english-site')
  const config = readFileSync(path.join(created, 'site.config.mjs'), 'utf8')
  assert.match(readFileSync(path.join(created, 'content/index.md'), 'utf8'), /lang: en-US/)
  assert.match(readFileSync(path.join(created, 'content/zh/index.md'), 'utf8'), /title: ermaozi 示例站/)
  assert.match(readFileSync(path.join(created, 'content/about.md'), 'utf8'), /permalink: \/about\/[\s\S]*translationOf: \/zh\/about\//)
  assert.match(readFileSync(path.join(created, 'content/zh/friends.md'), 'utf8'), /permalink: \/zh\/friends\/[\s\S]*translationOf: \/friends\//)
  assert.match(readFileSync(path.join(created, 'content/docs/index.md'), 'utf8'), /\]\(\/docs\/guide\/getting-started\/\)/)
  assert.match(readFileSync(path.join(created, 'content/zh/docs/index.md'), 'utf8'), /\]\(\/zh\/docs\/guide\/getting-started\/\)/)
  assert.match(readFileSync(path.join(created, 'content/docs/guide/getting-started.md'), 'utf8'), /other language is placed under `\/en\/` or `\/zh\/`/)
  assert.match(readFileSync(path.join(created, 'content/docs/guide/getting-started.md'), 'utf8'), /Create `content\/blog\/hello\.md`:[\s\S]*permalink: \/blog\/hello\//)
  assert.match(readFileSync(path.join(created, 'content/zh/docs/guide/getting-started.md'), 'utf8'), /`content\/zh\/blog\/` 下新建/)
  assert.match(readFileSync(path.join(created, 'content/docs/guide/content.md'), 'utf8'), /\[\[docs\/guide\/configuration\|View site configuration\]\]/)
  assert.match(readFileSync(path.join(created, 'content/zh/docs/guide/content.md'), 'utf8'), /\[\[zh\/docs\/guide\/configuration\|查看站点配置\]\]/)
  assert.match(readFileSync(path.join(created, 'content/zh/docs/guide/content.md'), 'utf8'), /\[\[#Obsidian 兼容\]\]/)
  assert.doesNotMatch(readFileSync(path.join(created, 'content/zh/docs/guide/content.md'), 'utf8'), /\[\[zh\/#/)
  assert.doesNotMatch(readFileSync(path.join(created, 'content/zh/blog/指南/02.写作/03.基础/内容写作.md'), 'utf8'), /permalink: \/zh\/en\//)
  assert.doesNotThrow(() => readFileSync(path.join(created, 'content/snippets/demo/Counter.vue')))
  assert.match(config, /^\s*multilingual: true,$/m)
  assert.match(config, /'zh-CN': \{[\s\S]*?home: '\/zh\/'/)
  assert.match(config, /'en-US': \{[\s\S]*?home: '\/'/)
  assert.match(config, /'en-US': \{[\s\S]*?description: "An Astro static blog theme with bilingual content, full-text search, dark mode, and enhanced Markdown\."/)
  assert.match(config, /英文 locale 是当前根语言，对应 content\//)
  assert.doesNotMatch(config, /英文 locale 保留给 content\/en\//)
})

test('documents non-interactive language options and rejects unsupported values', () => {
  const help = execFileSync(process.execPath, [path.join(packageRoot, 'bin/create.mjs'), '--help'], { encoding: 'utf8' })
  assert.match(help, /--yes\s+Use non-interactive defaults/)
  assert.match(help, /--lang=<code>\s+Default language/)
  assert.throws(
    () => execFileSync(process.execPath, [path.join(packageRoot, 'bin/create.mjs'), 'site', '--no-install', '--lang=invalid'], { stdio: 'pipe' }),
    /Command failed/,
  )
})

test('creates a complete ermaozi project without installing when requested', () => {
  execFileSync(process.execPath, [path.join(packageRoot, 'scripts/sync-template.mjs')])
  const cwd = mkdtempSync(path.join(tmpdir(), 'ermaozi-create-'))
  execFileSync(process.execPath, [path.join(packageRoot, 'bin/create.mjs'), 'my-site', '--no-install'], { cwd })
  const created = path.join(cwd, 'my-site')
  const pkg = JSON.parse(readFileSync(path.join(created, 'package.json'), 'utf8'))
  assert.equal(pkg.name, 'my-site')
  assert.equal(pkg.private, true)
  assert.equal(pkg.repository, undefined)
  assert.equal(pkg.homepage, undefined)
  assert.equal(pkg.bugs, undefined)
  assert.match(readFileSync(path.join(created, '.gitignore'), 'utf8'), /^\.astro\//m)
  assert.equal(pkg.scripts['test:create'], undefined)
  assert.equal(pkg.scripts.test, undefined)
  assert.equal(pkg.scripts['test:visual'], undefined)
  assert.equal(pkg.devDependencies['@playwright/test'], undefined)
  assert.equal(pkg.devDependencies['@clack/prompts'], undefined)
  assert.match(pkg.scripts.dev, /astro dev/)
  assert.doesNotMatch(pkg.scripts.dev, /astro build|pagefind/)
  assert.match(pkg.scripts.check, /tsc -p theme\/tsconfig\.check-js\.json/)
  assert.match(pkg.scripts.build, /tsc -p theme\/tsconfig\.check-js\.json/)
  assert.doesNotMatch(pkg.scripts.validate, /node --test|packages\/create-astro-theme-ermaozi/)
  assert.throws(() => readFileSync(path.join(created, 'tests/build.test.mjs')), error => error.code === 'ENOENT')
  assert.throws(() => readFileSync(path.join(created, 'playwright.config.ts')), error => error.code === 'ENOENT')
  const readme = readFileSync(path.join(created, 'README.md'), 'utf8')
  assert.doesNotMatch(readme, /npm test|test:visual|Publishing the Site Generator/)
  assert.match(readme, /beginner's quick start/)
  assert.match(readme, /readme-cn\.md/)
  const chineseReadme = readFileSync(path.join(created, 'readme-cn.md'), 'utf8')
  assert.match(chineseReadme, /零基础快速开始/)
  assert.doesNotMatch(chineseReadme, /npm test|test:visual|发布初始化器/)
  assert.equal(readdirSync(created).includes('src'), false)
  assert.equal(readdirSync(created).includes('scripts'), false)
  assert.equal(readdirSync(created).includes('THIRD_PARTY_NOTICES.md'), false)
  assert.match(readFileSync(path.join(created, 'astro.config.mjs'), 'utf8'), /srcDir: '\.\/theme\/'/)
  assert.equal(pkg.dependencies.swiper, '14.0.1')
  assert.equal(pkg.dependencies.katex, '0.17.0')
  assert.equal(pkg.dependencies['@mdit/plugin-katex-slim'], '1.0.1')
  assert.equal(pkg.dependencies['@mdit/plugin-mathjax-slim'], '1.0.1')
  assert.equal(pkg.dependencies['@vue/compiler-sfc'], '3.5.29')
  assert.equal(pkg.dependencies.esbuild, '0.28.1')
  assert.equal(pkg.dependencies.gsap, '3.15.0')
  assert.equal(pkg.dependencies.ogl, '1.0.11')
  assert.equal(pkg.dependencies.postprocessing, '6.39.2')
  assert.equal(pkg.dependencies.three, '0.185.0')
  assert.equal(pkg.dependencies['chart.js'], '4.5.1')
  assert.equal(pkg.dependencies.echarts, '6.1.0')
  assert.equal(pkg.dependencies['@mdit/plugin-plantuml'], '1.0.1')
  assert.equal(pkg.dependencies.artplayer, '5.4.0')
  assert.equal(pkg.dependencies.dashjs, '5.2.0')
  assert.equal(pkg.dependencies['hls.js'], '1.6.16')
  assert.equal(pkg.dependencies['mpegts.js'], '1.7.3')
  assert.equal(pkg.dependencies['flowchart.ts'], '3.0.1')
  assert.equal(pkg.dependencies['markmap-lib'], '0.18.12')
  assert.equal(pkg.dependencies['markmap-common'], '0.18.9')
  assert.equal(pkg.dependencies['markmap-toolbar'], '0.18.12')
  assert.equal(pkg.dependencies['markmap-view'], '0.18.12')
  assert.equal(pkg.dependencies['@docsearch/js'], '4.6.3')
  assert.equal(pkg.dependencies['@docsearch/css'], '4.6.3')
  assert.match(readFileSync(path.join(created, 'site.config.mjs'), 'utf8'), /siteName: 'ermaozi'/)
  assert.match(readFileSync(path.join(created, 'theme/components/vue/AlgoliaSearch.vue'), 'utf8'), /algolia-preconnect/)
  assert.match(readFileSync(path.join(created, 'theme/components/vue/background/HeroEffect.vue'), 'utf8'), /dark-veil/)
  assert.match(readFileSync(path.join(created, 'theme/components/VPHomeBox.astro'), 'utf8'), /vp-home-box/)
  assert.match(readFileSync(path.join(created, 'theme/lib/obsidian.ts'), 'utf8'), /installObsidian/)
  for (const file of [
    'theme/lib/locales.ts',
    'theme/lib/replace-assets.mjs',
    'theme/lib/auto-frontmatter.mjs',
    'theme/scripts/auto-frontmatter.mjs',
    'theme/scripts/audit.mjs',
    'theme/licenses/THIRD_PARTY_NOTICES.md',
    'theme/lib/image-size.ts',
    'theme/lib/collections.ts',
    'theme/lib/sidebar.ts',
    'theme/lib/user-slots.ts',
    'theme/client.ts',
    'theme/node.ts',
    'theme/components/NotFound.astro',
    'theme/styles/custom.css',
    'content/docs/guide/api.md',
    'content/en/docs/guide/api.md',
  ]) assert.doesNotThrow(() => readFileSync(path.join(created, file)))
  for (const file of [
    'theme/config.mjs',
    'theme/config-types.ts',
    'theme/lib/locales.ts',
    'theme/lib/auto-frontmatter.mjs',
    'theme/lib/collections.ts',
    'theme/lib/sidebar.ts',
    'theme/components/Header.astro',
    'theme/components/NotFound.astro',
  ]) assert.equal(readFileSync(path.join(created, file), 'utf8'), readFileSync(path.resolve(packageRoot, '../..', file), 'utf8'), file)
  const layout = readFileSync(path.join(created, 'theme/layouts/BaseLayout.astro'), 'utf8')
  assert.match(layout, /<!doctype html>/i)
  assert.match(layout, /loadSwipers/)
  assert.match(readFileSync(path.join(created, 'public/img/logo.svg'), 'utf8'), /<svg\b[^>]*\bviewBox=/)
})

test('refuses to overwrite a non-empty directory', () => {
  const cwd = mkdtempSync(path.join(tmpdir(), 'ermaozi-create-existing-'))
  const target = path.join(cwd, 'existing')
  mkdirSync(target)
  writeFileSync(path.join(target, 'keep.txt'), 'keep')
  assert.throws(
    () => execFileSync(process.execPath, [path.join(packageRoot, 'bin/create.mjs'), target, '--no-install'], { stdio: 'pipe' }),
    /Command failed/,
  )
  assert.equal(readFileSync(path.join(target, 'keep.txt'), 'utf8'), 'keep')
})

test('expands a leading home-directory shortcut instead of creating a literal tilde folder', () => {
  const cwd = mkdtempSync(path.join(tmpdir(), 'ermaozi-create-tilde-'))
  const home = path.join(cwd, 'home')
  mkdirSync(home)
  const output = execFileSync(process.execPath, [path.join(packageRoot, 'bin/create.mjs'), '~/tilde-site', '--no-install'], {
    cwd,
    env: { ...process.env, HOME: home, USERPROFILE: home },
    encoding: 'utf8',
  })
  assert.equal(JSON.parse(readFileSync(path.join(home, 'tilde-site/package.json'), 'utf8')).name, 'tilde-site')
  assert.throws(() => readFileSync(path.join(cwd, '~/tilde-site/package.json')), error => error.code === 'ENOENT')
  assert.match(output, /cd ~\/tilde-site/)
})

test('reuses Yarn without leaking its dlx loader or blocking the first CI install', () => {
  const cwd = mkdtempSync(path.join(tmpdir(), 'ermaozi-create-manager-'))
  const installer = path.join(cwd, 'installer.mjs')
  const launcher = path.join(cwd, 'launcher.mjs')
  const target = path.join(cwd, 'yarn-site')
  writeFileSync(installer, `#!/usr/bin/env node\nimport { writeFileSync } from 'node:fs'; writeFileSync('installer.json', JSON.stringify({ args: process.argv.slice(2), nodeOptions: process.env.NODE_OPTIONS ?? null }))`)
  chmodSync(installer, 0o755)
  writeFileSync(launcher, `process.env.CI = '1'; process.env.npm_config_user_agent = 'yarn/4.9.2 npm/? node/v22'; process.env.npm_execpath = ${JSON.stringify(installer)}; process.env.NODE_OPTIONS = '--require /tmp/dlx/.pnp.cjs'; process.argv = [process.execPath, 'create', ${JSON.stringify(target)}]; await import(${JSON.stringify(pathToFileURL(path.join(packageRoot, 'bin/create.mjs')).href)})`)
  execFileSync(process.execPath, [launcher], { cwd })
  const result = JSON.parse(readFileSync(path.join(target, 'installer.json'), 'utf8'))
  assert.deepEqual(result, { args: ['install', '--no-immutable'], nodeOptions: null })
  assert.equal(JSON.parse(readFileSync(path.join(target, 'package.json'), 'utf8')).packageManager, 'yarn@4.9.2')
  assert.equal(readFileSync(path.join(target, 'yarn.lock'), 'utf8'), '')
  assert.equal(readFileSync(path.join(target, '.yarnrc.yml'), 'utf8'), 'nodeLinker: node-modules\n')
})

test('GitHub releases publish only a matching package version through trusted publishing', () => {
  const workflow = readFileSync(path.resolve(packageRoot, '../..', '.github/workflows/publish-npm.yml'), 'utf8')
  assert.match(workflow, /release:\s*\n\s+types: \[published\]/)
  assert.match(workflow, /id-token: write/)
  assert.match(workflow, /npm install --global npm@11\.18\.0/)
  assert.match(workflow, /RELEASE_TAG.*github\.event\.release\.tag_name/)
  assert.match(workflow, /Release tag must be v/)
  assert.doesNotMatch(workflow, /NODE_AUTH_TOKEN|NPM_TOKEN/)
  assert.match(workflow, /npm publish --access public/)
  assert.match(workflow, /case "\$VERSION" in \*-\*\) TAG=beta/)
})
