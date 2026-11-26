import { docForPath } from "./docs";
import { SiteLayout } from "./layout/site-layout";
import type { AppRoute } from "./routes";
import { CommunityPage } from "./site-pages/community/page";
import { DocPage, DocsIndexPage } from "./site-pages/docs/page";
import { HomePage } from "./site-pages/home/page";
import { InstallPage } from "./site-pages/install/page";
import { PlaygroundPage } from "./site-pages/playground/page";

function NotFoundPage() {
	return (
		<div className="site-stack">
			<section className="mx-panel">
				<div className="mx-panel__title">404</div>
				<div className="mx-panel__body site-stack site-stack--tight">
					<h1 className="site-title site-title--page">Page not found</h1>
					<p className="site-copy">This Musi page does not exist.</p>
					<p>
						<a className="mx-button" href="/">
							Return home
						</a>
					</p>
				</div>
			</section>
		</div>
	);
}

function PageBody(props: { route: AppRoute }) {
	if (props.route.id === "not-found:en") {
		return <NotFoundPage />;
	}
	if (props.route.kind === "doc" && docForPath(props.route.path)) {
		return <DocPage pathname={props.route.path} route={props.route} />;
	}
	switch (props.route.section) {
		case "learn":
			return <DocsIndexPage route={props.route} />;
		case "install":
			return <InstallPage route={props.route} />;
		case "playground":
			return <PlaygroundPage route={props.route} />;
		case "community":
			return <CommunityPage route={props.route} />;
		default:
			return <HomePage route={props.route} />;
	}
}

export function App(props: { route: AppRoute }) {
	return (
		<SiteLayout route={props.route}>
			<PageBody route={props.route} />
		</SiteLayout>
	);
}
