/**
 * Única lista de distros del sitio: de aquí salen los logos que se piden a
 * fastfetch (components/logos), los slugs de `data-theme` (styles/themes.css)
 * y el contenido que varía por distro.
 *
 * La fuente de verdad es `src/systems.yml` → `src/config.json`; este módulo
 * solo añade los tipos que TypeScript necesita y el `DEFAULT_THEME` desde `site`.
 */
import config from "@/config.json";

export const systems = config.systems;
export type System = (typeof systems)[number];
export type Theme = System["slug"];

export const themes: Theme[] = systems.map((distro) => distro.slug).sort();

export const DEFAULT_THEME: Theme = config.site.default_theme as Theme;

/** clave de localStorage — replicada literalmente en el script anti-FOUC del layout */
export const STORAGE_KEY = "theme";
