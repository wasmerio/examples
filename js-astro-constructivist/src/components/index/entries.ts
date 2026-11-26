import type { IndexEntry } from './types'
import { cv } from '@/data/cv'
import { section, sectionLinks, text } from '@/data/site'

const { email, profiles, url } = cv.basics

/**
 * Flat, serialisable search dataset. `command-search.ts` renders it grouped by
 * `group`, filters on `search` and keeps real anchors in the DOM.
 */
const indexEntries: IndexEntry[] = [
  ...sectionLinks.map(link => ({
    group: 'sections' as const,
    label: link.label,
    meta: `${link.index} · ${link.tagline}`,
    href: `#${link.id}`,
    search: `${link.label} ${link.tagline} ${link.id} plate ${link.index}`,
  })),
  ...(section('projects').enabled
    ? cv.projects
    : []).map((project, projectIndex) => ({
    group: 'cases' as const,
    label: project.name,
    meta: `${text('common.case')} ${String(projectIndex + 1).padStart(2, '0')}`,
    href: `#project-${projectIndex + 1}`,
    search: `${project.name} ${project.description} case file project ${project.isActive === false
      ? 'archived'
      : 'active'}`,
  })),
  ...(section('skills').enabled
    ? cv.skills
    : []).map(skill => ({
    group: 'skills' as const,
    label: skill.name,
    meta: skill.category ?? text('index.skill'),
    href: '#skills',
    search: [
      skill.name,
      skill.category,
      ...(skill.keywords ?? []),
      'skill',
    ].join(' '),
  })),
  ...(email
    ? [
        {
          group: 'links' as const,
          label: email,
          meta: text('common.email'),
          href: `mailto:${email}`,
          search: `${email} email mail direct line contact`,
        },
      ]
    : []),
  ...(url
    ? [
        {
          group: 'links' as const,
          label: url.replace(/^https?:\/\//, '').replace(/\/$/, ''),
          meta: text('common.website'),
          href: url,
          external: true,
          search: `${url} website site home`,
        },
      ]
    : []),
  ...profiles.map(profile => ({
    group: 'links' as const,
    label: profile.network,
    meta: `@${profile.username}`,
    href: profile.url,
    external: true,
    search: `${profile.network} ${profile.username} ${profile.url} profile link`,
  })),
]

export const indexGroups = ([
  'sections',
  'cases',
  'skills',
  'links',
] as const)
  .map(group => ({
    group,
    entries: indexEntries.filter(entry => entry.group === group),
  }))
  .filter(group => group.entries.length > 0)
