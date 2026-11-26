// Boutique theme — scroll engine. All motion is a pure function of scroll position:
// this file only writes CSS custom properties (--p, --w, --x, --sp, --hp, --g),
// where --g is the ground shift that lifts the page to a lighter slate,
// the stylesheet does the rest, so everything reverses when scrolling back up.
(() => {
  const root = document.documentElement;
  const rm = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = x => x < 0 ? 0 : x > 1 ? 1 : x;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const smooth = t => t * t * (3 - 2 * t);   // data-ease="inout": a gentle start and finish

  const grounds = Array.from(document.querySelectorAll('[data-ground]'));

  const curtain = document.querySelector('.curtain');
  const mark = document.querySelector('[data-mark]');
  const brand = document.querySelector('.nav-brand');

  let scenes = [], still = false, raf = 0, dockDy = 1;

  // Split "data-split" text into one staged span per word.
  for (const el of document.querySelectorAll('[data-split]')) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.dataset.w = el.dataset.split;
      span.dataset.i = i;
      span.textContent = word;
      el.append(span, ' ');
    });
  }

  const docTop = el => {
    let t = 0;
    for (let n = el; n; n = n.offsetParent) t += n.offsetTop;
    return t;
  };

  function measure() {
    still = rm.matches;
    const vh = innerHeight;
    scenes = Array.from(document.querySelectorAll('[data-scene]')).map(el => {
      const track = el.querySelector('[data-track]');
      let over = 0;
      if (track) {
        over = Math.max(0, track.getBoundingClientRect().width - el.clientWidth);
        el.style.height = Math.round(vh + over * 1.1) + 'px';
      }
      const staged = Array.from(el.querySelectorAll('[data-w]')).map(c => {
        const n = c.dataset.w.split(/\s+/).map(Number);
        const rel = c.hasAttribute('data-rel');
        return { el: c, ez: c.dataset.ease === 'inout' ? smooth : ease, s: n[0] || 0, d: n[1] || 0.3, st: n[2] || 0, i: Number(c.dataset.i || 0), rel, top: rel ? docTop(c) : 0 };
      });
      return { el, kind: el.dataset.scene, v: el.dataset.var, lead: Number(el.dataset.lead || 0), stage: el.querySelector('.stage'), track, over, staged };
    });
    // Logo dock: where the nav logo has to sit to fill the slot on the hero curtain.
    if (mark && brand) {
      // Measured against the pinned stage (not the document): the stage is sticky, so
      // its own offset moves with the scroll and must stay out of the sum.
      const stage = mark.closest('.stage');
      let left = 0, top = 0;
      for (let n = mark; n && n !== stage; n = n.offsetParent) { left += n.offsetLeft; top += n.offsetTop; }
      const b = brand.getBoundingClientRect(), img = brand.querySelector('img');
      dockDy = top - (b.top + (b.height - img.offsetHeight) / 2);
      root.style.setProperty('--lx', (left - b.left).toFixed(1) + 'px');
      root.style.setProperty('--ly', dockDy.toFixed(1) + 'px');
      root.style.setProperty('--ls', (mark.offsetWidth / img.offsetWidth).toFixed(4));
    }
  }

  function update() {
    raf = 0;
    const vh = innerHeight;
    root.style.setProperty('--sp', clamp(scrollY / Math.max(1, root.scrollHeight - vh)).toFixed(4));
    for (const s of scenes) {
      const b = s.el.getBoundingClientRect();
      // data-lead: a pinned scene may start its progress that many viewports before it pins
      const lead = s.lead * vh;
      const raw = clamp(s.kind === 'pin' ? (lead - b.top) / Math.max(1, b.height - (s.stage ? s.stage.offsetHeight : vh) + lead)
        : s.kind === 'par' ? (vh - b.top) / (vh + b.height)
        : (vh - b.top) / (vh * 0.65));
      const p = still ? 1 : raw;
      const ps = p.toFixed(4);
      s.el.style.setProperty('--p', ps);
      if (s.v) root.style.setProperty('--' + s.v, ps);
      for (const c of s.staged) {
        let w = 1;
        if (!still && c.rel) w = ease(clamp((vh - (c.top - scrollY) - c.s * vh) / (c.d * vh)));
        else if (!still) w = c.ez(clamp((p - c.s - c.i * c.st) / c.d));
        c.el.style.setProperty('--w', w.toFixed(4));
        // The logo rides up with the curtain until it reaches its place in the header.
        if (c.el === curtain) root.style.setProperty('--lt', clamp(w * c.el.offsetHeight / Math.max(1, dockDy)).toFixed(4));
      }
      if (s.track) s.track.style.setProperty('--x', (-raw * s.over).toFixed(1) + 'px');
    }
    // Ground shift: the page lifts to the lighter slate as a [data-ground] chapter takes over
    // the viewport and back to dark as it leaves.
    let g = 0;
    for (const el of grounds) {
      const b = el.getBoundingClientRect();
      g = Math.max(g, Math.min(clamp((vh * 0.85 - b.top) / (vh * 0.35)), clamp((b.bottom - vh * 0.05) / (vh * 0.35))));
    }
    root.style.setProperty('--g', g.toFixed(4));
  }

  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  const onResize = () => { measure(); update(); };

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onResize);
  addEventListener('load', onResize);
  rm.addEventListener('change', onResize);
  if (document.fonts) document.fonts.ready.then(onResize);
  [300, 1200, 3000].forEach(t => setTimeout(onResize, t));
  onResize();

  // New-arrivals cards: lift, tilt toward the pointer, dim the siblings.
  const cardEnter = e => {
    const el = e.currentTarget, item = el.parentElement;
    item.classList.add('is-active');
    el.classList.add('is-active');
    for (const o of item.parentElement.children) {
      if (o === item) o.style.removeProperty('--dim'); else o.style.setProperty('--dim', '1');
    }
  };
  const cardLeave = e => {
    const el = e.currentTarget, item = el.parentElement;
    if (e.type === 'mouseleave' && el.matches(':focus-visible')) return;
    item.classList.remove('is-active');
    el.classList.remove('is-active', 'is-pressed');
    for (const k of ['--rx', '--ry']) el.style.removeProperty(k);
    // Leaving straight onto a sibling card: keep the dim so neighbours don't flash.
    const to = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest('.fan-card') : null;
    if (e.type === 'mouseleave' && to && to !== el) return;
    for (const o of item.parentElement.children) o.style.removeProperty('--dim');
  };
  const cardMove = e => {
    if (still) return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg');
    el.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
    el.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
    el.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
  };
  for (const card of document.querySelectorAll('.fan-card')) {
    card.addEventListener('mouseenter', cardEnter);
    card.addEventListener('focus', cardEnter);
    card.addEventListener('mouseleave', cardLeave);
    card.addEventListener('blur', cardLeave);
    card.addEventListener('mousemove', cardMove);
    card.addEventListener('mousedown', () => card.classList.add('is-pressed'));
    card.addEventListener('mouseup', () => card.classList.remove('is-pressed'));
  }
})();
