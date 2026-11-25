#!/usr/bin/env node

import { run } from './cli.js'

run().catch((error) => {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`\nError: ${message}`)
  process.exitCode = 1
})
