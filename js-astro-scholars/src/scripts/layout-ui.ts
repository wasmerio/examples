const STORAGE_KEY = "site-theme";

type ThemeMode = "dark" | "light";

let layoutAbortController: AbortController | undefined;

export function getBackToTopScrollBehavior(
	prefersReducedMotion: boolean,
): ScrollBehavior {
	return prefersReducedMotion ? "auto" : "smooth";
}

export function updateBackToTopVisibility(
	button: HTMLElement,
	isVisible: boolean,
) {
	button.setAttribute("data-visible", String(isVisible));
	button.tabIndex = isVisible ? 0 : -1;
}

function getStoredTheme(): ThemeMode | null {
	try {
		const value = localStorage.getItem(STORAGE_KEY);
		return value === "dark" || value === "light" ? value : null;
	} catch {
		return null;
	}
}

function getAppliedTheme(): ThemeMode {
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function updateThemeToggleLabels(root: ParentNode, mode: ThemeMode) {
	const nextMode: ThemeMode = mode === "dark" ? "light" : "dark";
	const label = `Switch to ${nextMode} mode`;
	const visibleLabel = `${nextMode === "dark" ? "Dark" : "Light"} mode`;

	root.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((button) => {
		button.setAttribute("aria-label", label);
		button.setAttribute("title", label);
		button.querySelectorAll<HTMLElement>("[data-theme-label]").forEach((text) => {
			text.textContent = visibleLabel;
		});
	});
}

function applyTheme(mode: ThemeMode, root: ParentNode = document) {
	document.documentElement.classList.toggle("dark", mode === "dark");
	document.documentElement.dataset.theme = mode;
	updateThemeToggleLabels(root, mode);
}

function setupThemeToggles(root: ParentNode, signal: AbortSignal) {
	applyTheme(getAppliedTheme(), root);

	root.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((button) => {
		button.addEventListener(
			"click",
			() => {
				const nextMode: ThemeMode = getAppliedTheme() === "dark" ? "light" : "dark";
				applyTheme(nextMode, root);

				try {
					localStorage.setItem(STORAGE_KEY, nextMode);
				} catch {
					// The visual theme still changes when persistent storage is unavailable.
				}
			},
			{ signal },
		);
	});
}

function setupSystemThemeListener(root: ParentNode, signal: AbortSignal) {
	if (!window.matchMedia) return;

	window.matchMedia("(prefers-color-scheme: dark)").addEventListener(
		"change",
		(event) => {
			if (!getStoredTheme()) {
				applyTheme(event.matches ? "dark" : "light", root);
			}
		},
		{ signal },
	);
}

export function setupMobileMenu(signal: AbortSignal) {
	const menuBtn = document.getElementById("mobile-menu-toggle");
	const menu = document.getElementById("mobile-menu");
	const iconMenu = document.getElementById("icon-menu");
	const iconClose = document.getElementById("icon-close");

	if (!menuBtn || !menu || !iconMenu || !iconClose) return;

	const updateMenuButtonLabel = (isOpen: boolean) => {
		const label = isOpen ? "Close navigation menu" : "Open navigation menu";
		menuBtn.setAttribute("aria-label", label);
		menuBtn.setAttribute("title", label);
	};

	const closeMenu = () => {
		menuBtn.setAttribute("aria-expanded", "false");
		menu.hidden = true;
		menu.classList.add("opacity-0", "scale-95", "invisible");
		menu.classList.remove("opacity-100", "scale-100", "visible");
		iconMenu.classList.remove("hidden");
		iconClose.classList.add("hidden");
		updateMenuButtonLabel(false);
	};

	const openMenu = () => {
		menuBtn.setAttribute("aria-expanded", "true");
		menu.hidden = false;
		menu.classList.remove("opacity-0", "scale-95", "invisible");
		menu.classList.add("opacity-100", "scale-100", "visible");
		iconMenu.classList.add("hidden");
		iconClose.classList.remove("hidden");
		updateMenuButtonLabel(true);
	};

	const desktopQuery = window.matchMedia("(min-width: 1024px)");
	const closeMenuAtDesktopBreakpoint = (
		event: MediaQueryList | MediaQueryListEvent,
	) => {
		if (event.matches) closeMenu();
	};

	desktopQuery.addEventListener("change", closeMenuAtDesktopBreakpoint, {
		signal,
	});
	closeMenuAtDesktopBreakpoint(desktopQuery);

	menuBtn.addEventListener(
		"click",
		(event) => {
			event.stopPropagation();
			menuBtn.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
		},
		{ signal },
	);

	document.addEventListener(
		"click",
		(event) => {
			const target = event.target;
			if (!(target instanceof Node)) return;

			if (
				menuBtn.getAttribute("aria-expanded") === "true" &&
				!menu.contains(target) &&
				!menuBtn.contains(target)
			) {
				closeMenu();
			}
		},
		{ signal },
	);

	document.addEventListener(
		"keydown",
		(event) => {
			if (
				event.key === "Escape" &&
				menuBtn.getAttribute("aria-expanded") === "true"
			) {
				closeMenu();
				menuBtn.focus();
			}
		},
		{ signal },
	);

	updateMenuButtonLabel(false);
}

function setupBackToTop(signal: AbortSignal) {
	const backToTopBtn = document.getElementById("back-to-top");
	if (!backToTopBtn) return;

	let frameId = 0;
	let isVisible: boolean | null = null;

	const toggleBackToTop = () => {
		if (frameId) return;

		frameId = window.requestAnimationFrame(() => {
			frameId = 0;
			const nextVisible = window.scrollY > 300;
			if (nextVisible === isVisible) return;

			isVisible = nextVisible;
			updateBackToTopVisibility(backToTopBtn, nextVisible);
		});
	};

	window.addEventListener("scroll", toggleBackToTop, { passive: true, signal });
	backToTopBtn.addEventListener(
		"click",
		() => {
			const prefersReducedMotion =
				window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
			window.scrollTo({
				top: 0,
				behavior: getBackToTopScrollBehavior(prefersReducedMotion),
			});
		},
		{ signal },
	);
	signal.addEventListener("abort", () => window.cancelAnimationFrame(frameId), {
		once: true,
	});
	toggleBackToTop();
}

function setupLayoutUiWhenReady() {
	layoutAbortController?.abort();
	layoutAbortController = new AbortController();
	const { signal } = layoutAbortController;

	setupMobileMenu(signal);
	setupThemeToggles(document, signal);
	setupSystemThemeListener(document, signal);
	setupBackToTop(signal);
	// Keep wide Markdown tables keyboard-scrollable without replacing their native table semantics.
	document.querySelectorAll<HTMLElement>(".prose table:not([tabindex])").forEach((table) => {
		table.tabIndex = 0;
	});
}

export function setupLayoutUi() {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", setupLayoutUiWhenReady, {
			once: true,
		});
		return;
	}

	setupLayoutUiWhenReady();
}
