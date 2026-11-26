// @env node
import { spawnSync } from 'node:child_process'
import { access } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const git = (...args) => spawnSync('git', args, { cwd: root, encoding: 'utf8', windowsHide: true })

async function installHooks() {
  if (process.env.CI || ['1', 'true'].includes(process.env.SKIP_INSTALL_SIMPLE_GIT_HOOKS || ''))
    return
  if (git('rev-parse', '--is-inside-work-tree').status !== 0)
    return
  if (!process.argv.includes('--install-hooks')) {
    console.log('Git hooks are opt-in. Run pnpm hooks:install if you want local pre-commit checks.')
    return
  }

  const custom = git('config', '--get', 'core.hooksPath')
  if (custom.status === 0 && custom.stdout.trim()) {
    console.log('Existing core.hooksPath is configured; leaving your hooks unchanged.')
    return
  }
  const result = git('rev-parse', '--git-path', 'hooks/pre-commit')
  if (result.status !== 0)
    return
  const hook = path.resolve(root, result.stdout.trim())
  const exists = await access(hook).then(() => true, () => false)
  if (exists) {
    console.log('A pre-commit hook already exists; leaving it unchanged.')
    return
  }

  const installer = fileURLToPath(new URL('../node_modules/simple-git-hooks/cli.js', import.meta.url))
  const installed = spawnSync(process.execPath, [installer], { cwd: root, stdio: 'inherit', windowsHide: true })
  if (installed.error)
    throw installed.error
  process.exitCode = installed.status ?? 1
}

await installHooks()
