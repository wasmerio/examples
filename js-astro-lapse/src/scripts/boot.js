/**
 * Shared by the Astro and Next builds: find every data-fx element and mount
 * its module. Each module exports mount(el, { reduced }).
 */
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function boot(loaders) {
  const run = () => {
    const byName = new Map();
    for (const el of document.querySelectorAll('[data-fx]')) {
      for (const name of el.dataset.fx.split(/\s+/)) {
        if (!name) continue;
        if (!byName.has(name)) byName.set(name, []);
        byName.get(name).push(el);
      }
    }
    for (const [name, els] of byName) {
      const load = loaders[name];
      if (!load) { console.warn('[fx] no module for', name); continue; }
      load().then((m) => els.forEach((el) => { try { m.mount(el, { reduced }); } catch (e) { console.error('[fx]', name, e); } }));
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
}
