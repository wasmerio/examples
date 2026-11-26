import type { ReactNode } from "preact/compat";
import { type DocPage, docChildren, docForPath, docParts } from "../docs";
import { GithubIcon, MenuIcon } from "../icons";
import { siteCopy } from "../lib/site-copy";
import type { AppRoute } from "../routes";
import { isDocsRoute, primaryRoutes } from "../routes";
import { InlineHtml } from "../ui/inline-html";

function HeaderLinks(props: { route: AppRoute }) {
	return (
		<>
			{primaryRoutes.map((route) => (
				<li key={route.id}>
					<a
						href={route.path}
						className="mx-tab"
						aria-current={
							props.route.section === route.section ? "page" : undefined
						}
					>
						{route.label}
					</a>
				</li>
			))}
		</>
	);
}

function DocsSidebar(props: { route: AppRoute }) {
	const activeDoc = docForPath(props.route.path);
	const activeTreePath = new Set(activeDoc?.treePath ?? []);
	const renderSidebarNode = (node: DocPage, depth: number) => {
		const children = docChildren(node.id);
		const levelClass =
			node.kind === "section"
				? "docs-sidebar-link-section"
				: "docs-sidebar-link-chapter";
		return (
			<div key={node.id} className="docs-sidebar-node">
				<a
					href={node.path}
					className={`docs-sidebar-link ${levelClass}${activeTreePath.has(node.id) ? " is-active" : ""}`}
					data-depth={depth}
				>
					<InlineHtml html={node.titleHtml} />
				</a>
				{children.length > 0 ? (
					<div className="docs-sidebar-children">
						{children.map((child) => renderSidebarNode(child, depth + 1))}
					</div>
				) : null}
			</div>
		);
	};

	return (
		<nav aria-label="Documentation sections" className="docs-sidebar-nav">
			{docParts.map((part) => (
				<section key={part.id} className="docs-sidebar-group">
					<a
						href={part.path}
						className={`docs-sidebar-heading${activeTreePath.has(part.id) ? " is-active" : ""}`}
					>
						<InlineHtml html={part.titleHtml} />
					</a>
					<div className="docs-sidebar-list">
						{docChildren(part.id).map((node) => renderSidebarNode(node, 0))}
					</div>
				</section>
			))}
		</nav>
	);
}

export function SiteLayout(props: { route: AppRoute; children: ReactNode }) {
	const docsMode = isDocsRoute(props.route);
	const drawerId = docsMode ? "docs-sidebar-drawer" : "site-nav-drawer";

	return (
		<div className={`site-shell${docsMode ? " site-shell-docs" : ""}`}>
			<a href="#main-content" className="skip-link">
				{siteCopy.skipToContent}
			</a>
			<header className="site-header mx-header">
				<div className="site-header-inner mx-header__inner mx-shell">
					<div className="site-brand-row">
						<button
							type="button"
							className="menu-toggle site-icon-button mx-button mx-button--ghost"
							aria-label={siteCopy.menu}
							title={siteCopy.menu}
							aria-expanded="false"
							aria-controls={drawerId}
							data-menu-toggle={true}
						>
							<MenuIcon size={18} />
							<span className="sr-only">{siteCopy.menu}</span>
						</button>
						<a href="/" className="site-logo mx-brand">
							<span
								className="site-logo-mark mx-brand__mark"
								aria-hidden="true"
							>
								<img src="/favicon.svg" alt="" className="site-logo-image" />
							</span>
							<span className="site-logo-title">MUSI</span>
						</a>
					</div>
					<div className="site-header-actions">
						<a
							href="https://github.com/musi-lang/musi"
							target="_blank"
							rel="noreferrer"
							className="site-icon-button mx-button mx-button--ghost"
							aria-label={siteCopy.utilityLabels.github}
							title={siteCopy.utilityLabels.github}
						>
							<GithubIcon size={18} />
							<span className="sr-only">{siteCopy.utilityLabels.github}</span>
						</a>
					</div>
				</div>
				<nav
					aria-label="Primary"
					className="site-header-nav-desktop mx-nav-rail"
				>
					<ul className="mx-nav-tabs">
						<HeaderLinks route={props.route} />
					</ul>
				</nav>
				<div id={drawerId} className="site-drawer">
					<div className="site-drawer-panel">
						{docsMode ? (
							<DocsSidebar route={props.route} />
						) : (
							<nav aria-label="Primary" className="site-header-nav">
								<ul className="mx-nav-tabs site-drawer-nav">
									<HeaderLinks route={props.route} />
								</ul>
							</nav>
						)}
					</div>
				</div>
			</header>
			<div className="site-frame">
				<main id="main-content" className="site-main">
					{props.children}
				</main>
			</div>
		</div>
	);
}
