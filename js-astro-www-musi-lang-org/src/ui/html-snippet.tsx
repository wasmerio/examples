import { localizeHtmlLinks } from "../lib/site-links";

export function HtmlSnippet(props: { className?: string; html: string }) {
	return (
		<div
			className={props.className}
			dangerouslySetInnerHTML={{
				__html: localizeHtmlLinks(props.html),
			}}
		/>
	);
}
