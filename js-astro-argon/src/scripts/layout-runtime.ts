import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbars } from "overlayscrollbars";
import { siteConfig } from "../config";
import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_EXTEND,
	BANNER_HEIGHT_HOME,
	MAIN_PANEL_OVERLAPS_BANNER_HEIGHT,
} from "../constants/constants";
import {
	applyColorTheme,
	getStoredColorTheme,
} from "../utils/setting-utils";
import { pathsEqual, url } from "../utils/url-utils";

let runtimeBooted = false;

function updateBannerHeightExtend() {
	// Keep --banner-height-extend as a multiple of 4 to avoid blurry text.
	let offset = Math.floor(window.innerHeight * (BANNER_HEIGHT_EXTEND / 100));
	offset -= offset % 4;
	document.documentElement.style.setProperty("--banner-height-extend", `${offset}px`);
}

function setClickOutsideToClose(panelId: string, ignoreIds: string[]) {
	document.addEventListener("click", (event) => {
		const panel = document.getElementById(panelId);
		if (!panel || panel.classList.contains("float-panel-closed")) {
			return;
		}

		const target = event.target;
		if (!(target instanceof Node)) return;

		const shouldIgnore = ignoreIds.some((id) => {
			const element = document.getElementById(id);
			return element === target || element?.contains(target);
		});

		if (!shouldIgnore) {
			panel.classList.add("float-panel-closed");
		}
	});
}

function loadColorTheme() {
	applyColorTheme(getStoredColorTheme());
}

function initBodyScrollbar() {
	const bodyElement = document.body;
	if (bodyElement.dataset.osInitialized === "true") {
		return;
	}

	OverlayScrollbars(
		{
			target: bodyElement,
			cancel: {
				// Keep native overlay scrollbar if available.
				nativeScrollbarsOverlaid: true,
			},
		},
		{
			scrollbars: {
				theme: "scrollbar-base scrollbar-auto py-1",
				autoHide: "move",
				autoHideDelay: 500,
				autoHideSuspend: false,
			},
		},
	);
	bodyElement.dataset.osInitialized = "true";
}

function initKatexScrollbar() {
	const katexElements =
		document.querySelectorAll<HTMLElement>(".katex-display");

	const processKatexElement = (element: HTMLElement) => {
		if (!element.parentNode) return;
		if (element.hasAttribute("data-scrollbar-initialized")) return;

		const container = document.createElement("div");
		container.className = "katex-display-container";
		container.setAttribute("aria-label", "scrollable container for formulas");

		element.parentNode.insertBefore(container, element);
		container.appendChild(element);

		OverlayScrollbars(container, {
			scrollbars: {
				theme: "scrollbar-base scrollbar-auto",
				autoHide: "leave",
				autoHideDelay: 500,
				autoHideSuspend: false,
			},
		});

		element.setAttribute("data-scrollbar-initialized", "true");
	};

	const katexObserver = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					processKatexElement(entry.target as HTMLElement);
					observer.unobserve(entry.target);
				}
			});
		},
		{
			root: null,
			rootMargin: "100px",
			threshold: 0.1,
		},
	);

	katexElements.forEach((element) => {
		katexObserver.observe(element);
	});
}

function initCustomScrollbar() {
	initBodyScrollbar();
	initKatexScrollbar();
}

function showBanner() {
	if (!siteConfig.banner.enable) return;
	const banner = document.getElementById("banner");
	if (!banner) return;
	banner.classList.remove("opacity-0", "scale-105");
}

function getScrollTop() {
	return Math.max(document.body.scrollTop, document.documentElement.scrollTop);
}

function getNavbarHiddenThreshold() {
	const NAVBAR_HEIGHT = 72;
	const MAIN_PANEL_EXCESS_HEIGHT = MAIN_PANEL_OVERLAPS_BANNER_HEIGHT * 16;
	const bannerHeight =
		document.body.classList.contains("lg:is-home") && window.innerWidth >= 1024
			? BANNER_HEIGHT_HOME
			: BANNER_HEIGHT;

	return (
		window.innerHeight * (bannerHeight / 100) -
		NAVBAR_HEIGHT -
		MAIN_PANEL_EXCESS_HEIGHT -
		16
	);
}

function createScrollHandler(
	backToTopBtn: HTMLElement | null,
	navbar: HTMLElement | null,
	bannerEnabled: boolean,
) {
	return () => {
		const scrollTop = getScrollTop();
		const backToTopThreshold = window.innerHeight * (BANNER_HEIGHT / 100);

		if (backToTopBtn) {
			if (scrollTop > backToTopThreshold) {
				backToTopBtn.classList.remove("hide");
			} else {
				backToTopBtn.classList.add("hide");
			}
		}

		if (!bannerEnabled || !navbar) return;
		if (scrollTop >= getNavbarHiddenThreshold()) {
			navbar.classList.add("navbar-hidden");
		} else {
			navbar.classList.remove("navbar-hidden");
		}
	};
}

function bindSwupHooks(
	scrollFunction: () => void,
	bannerEnabled: boolean,
) {
	const setup = () => {
		const swup = window.swup;
		if (!swup?.hooks) return;

		swup.hooks.on("link:click", () => {
			document.documentElement.style.setProperty("--content-delay", "0ms");
			if (!bannerEnabled) return;

			const navbar = document.getElementById("navbar-wrapper");
			if (!navbar || !document.body.classList.contains("lg:is-home")) {
				return;
			}
			if (getScrollTop() >= getNavbarHiddenThreshold()) {
				navbar.classList.add("navbar-hidden");
			}
		});

		swup.hooks.on("content:replace", initCustomScrollbar);

		swup.hooks.on("visit:start", (visit: { to: { url: string } }) => {
			const bodyElement = document.body;
			if (pathsEqual(visit.to.url, url("/"))) {
				bodyElement.classList.add("lg:is-home");
			} else {
				bodyElement.classList.remove("lg:is-home");
			}

			const heightExtend = document.getElementById("page-height-extend");
			heightExtend?.classList.remove("hidden");
		});

		swup.hooks.on("page:view", () => {
			const heightExtend = document.getElementById("page-height-extend");
			heightExtend?.classList.add("hidden");
			scrollFunction();
		});

		swup.hooks.on("visit:end", () => {
			setTimeout(() => {
				const heightExtend = document.getElementById("page-height-extend");
				heightExtend?.classList.add("hidden");
			}, 200);
		});
	};

	if (window?.swup?.hooks) {
		setup();
	} else {
		document.addEventListener("swup:enable", setup, { once: true });
	}
}

export function setupLayoutRuntime() {
	if (runtimeBooted || typeof window === "undefined") return;
	runtimeBooted = true;

	setClickOutsideToClose("display-setting", [
		"display-setting",
		"display-settings-switch",
	]);
	setClickOutsideToClose("nav-menu-panel", ["nav-menu-panel", "nav-menu-switch"]);
	setClickOutsideToClose("search-panel", ["search-panel", "search-bar", "search-switch"]);

	const bannerEnabled = !!document.getElementById("banner-wrapper");
	const backToTopBtn = document.getElementById("back-to-top-btn");
	const navbar = document.getElementById("navbar-wrapper");
	const scrollFunction = createScrollHandler(backToTopBtn, navbar, bannerEnabled);

	loadColorTheme();
	updateBannerHeightExtend();
	initCustomScrollbar();
	showBanner();

	bindSwupHooks(scrollFunction, bannerEnabled);

	window.addEventListener("scroll", scrollFunction, { passive: true });
	window.addEventListener(
		"resize",
		() => {
			updateBannerHeightExtend();
			scrollFunction();
		},
		{ passive: true },
	);
	scrollFunction();
}
