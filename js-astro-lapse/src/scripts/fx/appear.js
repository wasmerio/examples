// Framer "appear on in view", played once. The element's own CSS holds the
// hidden state (behind @media (scripting: enabled)) and the transition; this
// only adds .is-in the first time any part of it enters the viewport.
// With reduced motion the CSS never hides it, so this is a no-op.
export function mount(el, { reduced }) {
  if (reduced || !('IntersectionObserver' in window)) { el.classList.add('is-in'); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      el.classList.add('is-in');
      io.disconnect();
    }
  });
  io.observe(el);
}
