import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputDirectory = process.argv[2]

if (!outputDirectory) {
  console.error('Missing output directory.')
  process.exitCode = 1
} else {
  await rm(resolve(process.cwd(), outputDirectory), { recursive: true, force: true })
}
