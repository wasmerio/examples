import { h as _h, type Properties } from "hastscript";
import type { Paragraph as P } from "mdast";
import type {} from "mdast-util-to-hast";

/** From Astro Starlight: Function that generates an mdast HTML tree ready for conversion to HTML by rehype. */
export function h(el: string, attrs: Properties = {}, children: unknown[] = []): P {
	const { tagName, properties } = _h(el, attrs);
	return {
		children: children as P['children'],
		data: { hName: tagName, hProperties: properties },
		type: "paragraph",
	};
}
