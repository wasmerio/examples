import type * as Preact from "preact";
import { useEffect, useId, useMemo, useRef, useState } from "preact/hooks";
import { classNames, type MachinesTheme } from "./index";

const restoreNoop = (): void => undefined;

function clampNumber(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function percentOf(value: number, min: number, max: number): number {
	const safeMax = max > min ? max : min + 100;
	return Math.round(
		((clampNumber(value, min, safeMax) - min) / (safeMax - min)) * 100,
	);
}

function focusableElements(container: HTMLElement | null): HTMLElement[] {
	if (!container) {
		return [];
	}
	return Array.from(
		container.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
		),
	).filter((element) => !element.hasAttribute("disabled"));
}

function setSiblingBranchesInert(
	node: HTMLElement | null,
	inert: boolean,
): () => void {
	if (!node) {
		return restoreNoop;
	}
	const changed: Array<{
		element: HTMLElement;
		ariaHidden: string | null;
		inert: boolean;
	}> = [];
	let current: HTMLElement | null = node;
	while (current?.parentElement) {
		for (const sibling of Array.from(current.parentElement.children)) {
			if (!(sibling instanceof HTMLElement) || sibling === current) {
				continue;
			}
			changed.push({
				element: sibling,
				ariaHidden: sibling.getAttribute("aria-hidden"),
				inert: sibling.inert,
			});
			sibling.inert = inert;
			sibling.setAttribute("aria-hidden", inert ? "true" : "false");
		}
		if (current.parentElement === document.body) {
			break;
		}
		current = current.parentElement;
	}
	return () => {
		for (const entry of changed) {
			entry.element.inert = entry.inert;
			if (entry.ariaHidden === null) {
				entry.element.removeAttribute("aria-hidden");
			} else {
				entry.element.setAttribute("aria-hidden", entry.ariaHidden);
			}
		}
	};
}

export function MachinesRoot(
	props: Preact.HTMLAttributes<HTMLDivElement> & {
		children: Preact.ComponentChildren;
		theme?: MachinesTheme;
	},
) {
	const {
		children,
		class: classProp,
		className,
		theme = "warm",
		...rest
	} = props;
	return (
		<div
			{...rest}
			data-mx-root={true}
			data-mx-theme={theme}
			class={classNames(
				"mx-root",
				typeof classProp === "string" ? classProp : undefined,
				typeof className === "string" ? className : undefined,
			)}
		>
			{children}
		</div>
	);
}

export function Button(
	props: Preact.ButtonHTMLAttributes<HTMLButtonElement> & {
		children: Preact.ComponentChildren;
		variant?: "primary" | "secondary" | "hollow" | "ghost" | "link" | "danger";
	},
) {
	const {
		children,
		class: classProp,
		className,
		variant = "primary",
		type = "button",
		...rest
	} = props;
	return (
		<button
			{...rest}
			type={type}
			class={classNames(
				"mx-button",
				`mx-button--${variant}`,
				typeof classProp === "string" ? classProp : undefined,
				typeof className === "string" ? className : undefined,
			)}
		>
			{children}
		</button>
	);
}

export type BarTone = "accent" | "success" | "warning" | "danger";

export function ProgressBar(props: {
	label: string;
	value: number;
	max?: number;
	tone?: BarTone;
	showValue?: boolean;
	class?: string;
	className?: string;
}) {
	const { label, value, max = 100, tone = "accent", showValue = false } = props;
	const safeMax = max > 0 ? max : 100;
	const clampedValue = clampNumber(value, 0, safeMax);
	const percent = percentOf(clampedValue, 0, safeMax);
	return (
		<div
			class={classNames(
				"mx-bar",
				"mx-bar--progress",
				tone !== "accent" && `mx-bar--${tone}`,
				props.class,
				props.className,
			)}
			style={{ "--mx-bar-value": `${percent}%` }}
			role="progressbar"
			aria-label={label}
			aria-valuemin={0}
			aria-valuemax={safeMax}
			aria-valuenow={clampedValue}
		>
			<div class="mx-bar__head">
				<span class="mx-bar__label">{label}</span>
				{showValue ? <span class="mx-bar__value">{percent}%</span> : null}
			</div>
			<div class="mx-bar__track" aria-hidden="true">
				<div class="mx-bar__fill" />
			</div>
		</div>
	);
}

export function MeterBar(props: {
	label: string;
	value: number;
	min?: number;
	max?: number;
	low?: number;
	high?: number;
	optimum?: number;
	showValue?: boolean;
	class?: string;
	className?: string;
}) {
	const { label, value, min = 0, max = 100, showValue = false } = props;
	const safeMax = max > min ? max : min + 100;
	const clampedValue = clampNumber(value, min, safeMax);
	const percent = percentOf(clampedValue, min, safeMax);
	const meterStyle: Preact.JSX.CSSProperties = {
		"--mx-bar-value": `${percent}%`,
	};
	if (typeof props.low === "number") {
		meterStyle["--mx-meter-low"] = `${percentOf(props.low, min, safeMax)}%`;
	}
	if (typeof props.high === "number") {
		meterStyle["--mx-meter-high"] = `${percentOf(props.high, min, safeMax)}%`;
	}
	if (typeof props.optimum === "number") {
		meterStyle["--mx-meter-optimum"] =
			`${percentOf(props.optimum, min, safeMax)}%`;
	}
	const tone =
		typeof props.optimum === "number" && clampedValue >= props.optimum
			? "success"
			: typeof props.high === "number" && clampedValue >= props.high
				? "warning"
				: typeof props.low === "number" && clampedValue <= props.low
					? "danger"
					: "accent";
	return (
		<meter
			class={classNames(
				"mx-bar",
				"mx-bar--meter",
				tone !== "accent" && `mx-bar--${tone}`,
				props.class,
				props.className,
			)}
			style={meterStyle}
			aria-label={label}
			min={min}
			max={safeMax}
			low={props.low}
			high={props.high}
			optimum={props.optimum}
			value={clampedValue}
		>
			<div class="mx-bar__head">
				<span class="mx-bar__label">{label}</span>
				{showValue ? <span class="mx-bar__value">{clampedValue}</span> : null}
			</div>
			<div class="mx-bar__track" aria-hidden="true">
				<div class="mx-bar__fill" />
			</div>
		</meter>
	);
}

export function Slider(
	props: Omit<
		Preact.InputHTMLAttributes<HTMLInputElement>,
		"type" | "value" | "defaultValue" | "onInput"
	> & {
		label: string;
		value?: number;
		defaultValue?: number;
		onValueChange?: (value: number) => void;
		showValue?: boolean;
		class?: string;
		className?: string;
	},
) {
	const {
		label,
		value,
		defaultValue,
		onValueChange,
		showValue = true,
		class: classProp,
		className,
		min = 0,
		max = 100,
		step = 1,
		id,
		...rest
	} = props;
	const generatedId = useId();
	const sliderId = id ?? generatedId;
	const numericMin = Number(min);
	const numericMax = Number(max);
	const initialValue =
		value ?? defaultValue ?? numericMin + (numericMax - numericMin) / 2;
	const [internalValue, setInternalValue] = useState(Number(initialValue));
	const currentValue = Number(value ?? internalValue);
	const updateValue = (nextValue: number) => {
		if (value === undefined) {
			setInternalValue(nextValue);
		}
		onValueChange?.(nextValue);
	};
	return (
		<label class={classNames("mx-slider", classProp, className)} for={sliderId}>
			<span class="mx-slider__head">
				<span class="mx-field__label">{label}</span>
				{showValue ? (
					<output class="mx-slider__value" for={sliderId}>
						{currentValue}
					</output>
				) : null}
			</span>
			<input
				{...rest}
				id={sliderId}
				type="range"
				min={numericMin}
				max={numericMax}
				step={step}
				value={currentValue}
				onInput={(event) => updateValue(event.currentTarget.valueAsNumber)}
			/>
		</label>
	);
}

export interface TabItem {
	id: string;
	label: string;
	content: Preact.ComponentChildren;
}

export function Tabs(props: { items: readonly TabItem[]; label: string }) {
	const tabBaseId = useId();
	const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
	const [activeId, setActiveId] = useState(props.items[0]?.id ?? "");
	const active =
		props.items.find((item) => item.id === activeId) ?? props.items[0];
	if (!active) {
		return null;
	}
	const activeIndex = Math.max(
		0,
		props.items.findIndex((item) => item.id === active.id),
	);
	const activateTab = (index: number) => {
		const item = props.items[index];
		if (!item) {
			return;
		}
		setActiveId(item.id);
		requestAnimationFrame(() => tabRefs.current[item.id]?.focus());
	};
	const onTabKeyDown = (
		event: Preact.TargetedKeyboardEvent<HTMLButtonElement>,
		index: number,
	) => {
		const lastIndex = props.items.length - 1;
		if (event.key === "ArrowRight") {
			event.preventDefault();
			activateTab(index === lastIndex ? 0 : index + 1);
		} else if (event.key === "ArrowLeft") {
			event.preventDefault();
			activateTab(index === 0 ? lastIndex : index - 1);
		} else if (event.key === "Home") {
			event.preventDefault();
			activateTab(0);
		} else if (event.key === "End") {
			event.preventDefault();
			activateTab(lastIndex);
		}
	};
	return (
		<div class="mx-widget-tabs">
			<div class="mx-nav-rail" role="tablist" aria-label={props.label}>
				<ul class="mx-nav-tabs">
					{props.items.map((item, index) => (
						<li key={item.id}>
							<button
								id={`${tabBaseId}-${item.id}-tab`}
								ref={(node) => {
									tabRefs.current[item.id] = node;
								}}
								type="button"
								role="tab"
								aria-selected={item.id === active.id}
								aria-controls={`${tabBaseId}-${item.id}-panel`}
								tabIndex={index === activeIndex ? 0 : -1}
								class={classNames(
									"mx-tab",
									item.id === active.id && "is-active",
								)}
								onClick={() => setActiveId(item.id)}
								onKeyDown={(event) => onTabKeyDown(event, index)}
							>
								{item.label}
							</button>
						</li>
					))}
				</ul>
			</div>
			<div
				id={`${tabBaseId}-${active.id}-panel`}
				class="mx-tab-panel"
				role="tabpanel"
				aria-labelledby={`${tabBaseId}-${active.id}-tab`}
			>
				<div class="mx-tab-panel__body">{active.content}</div>
			</div>
		</div>
	);
}

export interface CodeTabItem {
	id: string;
	label: string;
	code?: string;
	html?: string;
	language?: string;
}

export function CodeTabs(props: {
	label: string;
	tabs: readonly CodeTabItem[];
}) {
	const tabBaseId = useId();
	const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
	const [activeId, setActiveId] = useState(props.tabs[0]?.id ?? "");
	const active =
		props.tabs.find((item) => item.id === activeId) ?? props.tabs[0];
	if (!active) {
		return null;
	}
	const activeIndex = Math.max(
		0,
		props.tabs.findIndex((item) => item.id === active.id),
	);
	const activateTab = (index: number) => {
		const item = props.tabs[index];
		if (!item) {
			return;
		}
		setActiveId(item.id);
		requestAnimationFrame(() => tabRefs.current[item.id]?.focus());
	};
	const onTabKeyDown = (
		event: Preact.TargetedKeyboardEvent<HTMLButtonElement>,
		index: number,
	) => {
		const lastIndex = props.tabs.length - 1;
		if (event.key === "ArrowRight") {
			event.preventDefault();
			activateTab(index === lastIndex ? 0 : index + 1);
		} else if (event.key === "ArrowLeft") {
			event.preventDefault();
			activateTab(index === 0 ? lastIndex : index - 1);
		} else if (event.key === "Home") {
			event.preventDefault();
			activateTab(0);
		} else if (event.key === "End") {
			event.preventDefault();
			activateTab(lastIndex);
		}
	};
	return (
		<div class="mx-code-tabs" data-code-tabs={true}>
			<div
				class="mx-nav-rail mx-code-tabs__rail"
				role="tablist"
				aria-label={props.label}
			>
				<ul class="mx-nav-tabs">
					{props.tabs.map((item, index) => (
						<li key={item.id}>
							<button
								id={`${tabBaseId}-${item.id}-tab`}
								ref={(node) => {
									tabRefs.current[item.id] = node;
								}}
								type="button"
								role="tab"
								aria-selected={item.id === active.id}
								aria-controls={`${tabBaseId}-${item.id}-panel`}
								tabIndex={index === activeIndex ? 0 : -1}
								data-code-tab-trigger={item.id}
								class={classNames(
									"mx-tab",
									item.id === active.id && "is-active",
								)}
								onClick={() => setActiveId(item.id)}
								onKeyDown={(event) => onTabKeyDown(event, index)}
							>
								{item.label}
							</button>
						</li>
					))}
				</ul>
			</div>
			{props.tabs.map((item) => {
				const selected = item.id === active.id;
				return (
					<div
						key={item.id}
						id={`${tabBaseId}-${item.id}-panel`}
						class="mx-code-frame mx-code-tabs__frame"
						role="tabpanel"
						aria-labelledby={`${tabBaseId}-${item.id}-tab`}
						data-code-tab-panel={item.id}
						hidden={!selected}
					>
						{item.language ? (
							<div class="mx-code-frame__header mx-code-frame__header--meta">
								<span class="mx-code-frame__language">{item.language}</span>
							</div>
						) : null}
						{item.html ? (
							<div
								class="mx-code-frame__content"
								dangerouslySetInnerHTML={{ __html: item.html }}
							/>
						) : (
							<pre>
								<code>{item.code ?? ""}</code>
							</pre>
						)}
					</div>
				);
			})}
		</div>
	);
}

export function Disclosure(props: {
	title: string;
	children: Preact.ComponentChildren;
	open?: boolean;
}) {
	return (
		<details class="mx-section" open={props.open}>
			<summary class="mx-section__title">{props.title}</summary>
			<div class="mx-section__body">{props.children}</div>
		</details>
	);
}

export function Drawer(props: {
	label: string;
	children: Preact.ComponentChildren;
	buttonLabel?: string;
}) {
	const [open, setOpen] = useState(false);
	const openLabel = props.buttonLabel ?? `Open ${props.label}`;
	const drawerRef = useRef<HTMLDivElement | null>(null);
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const closeRef = useRef<HTMLButtonElement | null>(null);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const closeDrawer = () => {
		setOpen(false);
		requestAnimationFrame(() => triggerRef.current?.focus());
	};
	const onDrawerKeyDown = (
		event: Preact.TargetedKeyboardEvent<HTMLDivElement>,
	) => {
		if (event.key === "Escape") {
			closeDrawer();
			return;
		}
		if (event.key !== "Tab") {
			return;
		}
		const focusable = focusableElements(panelRef.current);
		const first = focusable[0];
		const last = focusable.at(-1);
		if (!(first && last)) {
			event.preventDefault();
			return;
		}
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	};
	useEffect(() => {
		if (open) {
			closeRef.current?.focus();
			return setSiblingBranchesInert(drawerRef.current, true);
		}
		return undefined;
	}, [open]);
	return (
		<div ref={drawerRef} class="mx-drawer">
			<button
				ref={triggerRef}
				class="mx-button"
				type="button"
				onClick={() => setOpen(true)}
			>
				{openLabel}
			</button>
			{open ? (
				<div
					class="mx-drawer__scrim"
					role="dialog"
					aria-modal="true"
					aria-label={props.label}
					onKeyDown={onDrawerKeyDown}
				>
					<div ref={panelRef} class="mx-panel mx-drawer__panel">
						<div class="mx-panel__title mx-titlebar">
							<span class="mx-titlebar__label">{props.label}</span>
							<span class="mx-titlebar__actions">
								<button
									ref={closeRef}
									class="mx-button mx-button--ghost mx-drawer__close"
									type="button"
									onClick={closeDrawer}
								>
									Close
								</button>
							</span>
						</div>
						<div class="mx-panel__body">{props.children}</div>
					</div>
				</div>
			) : null}
		</div>
	);
}

export function LiveFilter(props: {
	items: readonly string[];
	label?: string;
	placeholder?: string;
}) {
	const [query, setQuery] = useState("");
	const visible = useMemo(
		() =>
			props.items.filter((item) =>
				item.toLowerCase().includes(query.toLowerCase()),
			),
		[props.items, query],
	);
	return (
		<div class="mx-stack mx-filter-list">
			<label class="mx-field">
				<span class="mx-field__label">{props.label ?? "Filter"}</span>
				<input
					value={query}
					placeholder={props.placeholder ?? "Type to narrow results"}
					onInput={(event) => setQuery(event.currentTarget.value)}
				/>
			</label>
			<div class="mx-grid">
				{visible.length > 0 ? (
					visible.map((item) => (
						<article key={item} class="mx-tile">
							<div class="mx-tile__head">
								<span class="mx-tile__kicker">Component</span>
								<span class="mx-tile__action">View</span>
							</div>
							<strong class="mx-tile__title">{item}</strong>
							<div class="mx-tile__body">
								Filtered result from Machines tokens.
							</div>
						</article>
					))
				) : (
					<article class="mx-tile">
						<div class="mx-tile__head">
							<span class="mx-tile__kicker">No matches</span>
							<span class="mx-tile__action">Clear</span>
						</div>
						<strong class="mx-tile__title">No matching components</strong>
						<div class="mx-tile__body">
							Try a shorter query or clear “{query}”.
						</div>
					</article>
				)}
			</div>
		</div>
	);
}
