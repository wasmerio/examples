// FAQ accordion (Framer "Sections/FAQ Item", Closed <-> Open, tap anywhere on
// the item cycles the variant; transition tween 0.4,0,0.2,1 0.35s).
// Framer animates this as a layout animation: the rows below jump to their
// new place at once and only the item's own box grows or shrinks. We do the
// same: the layout changes instantly and a clip-path inset on the item plays
// the size change. Closing keeps the answer rendered under a negative bottom
// margin (so the rows below still jump at once) until the clip has closed.
// Items are <details>, so without JS they still open natively.
const DURATION = 350;
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const R = 16;
const inset = (b) => `inset(0px 0px ${b}px 0px round ${R}px)`;

export function mount(list, { reduced }) {
  for (const item of list.querySelectorAll('details')) {
    const answer = item.querySelector('.answer');
    let anim = null;
    let pending = null; // cleanup that ends a close

    // Jump any running animation to its end state, synchronously.
    const settle = () => {
      if (anim) { anim.cancel(); anim = null; }
      if (pending) { const p = pending; pending = null; p(); }
    };

    const open = () => {
      const before = item.offsetHeight;
      item.open = true;
      if (reduced) return;
      const grow = item.offsetHeight - before;
      anim = item.animate([{ clipPath: inset(grow) }, { clipPath: inset(0) }], { duration: DURATION, easing: EASE });
      anim.onfinish = () => { anim = null; };
    };

    const close = () => {
      if (reduced) { item.open = false; return; }
      const shrink = answer.offsetHeight;
      item.classList.add('is-closing');
      item.style.marginBottom = `-${shrink}px`;
      pending = () => {
        item.open = false;
        item.classList.remove('is-closing');
        item.style.marginBottom = '';
      };
      const a = item.animate([{ clipPath: inset(0) }, { clipPath: inset(shrink) }], { duration: DURATION, easing: EASE, fill: 'forwards' });
      anim = a;
      a.onfinish = () => {
        if (anim !== a) return;
        anim = null;
        if (pending) { const p = pending; pending = null; p(); }
        a.cancel();
      };
    };

    item.addEventListener('click', (e) => {
      // A tap anywhere on the card toggles it, as in Framer; links inside an
      // answer keep working.
      if (e.target.closest('a')) return;
      e.preventDefault();
      settle();
      if (item.open) close(); else open();
    });
  }
}
