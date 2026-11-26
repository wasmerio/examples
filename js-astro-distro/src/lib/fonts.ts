/**
 * Las fuentes se sirven desde `@fontsource/*` (cada paquete trae sus `.woff2`
 * y su `@font-face`). Importar los archivos de peso aquí basta para que
 * Vite los agrupe en el CSS final — sin CDN externa, sin DNS a Google.
 *
 * Cuando en el futuro se quieran añadir/quitar pesos o familias basta con
 * tocar estos `import` y el mapa `FONT_FAMILY` de abajo.
 */
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource/ubuntu-mono/400.css";
import "@fontsource/ubuntu-mono/700.css";
import "@fontsource/fira-code/400.css";
import "@fontsource/fira-code/500.css";
import "@fontsource/fira-code/700.css";
import "@fontsource/noto-sans-mono/400.css";
import "@fontsource/noto-sans-mono/500.css";
import "@fontsource/noto-sans-mono/700.css";
import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/500.css";
import "@fontsource/noto-sans/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/700.css";

import type { systems } from "./themes";

type SystemFont = (typeof systems)[number]["font"];

/**
 * Familia local (ya bundled por `@fontsource`) que usa cada `font`
 * declarado en `config.json → sistemas[]`. Para fonts que no tienen
 * equivalente cubierto por `@fontsource` (Hack no está disponible, y
 * para Iosevka/DejaVu/SF/Liberation/Cascadia no hay nada equivalente
 * libre) se elige el sustituto más razonable del mismo tipo.
 *
 *  * `Fira Code` sustituye a Hack: ambas son mono de programación con
 *    buena diferenciación de glifos, Fira Code es el estándar de
 *    facto en la comunidad para reemplazar Hack.
 */
export const FONT_FAMILY: Record<SystemFont, string> = {
	"JetBrains Mono": "JetBrains Mono",
	"Ubuntu Mono": "Ubuntu Mono",
	Hack: "Fira Code",
	Inter: "Inter",
	"Noto Sans": "Noto Sans",
	"Noto Sans Mono": "Noto Sans Mono",
	"Roboto Mono": "Roboto Mono",
	// Sustitutos para fonts que NO están en @fontsource (mismo estilo):
	"Iosevka Term": "JetBrains Mono",
	"DejaVu Sans Mono": "JetBrains Mono",
	"Liberation Mono": "JetBrains Mono",
	"Cascadia Mono": "JetBrains Mono",
	"SF Mono": "JetBrains Mono",
	Monospace: "JetBrains Mono",
	Cantarell: "Inter",
};

/**
 * Cadena de `font-family` con fallbacks sensatos: si el `@font-face`
 * no se ha terminado de inyectar, el navegador cae al mono de sistema.
 */
export function fontStack(family: string): string {
	return `'${family}', ui-monospace, 'SF Mono', Menlo, Monaco, monospace`;
}
