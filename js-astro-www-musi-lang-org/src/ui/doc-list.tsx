import type { ReactNode } from "preact/compat";
import { siteCopy } from "../lib/site-copy";
import { InlineHtml } from "./inline-html";
import { MachinesActionCard, MachinesGroupbox } from "./machines";

interface DocListPage {
	id: string;
	kind: "part" | "section" | "chapter";
	childIds: string[];
	path: string;
	slug: string;
	summaryHtml: string;
	title: string;
	titleHtml: string;
	summary: string;
}

function pageKindLabel(page: DocListPage) {
	const kind =
		page.kind === "section"
			? "Section"
			: page.kind === "part"
				? "Part"
				: "Chapter";
	return page.childIds.length > 0 ? `${kind} · ${page.childIds.length}` : kind;
}

export function DocListGroup(props: {
	group: ReactNode;
	path?: string;
	summaryHtml?: string;
	pages: readonly DocListPage[];
	linkLabel?: string;
}) {
	return (
		<MachinesGroupbox legend={props.group} className="docs-groupbox">
			{props.path ? (
				<a
					href={props.path}
					className="mx-button mx-button--link docs-groupbox__open"
				>
					{props.linkLabel ?? siteCopy.ui.openSection}
				</a>
			) : null}
			{props.summaryHtml ? (
				<div
					className="site-copy site-copy--small"
					dangerouslySetInnerHTML={{ __html: props.summaryHtml }}
				/>
			) : null}
			<div className="docs-child-list">
				{props.pages.map((page) => (
					<MachinesActionCard
						key={page.id}
						href={page.path}
						className="docs-child-card"
						kicker={pageKindLabel(page)}
						title={<InlineHtml html={page.titleHtml} />}
						action="»"
					>
						<span
							className="mx-action-card__body docs-child-card__summary"
							dangerouslySetInnerHTML={{ __html: page.summaryHtml }}
						/>
					</MachinesActionCard>
				))}
			</div>
		</MachinesGroupbox>
	);
}

export function DocPartTile(props: {
	title: string;
	titleHtml: string;
	path: string;
	summaryHtml: string;
	chapterCount: number;
}) {
	return (
		<MachinesActionCard
			href={props.path}
			className="docs-part-tile"
			kicker={`${props.chapterCount} ${
				props.chapterCount === 1 ? "chapter" : "chapters"
			}`}
			title={<InlineHtml html={props.titleHtml} />}
			action={siteCopy.ui.openSection}
		>
			<span
				className="mx-action-card__body docs-part-tile__summary"
				dangerouslySetInnerHTML={{ __html: props.summaryHtml }}
			/>
		</MachinesActionCard>
	);
}
