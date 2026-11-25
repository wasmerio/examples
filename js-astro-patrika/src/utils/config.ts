// src/config/getConfig.ts
// Merges user YAML config over default values.
// Import this in layouts and pages — never import site.config.ts directly.

import { getCollection } from 'astro:content'
import { defaultConfig } from '@/site.config'
import type { UserConfig } from '@/types'

export async function getConfig(): Promise<UserConfig> {
  const entries = await getCollection('siteConfig')
  const userConfig = entries.find(e => e.id === 'config')?.data ?? {}

  return {
    ...defaultConfig,
    ...userConfig,
    // deep merge author so partial overrides don't wipe sibling fields
    author: {
      ...defaultConfig.author,
      ...(userConfig.author ?? {}),
    },
  }
}