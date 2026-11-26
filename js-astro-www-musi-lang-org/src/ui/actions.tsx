import type { AnchorHTMLAttributes, ReactNode } from "preact/compat";

type ButtonTone = "primary" | "secondary" | "ghost" | "link";

function buttonClass(tone: ButtonTone, className?: unknown) {
	const toneClass =
		tone === "secondary"
			? " mx-button--secondary"
			: tone === "ghost"
				? " mx-button--ghost"
				: tone === "link"
					? " mx-button--link"
					: "";
	return `mx-button${toneClass}${typeof className === "string" ? ` ${className}` : ""}`;
}

function ActionAnchor(
	props: AnchorHTMLAttributes<HTMLAnchorElement> & {
		children: ReactNode;
		tone: ButtonTone;
	},
) {
	const { children, className, tone, ...rest } = props;
	return (
		<a {...rest} className={buttonClass(tone, className)}>
			{children}
		</a>
	);
}

export function PrimaryAction(props: { children: ReactNode; href: string }) {
	return (
		<ActionAnchor href={props.href} tone="primary">
			{props.children}
		</ActionAnchor>
	);
}

export function SecondaryAction(props: { children: ReactNode; href: string }) {
	return (
		<ActionAnchor href={props.href} tone="secondary">
			{props.children}
		</ActionAnchor>
	);
}

export function InlineAction(
	props: AnchorHTMLAttributes<HTMLAnchorElement> & {
		children: ReactNode;
		href: string;
	},
) {
	const { children, className, ...rest } = props;
	return (
		<a {...rest} className={buttonClass("link", className)}>
			{children}
		</a>
	);
}

export function ActionStrip(props: { children: ReactNode }) {
	return <div className="mx-cluster">{props.children}</div>;
}
