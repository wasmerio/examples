import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { EASE_OUT } from "./data";

// Shown only on the official demo deployment, so anyone who clones or deploys this template ships a clean site.
const DEMO_HOST = "kite-astro-template.vercel.app";
const PROMPT_URL =
  "https://onepaste.dev/templates/kite/?utm_source=template-demo&utm_medium=banner&utm_campaign=kite-astro";
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
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-3 sm:bottom-6">
      <motion.div
        className="kt-sticker-sm pointer-events-auto flex items-center gap-1 rounded-full bg-(--butter) py-1 pr-1 pl-4 text-[14px] font-semibold text-(--ink)"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4, ease: EASE_OUT }}
      >
        <a href={PROMPT_URL} target="_blank" rel="noopener" className="group flex items-center gap-2 rounded-full py-1.5 pr-1">
          <span>
            <span className="hidden sm:inline">Like this design? </span>
            Get the AI prompt on <span className="underline decoration-2 underline-offset-2 decoration-(--tang)">onepaste.dev</span>
          </span>
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
            &rarr;
          </span>
        </a>
        <button
          type="button"
          aria-label="Dismiss onepaste banner"
          onClick={dismiss}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-(--ink)/10"
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}
