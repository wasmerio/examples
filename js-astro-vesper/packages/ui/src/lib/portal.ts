/**
 * Where a component's popups render: inside the closest element with
 * `data-ui-portal` around `from`, or undefined for the default (`<body>`).
 * Use `data-ui-portal` where tokens are set on part of a page, so a popup
 * opened there keeps that part's tokens.
 */
export function portalContainer(from: { closest(selector: string): unknown } | null | undefined): HTMLElement | undefined {
	return (from?.closest("[data-ui-portal]") as HTMLElement | null | undefined) ?? undefined;
}
