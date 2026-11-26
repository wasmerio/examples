import { homeSampleHtml } from "../../content";
import { docParts, docSearchEntries } from "../../docs";
import { siteCopy } from "../../lib/site-copy";
import type { AppRoute } from "../../routes";
import {
	ActionStrip,
	InlineAction,
	PrimaryAction,
	SecondaryAction,
} from "../../ui/actions";
import { DocPartTile } from "../../ui/doc-list";
import { DocsSearch } from "../../ui/docs-search";
import { HtmlSnippet } from "../../ui/html-snippet";
import {
	MachinesActionCard,
	MachinesCodeFrame,
	MachinesGroupbox,
	MachinesPanel,
	MachinesSection,
	MachinesTile,
} from "../../ui/machines";

export function HomePage(_props: { route: AppRoute }) {
	const copy = siteCopy.home;
	return (
		<div className="site-stack page-home">
			<MachinesPanel
				title={copy.eyebrow}
				className="home-hero-panel"
				aria-labelledby="home-title"
			>
				<div className="site-hero-grid">
					<div className="site-hero-copy">
						<h1 id="home-title" className="site-title site-title--page">
							{copy.title}
						</h1>
						<div className="site-copy">{copy.description}</div>
						<ul className="site-summary-list">
							{copy.summary.map((item) => (
								<li key={item} className="site-summary-item">
									{item}
								</li>
							))}
						</ul>
						<ActionStrip>
							<PrimaryAction href="/learn/book">
								{copy.primaryCta}
							</PrimaryAction>
							<SecondaryAction href="/install">
								{copy.secondaryCta}
							</SecondaryAction>
							<InlineAction href="/community">{copy.tertiaryCta}</InlineAction>
						</ActionStrip>
					</div>
					<div className="home-hero-sample-stack">
						<div className="home-sample-copy site-copy site-copy--small">
							<p>
								Start with one value, one function, and one final result. This
								matches Musi's beginner path.
							</p>
							<p>
								Musi reads top to bottom. Bind values with <code>let</code>,
								define small functions the same way, then end with the result
								you want.
							</p>
						</div>
						<MachinesCodeFrame
							title={siteCopy.ui.sample}
							className="home-hero-sample"
						>
							<HtmlSnippet html={homeSampleHtml} />
						</MachinesCodeFrame>
					</div>
				</div>
			</MachinesPanel>

			<MachinesGroupbox
				legend={siteCopy.ui.status}
				className="mx-groupbox--compact home-status-group"
				aria-label={siteCopy.ui.status}
			>
				<div className="site-grid site-grid--three">
					{copy.statusItems.map((item) => (
						<MachinesTile
							key={item.label}
							kicker={item.label}
							title={item.value}
						>
							<span>{item.copy}</span>
						</MachinesTile>
					))}
				</div>
			</MachinesGroupbox>

			<MachinesSection
				kicker={siteCopy.ui.primaryPaths}
				title="Choose a path"
				aria-label={siteCopy.ui.primaryPaths}
			>
				<div className="mx-grid site-grid--three">
					{copy.taskBoards.map((link) => (
						<MachinesActionCard
							key={link.title}
							href={link.href}
							kicker={link.label}
							title={link.title}
							description={link.copy}
							action={link.actionLabel}
						/>
					))}
				</div>
			</MachinesSection>

			<MachinesSection
				kicker={siteCopy.ui.learnSection}
				title={siteCopy.ui.findDocs}
			>
				<p className="site-copy site-copy--small">
					Search chapters, effects, types, operators, and command questions.
				</p>
				<DocsSearch
					entries={docSearchEntries}
					heading={siteCopy.ui.findDocs}
					showHeader={false}
					initialLimit={4}
					queryLimit={8}
				/>
			</MachinesSection>

			<MachinesSection
				kicker={siteCopy.ui.learnSection}
				title={copy.sectionsTitle}
			>
				<div className="mx-grid site-grid--two">
					{copy.sections.map((section) => (
						<MachinesGroupbox
							key={section.title}
							legend={section.title}
							className="mx-groupbox--compact"
						>
							<p>{section.copy}</p>
						</MachinesGroupbox>
					))}
				</div>
			</MachinesSection>

			<MachinesSection
				kicker={siteCopy.ui.learnSection}
				title={siteCopy.learn.partsTitle}
				action={
					<InlineAction href="/learn/book">{siteCopy.nav.learn}</InlineAction>
				}
			>
				<div className="mx-grid site-parts-grid">
					{docParts.map((part) => (
						<DocPartTile
							key={part.id}
							title={part.title}
							titleHtml={part.titleHtml}
							path={part.path}
							summaryHtml={part.summaryHtml}
							chapterCount={part.chapters.length}
						/>
					))}
				</div>
			</MachinesSection>
		</div>
	);
}
