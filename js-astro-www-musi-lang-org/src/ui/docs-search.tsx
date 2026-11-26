import type { DocSearchEntry } from "../docs";
import { InlineHtml } from "./inline-html";

interface DocsSearchProps {
	entries: readonly DocSearchEntry[];
	heading?: string;
	inputLabel?: string;
	lede?: string;
	className?: string;
	initialLimit?: number;
	queryLimit?: number;
	showHeader?: boolean;
	variant?: "panel" | "disclosure";
}

function entryKicker(entry: DocSearchEntry) {
	return (
		<>
			<span>{entry.kind} / </span>
			<InlineHtml html={entry.partTitleHtml} />
			{entry.sectionTitleHtml ? (
				<>
					<span> / </span>
					<InlineHtml html={entry.sectionTitleHtml} />
				</>
			) : null}
		</>
	);
}

export function DocsSearch(props: DocsSearchProps) {
	const initialLimit = props.initialLimit ?? 8;
	const queryLimit = props.queryLimit ?? initialLimit;
	const visibleEntries = props.entries.slice(0, initialLimit);
	const heading = props.heading ?? "Find docs";
	const inputLabel = props.inputLabel ?? "Search docs";
	const showHeader = props.showHeader ?? true;
	const variant = props.variant ?? "panel";
	const searchBody = (
		<>
			{showHeader ? (
				<div className="docs-search__header">
					<div>
						<div className="mx-kicker">{heading}</div>
						{props.lede ? (
							<p className="site-copy site-copy--small">{props.lede}</p>
						) : null}
					</div>
				</div>
			) : null}
			<label className="mx-field docs-search__field">
				<span className="mx-field__label">{inputLabel}</span>
				<input
					type="search"
					placeholder="Search chapters and questions..."
					data-docs-search-input={true}
					aria-label={inputLabel}
				/>
			</label>
			<div className="docs-search__results" data-docs-search-results={true}>
				{props.entries.map((entry, index) => (
					<a
						key={entry.id}
						href={entry.path}
						className="mx-action-card mx-action-card--quiet docs-search__result"
						data-docs-search-entry={true}
						data-search-text={entry.searchText}
						hidden={index >= visibleEntries.length}
					>
						<span className="mx-action-card__head">
							<span className="mx-action-card__kicker">
								{entryKicker(entry)}
							</span>
							<span className="mx-action-card__action">Open</span>
						</span>
						<strong className="mx-action-card__title">
							<InlineHtml html={entry.titleHtml} />
						</strong>
						<span className="mx-action-card__body">{entry.summary}</span>
					</a>
				))}
			</div>
			<p
				className="site-copy site-copy--small docs-search__empty"
				data-docs-search-empty={true}
				hidden={true}
			>
				No matching docs yet. Try a command, type, effect, or operator.
			</p>
		</>
	);
	return (
		<search
			className={`docs-search docs-search--${variant}${props.className ? ` ${props.className}` : ""}`}
			data-docs-search={true}
			data-docs-search-initial-limit={initialLimit}
			data-docs-search-query-limit={queryLimit}
		>
			{variant === "disclosure" ? (
				<details
					className="docs-search__disclosure mx-card"
					data-docs-search-details={true}
				>
					<summary className="mx-card__title docs-search__summary">
						<span>{heading}</span>
						<span aria-hidden={true}>⌄</span>
					</summary>
					<div className="mx-card__body docs-search__drawer">{searchBody}</div>
				</details>
			) : (
				searchBody
			)}
		</search>
	);
}
