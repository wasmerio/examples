import { generateAutoFrontmatter } from '../lib/auto-frontmatter.mjs'
import { siteConfig } from '../../site.config.mjs'

await generateAutoFrontmatter({ config: siteConfig })
