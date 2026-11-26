import { afterEach, describe, expect, it, vi } from "vitest";
import {
	getBackToTopScrollBehavior,
	setupMobileMenu,
	updateBackToTopVisibility,
	updateThemeToggleLabels,
} from "../src/scripts/layout-ui";

afterEach(() => vi.unstubAllGlobals());

describe("layout UI helpers", () => {
	it("uses instant scroll when reduced motion is requested", () => {
		expect(getBackToTopScrollBehavior(true)).toBe("auto");
	});

	it("uses smooth scroll when reduced motion is not requested", () => {
		expect(getBackToTopScrollBehavior(false)).toBe("smooth");
	});

	it("keeps the hidden back-to-top action out of the tab order", () => {
		const attributes = new Map<string, string>();
		const button = {
			tabIndex: 0,
			setAttribute: (name: string, value: string) => attributes.set(name, value),
		} as unknown as HTMLElement;

		updateBackToTopVisibility(button, false);

		expect(button.tabIndex).toBe(-1);
		expect(attributes.get("data-visible")).toBe("false");
	});

	it("uses an action label without toggle-button state", () => {
		const attributes = new Map<string, string>();
		const visibleLabel = { textContent: "Dark mode" };
		const button = {
			setAttribute: (name: string, value: string) => attributes.set(name, value),
			querySelectorAll: () => [visibleLabel],
		};
		const root = {
			querySelectorAll: () => [button],
		} as unknown as ParentNode;

		updateThemeToggleLabels(root, "dark");

		expect(Object.fromEntries(attributes)).toEqual({
			"aria-label": "Switch to light mode",
			title: "Switch to light mode",
		});
		expect(visibleLabel.textContent).toBe("Light mode");
	});

	it("closes an open mobile menu when the desktop breakpoint matches", () => {
		let breakpointListener: ((event: { matches: boolean }) => void) | undefined;
		const elements = new Map<string, ReturnType<typeof createElement>>([
			["mobile-menu-toggle", createElement()],
			["mobile-menu", createElement()],
			["icon-menu", createElement()],
			["icon-close", createElement()],
		]);
		const menuButton = elements.get("mobile-menu-toggle")!;
		const menu = elements.get("mobile-menu")!;

		vi.stubGlobal("document", {
			getElementById: (id: string) => elements.get(id),
			addEventListener: () => {},
		});
		vi.stubGlobal("window", {
			matchMedia: () => ({
				matches: false,
				addEventListener: (
					_type: string,
					listener: (event: { matches: boolean }) => void,
				) => {
					breakpointListener = listener;
				},
			}),
		});

		setupMobileMenu(new AbortController().signal);
		menuButton.setAttribute("aria-expanded", "true");
		menu.hidden = false;
		breakpointListener?.({ matches: true });

		expect(menuButton.getAttribute("aria-expanded")).toBe("false");
		expect(menu.hidden).toBe(true);
	});
});

function createElement() {
	const attributes = new Map<string, string>();
	const classes = new Set<string>();

	return {
		hidden: false,
		classList: {
			add: (...tokens: string[]) => tokens.forEach((token) => classes.add(token)),
			remove: (...tokens: string[]) =>
				tokens.forEach((token) => classes.delete(token)),
		},
		setAttribute: (name: string, value: string) => attributes.set(name, value),
		getAttribute: (name: string) => attributes.get(name) ?? null,
		addEventListener: () => {},
		contains: () => false,
		focus: () => {},
	};
}
