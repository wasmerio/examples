import type { ComponentChildren } from "preact";
import type { AnchorHTMLAttributes, HTMLAttributes } from "preact/compat";

type ClassProp = { className?: string | undefined };

function joinClasses(...values: Array<string | false | null | undefined>) {
	return values.filter(Boolean).join(" ");
}

export function MachinesPanel(
	props: Omit<HTMLAttributes<HTMLElement>, "title"> &
		ClassProp & {
			children: ComponentChildren;
			title?: ComponentChildren;
		},
) {
	const { children, className, title, ...rest } = props;
	return (
		<section {...rest} className={joinClasses("mx-panel", className)}>
			{title ? <div className="mx-panel__title">{title}</div> : null}
			<div className="mx-panel__body">{children}</div>
		</section>
	);
}

export function MachinesSection(
	props: Omit<HTMLAttributes<HTMLElement>, "title"> &
		ClassProp & {
			children: ComponentChildren;
			kicker?: ComponentChildren;
			title?: ComponentChildren;
			action?: ComponentChildren;
		},
) {
	const { action, children, className, kicker, title, ...rest } = props;
	return (
		<section {...rest} className={joinClasses("mx-section", className)}>
			{title ? (
				<div className="mx-section__title">
					<span>
						{kicker ? <span>{kicker} · </span> : null}
						{title}
					</span>
					{action}
				</div>
			) : null}
			<div className="mx-section__body">{children}</div>
		</section>
	);
}

export function MachinesCard(
	props: Omit<HTMLAttributes<HTMLElement>, "title"> &
		ClassProp & {
			children: ComponentChildren;
			title?: ComponentChildren;
		},
) {
	const { children, className, title, ...rest } = props;
	return (
		<article {...rest} className={joinClasses("mx-card", className)}>
			{title ? <div className="mx-card__title">{title}</div> : null}
			<div className="mx-card__body">{children}</div>
		</article>
	);
}

export function MachinesPost(
	props: HTMLAttributes<HTMLElement> &
		ClassProp & {
			children: ComponentChildren;
			meta?: ComponentChildren;
		},
) {
	const { children, className, meta, ...rest } = props;
	return (
		<article {...rest} className={joinClasses("mx-post", className)}>
			{meta ? <div className="mx-post__meta">{meta}</div> : null}
			<div className="mx-post__body">{children}</div>
		</article>
	);
}

export function MachinesSidebarPanel(
	props: Omit<HTMLAttributes<HTMLElement>, "title"> &
		ClassProp & {
			children: ComponentChildren;
			title: ComponentChildren;
		},
) {
	const { children, className, title, ...rest } = props;
	return (
		<aside
			{...rest}
			className={joinClasses("mx-sidebar mx-sidebar--standalone", className)}
		>
			<div className="mx-sidebar__title">{title}</div>
			<div className="mx-sidebar__body">{children}</div>
		</aside>
	);
}

export function MachinesMessage(
	props: HTMLAttributes<HTMLElement> &
		ClassProp & {
			children: ComponentChildren;
			mark?: ComponentChildren;
		},
) {
	const { children, className, mark = "•", ...rest } = props;
	return (
		<aside {...rest} className={joinClasses("mx-message", className)}>
			<span className="mx-message__mark" aria-hidden="true">
				{mark}
			</span>
			<div>{children}</div>
		</aside>
	);
}

export function MachinesActionCard(
	props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "title"> &
		ClassProp & {
			action?: ComponentChildren;
			children?: ComponentChildren;
			description?: ComponentChildren;
			kicker?: ComponentChildren;
			title: ComponentChildren;
		},
) {
	const {
		action = "Open",
		children,
		className,
		description,
		kicker,
		title,
		...rest
	} = props;
	return (
		<a {...rest} className={joinClasses("mx-action-card", className)}>
			<span className="mx-action-card__head">
				{kicker ? (
					<span className="mx-action-card__kicker">{kicker}</span>
				) : null}
				<span className="mx-action-card__action">{action}</span>
			</span>
			<strong className="mx-action-card__title">{title}</strong>
			{description ? (
				<span className="mx-action-card__body">{description}</span>
			) : null}
			{children}
		</a>
	);
}

export function MachinesTile(
	props: Omit<HTMLAttributes<HTMLElement>, "title"> &
		ClassProp & {
			action?: ComponentChildren;
			children?: ComponentChildren;
			kicker?: ComponentChildren;
			title: ComponentChildren;
		},
) {
	const { action, children, className, kicker, title, ...rest } = props;
	return (
		<article {...rest} className={joinClasses("mx-tile", className)}>
			<div className="mx-tile__head">
				{kicker ? <span className="mx-tile__kicker">{kicker}</span> : null}
				{action ? <span className="mx-tile__action">{action}</span> : null}
			</div>
			<strong className="mx-tile__title">{title}</strong>
			{children ? <div className="mx-tile__body">{children}</div> : null}
		</article>
	);
}

export function MachinesGroupbox(
	props: HTMLAttributes<HTMLElement> &
		ClassProp & {
			children: ComponentChildren;
			legend: ComponentChildren;
		},
) {
	const { children, className, legend, ...rest } = props;
	return (
		<section {...rest} className={joinClasses("mx-groupbox", className)}>
			<div className="mx-groupbox__legend">{legend}</div>
			<div className="mx-groupbox__body">{children}</div>
		</section>
	);
}

export function MachinesCodeFrame(
	props: Omit<HTMLAttributes<HTMLElement>, "title"> &
		ClassProp & {
			children: ComponentChildren;
			title?: ComponentChildren;
		},
) {
	const { children, className, title, ...rest } = props;
	return (
		<section {...rest} className={joinClasses("mx-code-frame", className)}>
			{title ? (
				<div className="mx-code-frame__header mx-code-frame__header--meta">
					<span className="mx-code-frame__language">{title}</span>
				</div>
			) : null}
			{children}
		</section>
	);
}
