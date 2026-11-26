const freeze = (value) => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

export const SITE_CONFIG = freeze({
  brand: {
    name: { zh: '两个人的记忆地图', en: 'A Memory Atlas for Two' },
    description: { zh: '一份关于林岚和周屿的虚构纪念册示例。', en: 'A fictional memory-book demo about Lin Lan and Zhou Yu.' },
  },
  siteUrl: '',
  basePath: '/',
  locale: 'en',
  timeZone: 'Asia/Shanghai',
  anniversaries: {
    love: { date: '2022-06-18', startAt: '2022-06-18T00:00:00+08:00', label: { zh: '相识纪念日', en: 'First Meeting Anniversary' } },
    wedding: { date: '2024-09-21', startAt: '2024-09-21T00:00:00+08:00', label: { zh: '庆祝日', en: 'Celebration Day' } },
  },
  birthdays: {
    one: { name: { zh: '林岚', en: 'Lin Lan' }, date: '03-14' },
    two: { name: { zh: '周屿', en: 'Zhou Yu' }, date: '11-02' },
  },
  debugPanel: true,
});

export function getConfiguredBasePath(value = process.env.BASE_PATH ?? SITE_CONFIG.basePath) {
  const path = String(value || '/');
  return path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`;
}
