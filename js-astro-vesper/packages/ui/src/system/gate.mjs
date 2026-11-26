/**
 * True when the design system pages should exist: always in `astro dev`,
 * in `astro build` only with ASTRONOMIC_SYSTEM=1, never in preview or sync.
 */
export function systemEnabled({ command, env = process.env }) {
	if (command === "dev") return true;
	if (command === "build") return env.ASTRONOMIC_SYSTEM === "1";
	return false;
}
