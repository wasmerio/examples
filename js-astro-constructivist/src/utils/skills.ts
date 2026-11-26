import type { Skill } from '@/data/schema'

export const DEFAULT_SKILL_CATEGORY = 'Other'

export const SKILL_CATEGORY_ORDER = [
  'Core',
  'Frontend',
  'Backend',
  'Tooling',
] as const

export interface SkillGroup {
  category: string
  skills: Skill[]
}

/**
 * Group skills by category, keeping the configured order first and appending
 * unknown categories in source order.
 */
export function groupSkillsByCategory(
  skills: Skill[],
  order: readonly string[] = SKILL_CATEGORY_ORDER,
): SkillGroup[] {
  const grouped = new Map<string, Skill[]>()

  for (const skill of skills) {
    const category = skill.category?.trim() || DEFAULT_SKILL_CATEGORY
    const bucket = grouped.get(category)
    if (bucket)
      bucket.push(skill)
    else
      grouped.set(category, [skill])
  }

  const groups: SkillGroup[] = []
  for (const category of order) {
    const bucket = grouped.get(category)
    if (bucket)
      groups.push({ category, skills: bucket })
  }
  for (const [category, bucket] of grouped) {
    if (!order.includes(category))
      groups.push({ category, skills: bucket })
  }

  return groups
}
