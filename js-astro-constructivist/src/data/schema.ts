import { z } from 'zod'
import { THEMES } from '../constants'
import { assetSchema, heroSchema, httpUrlSchema, sectionsSchema, siteSchema } from './config-schema'

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{1,2}(?:-\d{1,2})?$/, 'Dates must use YYYY-MM or YYYY-MM-DD')

const stringListSchema = z.array(z.string())

/** Empty strings mean "not provided" so a blank field never breaks the build */
const emptyStringSchema = z.string().trim().length(0).transform(() => undefined)
const linkSchema = z.union([httpUrlSchema, emptyStringSchema]).optional()
const optionalAssetSchema = z.union([assetSchema, emptyStringSchema]).optional()
const legacyDecoration = z.string().optional().describe('Legacy metadata accepted for migration; does not change the theme presentation.')

const profileSchema = z.strictObject({
  icon: z.string(),
  network: z.string(),
  username: z.string(),
  url: httpUrlSchema,
})

const coloredItemSchema = z.strictObject({
  emoji: legacyDecoration,
  text: z.string(),
  color: legacyDecoration,
})

const aboutSchema = z.strictObject({
  personalInfo: z
    .array(
      z.strictObject({
        emoji: legacyDecoration,
        label: z.string(),
        value: z.string(),
        color: legacyDecoration,
      }),
    )
    .default([]),
  traits: z.array(coloredItemSchema).default([]),
  highlights: z.array(coloredItemSchema).default([]),
  quote: z
    .strictObject({
      text: z.string(),
      emoji: legacyDecoration,
      values: z
        .array(
          z.strictObject({
            emoji: legacyDecoration,
            label: z.string(),
            color: legacyDecoration,
          }),
        )
        .default([]),
    })
    .optional(),
  /** Legacy field still present in some cv.json files */
  tags: z
    .array(
      z.strictObject({
        icon: z.string(),
        text: z.string(),
      }),
    )
    .optional()
    .describe('Legacy tags accepted for migration; use traits, highlights or personalInfo for visible content.'),
})

const basicsSchema = z.strictObject({
  name: z.string().trim().min(1),
  label: z.string().trim().min(1),
  image: optionalAssetSchema,
  email: z.email().optional(),
  phone: z.string().optional(),
  url: linkSchema,
  summary: z.string().optional(),
  theme: z.enum(THEMES).default('red'),
  location: z
    .strictObject({
      address: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
      countryCode: z.string().optional(),
      region: z.string().optional(),
    })
    .optional(),
  profiles: z.array(profileSchema).default([]),
  beian: z
    .strictObject({
      mint: z.string().optional(),
      police: z.string().optional(),
    })
    .optional(),
  about: aboutSchema.optional(),
})

export const workSchema = z.strictObject({
  name: z.string(),
  position: z.string(),
  location: z.string().optional(),
  location_type: z.string().optional(),
  url: linkSchema,
  startDate: dateSchema,
  endDate: dateSchema.nullish(),
  summary: z.union([
    z.string(),
    stringListSchema,
  ]).optional(),
  highlights: stringListSchema.optional(),
  responsibilities: stringListSchema.optional(),
  achievements: stringListSchema.optional(),
  skills: z.record(z.string(), z.string()).optional(),
})

const educationSchema = z.strictObject({
  institution: z.string(),
  area: z.string(),
  studyType: z.string(),
  url: linkSchema,
  startDate: dateSchema,
  endDate: dateSchema.nullish(),
  score: z.string().optional(),
  courses: stringListSchema.optional(),
})

const certificateSchema = z.strictObject({
  name: z.string(),
  date: dateSchema,
  issuer: z.string(),
  url: linkSchema,
})

const skillSchema = z.strictObject({
  name: z.string(),
  icon: z.string(),
  level: z.string().optional(),
  category: z.string().optional(),
  keywords: stringListSchema.optional(),
})

const projectSchema = z.strictObject({
  name: z.string(),
  description: z.string(),
  isActive: z.boolean().optional(),
  highlights: stringListSchema.optional(),
  url: linkSchema,
  github: linkSchema,
  image: z
    .strictObject({
      url: assetSchema,
      position: z.enum(['background', 'container']).optional(),
      dark: optionalAssetSchema,
    })
    .optional(),
})

const imageListSchema = z.array(
  z.strictObject({
    image: assetSchema,
    alt: z.string().optional(),
    desc: z.string().optional(),
  }),
)

export const cvSchema = z.strictObject({
  $schema: z.string().optional(),
  site: siteSchema,
  hero: heroSchema,
  sections: sectionsSchema,
  ui: z.record(z.string(), z.string()).default({}),
  basics: basicsSchema,
  work: z.array(workSchema).default([]),
  volunteer: z
    .array(
      z.strictObject({
        organization: z.string(),
        position: z.string(),
        url: linkSchema,
        startDate: dateSchema,
        endDate: dateSchema.nullish(),
        summary: z.string().optional(),
        highlights: stringListSchema.optional(),
      }),
    )
    .default([]),
  education: z.array(educationSchema).default([]),
  awards: z
    .array(
      z.strictObject({
        title: z.string(),
        date: dateSchema,
        awarder: z.string(),
        summary: z.string().optional(),
      }),
    )
    .default([]),
  certificates: z.array(certificateSchema).default([]),
  publications: z
    .array(
      z.strictObject({
        name: z.string(),
        publisher: z.string().optional(),
        releaseDate: dateSchema.optional(),
        url: linkSchema,
        summary: z.string().optional(),
      }),
    )
    .default([]),
  skills: z.array(skillSchema).default([]),
  languages: z
    .array(
      z.strictObject({
        language: z.string(),
        fluency: z.string(),
      }),
    )
    .default([]),
  interests: z
    .array(
      z.strictObject({
        name: z.string(),
        keywords: stringListSchema.optional(),
      }),
    )
    .default([]),
  references: z
    .array(
      z.strictObject({
        name: z.string(),
        reference: z.string(),
      }),
    )
    .default([]),
  projects: z.array(projectSchema).default([]),
  images: z
    .strictObject({
      intro: z.string().optional(),
      list: imageListSchema.default([]),
    })
    .optional(),
})

export type Skill = z.infer<typeof skillSchema>
