import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDirectory, '../../..')
const cliEntry = resolve(repoRoot, 'packages/create-accessible-astro-starter/dist/src/index.js')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function run(command, args, options = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      stdio: 'inherit',
      ...options,
    })

    child.on('error', rejectPromise)
    child.on('exit', (code) => {
      if (code === 0) {
        resolvePromise()
        return
      }

      rejectPromise(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}`))
    })
  })
}

try {
  await run(npmCommand, ['run', 'build:cli'])
  await run(process.execPath, [cliEntry, ...process.argv.slice(2)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ACCESSIBLE_ASTRO_STARTER_TEMPLATE_DIR: repoRoot,
    },
  })
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`\nError: ${message}`)
  process.exitCode = 1
}
