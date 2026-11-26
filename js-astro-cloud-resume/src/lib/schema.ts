/**
 * Schema for `src/data/resume.yaml`.
 *
 * Every object is `strict`: an unknown key (usually a typo such as `hightlights`)
 * fails the build with the exact path of the problem instead of being ignored.
 * Every section except `basics` is optional and can be removed from the file.
 */
import { z } from 'astro/zod';

/** "2024", "2024-03" or "2024-03-15". YAML may parse a bare year as a number. */
const partialDate = z.coerce
  .string()
  .regex(/^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/, {
    message: 'Expected a date as YYYY, YYYY-MM or YYYY-MM-DD (quote it in YAML, e.g. "2024-03")',
  });

/** Absolute http(s) URL. */
const url = z.url({ protocol: /^https?$/, message: 'Expected an absolute http(s):// URL' });

/** Absolute URL, or a path to a file in `public/` (e.g. "avatar.svg" or "/avatar.svg"). */
const asset = z.string().min(1);

const nonEmpty = z.string().trim().min(1);
const tags = z.array(nonEmpty).default([]);

export const profileNetworks = [
  'github',
  'gitlab',
  'linkedin',
  'x',
  'mastodon',
  'bluesky',
  'credly',
  'website',
  'blog',
  'other',
] as const;

const profile = z.strictObject({
  /** Selects the icon. Use "other" for anything not listed. */
  network: z.enum(profileNetworks),
  /** Text shown on the page, e.g. "jdoe" or "linkedin.com/in/jdoe". Defaults to the URL host + path. */
  label: nonEmpty.optional(),
  url,
});

const basics = z.strictObject({
  name: nonEmpty,
  /** Job title shown under the name, e.g. "Senior Cloud Architect". */
  title: nonEmpty,
  /** One or more paragraphs, separated by a blank line. Plain text. */
  summary: nonEmpty.optional(),
  /** Square image: absolute URL or file in `public/`. Omit to show initials. */
  photo: asset.optional(),
  /** Alternative text for the photo. Defaults to the person's name. */
  photoAlt: nonEmpty.optional(),
  location: nonEmpty.optional(),
  email: z.email({ message: 'Expected a valid e-mail address' }).optional(),
  phone: nonEmpty.optional(),
  website: url.optional(),
  /** Social and professional profiles (GitHub, LinkedIn, ...). */
  profiles: z.array(profile).default([]),
  /** Short status line, e.g. "Open to new opportunities". */
  availability: nonEmpty.optional(),
});

const experience = z.strictObject({
  company: nonEmpty,
  companyUrl: url.optional(),
  role: nonEmpty,
  location: nonEmpty.optional(),
  /** e.g. "Full-time", "Contract", "Freelance". */
  type: nonEmpty.optional(),
  start: partialDate,
  /** Omit for a current position ("Present"). */
  end: partialDate.optional(),
  summary: nonEmpty.optional(),
  highlights: z.array(nonEmpty).default([]),
  /** Technologies, shown as tags. */
  tags,
});

const education = z.strictObject({
  institution: nonEmpty,
  url: url.optional(),
  degree: nonEmpty,
  field: nonEmpty.optional(),
  location: nonEmpty.optional(),
  start: partialDate.optional(),
  end: partialDate.optional(),
  details: nonEmpty.optional(),
});

const certification = (defaultIssuer: string) =>
  z.strictObject({
    name: nonEmpty,
    /** Defaults to the vendor of the active brand ("Amazon Web Services" for `aws`). */
    issuer: nonEmpty.default(defaultIssuer),
    issued: partialDate,
    /** Omit if the certification does not expire. */
    expires: partialDate.optional(),
    credentialId: nonEmpty.optional(),
    /** Public verification page (Credly, issuer portal, ...). */
    url: url.optional(),
    /**
     * Badge image: absolute URL (e.g. the Credly-hosted image) or a file in `public/`.
     * Omit to use the generic placeholder badge.
     */
    badge: asset.optional(),
  });

const skillItem = z.union([
  nonEmpty.transform((name) => ({ name, level: undefined as number | undefined })),
  z.strictObject({
    name: nonEmpty,
    /** Optional self-assessment from 1 (basic) to 5 (expert). */
    level: z.number().int().min(1).max(5).optional(),
  }),
]);

const skillGroup = z.strictObject({
  /** Group heading, e.g. "Compute & Containers". */
  name: nonEmpty,
  items: z.array(skillItem).min(1),
});

const language = z.strictObject({
  name: nonEmpty,
  /** Free text, e.g. "Native", "Professional", "C1". */
  fluency: nonEmpty.optional(),
  /** Optional 1-5 meter. */
  level: z.number().int().min(1).max(5).optional(),
});

const interest = z.union([
  nonEmpty.transform((name) => ({ name, url: undefined as string | undefined })),
  z.strictObject({ name: nonEmpty, url: url.optional() }),
]);

const project = z.strictObject({
  name: nonEmpty,
  url: url.optional(),
  /** Source repository, if different from `url`. */
  repo: url.optional(),
  description: nonEmpty,
  tags,
});

/**
 * Builds the schema. `defaultIssuer` is the certification issuer used when the
 * data file leaves it out; it follows the active brand.
 */
export function makeResumeSchema(defaultIssuer = 'Amazon Web Services') {
  return z.strictObject({
    basics,
    experiences: z.array(experience).optional(),
    projects: z.array(project).optional(),
    certifications: z.array(certification(defaultIssuer)).optional(),
    education: z.array(education).optional(),
    skills: z.array(skillGroup).optional(),
    languages: z.array(language).optional(),
    interests: z.array(interest).optional(),
  });
}

/** Schema with the default (AWS) issuer, used to generate resume.schema.json. */
export const resumeSchema = makeResumeSchema();

export type Resume = z.output<typeof resumeSchema>;
export type Experience = z.output<typeof experience>;
export type Certification = z.output<ReturnType<typeof certification>>;
export type Profile = z.output<typeof profile>;
