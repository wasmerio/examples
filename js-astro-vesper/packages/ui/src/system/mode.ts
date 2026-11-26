/**
 * The light and dark switch on the design system pages. Sets or removes
 * `data-theme` on <html> and saves the choice as `aui-theme`.
 */
type Mode = "system" | "light" | "dark";

const KEY = "aui-theme";
const root = document.documentElement;

function savedMode(): Mode {
	try {
		const value = localStorage.getItem(KEY);
		if (value === "light" || value === "dark") return value;
	} catch {}
	return "system";
}

function apply(mode: Mode) {
	if (mode === "system") delete root.dataset.theme;
	else root.dataset.theme = mode;
}

function save(mode: Mode) {
	try {
		localStorage.setItem(KEY, mode);
	} catch {}
}

const onSystemPage = () => !!document.querySelector("[data-system-page]");

/** Applies the saved mode and binds the switch on this page (once per input). */
function setup() {
	if (!onSystemPage()) return;
	const mode = savedMode();
	apply(mode);
	for (const input of document.querySelectorAll<HTMLInputElement>("[data-system-mode] input")) {
		input.checked = input.value === mode;
		if (input.dataset.bound) continue;
		input.dataset.bound = "";
		input.addEventListener("change", () => {
			const next = input.value as Mode;
			apply(next);
			save(next);
		});
	}
}

// Inline module scripts can run again after a ClientRouter swap: bind the
// document listeners once per visit.
const w = window as unknown as { __auiSystemMode?: boolean };
if (!w.__auiSystemMode) {
	w.__auiSystemMode = true;
	// ClientRouter replaces the <html> attributes on each navigation: put the mode back before paint.
	document.addEventListener("astro:after-swap", () => {
		if (onSystemPage()) apply(savedMode());
	});
	// With ClientRouter this fires on every page; without it, the direct call below does the work.
	document.addEventListener("astro:page-load", setup);
}
setup();
