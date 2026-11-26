function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

export function renderPlacesMemoryIndex(memories, basePath = '/') {
  const siteBase = `/${String(basePath || '/').replace(/^\/+|\/+$/g, '')}`.replace(/^\/$/, '/');
  const base = siteBase.endsWith('/') ? siteBase : `${siteBase}/`;
  const localized = (value) => {
    const zh = typeof value === 'string' ? value : value?.zh ?? value?.en ?? '';
    const en = typeof value === 'string' ? value : value?.en ?? value?.zh ?? '';
    return `<span lang="zh-CN" data-locale-copy="zh">${escapeHTML(zh)}</span><span lang="en" data-locale-copy="en">${escapeHTML(en)}</span>`;
  };
  return memories.filter(({ placeIds }) => placeIds.length > 0).map((memory) => {
    const id = escapeHTML(memory.id);
    const image = escapeHTML(`${base}assets/images/${memory.image}`);
    const values = ['title', 'description', 'alt'].map((field) => ({
      field,
      zh: escapeHTML(typeof memory[field] === 'string' ? memory[field] : memory[field]?.zh ?? ''),
      en: escapeHTML(typeof memory[field] === 'string' ? memory[field] : memory[field]?.en ?? ''),
    }));
    const value = (field, language) => values.find((item) => item.field === field)?.[language] ?? '';
    return `          <li><a class="atlas-memory-fallback memory-image-hover" data-memory-id="${id}" data-memory-caption-zh="${value('description', 'zh')}" data-memory-caption-en="${value('description', 'en')}" data-memory-title-zh="${value('title', 'zh')}" data-memory-title-en="${value('title', 'en')}" href="${base}album/#memory-${id}"><img class="memory-image-frame__image atlas-memory-thumbnail" src="${image}" alt="${value('alt', 'en')}" data-locale-alt-zh="${value('alt', 'zh')}" data-locale-alt-en="${value('alt', 'en')}" loading="lazy" decoding="async"><span><time>${escapeHTML(memory.date)}</time><strong>${localized(memory.title)}</strong></span></a></li>`;
  }).join('\n');
}
