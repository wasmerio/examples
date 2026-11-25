import { parseArgs } from 'node:util'
import { PRESETS, type ParsedFlags, type Preset } from './types.js'

const PRESET_SET = new Set<Preset>(PRESETS)

function normalizePreset(value: string): Preset {
  const normalized = value === 'content' ? 'minimal' : value
  if (!PRESET_SET.has(normalized as Preset)) {
    throw new Error(`Invalid preset "${value}". Use one of: ${PRESETS.join(', ')}.`)
  }

  return normalized as Preset
}

export function getDefaultLauncher(preset: Preset): boolean {
  return preset === 'full'
}

export function parseCliArgs(argv: string[]): ParsedFlags {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    strict: true,
    options: {
      preset: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      launcher: {
        type: 'boolean',
      },
      'no-launcher': {
        type: 'boolean',
      },
      yes: {
        type: 'boolean',
        short: 'y',
      },
    },
  })

  if (values.launcher && values['no-launcher']) {
    throw new Error('Use either --launcher or --no-launcher, not both.')
  }

  return {
    targetDir: positionals[0],
    siteName: values.name,
    preset: values.preset ? normalizePreset(values.preset) : undefined,
    includeLauncher: values.launcher ? true : values['no-launcher'] ? false : undefined,
    yes: Boolean(values.yes),
  }
}
