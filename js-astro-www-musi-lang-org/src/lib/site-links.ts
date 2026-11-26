const docsPrefixPattern = /^\/docs/;

export function localizePath(path: string) {
	return path;
}

export function localizeDocPath(path: string) {
	return path.replace(docsPrefixPattern, "/learn");
}

export function localizeHtmlLinks(html: string) {
	return html.replaceAll('href="/docs', 'href="/learn');
}
