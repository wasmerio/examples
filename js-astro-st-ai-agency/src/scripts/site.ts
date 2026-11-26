/**
 * ST AI Agency — site-wide behaviour (vanilla, ~2.5 KB minified).
 * Sticky header · mobile menu · scroll reveal · hero drift · demo-safe forms
 */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- sticky header: floats once the page hero has scrolled away ---------- */
const header = document.getElementById('hdr');
const hero = document.querySelector<HTMLElement>('[data-hero]');

if (header) {
  let ticking = false;
  const update = () => {
    const threshold = hero ? hero.offsetHeight - 120 : 120;
    header.classList.toggle('float', window.scrollY > threshold);
    ticking = false;
  };
  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  window.addEventListener('resize', update);
}

/* ---------- mobile menu ---------- */
const menu = document.getElementById('mob');
const burger = document.getElementById('burger');
const closeBtn = document.getElementById('mobX');

if (menu && burger && closeBtn) {
  const focusables = () =>
    Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter((el) => el.offsetParent !== null);

  let hideTimer: number | undefined;

  const open = () => {
    window.clearTimeout(hideTimer);
    menu.hidden = false;
    // force a style flush so the opacity/transform transition runs from the closed state,
    // and so the close button is visible (focusable) before we move focus to it
    void menu.offsetWidth;
    menu.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    closeBtn.focus();
  };

  const close = (returnFocus = true) => {
    if (menu.hidden) return;
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    hideTimer = window.setTimeout(() => (menu.hidden = true), reduceMotion.matches ? 0 : 350);
    if (returnFocus) burger.focus();
  };

  burger.addEventListener('click', open);
  closeBtn.addEventListener('click', () => close());
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => close(false)));

  document.addEventListener('keydown', (e) => {
    if (menu.hidden) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    // keep keyboard focus inside the open dialog
    if (e.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // menu is only for narrow screens — close it if the viewport grows past the breakpoint
  window.matchMedia('(min-width: 1201px)').addEventListener('change', (mq) => mq.matches && close(false));
}

/* ---------- scroll reveal ---------- */
const reveal = document.querySelectorAll<HTMLElement>('.rv');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' },
  );
  reveal.forEach((el) => io.observe(el));
} else {
  reveal.forEach((el) => el.classList.add('in'));
}

/* ---------- slow drift on the hero photograph ---------- */
const drift = document.querySelector<HTMLImageElement>('.hero__media img');
if (drift) {
  let queued = false;
  const parallax = () => {
    queued = false;
    if (reduceMotion.matches || window.innerWidth <= 820) {
      drift.style.transform = 'scale(1.04)';
      return;
    }
    const y = Math.min(window.scrollY, 800);
    drift.style.transform = `scale(1.04) translateY(${y * 0.07}px)`;
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(parallax);
    }
  };
  parallax();
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
}

/* ---------- forms ----------
 * Forms without an `action` are in demo mode: nothing is sent anywhere and the
 * visitor is told so. Configure an endpoint in src/config/site.ts (see README).
 */
document.querySelectorAll<HTMLFormElement>('form.js-form').forEach((form) => {
  const status = form.querySelector<HTMLElement>('.form__status');
  form.addEventListener('submit', (e) => {
    if (form.dataset.demo !== 'true') return;
    e.preventDefault();
    if (status) {
      status.textContent =
        'Demo mode: this form is not connected yet, so nothing was sent. Connect a form provider in src/config/site.ts.';
    }
  });
});
