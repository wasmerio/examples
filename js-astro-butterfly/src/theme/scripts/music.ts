import aplayerCss from 'aplayer/dist/APlayer.min.css?url';
import { loadStyle } from './load-style';
import { setupFixedLyrics, type FixedLyricsPlayer } from './music-lyrics';
import { load, save, toast } from './store';

/**
 * APlayer + Meting API without the meting.js runtime.
 * - Global fixed player: created once, lives in a `transition:persist` container.
 * - `::music{}` embeds on the music page: created per page, destroyed on navigation.
 */
type APlayerInstance = FixedLyricsPlayer & {
  destroy: () => void;
  pause: () => void;
  list: { add: (audio: Playlist) => void; switch: (index: number) => void };
};
type APlayerCtor = new (o: object) => APlayerInstance;
type Track = { name?: string; title?: string; artist?: string; author?: string; url: string; pic?: string; cover?: string; lrc?: string };

/** Embed playlist height on desktop (300px on phones, MusicPlayer.astro);
 * `.music-embed` reserves the matching space while loading (content.css). */
/** Rows an embed playlist shows on desktop before it scrolls: 32px each plus a 1px divider. */
const EMBED_LIST_ROWS = 24;
const EMBED_LIST_HEIGHT = EMBED_LIST_ROWS * 33 - 1;

/** Public Meting instances limit requests per day, and a visitor rarely needs a fresher list. */
const LIST_CACHE_DAYS = 1;
/** After a refusal, wait this long before fetching ahead of a click again. A click always tries. */
const WARM_UP_PAUSE_DAYS = 1 / 24;
const WARM_UP_PAUSED = 'music-warm-up-paused';

/** The API's own explanation, worth showing as is (e.g. its daily limit was reached). */
class MetingRefusal extends Error {}

let APlayer: APlayerCtor | undefined;
let globalPlayer: APlayerInstance | undefined;
let pagePlayers: APlayerInstance[] = [];

async function loadAPlayer() {
  if (!APlayer) {
    const [mod] = await Promise.all([import('aplayer'), loadStyle(aplayerCss)]);
    APlayer = (mod.default ?? mod) as unknown as APlayerCtor;
  }
  return APlayer;
}

type Playlist = { name?: string; artist?: string; url: string; cover?: string; lrc?: string }[];

async function fetchList(api: string, server: string, type: string, id: string): Promise<Playlist> {
  const key = `music-list:${server}:${type}:${id}`;
  const cached = load<Playlist>(key);
  if (Array.isArray(cached) && cached.length) return cached;
  const url = api.replace(':server', server).replace(':type', type).replace(':id', id).replace(':r', String(Math.random()));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Meting ${res.status}`);
  // Over its limit the API still answers 200, with { message } instead of a list.
  const data = (await res.json()) as Track[] | { message?: string };
  if (!Array.isArray(data)) throw new MetingRefusal(data.message ?? '没有返回歌单');
  const list = data.map((t) => ({
    name: t.name ?? t.title,
    artist: t.artist ?? t.author,
    url: t.url,
    cover: t.pic ?? t.cover,
    // Given no address APlayer requests the current page and runs its lyric regex over
    // the HTML, which backtracks for seconds on the main thread.
    lrc: t.lrc || 'data:text/plain,',
  }));
  if (list.length) save(key, list, LIST_CACHE_DAYS);
  return list;
}

let globalList: Promise<Playlist> | undefined;

/** The global playlist, fetched once per visit (a failed fetch is retried on the next call). */
function getGlobalList(el: HTMLElement) {
  globalList ??= fetchList(el.dataset.api!, el.dataset.server!, el.dataset.type!, el.dataset.id!).catch((e) => {
    globalList = undefined;
    save(WARM_UP_PAUSED, true, WARM_UP_PAUSE_DAYS);
    throw e;
  });
  return globalList;
}

let startIndex: number | undefined;
/** Held so the decoded cover stays in memory until the player opens. */
let startCover: HTMLImageElement | undefined;

/** The track the global player opens on, chosen once so its cover can be ready first. */
function pickStart(list: Playlist) {
  startIndex ??= Math.floor(Math.random() * list.length);
  return startIndex;
}

/**
 * Fetch and decode the opening track's cover, so the player shows it from its first
 * frame. Meting answers with an uncacheable redirect to the image, so the track keeps
 * the final address: the cached image, with no further request to the API.
 */
async function preloadStartCover(list: Playlist) {
  const track = list[pickStart(list)];
  if (!track?.cover || startCover) return;
  const res = await fetch(track.cover);
  await res.body?.cancel();
  const image = new Image();
  image.src = res.url;
  await image.decode();
  startCover = image;
  track.cover = res.url;
}

/**
 * Idle until urgent: once the page has loaded and the browser is idle, fetch
 * what opening the player needs (APlayer's code and styles, the playlist from
 * the Meting API, which alone takes ~1 s, the opening track's cover), so a click
 * only builds the player.
 * Skipped when the visitor asks to save data or is on a 2G connection. The playlist
 * is cached, so this costs the API at most one request a day per browser.
 */
function warmUp() {
  const el = document.querySelector<HTMLElement>('[data-global-music]');
  if (!el || globalPlayer || el.dataset.state) return;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData || /2g/.test(conn?.effectiveType ?? '')) return;
  loadAPlayer().catch(() => {});
  if (!load(WARM_UP_PAUSED)) getGlobalList(el).then(preloadStartCover).catch(() => {});
}

function warmUpWhenIdle() {
  const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(warmUp, { timeout: 5000 }) : setTimeout(warmUp, 2000));
  if (document.readyState === 'complete') idle();
  else addEventListener('load', idle, { once: true });
}

/** Only one player makes sound at a time (APlayer mutex across instances). */
function exclusive(p: APlayerInstance) {
  p.on('play', () => [globalPlayer, ...pagePlayers].forEach((o) => o && o !== p && o.pause()));
}

async function initGlobal() {
  const el = document.querySelector<HTMLElement>('[data-global-music]');
  if (!el || globalPlayer || el.dataset.state) return;
  el.dataset.state = 'loading';
  const trigger = el.querySelector<HTMLButtonElement>('[data-music-start]');
  if (trigger) trigger.disabled = true;
  try {
    const [Ctor, list] = await Promise.all([loadAPlayer(), getGlobalList(el)]);
    const start = pickStart(list);
    // APlayer builds the fixed player in mini mode. Suppress its setup transitions.
    el.classList.add('ap-init');
    globalPlayer = new Ctor({
      container: el,
      fixed: true,
      autoplay: false,
      order: 'random',
      preload: 'none',
      volume: 0.55,
      theme: 'var(--theme-color)',
      lrcType: 3,
      audio: [],
    });
    setupFixedLyrics(el, globalPlayer);
    // Given tracks, APlayer starts on a random one of its own, fetching its cover and
    // lyrics. Hold that back and start on ours: the list keeps its order, and every
    // track still joins the random order.
    const playerList = globalPlayer.list;
    playerList.switch = () => {};
    playerList.add(list);
    delete (playerList as Partial<typeof playerList>).switch; // back to APlayer's own
    playerList.switch(start);
    labelControls(el);
    // Lyrics start off, and the LRC button turns them on when wanted.
    // Use the button so APlayer's visibility and button state stay in sync.
    el.querySelector<HTMLButtonElement>('.aplayer-icon-lrc')!.click();
    exclusive(globalPlayer);
    trigger?.remove();
    // Resolve the tucked layout before hover can pull the cover into view.
    void el.offsetWidth;
    el.classList.remove('ap-init');
    el.querySelector<HTMLElement>('.aplayer-miniswitcher')?.click();
    el.dataset.state = 'ready';
  } catch (e) {
    el.classList.remove('ap-init');
    el.dataset.state = '';
    if (trigger) { trigger.disabled = false; trigger.setAttribute('aria-label', '音乐加载失败，点击重试'); }
    toast(e instanceof MetingRefusal ? `音乐服务：${e.message}` : '音乐加载失败，请稍后重试', 'error');
  }
}

async function initEmbeds() {
  pagePlayers.forEach((p) => p.destroy());
  pagePlayers = [];
  const embeds = [...document.querySelectorAll<HTMLElement>('[data-meting]')];
  if (!embeds.length) return;
  const Ctor = await loadAPlayer();
  await Promise.all(
    embeds.map(async (el) => {
      try {
        // each embed carries the API itself, so it works without the floating player
        const audio = await fetchList(el.dataset.api!, el.dataset.server!, el.dataset.type!, el.dataset.id!);
        el.textContent = '';
        delete el.dataset.failed;
        const p = new Ctor({ container: el, theme: 'var(--theme-color)', preload: 'none', listMaxHeight: `${EMBED_LIST_HEIGHT}px`, lrcType: 3, audio });
        labelControls(el);
        exclusive(p);
        pagePlayers.push(p);
      } catch (e) {
        el.dataset.failed = '';
        el.innerHTML = '<span></span>，<button type="button" class="hl-label">重试</button>';
        el.querySelector('span')!.textContent = e instanceof MetingRefusal ? `歌单加载失败：${e.message}` : '歌单加载失败';
        el.querySelector('button')?.addEventListener('click', () => initEmbeds(), { once: true });
      }
    }),
  );
}

let started = false;

export function initMusic() {
  if (!started) {
    started = true;
    // Build the player when the visitor opens it; its code and playlist are
    // fetched ahead of time, when the browser is idle or the pointer heads there.
    document.addEventListener('click', (e) => {
      if ((e.target as Element).closest('[data-music-start]')) void initGlobal();
    });
    document.addEventListener('pointerover', (e) => {
      if ((e.target as Element).closest?.('[data-music-start]')) warmUp();
    });
    // A tap or click elsewhere folds the player, and an open playlist with it. `click`,
    // not `pointerdown`: a touch that turns into a scroll fires no click, so
    // scrolling the page while listening leaves the player open.
    document.addEventListener('click', (e) => {
      const target = e.target as Element | null;
      if (!target?.isConnected || target.closest('#global-music, [data-music-start]')) return;
      collapseGlobal(false);
    });
    // Escape folds the playlist first, then the player; left to dialogs and text fields.
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented || document.querySelector('dialog[open]')) return;
      if ((e.target as Element | null)?.closest?.('input, textarea, select, [contenteditable]')) return;
      collapseGlobal(true);
    });
    warmUpWhenIdle();
    document.addEventListener('astro:before-swap', () => {
      pagePlayers.forEach((p) => p.destroy());
      pagePlayers = [];
    });
  }
  initEmbeds();
}

/**
 * Fold the global player. An open playlist folds with it and comes back when
 * the player reopens (MusicPlayer.astro); `listFirst` closes the list for good
 * instead, leaving the player open.
 */
function collapseGlobal(listFirst: boolean) {
  const el = document.querySelector<HTMLElement>('#global-music.aplayer');
  if (!el) return;
  if (listFirst && !el.classList.contains('aplayer-narrow') && !el.querySelector('.aplayer-list')?.classList.contains('aplayer-list-hide')) {
    el.querySelector<HTMLElement>('.aplayer-icon-menu')?.click();
    return;
  }
  if (!el.classList.contains('aplayer-narrow')) el.querySelector<HTMLElement>('.aplayer-miniswitcher')?.click();
}

/** APlayer's SVG-only controls need names for keyboard and screen-reader users. */
function labelControls(el: HTMLElement) {
  const labels: Record<string, string> = {
    play: '播放', pause: '暂停', back: '上一首', forward: '下一首',
    volume: '音量', order: '播放顺序', loop: '循环模式', menu: '歌单', lrc: '歌词',
  };
  for (const [icon, label] of Object.entries(labels)) {
    el.querySelectorAll(`.aplayer-icon-${icon}`).forEach((b) => b.setAttribute('aria-label', label));
  }
  const toggle = el.querySelector<HTMLElement>('.aplayer-miniswitcher');
  if (toggle) {
    toggle.setAttribute('role', 'button');
    toggle.tabIndex = 0;
    toggle.setAttribute('aria-label', '展开或收起音乐播放器');
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
    });
  }
}
