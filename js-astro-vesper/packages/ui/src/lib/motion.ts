/**
 * The motion contract's scripts (decision 0018): the fade-up (`reveal`) and the pause flag (`restorePause`,
 * `bindPause`). No island, no package: a theme writes `motionScript` inline in <head>, and MotionPause binds its
 * button with `bindPause`.
 *
 * Three states on <html>:
 *   data-motion="calm"   the theme's setting, written on the server: nothing moves (the motion-ok variant is off,
 *                        and the fade-up never starts)
 *   data-motion-paused   the reader pressed "Pause motion": marquees freeze, autoplaying video stops and the
 *                        motion-ok variant is off (the reader's calm); kept for the session
 *   data-reveal-ready    the fade-up can run (set by `reveal`); the `reveal` utility's rules need it
 *
 * The fade-up: blocks marked `data-reveal` rise gently into place as they enter the view, once. Content is visible by
 * default. Only when the browser has IntersectionObserver, the reader has not asked for reduced motion and the theme
 * is not calm does `reveal()` set `data-reveal-ready`; the `reveal` rules (theme.css, on <html>) apply only then, and
 * only on a screen that allows motion, so with no script, with reduced motion, under calm and in print nothing is
 * hidden. Written inline in <head>, so the flag is on <html> before the first paint (nothing shows and then hides);
 * the observer starts once the page is parsed (readyState "interactive", before deferred scripts run), and if
 * anything after setting the flag fails (waiting for the parse or starting the observer), it comes off again.
 *
 * Marks (theme.css, @utility reveal):
 *   data-reveal          the element rises (its delay from an inline --reveal-i, 90ms a step)
 *   data-reveal="kids"   its children rise one after another
 *   data-reveal="hero"   a kit hero's text rises line by line (the eyebrow, the heading, the lead, the actions)
 *   data-reveal="items"  the items of its list rise one after another
 *
 * Each function is written out in full (no helper outside it), so the inline script can carry its source. Plain Node
 * loads this file, and the kit's tests run each function on a stand-in window.
 */

type RevealWindow = Pick<Window, "document" | "matchMedia"> & { IntersectionObserver?: typeof IntersectionObserver };
type PauseWindow = { document: Pick<Document, "documentElement">; sessionStorage?: Pick<Storage, "getItem"> };

/** The sessionStorage key that keeps the pause for the session. */
export const PAUSE_KEY = "astronomic:motion-paused";

/** Starts the fade-up on `win`. Returns false (and changes nothing) when motion is off or the browser cannot. */
export function reveal(win: RevealWindow): boolean {
	const Observer = win.IntersectionObserver;
	if (!Observer || !win.matchMedia || win.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
	const doc = win.document;
	const root = doc.documentElement;
	// The theme's calm setting, or the reader's pause (restorePause runs first): nothing moves, so the fade-up never starts.
	if (root.getAttribute("data-motion") === "calm" || root.hasAttribute("data-motion-paused")) return false;
	root.setAttribute("data-reveal-ready", "");
	// Never leave content hidden: if anything below fails (now or once the page is parsed), the flag comes off, and
	// without it no reveal rule applies.
	const off = () => root.removeAttribute("data-reveal-ready");
	try {
		const start = () => {
			try {
				const io = new Observer(
					(entries) => {
						for (const entry of entries) {
							if (!entry.isIntersecting) continue;
							entry.target.classList.add("is-in");
							io.unobserve(entry.target);
						}
					},
					{ rootMargin: "0px 0px -8% 0px" },
				);
				for (const el of doc.querySelectorAll("[data-reveal]")) io.observe(el);
			} catch {
				off();
			}
		};
		// Start as soon as the page is parsed ("interactive"), not at DOMContentLoaded, which waits for deferred scripts.
		if (doc.readyState !== "loading") start();
		else {
			const ready = () => {
				if (doc.readyState === "loading") return;
				doc.removeEventListener("readystatechange", ready);
				start();
			};
			doc.addEventListener("readystatechange", ready);
		}
	} catch {
		off();
	}
	return true;
}

/** Puts back a pause chosen earlier in this session, before the first paint. Never throws (storage may). */
export function restorePause(win: PauseWindow): boolean {
	try {
		if (win.sessionStorage?.getItem("astronomic:motion-paused") !== "1") return false;
		win.document.documentElement.setAttribute("data-motion-paused", "");
		return true;
	} catch {
		return false;
	}
}

type PauseRoot = Pick<ParentNode, "querySelectorAll"> & {
	ownerDocument?: (Pick<Document, "documentElement"> & { defaultView?: { sessionStorage?: Pick<Storage, "setItem" | "removeItem"> } | null }) | null;
	documentElement?: Element;
	defaultView?: { sessionStorage?: Pick<Storage, "setItem" | "removeItem"> } | null;
};

/**
 * Binds every `[data-motion-pause]` button under `root` (a document or an element), once each, and takes off its
 * hidden attribute. A press toggles
 * `aria-pressed`, `data-motion-paused` on <html> and the session flag. The label stays "Pause motion": the pressed
 * state says it is paused (the usual toggle pattern). Returns how many buttons it bound.
 */
export function bindPause(root: PauseRoot): number {
	const doc = root.documentElement ? root : root.ownerDocument;
	if (!doc?.documentElement) return 0;
	const html = doc.documentElement;
	const storage = () => {
		try {
			return doc.defaultView?.sessionStorage ?? null;
		} catch {
			return null;
		}
	};
	const buttons = [...root.querySelectorAll<HTMLElement>("[data-motion-pause]")];
	const sync = () => {
		const paused = html.hasAttribute("data-motion-paused");
		for (const b of root.querySelectorAll<HTMLElement>("[data-motion-pause]")) b.setAttribute("aria-pressed", String(paused));
	};
	let bound = 0;
	for (const button of buttons) {
		if (button.hasAttribute("data-motion-pause-bound")) continue;
		button.setAttribute("data-motion-pause-bound", "");
		// MotionPause renders hidden, so with no script there is no button that does nothing. Once bound it shows
		// where motion is allowed (its motion-ok class); with reduced motion or under calm it stays hidden.
		button.hidden = false;
		button.addEventListener("click", () => {
			const paused = !html.hasAttribute("data-motion-paused");
			if (paused) html.setAttribute("data-motion-paused", "");
			else html.removeAttribute("data-motion-paused");
			try {
				const s = storage();
				if (paused) s?.setItem(PAUSE_KEY, "1");
				else s?.removeItem(PAUSE_KEY);
			} catch {
				// Storage may be off; the pause still holds for this page.
			}
			sync();
		});
		bound++;
	}
	sync();
	return bound;
}

/** The inline script for <head>: `restorePause`, then `reveal`, on this window. One IIFE. */
export const motionScript = `(function(){${restorePause.toString()}\n${reveal.toString()}\nrestorePause(window);reveal(window);})();`;

/** The pause flag's inline script alone, for a page with no fade-up that still keeps the reader's pause (a site whose
 * pause button lives on other pages): `restorePause` on this window. One IIFE. */
export const pauseScript = `(function(){${restorePause.toString()}\nrestorePause(window);})();`;

/** The fade-up's inline script, kept for themes that wrote it before the pause existed: the same as `motionScript`. */
export const revealScript = motionScript;
