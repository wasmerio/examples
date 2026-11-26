import { useEffect, useState } from "react";
import { motion } from "motion/react";

// Shown only on the official demo deployment, so anyone who clones or deploys this template ships a clean site.
const DEMO_HOST = "nightshift-astro-template.vercel.app";
const PROMPT_URL =
  "https://onepaste.dev/templates/nightshift/?utm_source=template-demo&utm_medium=banner&utm_campaign=nightshift-astro";
const DISMISS_KEY = "onepaste-banner-dismissed";

export function OnepasteBanner() {
  // Decided after mount: the server render has no window, so starting hidden keeps hydration identical.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.location.hostname !== DEMO_HOST) return;
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // Storage can be blocked inside third-party iframes; the banner still shows there.
    }
    setVisible(true);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Ignore blocked storage: dismissal then lasts until reload.
    }
  }

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex justify-center px-3 sm:bottom-6">
      <motion.div
        className="pointer-events-auto flex items-center gap-1 rounded-full bg-(--ink) py-1 pr-1 pl-4 text-[13.5px] text-(--paper) shadow-[0_18px_40px_-18px_rgba(15,20,66,0.7)]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <a
          href={PROMPT_URL}
          target="_blank"
          rel="noopener"
          className="group flex items-center gap-2 rounded-full py-1.5 pr-1 font-medium"
        >
          <span>
            <span className="hidden sm:inline">Like this design? </span>
            Get the AI prompt on <span className="ns-underline font-semibold text-(--sun)">onepaste.dev</span>
          </span>
          <span aria-hidden="true" className="text-(--orange) transition-transform duration-300 group-hover:translate-x-0.5">
            &rarr;
          </span>
        </a>
        <button
          type="button"
          aria-label="Dismiss onepaste banner"
          onClick={dismiss}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-(--paper)/70 transition-colors hover:bg-(--paper)/10 hover:text-(--paper)"
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}
