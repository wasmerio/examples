import type { SocialName } from "@/types/config";

type SvgComponent = (_props: Record<string, unknown>) => unknown;

const icons = import.meta.glob<{ default: SvgComponent }>(
  "/src/assets/icons/socials/*.svg"
);

/** Solid glyphs (Simple Icons) that need fill styling, not stroke styling. */
const FILLED: ReadonlySet<SocialName> = new Set(["devto", "lemmy"]);

/**
 * Looks up the local icon for a social profile. Throws when the file is
 * missing so a typo never silently drops a configured profile.
 */
export async function getSocialIcon(
  name: SocialName
): Promise<{ Icon: SvgComponent; filled: boolean }> {
  const load = icons[`/src/assets/icons/socials/${name}.svg`];
  if (!load) {
    throw new Error(
      `[socials] no icon file src/assets/icons/socials/${name}.svg`
    );
  }
  const mod = await load();
  return { Icon: mod.default, filled: FILLED.has(name) };
}
