/**
 * An icon component: Lucide's (@lucide/astro), your own SVG component, or any component that takes props. Icon
 * passes it aria-hidden="true" and sizes the svg it draws. One argument of any type: Lucide types an icon as
 * (props: LucideProps) => unknown, and an .astro import is typed (props: Props) => any; both fit, and the kit needs
 * no icon package.
 */
export type IconComponent = (props: any) => unknown;

/** An icon's size: sm 1rem, md 1.25rem, lg 1.5rem. */
export type IconSize = "sm" | "md" | "lg";

const SIZE: Record<IconSize, string> = { sm: "size-4", md: "size-5", lg: "size-6" };

/**
 * The ui-icon utility (theme.css: the --ui-icon-stroke line weight, a non-scaling stroke) and the size class. Icon.astro
 * uses it on its span; a React part puts it on its own <svg>.
 */
export function iconClasses(size: IconSize = "md"): string {
	return `ui-icon ${SIZE[size]}`;
}
