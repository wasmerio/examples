import type { ReactNode } from "preact/compat";
import { MachinesPanel } from "./machines";

export interface SiteHeadingProps {
	eyebrow: ReactNode;
	title: ReactNode;
	description?: ReactNode;
	descriptionHtml?: string;
	actions?: ReactNode;
	badge?: ReactNode;
	meta?: ReactNode;
	titleAs?: "h1" | "h2";
	titleSize?: "page" | "section";
}

export function SiteHeading(props: SiteHeadingProps) {
	const TitleTag = props.titleAs ?? "h1";
	const titleSize = props.titleSize ?? "page";

	return (
		<MachinesPanel title={props.eyebrow} className="site-heading">
			<div className="site-heading__body">
				<div>
					{props.badge ? <div className="site-badge">{props.badge}</div> : null}
					<TitleTag className={`site-title site-title--${titleSize}`}>
						{props.title}
					</TitleTag>
					{props.descriptionHtml ? (
						<div
							className="site-copy"
							dangerouslySetInnerHTML={{ __html: props.descriptionHtml }}
						/>
					) : props.description ? (
						<div className="site-copy">{props.description}</div>
					) : null}
					{props.meta ? <div className="site-meta">{props.meta}</div> : null}
				</div>
				{props.actions ? (
					<div className="mx-cluster">{props.actions}</div>
				) : null}
			</div>
		</MachinesPanel>
	);
}
