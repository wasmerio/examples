/**
 * Checks a theme's screens list (the `screens` export of its screens file)
 * and returns it. Throws on the first bad entry, naming it, so a typo in the
 * list shows on /system instead of as a broken preview.
 *
 * @param {unknown} list
 * @param {string} [route] The system route, e.g. "/system". A screen there would preview itself.
 * @returns {{ name: string; path: string; description: string; note?: string; status?: number }[]}
 */
export function checkScreens(list, route) {
	if (!Array.isArray(list)) throw new Error("astronomicSystem: the screens file must export `screens`, an array.");
	list.forEach((screen, i) => {
		const where = `astronomicSystem: screens[${i}]`;
		if (!screen || typeof screen !== "object") throw new Error(`${where} is not an object.`);
		for (const key of ["name", "path", "description"]) {
			if (typeof screen[key] !== "string" || !screen[key].trim()) throw new Error(`${where} needs \`${key}\`, a non-empty string.`);
		}
		if (!screen.path.startsWith("/") || screen.path.startsWith("//"))
			throw new Error(`${where} (${screen.name}): \`path\` must start with one "/", e.g. "/work".`);
		if (route && (screen.path === route || screen.path.startsWith(`${route}/`) || screen.path.startsWith(`${route}?`)))
			throw new Error(`${where} (${screen.name}): \`path\` is a design system page. List only the site's own screens.`);
		if (screen.note !== undefined && typeof screen.note !== "string") throw new Error(`${where} (${screen.name}): \`note\` must be a string.`);
		if (screen.status !== undefined && !(Number.isInteger(screen.status) && screen.status >= 200 && screen.status <= 599))
			throw new Error(`${where} (${screen.name}): \`status\` must be an HTTP status, e.g. 404.`);
	});
	return list;
}
