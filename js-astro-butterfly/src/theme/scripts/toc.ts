let cleanup: (() => void) | undefined;

/**
 * Post TOC: highlights the current section, expands only the active branch
 * (Butterfly toc.expand=false), keeps the active link visible inside the TOC
 * box, shows reading progress of the article body and updates the URL hash
 * with replaceState (anchor.auto_update) without polluting history.
 */
export function initToc() {
  cleanup?.();
  cleanup = undefined;

  const toc = document.querySelector<HTMLElement>('[data-toc]');
  const article = document.querySelector<HTMLElement>('#article-container');
  const mobileBtn = document.querySelector<HTMLElement>('[data-mobile-toc]');
  const commentBtn = document.querySelector<HTMLElement>('[data-comment-btn]');
  if (commentBtn) commentBtn.hidden = !document.getElementById('post-comment');
  if (mobileBtn) mobileBtn.hidden = !toc;
  if (!toc || !article) return;

  const links = [...toc.querySelectorAll<HTMLAnchorElement>('a.toc-link')];
  const headings = links
    .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
    .filter((h): h is HTMLElement => !!h);
  const percentEl = toc.querySelector<HTMLElement>('[data-toc-percent]');
  const content = toc.querySelector<HTMLElement>('.toc-content')!;
  let active = -1;
  let ticking = false;

  const setActive = (i: number) => {
    if (i === active) return;
    active = i;
    toc.querySelectorAll('.active').forEach((n) => n.classList.remove('active'));
    toc.querySelectorAll('.expand').forEach((n) => n.classList.remove('expand'));
    const link = links[i];
    if (!link) return;
    link.classList.add('active');
    // expand the active item's children and every ancestor list
    let li: HTMLElement | null = link.parentElement;
    li?.classList.add('expand');
    while (li && li !== content) {
      if (li.tagName === 'LI') li.classList.add('expand');
      li = li.parentElement;
    }
    // keep the active link within the scrolling TOC box
    const box = content.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    if (r.top < box.top + 20 || r.bottom > box.bottom - 20) {
      content.scrollTo({ top: content.scrollTop + r.top - box.top - box.height / 2, behavior: 'smooth' });
    }
    const hash = `#${headings[i].id}`;
    if (location.hash !== hash) history.replaceState(history.state, '', hash);
  };

  const update = () => {
    ticking = false;
    const top = window.scrollY;
    const start = article.offsetTop;
    const height = article.offsetHeight - window.innerHeight;
    const pct = height > 0 ? Math.min(100, Math.max(0, Math.round(((top - start) / height) * 100))) : 100;
    if (percentEl) percentEl.textContent = String(pct);

    let idx = -1;
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top <= 90) idx = i;
      else break;
    }
    if (idx === -1) {
      active = -1;
      toc.querySelectorAll('.active').forEach((n) => n.classList.remove('active'));
      return;
    }
    setActive(idx);
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  const onClick = (e: Event) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a.toc-link');
    if (!a) return;
    e.preventDefault();
    const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
    target?.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(history.state, '', a.hash);
    document.documentElement.classList.remove('toc-open');
  };

  const onMobile = (e: Event) => {
    const t = e.target as Element;
    if (t.closest('[data-mobile-toc]')) document.documentElement.classList.toggle('toc-open');
    else if (document.documentElement.classList.contains('toc-open') && !t.closest('[data-toc]')) {
      document.documentElement.classList.remove('toc-open');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  toc.addEventListener('click', onClick);
  document.addEventListener('click', onMobile);
  update();

  cleanup = () => {
    window.removeEventListener('scroll', onScroll);
    toc.removeEventListener('click', onClick);
    document.removeEventListener('click', onMobile);
    document.documentElement.classList.remove('toc-open');
  };
}
