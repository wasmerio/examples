import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.doUnmock('./cv')
  vi.resetModules()
  vi.unstubAllEnvs()
})

describe('site configuration helpers', () => {
  it('preserves disabled section copy and numbers enabled sections in configured order', async () => {
    vi.doMock('./cv', () => ({
      cv: {
        site: { url: 'https://example.com', base: '/' },
        ui: {},
        sections: [
          {
            id: 'contact',
            enabled: true,
            label: 'Say hello',
            title: 'Write to me',
            tone: 'accent',
          },
          {
            id: 'education',
            enabled: false,
            label: 'Study',
            title: 'Learning record',
            kicker: 'Keep learning',
            tagline: 'Practice',
            tone: 'ink',
          },
          {
            id: 'about',
            enabled: true,
            label: 'About',
            title: 'The story',
            tone: 'paper',
          },
        ],
      },
    }))
    const { allSections, section, sectionLinks } = await import('./site')
    expect(allSections.map(item => [item.id, item.index])).toEqual([
      ['contact', '00'],
      ['about', '01'],
    ])
    expect(sectionLinks).toHaveLength(2)
    expect(section('education')).toMatchObject({
      enabled: false,
      label: 'Study',
      title: 'Learning record',
      kicker: 'Keep learning',
      tagline: 'Practice',
      tone: 'ink',
    })
    expect(section('missing')).toMatchObject({ enabled: false, label: 'missing' })
  })

  it('prefixes public assets with the deployment base without rewriting remote assets', async () => {
    vi.stubEnv('BASE_URL', '/theme/')
    vi.stubEnv('SITE', 'https://example.com')
    const { asset, absoluteUrl } = await import('./site')
    expect(asset('/images/portrait.svg')).toBe('/theme/images/portrait.svg')
    expect(asset('images/portrait.svg')).toBe('/theme/images/portrait.svg')
    expect(asset('https://cdn.example.com/image.png')).toBe('https://cdn.example.com/image.png')
    expect(absoluteUrl('/og.svg')).toBe('https://example.com/theme/og.svg')
  })
})
