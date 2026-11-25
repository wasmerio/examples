// src/utils/parseConfig.ts

import { z } from "astro/zod"
import { sideyConfig } from "@config"

const configSchema = z.object({
  site: z.object({
    title: z.string(),
    description: z.string(),
    url: z.url(),
    author: z.string(),
    locale: z.string().default("en"),
  }),
  navigation: z.array(
    z.object({
      label: z.string(),
      href: z.string(),
    })
  ),
})

const parseResult = configSchema.safeParse(sideyConfig)

if (!parseResult.success) {
  console.error("\n❌ Configuration Error in sidey.config.ts:")

  parseResult.error.issues.forEach((err) => {
    console.error(`[${err.path.join(".")}] - ${err.message}`)
  })

  console.error("\n")
  process.exit(1)
}

export const config = parseResult.data
