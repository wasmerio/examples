/**
 * Hover accordion for the blog row (port of the withBlogAccordion override):
 * the pointed card opens to the featured width and reveals its frosted copy
 * panel, the others collapse to covers.
 *
 * Mechanic taken from the "One platform, many missions" section on
 * usavionix.com, which runs the same open/collapse on click.
 *
 * Markup contract (BlogRow.astro): the row carries data-fx="blog-accordion",
 * each card is [data-card] (the <a>), its frosted panel [data-panel] and the
 * copy inside it [data-copy]. The row's resting state is drawn in CSS, so this
 * only adds the interaction and keeps the widths exact.
 */
const CARD = '[data-card]';
const PANEL = '[data-panel]';
const COPY = '[data-copy]';
// The article page tags its own title with this element id.
const TITLE_ID = 'article-title';

// Padding of the frosted panel, so the copy can be held at the open card's
// inner width.
const PANEL_PADDING = 32;

// The Figma row is 530 / 307 / 307 inside 1160 with two 8px gaps, so the open
// card is worth 530/307 collapsed cards. Driving the accordion with flex-grow
// shares instead of pixel widths keeps those proportions at any viewport width.
const OPEN_SHARE = 530 / 307;

// framer-motion `{duration: .5, ease: "easeInOut"}` on the reference, as one CSS tween.
const DURATION = '0.5s';
const EASE = 'cubic-bezier(0.42, 0, 0.58, 1)';

// Which card is open before the pointer arrives, and where it returns on leave.
const DEFAULT_INDEX = 0;

// How many cards the row is allowed to show. A card pointing at the page being
// read is dropped first, then the surplus from the end.
const MAX_CARDS = 3;

// Desktop (>= 1200) runs the hover accordion. Tablet becomes a horizontal
// scroller with every card open, and Phone stacks them. The breakpoint is read
// as a media query rather than a row width, because a 1199px Tablet row and a
// 1200px Desktop row measure the same.
const DESKTOP_QUERY = '(min-width: 1200px)';

// Scroller card width: a share of the row, clamped, so about two cards and a
// slice of the third are in view at any tablet width.
const CARD_SHARE = 0.46;
const CARD_MIN = 280;
const CARD_MAX = 420;

const SCROLLBAR_STYLE_ID = 'blog-row-scrollbar';

function rowMode(row) {
  if (getComputedStyle(row).flexDirection !== 'row') return 'stack';
  return window.matchMedia(DESKTOP_QUERY).matches ? 'accordion' : 'scroller';
}

const isAccordionRow = (row) => rowMode(row) === 'accordion';

// A scrollbar cannot be hidden from an inline style, so the rule goes in once.
function hideScrollbar() {
  if (document.getElementById(SCROLLBAR_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = SCROLLBAR_STYLE_ID;
  style.textContent = '[data-fx~="blog-accordion"]::-webkit-scrollbar{display:none}';
  document.head.appendChild(style);
}

function cardBasis(row) {
  const share = row.clientWidth * CARD_SHARE;
  return Math.round(Math.min(CARD_MAX, Math.max(CARD_MIN, share)));
}

const findCards = (row) => {
  const named = Array.from(row.querySelectorAll(CARD));
  return named.length > 0 ? named : Array.from(row.children);
};
const findPanel = (card) => card.querySelector(PANEL) ?? card.firstElementChild;

// Tablet: every card open at a fixed width, the row scrolled sideways. Snap
// points put each card against the left edge so a flick reads as paging.
function applyScroller(row, cards) {
  hideScrollbar();
  row.style.overflowX = 'auto';
  row.style.overflowY = 'hidden';
  row.style.scrollSnapType = 'x mandatory';
  row.style.scrollbarWidth = 'none';

  const basis = cardBasis(row);
  cards.forEach((card) => {
    card.style.transition = '';
    card.style.flexBasis = basis + 'px';
    card.style.flexGrow = '0';
    card.style.flexShrink = '0';
    card.style.minWidth = '0px';
    card.style.scrollSnapAlign = 'start';

    const panel = findPanel(card);
    if (panel) {
      panel.style.transition = '';
      panel.style.opacity = '1';
      panel.style.pointerEvents = 'auto';
    }
    const copy = card.querySelector(COPY);
    if (copy) {
      copy.style.width = basis - PANEL_PADDING * 2 + 'px';
      copy.style.flexShrink = '0';
    }
  });
}

// Handing the row back to the accordion or the stack.
function clearScroller(row, cards) {
  row.style.overflowX = '';
  row.style.overflowY = '';
  row.style.scrollSnapType = '';
  row.style.scrollbarWidth = '';
  cards.forEach((card) => {
    card.style.flexShrink = '';
    card.style.scrollSnapAlign = '';
  });
}

const trimSlash = (value) => (value.length > 1 && value.endsWith('/') ? value.slice(0, -1) : value);

function isCurrentPath(href, here) {
  const target = trimSlash(href);
  if (target.length <= 1) return false;
  return trimSlash(here).endsWith(target);
}

function cardHref(card) {
  const anchor = (card.tagName === 'A' ? card : null) ?? card.querySelector('a[href]') ?? card.closest('a[href]');
  const href = anchor?.getAttribute('href');
  if (!href) return null;
  try { return new URL(href, window.location.origin).pathname; } catch { return null; }
}

// Collapses runs of whitespace and lowercases, so two renderings of the same
// title compare equal.
function normalise(text) {
  let out = '';
  let pendingSpace = false;
  for (const char of (text ?? '').toLowerCase()) {
    if (char.trim().length === 0) { pendingSpace = out.length > 0; continue; }
    if (pendingSpace) { out += ' '; pendingSpace = false; }
    out += char;
  }
  return out;
}

// Empty on any page that is not an article, which keeps the home row untouched.
const currentTitle = () => normalise(document.getElementById(TITLE_ID)?.textContent);

function isCurrentCard(card, title) {
  if (title.length === 0) return false;
  return normalise(card.textContent).includes(title);
}

function rowChild(row, card) {
  let node = card;
  while (node.parentElement && node.parentElement !== row) node = node.parentElement;
  return node.parentElement === row ? node : card;
}

// First the card pointing at the page we are already on, then the surplus
// from the end. The page templates already pass the right posts, so this is
// normally a no-op; it keeps the row honest if a buyer passes more.
function selectCards(row, all) {
  const here = window.location.pathname;
  const title = currentTitle();
  const hidden = [];
  const visible = [];
  all.forEach((card) => {
    const href = cardHref(card);
    const byPath = href ? isCurrentPath(href, here) : false;
    if (byPath || isCurrentCard(card, title)) hidden.push(card);
    else visible.push(card);
  });
  while (visible.length > MAX_CARDS) hidden.push(visible.pop());
  hidden.forEach((card) => (rowChild(row, card).style.display = 'none'));
  visible.forEach((card) => (rowChild(row, card).style.display = ''));
  return { visible, hidden };
}

// The copy is pinned to the width it has when the card is open, so the title
// keeps its line breaks while the card resizes. The overflow is clipped by the
// card while the panel fades out.
function lockCopyWidth(row, cards) {
  if (!isAccordionRow(row)) {
    cards.forEach((card) => {
      const copy = card.querySelector(COPY);
      if (!copy) return;
      copy.style.width = '';
      copy.style.flexShrink = '';
    });
    return;
  }
  const gap = parseFloat(getComputedStyle(row).columnGap || '0') || 0;
  const track = row.clientWidth - gap * (cards.length - 1);
  if (track <= 0) return;

  const open = (track * OPEN_SHARE) / (OPEN_SHARE + cards.length - 1);
  const width = Math.round(open - PANEL_PADDING * 2);
  if (width <= 0) return;

  cards.forEach((card) => {
    const copy = card.querySelector(COPY);
    if (!copy) return;
    copy.style.width = `${width}px`;
    copy.style.flexShrink = '0';
  });
}

function paint(cards, active, all = false) {
  cards.forEach((card, index) => {
    const isOpen = all || index === active;
    card.style.flexBasis = all ? '' : '0px';
    card.style.minWidth = '0px';
    card.style.flexGrow = all ? '' : isOpen ? String(OPEN_SHARE) : '1';

    const panel = findPanel(card);
    if (!panel) return;
    panel.style.opacity = isOpen ? '1' : '0';
    panel.style.pointerEvents = isOpen ? 'auto' : 'none';
  });
}

export function mount(row, { reduced }) {
  let active = DEFAULT_INDEX;
  let cards = [];
  let detach = null;

  function bind() {
    detach?.();
    detach = null;
    cards = selectCards(row, findCards(row)).visible;
    if (cards.length === 0) return;

    const mode = rowMode(row);
    if (mode !== 'accordion') {
      if (mode === 'scroller') {
        paint(cards, active, true);
        applyScroller(row, cards);
      } else {
        clearScroller(row, cards);
        cards.forEach((card) => (card.style.transition = ''));
        lockCopyWidth(row, cards);
        paint(cards, active, true);
      }
      const relayout = () => bind();
      window.addEventListener('resize', relayout);
      detach = () => window.removeEventListener('resize', relayout);
      return;
    }

    clearScroller(row, cards);
    const cleanups = [];

    cards.forEach((card, index) => {
      // Reduced motion: the cards still switch, without the tween.
      card.style.transition = reduced ? '' : `flex-grow ${DURATION} ${EASE}`;
      const panel = findPanel(card);
      if (panel) panel.style.transition = reduced ? '' : `opacity ${DURATION} ${EASE}`;

      const open = (event) => {
        // Touch and pen have no hover, so they switch on press instead.
        if (event.type === 'pointerdown' && event.pointerType === 'mouse') return;
        if (event.type === 'pointerenter' && event.pointerType !== 'mouse') return;
        if (active === index) return;
        active = index;
        paint(cards, active);
      };
      // Keyboard users open the card they tab to.
      const focus = () => {
        if (active === index) return;
        active = index;
        paint(cards, active);
      };
      card.addEventListener('pointerenter', open);
      card.addEventListener('pointerdown', open);
      card.addEventListener('focus', focus);
      cleanups.push(() => {
        card.removeEventListener('pointerenter', open);
        card.removeEventListener('pointerdown', open);
        card.removeEventListener('focus', focus);
      });
    });

    const reset = (event) => {
      if (event.pointerType !== 'mouse') return;
      if (active === DEFAULT_INDEX) return;
      active = DEFAULT_INDEX;
      paint(cards, active);
    };
    row.addEventListener('pointerleave', reset);
    cleanups.push(() => row.removeEventListener('pointerleave', reset));

    const resize = () => {
      // Crossing the threshold flips the whole behaviour, so rebind.
      if (!isAccordionRow(row)) bind();
      else lockCopyWidth(row, cards);
    };
    window.addEventListener('resize', resize);
    cleanups.push(() => window.removeEventListener('resize', resize));

    detach = () => cleanups.forEach((fn) => fn());
    lockCopyWidth(row, cards);
    paint(cards, active);
  }

  // The Framer override also watched the row with a MutationObserver to
  // survive React re-renders and CMS items mounting late. Astro renders the
  // cards once at build time, so binding once (and on resize) is enough.
  bind();
}
