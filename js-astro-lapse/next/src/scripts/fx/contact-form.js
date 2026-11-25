/**
 * Contact form states, as in the Framer "UI/Contact Submit" button:
 * Default ("Send it") -> Sending… -> Sent ("Thanks — we'll reply") or Error.
 *
 * A static theme has no backend. The form posts to whatever URL is in its
 * `action` attribute, which contact.astro fills from PUBLIC_FORM_ENDPOINT
 * (Formspree, Basin, Getform, your own API: any endpoint that accepts a
 * multipart POST and answers 2xx). With no endpoint set, nothing is sent:
 * the button plays Sending… and then shows the success state, so the demo
 * behaves like the live template.
 */
const HOLD_MS = 4000; // how long Sent / Error stay before the button resets
const DEMO_DELAY_MS = 900; // fake "sending" time when no endpoint is set

export function mount(form) {
  const btn = form.querySelector('button[type="submit"]');
  const label = btn?.querySelector('.submit-label');
  if (!btn || !label) return;
  let timer = 0;

  const set = (state) => {
    btn.dataset.state = state;
    label.textContent = btn.dataset[`label${state[0].toUpperCase()}${state.slice(1)}`];
    btn.setAttribute('aria-busy', String(state === 'sending'));
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (btn.dataset.state === 'sending') return;
    clearTimeout(timer);
    set('sending');
    const endpoint = form.getAttribute('action');
    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`Form endpoint answered ${res.status}`);
      } else {
        await new Promise((r) => setTimeout(r, DEMO_DELAY_MS));
      }
      set('success');
      form.reset();
    } catch (err) {
      console.warn('[contact-form]', err);
      set('error');
    }
    timer = setTimeout(() => set('idle'), HOLD_MS);
  });
}
