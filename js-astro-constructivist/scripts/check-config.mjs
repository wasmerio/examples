// @env node
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { cvSchema } from '../src/data/schema.ts'

try {
  const content = JSON.parse(await readFile(new URL('../cv.json', import.meta.url), 'utf8'))
  const result = cvSchema.safeParse(content)
  if (!result.success) {
    for (const issue of result.error.issues)
      console.error(`${issue.path.join('.') || 'cv.json'}: ${issue.message}`)
    process.exitCode = 1
  }
  else {
    console.log(`cv.json is valid: ${result.data.sections.filter(section => section.enabled).length} enabled sections, ${result.data.projects.length} projects.`)
  }
}
catch (error) {
  console.error(`Cannot read cv.json: ${error instanceof Error
    ? error.message
    : String(error)}`)
  process.exitCode = 1
}
