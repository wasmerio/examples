/**
 * VideoMedia's script: a silent loop that plays only when the reader allows motion (decision 0018).
 *
 * The HTML works on its own: a <video muted loop playsinline controls> with its poster and no autoplay attribute, so
 * with no script the reader sees the still and the browser's own controls. The script, once per video:
 * - takes the native controls off and shows the kit's play and pause button (a toggle: aria-pressed="true" while
 *   the video is meant to play);
 * - plays it when it has autoplay (data-video-autoplay) and motion is allowed: no reduced motion, the theme not calm
 *   (data-motion="calm" on <html>) and the page not paused (data-motion-paused on <html>, MotionPause's button);
 * - pauses it at once when any of those turns on: the reduced-motion query's change, or a change on <html> (a
 *   MutationObserver), and then forgets the reader's own play, so the latest ask for less motion wins;
 * - pauses it while it is off screen (IntersectionObserver), and plays it again when it comes back, if it was playing;
 * - plays or pauses on the button. A press is the reader's own choice: it plays even when motion is off (a reader who
 *   asks for less motion can still start a video), until a later change asks for less motion again.
 *
 * No island and no package: VideoMedia renders a processed <script> that calls `start()`, bundled once per page.
 */

/** The root of each video (VideoMedia's figure or div). */
export const VIDEO_SELECTOR = "[data-video-media]";

type Listener = (event: { matches: boolean }) => void;
type MediaQuery = { matches: boolean; addEventListener?: (type: "change", fn: Listener) => void; removeEventListener?: (type: "change", fn: Listener) => void };
type ObserverClass<O> = new (callback: (entries: any[]) => void, options?: any) => O;

/** What the script reads from the window, so the tests can pass a stand-in. */
export interface VideoWindow {
	document: { documentElement: Element };
	matchMedia?: (query: string) => MediaQuery;
	IntersectionObserver?: ObserverClass<{ observe(el: Element): void; disconnect(): void }>;
	MutationObserver?: ObserverClass<{ observe(el: Element, options: MutationObserverInit): void; disconnect(): void }>;
}

/** The reduced-motion query. */
export const REDUCE = "(prefers-reduced-motion: reduce)";

/** Whether a video may play by itself: no reduced motion, the theme not calm, the page not paused. */
export function motionAllowed(win: VideoWindow): boolean {
	const html = win.document.documentElement;
	if (html.getAttribute("data-motion") === "calm" || html.hasAttribute("data-motion-paused")) return false;
	return !win.matchMedia?.(REDUCE).matches;
}

type VideoEl = Element & { muted: boolean; paused: boolean; play(): Promise<void> | void; pause(): void; removeAttribute(name: string): void };

/**
 * Binds one VideoMedia root: returns false when it has no video or button, or is bound already. The video plays when
 * it is meant to (autoplay with motion allowed, or the reader pressed play) and is on screen.
 */
export function bindVideo(root: Element, win: VideoWindow): boolean {
	const video = root.querySelector("video") as VideoEl | null;
	const button = root.querySelector<HTMLElement>("[data-video-toggle]");
	if (!video || !button || root.hasAttribute("data-video-bound")) return false;
	root.setAttribute("data-video-bound", "");
	const autoplay = root.hasAttribute("data-video-autoplay");
	video.muted = true;
	video.removeAttribute("controls");
	button.hidden = false;

	// The reader's own choice from the button (true: play, false: pause), or null to follow autoplay and motion.
	let chosen: boolean | null = null;
	// With an observer, a video waits for its first report before it plays (it may start off screen).
	let inView = !win.IntersectionObserver;
	const wanted = () => chosen ?? (autoplay && motionAllowed(win));
	const sync = () => {
		const want = wanted();
		button.setAttribute("aria-pressed", String(want));
		if (want && inView) {
			if (!video.paused) return;
			try {
				const played = video.play();
				// A browser may refuse to play (a power saver, a data saver): show the play state again.
				if (played && typeof played.catch === "function")
					played.catch(() => {
						if (video.paused) {
							chosen = false;
							button.setAttribute("aria-pressed", "false");
						}
					});
			} catch {
				chosen = false;
				button.setAttribute("aria-pressed", "false");
			}
		} else if (!video.paused) video.pause();
	};
	/**
	 * Reduced motion, calm or the page's pause changed. When motion is now off, the reader's own choice is dropped, so
	 * the video stops (and follows autoplay again once motion is back). When motion is back, a video the reader paused
	 * stays paused.
	 */
	const changed = () => {
		if (!motionAllowed(win)) chosen = null;
		sync();
	};

	button.addEventListener("click", () => {
		chosen = !wanted();
		sync();
	});

	const html = win.document.documentElement;
	const query = win.matchMedia?.(REDUCE);
	let mutations: { disconnect(): void } | undefined;
	let seen: { disconnect(): void } | undefined;
	const onQuery: Listener = () => (root.isConnected === false ? stop() : changed());
	const stop = () => {
		query?.removeEventListener?.("change", onQuery);
		mutations?.disconnect();
		seen?.disconnect();
	};
	query?.addEventListener?.("change", onQuery);
	if (win.MutationObserver) {
		const mo = new win.MutationObserver(() => {
			// A video no longer in the document (ClientRouter swapped the page) lets go of <html>.
			if (root.isConnected === false) return stop();
			changed();
		});
		mo.observe(html, { attributes: true, attributeFilter: ["data-motion", "data-motion-paused"] });
		mutations = mo;
	}
	if (win.IntersectionObserver) {
		const io = new win.IntersectionObserver((entries) => {
			for (const entry of entries) inView = entry.isIntersecting;
			sync();
		});
		io.observe(root);
		seen = io;
	}
	sync();
	return true;
}

/** Binds every VideoMedia on the page, now and after each ClientRouter navigation. Once per page. */
export function start() {
	const w = window as unknown as { __auiVideo?: boolean };
	const bindAll = () => {
		for (const root of document.querySelectorAll(VIDEO_SELECTOR)) bindVideo(root, window as unknown as VideoWindow);
	};
	bindAll();
	if (w.__auiVideo) return;
	w.__auiVideo = true;
	document.addEventListener("astro:page-load", bindAll);
}
