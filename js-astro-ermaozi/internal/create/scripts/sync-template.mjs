import { cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const projectRoot = path.resolve(packageRoot, '../..')
const templateRoot = path.join(packageRoot, 'template')
const entries = [
  '.gitignore',
  'LICENSE',
  'README.md',
  'readme-cn.md',
  'astro.config.mjs',
  'content',
  'package.json',
  'public',
  'site.config.mjs',
  'theme',
  'tsconfig.json',
]

if (path.dirname(templateRoot) !== packageRoot) throw new Error('Invalid template directory')
await rm(templateRoot, { recursive: true, force: true })
await mkdir(templateRoot, { recursive: true })
for (const entry of entries) await cp(path.join(projectRoot, entry), path.join(templateRoot, entry), { recursive: true })
await rename(path.join(templateRoot, '.gitignore'), path.join(templateRoot, 'gitignore'))

const packagePath = path.join(templateRoot, 'package.json')
const pkg = JSON.parse(await readFile(packagePath, 'utf8'))
pkg.name = 'ermaozi-site'
pkg.private = true
delete pkg.repository
delete pkg.homepage
delete pkg.bugs
delete pkg.scripts['test:create']
delete pkg.scripts.test
delete pkg.scripts['test:visual']
delete pkg.devDependencies['@playwright/test']
delete pkg.devDependencies['@clack/prompts']
pkg.scripts.validate = `${pkg.scripts.build} && node theme/scripts/audit.mjs`
await writeFile(packagePath, `${JSON.stringify(pkg, null, 2)}\n`)

for (const name of ['README.md', 'readme-cn.md']) {
  const readmePath = path.join(templateRoot, name)
  const readme = (await readFile(readmePath, 'utf8'))
    .replace(/^npm test\s+.*\n/m, '')
    .replace(/^npm run test:visual\s+.*\n/m, '')
    .replace(/\n## (?:发布初始化器|Publishing the Site Generator)\n[\s\S]*?(?=\n## (?:项目结构|Project Structure))/, '')
  await writeFile(readmePath, readme)
}
