import { load, save } from './store';
import { bindCommentImages } from './content';
import { useFallbackFont } from './fallback-font';

type Twikoo = {
  init: (o: object) => Promise<void>;
  getRecentComments: (o: object) => Promise<RecentComment[]>;
};
type RecentComment = { url: string; nick: string; avatar: string; commentText: string; created: number; id: string };

let twikoo: Promise<Twikoo> | undefined;
const loadTwikoo = () =>
  (twikoo ??= import('twikoo').then((m) => ((m as { default?: Twikoo }).default ?? m) as unknown as Twikoo));

const relTime = (ts: number) => {
  const diff = (Date.now() - ts) / 1000;
  const rtf = new Intl.RelativeTimeFormat('zh-CN', { numeric: 'auto' });
  for (const [unit, s] of [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]] as const) {
    if (diff >= s) return rtf.format(-Math.floor(diff / s), unit);
  }
  return '刚刚';
};
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Comment box: initialise when it comes near the viewport. */
function initCommentBox() {
  const el = document.querySelector<HTMLElement>('#twikoo[data-comment-box]');
  if (!el) return;
  const start = async () => {
    try {
      const tk = await loadTwikoo();
      useFallbackFont(); // visitors' comments use characters the site never does
      await tk.init({ envId: el.dataset.envId, el: '#twikoo', path: el.dataset.path, lang: 'zh-CN' });
      bindCommentImages(el);
      new MutationObserver(() => bindCommentImages(el)).observe(el, { childList: true, subtree: true });
    } catch {
      el.innerHTML = '<p class="comment-error">评论加载失败，<button type="button" class="hl-label">重试</button></p>';
      el.querySelector('button')?.addEventListener('click', () => start(), { once: true });
    }
  };
  if (location.hash.startsWith('#') && location.hash.length > 1 && !document.getElementById(location.hash.slice(1))) {
    start(); // deep link to a comment
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        start();
      }
    },
    { rootMargin: '600px 0px' },
  );
  io.observe(el);
  document.addEventListener('astro:before-swap', () => io.disconnect(), { once: true });
}

/** Aside "最新评论" card (cached 10 min like Butterfly). */
function initNewestComments() {
  const card = document.querySelector<HTMLElement>('[data-newest-comments]');
  const list = card?.querySelector('ul');
  if (!card || !list) return;
  const envId = card.dataset.twikooEnv;
  if (!envId) return;

  const render = (items: RecentComment[]) => {
    useFallbackFont(items.map((c) => c.commentText + c.nick).join(''));
    list.innerHTML = items.length
      ? items
          .map(
            (c) => `<li class="aside-list-item">
      <a class="thumbnail" href="${esc(c.url)}#${esc(c.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(c.avatar)}" alt="" loading="lazy" width="64" height="64"></a>
      <div class="content">
        <a class="comment line-clamp-2" href="${esc(c.url)}#${esc(c.id)}">${esc(c.commentText)}</a>
        <div class="name"><span>${esc(c.nick)}</span> / <time datetime="${new Date(c.created).toISOString()}">${relTime(c.created)}</time></div>
      </div></li>`,
          )
          .join('')
      : '<li class="aside-list-empty">没有评论</li>';
  };

  // Near the viewport only, cached or not: on phones the card is far down the page,
  // and rendering it pulls the full font for any character the site doesn't have.
  const io = new IntersectionObserver(async (entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    const cached = load<RecentComment[]>('twikoo-newest-comments');
    if (cached) return render(cached);
    try {
      const tk = await loadTwikoo();
      const items = await tk.getRecentComments({ envId, pageSize: 5, includeReply: true });
      const clean = items.map((c) => ({ ...c, commentText: c.commentText.replace(/\s+/g, ' ').trim() || '[图片]' }));
      save('twikoo-newest-comments', clean, 10 / 1440);
      render(clean);
    } catch {
      list.innerHTML = '<li class="aside-list-empty">评论加载失败</li>';
    }
  }, { rootMargin: '300px 0px' });
  io.observe(card);
}

export function initComments() {
  initCommentBox();
  initNewestComments();
}
