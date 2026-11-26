import { describe, expect, it } from 'vitest'
import { DEFAULT_SKILL_CATEGORY, groupSkillsByCategory, SKILL_CATEGORY_ORDER } from './skills'

function skill(name: string, category?: string) {
  return { name, icon: 'mdi:code-tags', category }
}

describe('groupSkillsByCategory', () => {
  it('orders known categories before unknown ones', () => {
    const groups = groupSkillsByCategory([
      skill('Tauri', 'Desktop'),
      skill('Vue', 'Frontend'),
      skill('Node', 'Backend'),
    ])

    expect(groups.map(group => group.category)).toEqual([
      'Frontend',
      'Backend',
      'Desktop',
    ])
  })

  it('keeps the configured category order', () => {
    const groups = groupSkillsByCategory([
      skill('Docker', 'Tooling'),
      skill('Vue', 'Frontend'),
      skill('HTML', 'Core'),
    ])

    expect(groups.map(group => group.category)).toEqual(
      SKILL_CATEGORY_ORDER.filter(category => ['Tooling', 'Frontend', 'Core'].includes(category)),
    )
  })

  it('falls back to the default category when missing', () => {
    const groups = groupSkillsByCategory([
      skill('Git'),
    ])

    expect(groups).toHaveLength(1)
    expect(groups[0].category).toBe(DEFAULT_SKILL_CATEGORY)
    expect(groups[0].skills).toHaveLength(1)
  })

  it('preserves every skill and its source order within a group', () => {
    const groups = groupSkillsByCategory([
      skill('Vue', 'Frontend'),
      skill('React', 'Frontend'),
    ])

    expect(groups[0].skills.map(item => item.name)).toEqual(['Vue', 'React'])
  })

  it('returns an empty list for empty input', () => {
    expect(groupSkillsByCategory([])).toEqual([])
  })
})
